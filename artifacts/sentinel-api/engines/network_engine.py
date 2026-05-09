"""NetworkX-based circular flow and multi-hop mule ring detection."""
import networkx as nx
from data.loader import get_all_transactions, get_accounts_master
import pandas as pd
from typing import Any


def build_graph(txns: pd.DataFrame) -> nx.DiGraph:
    G = nx.DiGraph()
    for _, row in txns.iterrows():
        src = str(row["from_acc"])
        dst = str(row["to_acc"])
        amount = float(row["amount"])
        G.add_edge(src, dst, weight=amount, txn_id=str(row["txn_id"]))
    return G


def detect_cycles(G: nx.DiGraph, max_length: int = 7) -> list[list[str]]:
    """Return all simple cycles up to max_length nodes."""
    cycles = []
    try:
        for cycle in nx.simple_cycles(G):
            if 2 < len(cycle) <= max_length:
                cycles.append(cycle)
    except Exception:
        pass
    return cycles[:20]  # cap at 20 cycles


def get_network_graph(account_id: str | None = None) -> dict[str, Any]:
    txns = get_all_transactions()
    accounts = get_accounts_master()

    if txns.empty:
        return {"nodes": [], "edges": [], "cycles": [], "stats": {}}

    # Filter to relevant subgraph if account_id given
    if account_id:
        # Find all accounts reachable within 2 hops
        related = set()
        related.add(account_id)
        for _, row in txns.iterrows():
            if str(row["from_acc"]) == account_id:
                related.add(str(row["to_acc"]))
            if str(row["to_acc"]) == account_id:
                related.add(str(row["from_acc"]))
        # second hop
        hop2 = set()
        for acc in list(related):
            for _, row in txns.iterrows():
                if str(row["from_acc"]) == acc:
                    hop2.add(str(row["to_acc"]))
                if str(row["to_acc"]) == acc:
                    hop2.add(str(row["from_acc"]))
        related = related | hop2
        subset = txns[
            txns["from_acc"].astype(str).isin(related) |
            txns["to_acc"].astype(str).isin(related)
        ]
    else:
        subset = txns

    G = build_graph(subset)
    cycles = detect_cycles(G)

    # Build account name lookup
    name_map: dict[str, str] = {}
    if not accounts.empty:
        for _, row in accounts.iterrows():
            name_map[str(row["account_id"])] = str(row["account_name"])

    # Assign risk to nodes
    flagged_set = set()
    if account_id:
        flagged_set.add(account_id)
    # accounts in cycles are high-risk
    for cyc in cycles:
        for node in cyc:
            flagged_set.add(node)

    nodes = []
    for node in G.nodes():
        label = name_map.get(node, node)
        in_cycle = node in flagged_set
        nodes.append({
            "id": node,
            "label": label[:20],
            "risk": "HIGH" if in_cycle else "LOW",
            "in_cycle": in_cycle,
            "degree": G.degree(node),
            "in_degree": G.in_degree(node),
            "out_degree": G.out_degree(node),
        })

    edges = []
    for src, dst, data in G.edges(data=True):
        edges.append({
            "source": src,
            "target": dst,
            "amount": round(data.get("weight", 0), 2),
            "txn_id": data.get("txn_id", ""),
            "in_cycle": any(
                src in cyc and dst in cyc for cyc in cycles
            ),
        })

    return {
        "nodes": nodes[:60],
        "edges": edges[:120],
        "cycles": [{"nodes": c, "length": len(c)} for c in cycles],
        "stats": {
            "total_nodes": G.number_of_nodes(),
            "total_edges": G.number_of_edges(),
            "cycles_found": len(cycles),
            "flagged_nodes": len(flagged_set),
        },
    }
