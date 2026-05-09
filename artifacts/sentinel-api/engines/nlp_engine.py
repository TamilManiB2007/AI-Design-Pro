"""NLP remark similarity engine — keyword-pattern matching for mule fraud signals."""
import re
from data.loader import get_all_transactions, get_transactions_reg

# Mule-fraud pattern library — curated keyword clusters
FRAUD_PATTERNS = {
    "crypto_urgency": [
        "crypto", "bitcoin", "btc", "usdt", "ethereum", "eth",
        "urgent", "immediately", "asap", "quick", "fast", "now",
        "exchange", "convert", "wallet",
    ],
    "advisory_fee": [
        "advisory", "fee", "consultation", "commission", "referral",
        "service charge", "facilitation",
    ],
    "layering_language": [
        "settlement", "advance", "invoice", "payment received",
        "business settlement", "offshore", "nominee",
    ],
    "smurfing_narration": [
        "small amount", "partial", "split", "installment",
        "emi", "monthly", "utility bill",
    ],
    "mule_indicators": [
        "loan emi", "monthly payment", "purchase", "transfer",
        "fund transfer", "rtgs", "neft", "imps",
    ],
}

# Suspicious = any of these high-weight pattern groups
HIGH_RISK_PATTERNS = ["crypto_urgency", "advisory_fee", "layering_language"]


def _tokenize(text: str) -> set[str]:
    text = text.lower()
    tokens = re.findall(r"[a-z]+", text)
    return set(tokens)


def _compute_similarity(remark: str) -> tuple[float, str]:
    """Return (similarity_percent, matched_pattern_name)."""
    tokens = _tokenize(remark)
    if not tokens:
        return 0.0, "none"

    best_score = 0.0
    best_pattern = "none"

    for pattern_name, keywords in FRAUD_PATTERNS.items():
        keyword_tokens = set(k.lower() for kw in keywords for k in kw.split())
        overlap = tokens & keyword_tokens
        if not keyword_tokens:
            continue
        score = len(overlap) / len(keyword_tokens) * 100
        # Boost for high-risk patterns
        if pattern_name in HIGH_RISK_PATTERNS:
            score = min(score * 1.4, 100.0)
        if score > best_score:
            best_score = score
            best_pattern = pattern_name

    return round(min(best_score, 100.0), 1), best_pattern


def analyze_remarks(limit: int = 15) -> list[dict]:
    txns = get_transactions_reg()
    if txns.empty:
        return _fallback_remarks()

    results = []
    for _, row in txns.iterrows():
        narration = str(row.get("narration", ""))
        if not narration or narration.lower() == "nan":
            continue
        sim, pattern = _compute_similarity(narration)
        flagged_in_data = bool(row.get("flagged", False))

        # Determine flag status
        if sim >= 75 or flagged_in_data:
            flag = "ALERT"
        elif sim >= 45:
            flag = "REVIEW"
        else:
            flag = "CLEAR"

        results.append({
            "remark": narration,
            "account": str(row.get("txn_id", "")),
            "from_account": str(row.get("from_acc", "")),
            "similarity": sim,
            "pattern": pattern,
            "flag": flag,
            "amount": float(row.get("amount", 0)),
        })

    # Sort by similarity desc
    results.sort(key=lambda x: x["similarity"], reverse=True)
    return results[:limit]


def _fallback_remarks() -> list[dict]:
    return [
        {"remark": "Urgent Crypto Payment", "account": "TXN-4821", "from_account": "ACC001", "similarity": 94.0, "pattern": "crypto_urgency", "flag": "ALERT", "amount": 4983},
        {"remark": "Business Settlement Offshore", "account": "TXN-4820", "from_account": "ACC007", "similarity": 78.0, "pattern": "layering_language", "flag": "ALERT", "amount": 450000},
        {"remark": "Advisory Fee Payment", "account": "TXN-4819", "from_account": "ACC004", "similarity": 85.0, "pattern": "advisory_fee", "flag": "ALERT", "amount": 520000},
        {"remark": "Festival Gift Transfer", "account": "TXN-4818", "from_account": "ACC010", "similarity": 23.0, "pattern": "mule_indicators", "flag": "CLEAR", "amount": 12400},
        {"remark": "Monthly Payment EMI", "account": "TXN-4817", "from_account": "ACC014", "similarity": 31.0, "pattern": "smurfing_narration", "flag": "CLEAR", "amount": 47773},
        {"remark": "USDT Exchange Convert Now", "account": "TXN-4816", "from_account": "ACC009", "similarity": 91.0, "pattern": "crypto_urgency", "flag": "ALERT", "amount": 480203},
        {"remark": "Commission Referral Advance", "account": "TXN-4815", "from_account": "ACC006", "similarity": 72.0, "pattern": "advisory_fee", "flag": "REVIEW", "amount": 320241},
        {"remark": "Salary Advance Release", "account": "TXN-4814", "from_account": "ACC011", "similarity": 17.0, "pattern": "mule_indicators", "flag": "CLEAR", "amount": 42493},
    ]
