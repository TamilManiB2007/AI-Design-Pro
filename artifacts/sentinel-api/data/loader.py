import pandas as pd
import os
from pathlib import Path

DATA_DIR = Path(__file__).parent / "csv"

def _load(filename: str) -> pd.DataFrame:
    path = DATA_DIR / filename
    if not path.exists():
        return pd.DataFrame()
    return pd.read_csv(path)

# Lazy-loaded singletons
_transactions_reg: pd.DataFrame | None = None
_transactions_ext: pd.DataFrame | None = None
_accounts_master: pd.DataFrame | None = None
_accounts_ext: pd.DataFrame | None = None
_pep_watchlist: pd.DataFrame | None = None
_weighted_risk: pd.DataFrame | None = None

def get_transactions_reg() -> pd.DataFrame:
    global _transactions_reg
    if _transactions_reg is None:
        _transactions_reg = _load("transactions_reg.csv")
        if not _transactions_reg.empty:
            _transactions_reg["timestamp"] = pd.to_datetime(_transactions_reg["timestamp"])
    return _transactions_reg

def get_transactions_ext() -> pd.DataFrame:
    global _transactions_ext
    if _transactions_ext is None:
        _transactions_ext = _load("transactions_ext.csv")
        if not _transactions_ext.empty:
            _transactions_ext["timestamp"] = pd.to_datetime(_transactions_ext["timestamp"])
    return _transactions_ext

def get_accounts_master() -> pd.DataFrame:
    global _accounts_master
    if _accounts_master is None:
        _accounts_master = _load("accounts_master.csv")
    return _accounts_master

def get_accounts_ext() -> pd.DataFrame:
    global _accounts_ext
    if _accounts_ext is None:
        _accounts_ext = _load("accounts_ext.csv")
    return _accounts_ext

def get_pep_watchlist() -> pd.DataFrame:
    global _pep_watchlist
    if _pep_watchlist is None:
        _pep_watchlist = _load("pep_watchlist.csv")
    return _pep_watchlist

def get_weighted_risk() -> pd.DataFrame:
    global _weighted_risk
    if _weighted_risk is None:
        _weighted_risk = _load("weighted_risk.csv")
    return _weighted_risk

def get_all_transactions() -> pd.DataFrame:
    """Merge both transaction datasets into one unified frame."""
    reg = get_transactions_reg()
    ext = get_transactions_ext()

    frames = []
    if not reg.empty:
        r = reg.rename(columns={"from_account": "from_acc", "to_account": "to_acc"})
        r = r[["txn_id", "from_acc", "to_acc", "amount", "timestamp", "narration", "flagged", "channel"]].copy()
        frames.append(r)

    if not ext.empty:
        e = ext.rename(columns={"from": "from_acc", "to": "to_acc"})
        e["narration"] = ""
        e["flagged"] = False
        e["channel"] = "DIGITAL"
        e = e[["txn_id", "from_acc", "to_acc", "amount", "timestamp", "narration", "flagged", "channel"]].copy()
        frames.append(e)

    if not frames:
        return pd.DataFrame()
    return pd.concat(frames, ignore_index=True).drop_duplicates(subset=["txn_id"])

def reload_all():
    global _transactions_reg, _transactions_ext, _accounts_master
    global _accounts_ext, _pep_watchlist, _weighted_risk
    _transactions_reg = _transactions_ext = _accounts_master = None
    _accounts_ext = _pep_watchlist = _weighted_risk = None
