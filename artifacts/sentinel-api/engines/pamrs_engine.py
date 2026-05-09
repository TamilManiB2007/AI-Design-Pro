"""PAMRS — Pre-Activation Mule Risk Scoring engine."""
import hashlib
from data.loader import get_accounts_master, get_all_transactions, get_pep_watchlist


def _device_id_check(account_id: str, accounts_df) -> dict:
    """Simulate device-ID sharing — accounts with the same IFSC branch cluster."""
    if accounts_df.empty:
        return {"result": "PASS", "detail": "No data", "score": 0}
    row = accounts_df[accounts_df["account_id"] == account_id]
    if row.empty:
        return {"result": "PASS", "detail": "Account not found", "score": 0}

    branch = row.iloc[0].get("branch", "")
    shared = accounts_df[accounts_df["branch"] == branch]
    count = len(shared)
    if count > 4:
        return {"result": "FAIL", "detail": f"Device cluster: {count} accounts share branch {branch}", "score": 30}
    return {"result": "PASS", "detail": f"Device check OK — branch {branch} ({count} accounts)", "score": 0}


def _pincode_check(account_id: str, accounts_df) -> dict:
    """Check pincode clustering — many accounts from same city = higher risk."""
    if accounts_df.empty:
        return {"result": "PASS", "detail": "No data", "score": 0}
    row = accounts_df[accounts_df["account_id"] == account_id]
    if row.empty:
        return {"result": "PASS", "detail": "Account not found", "score": 0}

    city = row.iloc[0].get("city", "")
    city_count = len(accounts_df[accounts_df["city"] == city])
    if city_count > 3:
        return {"result": "FAIL", "detail": f"Pincode cluster: {city_count} accounts in {city}", "score": 25}
    return {"result": "PASS", "detail": f"Pincode check OK — {city} ({city_count} accounts)", "score": 0}


def _network_proximity(account_id: str, txns_df) -> dict:
    """Check if account transacts with known flagged accounts."""
    if txns_df.empty:
        return {"result": "PASS", "detail": "No transactions found", "score": 0}

    counterparties = set()
    for _, row in txns_df.iterrows():
        if str(row["from_acc"]) == account_id:
            counterparties.add(str(row["to_acc"]))
        if str(row["to_acc"]) == account_id:
            counterparties.add(str(row["from_acc"]))

    # Check for known high-risk counterparties
    risky_prefixes = ["ACC016", "ACC017", "ACC-OFFSH", "ACC-FUNNEL"]
    risky_found = [cp for cp in counterparties if any(cp.startswith(r) for r in risky_prefixes)]

    if risky_found:
        return {
            "result": "FAIL",
            "detail": f"Network proximity: {len(risky_found)} flagged neighbor(s) — {', '.join(risky_found[:3])}",
            "score": 35,
        }
    return {"result": "PASS", "detail": f"Network OK — {len(counterparties)} counterparties, none flagged", "score": 0}


def _sim_swap_check(account_id: str) -> dict:
    """Simulated sim-swap check based on account ID hash."""
    h = int(hashlib.md5(account_id.encode()).hexdigest(), 16)
    if h % 7 == 0:
        return {"result": "FAIL", "detail": "SIM swap detected 14 days ago", "score": 20}
    return {"result": "PASS", "detail": "No recent SIM swap activity", "score": 0}


def _behavioral_baseline(account_id: str, txns_df) -> dict:
    """Check if account has a behavioral baseline (history)."""
    if txns_df.empty:
        return {"result": "FAIL", "detail": "No pre-activation baseline available", "score": 15}
    account_txns = txns_df[
        (txns_df["from_acc"] == account_id) | (txns_df["to_acc"] == account_id)
    ]
    if len(account_txns) < 3:
        return {"result": "FAIL", "detail": f"Insufficient baseline — only {len(account_txns)} prior transactions", "score": 15}
    return {"result": "PASS", "detail": f"Baseline OK — {len(account_txns)} prior transactions", "score": 0}


def _watchlist_check(account_id: str) -> dict:
    """Direct PEP/watchlist check."""
    pep = get_pep_watchlist()
    if pep.empty:
        return {"result": "PASS", "detail": "No watchlist match", "score": 0}
    match = pep[pep["account_id"] == account_id]
    if not match.empty:
        name = match.iloc[0].get("name", "Unknown")
        level = match.iloc[0].get("risk_level", "High")
        return {"result": "FAIL", "detail": f"WATCHLIST HIT: {name} ({level}) — {match.iloc[0].get('source', '')}", "score": 50}
    return {"result": "PASS", "detail": "No watchlist or PEP match found", "score": 0}


def run_pamrs(account_id: str) -> dict:
    accounts_df = get_accounts_master()
    txns_df = get_all_transactions()

    checks = {
        "device_id": _device_id_check(account_id, accounts_df),
        "pincode_cluster": _pincode_check(account_id, accounts_df),
        "network_proximity": _network_proximity(account_id, txns_df),
        "sim_swap": _sim_swap_check(account_id),
        "behavioral_baseline": _behavioral_baseline(account_id, txns_df),
        "watchlist": _watchlist_check(account_id),
    }

    total_score = sum(c["score"] for c in checks.values())
    fails = sum(1 for c in checks.values() if c["result"] == "FAIL")

    verdict = "BLOCKED" if (total_score >= 50 or fails >= 4) else "GATED" if (total_score >= 25 or fails >= 2) else "PASS"

    return {
        "account_id": account_id,
        "checks": checks,
        "total_score": total_score,
        "fails": fails,
        "verdict": verdict,
        "recommendation": {
            "BLOCKED": "Do not activate account. Escalate to compliance team for manual review.",
            "GATED": "Conditional activation — require enhanced KYC before enabling full transactions.",
            "PASS": "Account cleared for activation under standard monitoring.",
        }[verdict],
    }
