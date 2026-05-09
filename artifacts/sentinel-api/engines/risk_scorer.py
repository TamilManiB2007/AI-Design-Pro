"""Weighted risk scorer — aggregates 6 detector scores into composite index."""
import pandas as pd
import math
from data.loader import (
    get_all_transactions, get_accounts_master,
    get_pep_watchlist, get_weighted_risk
)

# Detector weights — must sum to 1.0
WEIGHTS = {
    "structuring": 0.25,
    "velocity": 0.20,
    "network": 0.20,
    "pep": 0.15,
    "jurisdiction": 0.10,
    "kyc": 0.10,
}

# FATF grey-list / FinCEN flagged jurisdictions (city indicators)
RISKY_CITIES = {
    "dubai", "panama", "cayman", "belize", "seychelles",
    "myanmar", "vanuatu", "laos", "cambodia",
}

STRUCTURING_THRESHOLD = 5000


def _structuring_score(txns: pd.DataFrame, account_id: str) -> float:
    """Score based on sub-threshold splitting behavior."""
    sent = txns[txns["from_acc"] == account_id]
    if sent.empty:
        return 0.0
    sub_thresh = sent[sent["amount"] < STRUCTURING_THRESHOLD]
    ratio = len(sub_thresh) / max(len(sent), 1)
    # High frequency of sub-threshold = high structuring risk
    return min(round(ratio * 100, 1), 100.0)


def _velocity_score(txns: pd.DataFrame, account_id: str) -> float:
    """Score based on transaction frequency vs. expected baseline."""
    all_acc_txns = txns[(txns["from_acc"] == account_id) | (txns["to_acc"] == account_id)]
    if all_acc_txns.empty:
        return 0.0
    count = len(all_acc_txns)
    # Normalise: >50 txns = 100, 0 txns = 0
    return min(round((count / 50) * 100, 1), 100.0)


def _network_score(txns: pd.DataFrame, account_id: str) -> float:
    """Score based on distinct counterparties and multi-hop exposure."""
    sent = txns[txns["from_acc"] == account_id]["to_acc"].nunique()
    recv = txns[txns["to_acc"] == account_id]["from_acc"].nunique()
    total_unique = sent + recv
    return min(round((total_unique / 20) * 100, 1), 100.0)


def _pep_score(account_id: str) -> float:
    """Binary + risk-level score for PEP match."""
    pep = get_pep_watchlist()
    if pep.empty:
        return 0.0
    match = pep[pep["account_id"] == account_id]
    if match.empty:
        return 0.0
    level = match.iloc[0]["risk_level"].lower() if "risk_level" in match.columns else "medium"
    return {"critical": 100.0, "high": 80.0, "medium": 55.0}.get(level, 40.0)


def _jurisdiction_score(account_id: str) -> float:
    """Score based on account city's FATF risk alignment."""
    master = get_accounts_master()
    if master.empty:
        return 10.0
    row = master[master["account_id"] == account_id]
    if row.empty:
        return 10.0
    city = str(row.iloc[0].get("city", "")).lower()
    if any(rc in city for rc in RISKY_CITIES):
        return 90.0
    return 15.0


def _kyc_score(account_id: str) -> float:
    """Score based on KYC level."""
    master = get_accounts_master()
    if master.empty:
        return 20.0
    row = master[master["account_id"] == account_id]
    if row.empty:
        return 20.0
    kyc = str(row.iloc[0].get("kyc_level", "medium")).lower()
    status = str(row.iloc[0].get("status", "active")).lower()
    base = {"low": 75.0, "medium": 40.0, "high": 10.0}.get(kyc, 40.0)
    if status in ("flagged", "watchlist", "suspended"):
        base = min(base + 30, 100.0)
    return base


def score_account(account_id: str) -> dict:
    txns = get_all_transactions()
    scores = {
        "structuring": _structuring_score(txns, account_id),
        "velocity": _velocity_score(txns, account_id),
        "network": _network_score(txns, account_id),
        "pep": _pep_score(account_id),
        "jurisdiction": _jurisdiction_score(account_id),
        "kyc": _kyc_score(account_id),
    }
    composite = sum(scores[k] * WEIGHTS[k] for k in WEIGHTS)
    return {
        "account_id": account_id,
        "scores": scores,
        "weights": WEIGHTS,
        "composite": round(composite, 1),
        "verdict": (
            "HIGH" if composite >= 70
            else "MEDIUM" if composite >= 40
            else "LOW"
        ),
    }


def get_dashboard_scores() -> dict:
    """Aggregate detector scores across all flagged/watchlist accounts."""
    master = get_accounts_master()
    if master.empty:
        return {d: 50 for d in WEIGHTS}

    flagged = master[master["status"].isin(["Flagged", "Watchlist", "Suspended"])]
    if flagged.empty:
        flagged = master.head(5)

    agg = {d: 0.0 for d in WEIGHTS}
    for acc_id in flagged["account_id"].tolist():
        s = score_account(acc_id)
        for d in WEIGHTS:
            agg[d] += s["scores"][d]

    n = max(len(flagged), 1)
    return {d: round(agg[d] / n, 1) for d in agg}
