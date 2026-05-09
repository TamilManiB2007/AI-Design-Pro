"""STR (Suspicious Transaction Report) generator for FIU-IND compliance."""
import hashlib
import time
from datetime import datetime, timezone
from data.loader import get_accounts_master, get_all_transactions

# In-memory STR queue
_str_queue: list[dict] = []


def _get_account_name(account_id: str) -> str:
    master = get_accounts_master()
    if master.empty:
        return account_id
    row = master[master["account_id"] == account_id]
    if row.empty:
        return account_id
    return str(row.iloc[0].get("account_name", account_id))


def generate_str(account_id: str, risk_score: float, detectors_triggered: list[str]) -> dict:
    """Generate a FIU-IND Suspicious Transaction Report for an account."""
    txns = get_all_transactions()
    acc_txns = txns[
        (txns["from_acc"] == account_id) | (txns["to_acc"] == account_id)
    ] if not txns.empty else None

    total_amount = float(acc_txns["amount"].sum()) if acc_txns is not None and not acc_txns.empty else 0.0
    txn_count = len(acc_txns) if acc_txns is not None else 0

    now_ts = int(time.time())
    str_id = f"STR-{datetime.fromtimestamp(now_ts, tz=timezone.utc).strftime('%Y')}-{hashlib.md5(f'{account_id}{now_ts}'.encode()).hexdigest()[:6].upper()}"
    dt_str = datetime.fromtimestamp(now_ts, tz=timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")

    report = {
        "str_id": str_id,
        "account_id": account_id,
        "account_name": _get_account_name(account_id),
        "risk_score": risk_score,
        "detectors_triggered": detectors_triggered,
        "total_suspicious_amount": round(total_amount, 2),
        "transaction_count": txn_count,
        "generated_at": dt_str,
        "status": "filed",
        "regulatory_ref": "FIU-IND Notification 2014 | PMLA Sec 12 | FATF R.20",
        "summary": (
            f"Account {account_id} ({_get_account_name(account_id)}) flagged with composite risk score {risk_score}/100. "
            f"Detectors triggered: {', '.join(detectors_triggered)}. "
            f"Total suspicious transaction volume: ₹{total_amount:,.2f} across {txn_count} transactions. "
            f"Recommended action: Freeze account pending investigation and file STR with FIU-IND within 7 working days."
        ),
    }

    _str_queue.insert(0, report)
    return report


def get_str_queue(limit: int = 10) -> list[dict]:
    return _str_queue[:limit]
