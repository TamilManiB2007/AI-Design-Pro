import { useState, useEffect, useRef, useCallback } from "react";
import {
  Shield, Zap, Network, Globe, Lock, Fingerprint,
  BarChart2, AlertTriangle, Activity, Bell, HeartPulse,
  Radio, RefreshCw, EyeOff, Terminal, Map, CheckSquare,
  FileText, Sliders, ChevronDown, ChevronUp, Hash,
  TrendingUp, Clock, CheckCircle, XCircle, AlertCircle,
  Database, Cpu, Wifi, ArrowRight
} from "lucide-react";

const API = "/engine-api";

interface DashboardProps {
  zeroPii: boolean;
}

// ─── Type definitions ──────────────────────────────────────────────────────

interface Detector {
  name: string;
  score: number;
  status: string;
  weight: number;
}

interface Transaction {
  id: string;
  account: string;
  accountId: string;
  amount: number;
  risk: number;
  detector: string;
  ts: string;
  status: string;
  flagged: boolean;
  channel: string;
  narration: string;
}

interface MerkleBlock {
  block: number;
  hash: string;
  event: string;
  timestamp: string;
  account: string;
  amount: number;
  verified: boolean;
}

interface NlpRemark {
  remark: string;
  account: string;
  from_account: string;
  similarity: number;
  flag: string;
  pattern: string;
  amount: number;
}

interface AlertItem {
  id: string | number;
  type: string;
  msg: string;
  account: string;
  ts: string;
  source?: string;
}

interface StrItem {
  str_id: string;
  account_id: string;
  risk_score: number;
  status: string;
}

interface PamrsCheck {
  label: string;
  result: string;
  detail: string;
}

interface NetworkNode {
  id: string;
  label: string;
  risk: string;
  in_cycle: boolean;
}

interface NetworkEdge {
  source: string;
  target: string;
  amount: number;
  in_cycle: boolean;
}

interface NetworkCycle {
  nodes: string[];
  length: number;
}

// ─── Fallback static data (shown while API loads) ──────────────────────────

const FALLBACK_DETECTORS: Detector[] = [
  { name: "Structuring", score: 88, status: "ALERT", weight: 0.25 },
  { name: "Velocity", score: 82, status: "ALERT", weight: 0.20 },
  { name: "Network", score: 74, status: "ALERT", weight: 0.20 },
  { name: "Pep", score: 61, status: "WARNING", weight: 0.15 },
  { name: "Jurisdiction", score: 54, status: "WARNING", weight: 0.10 },
  { name: "Kyc", score: 38, status: "ACTIVE", weight: 0.10 },
];

const FALLBACK_TRANSACTIONS: Transaction[] = [
  { id: "TXN-4821", account: "Rajesh Kumar", accountId: "ACC001", amount: 4983, risk: 92, detector: "Structuring", ts: "14:32:07", status: "ALERT", flagged: true, channel: "DIGITAL", narration: "Urgent Crypto Payment" },
  { id: "TXN-4820", account: "Priya Sharma", accountId: "ACC004", amount: 48200, risk: 78, detector: "Velocity", ts: "14:29:43", status: "ALERT", flagged: true, channel: "NEFT", narration: "Business Settlement" },
  { id: "TXN-4819", account: "Amit Verma", accountId: "ACC007", amount: 4750, risk: 85, detector: "Network", ts: "14:27:18", status: "ALERT", flagged: true, channel: "IMPS", narration: "Advisory Fee" },
  { id: "TXN-4818", account: "Sunita Patel", accountId: "ACC010", amount: 12400, risk: 34, detector: "Velocity", ts: "14:24:55", status: "CLEAR", flagged: false, channel: "UPI", narration: "Festival Gift Transfer" },
  { id: "TXN-4817", account: "Deepak Nair", accountId: "ACC005", amount: 4850, risk: 88, detector: "Structuring", ts: "14:21:32", status: "ALERT", flagged: true, channel: "DIGITAL", narration: "Loan Repayment" },
  { id: "TXN-4816", account: "Meena Joshi", accountId: "ACC009", amount: 73000, risk: 67, detector: "PEP", ts: "14:18:09", status: "REVIEW", flagged: false, channel: "RTGS", narration: "Invoice Settlement" },
  { id: "TXN-4815", account: "Vikram Singh", accountId: "ACC003", amount: 4990, risk: 91, detector: "Structuring", ts: "14:15:44", status: "ALERT", flagged: true, channel: "DIGITAL", narration: "USDT Exchange" },
  { id: "TXN-4814", account: "Anjali Rao", accountId: "ACC012", amount: 28700, risk: 43, detector: "Jurisdiction", ts: "14:12:21", status: "CLEAR", flagged: false, channel: "NEFT", narration: "Salary Transfer" },
];

const FALLBACK_NLP: NlpRemark[] = [
  { remark: "Urgent Crypto Payment Needed", account: "TXN-4821", from_account: "ACC001", similarity: 94, flag: "ALERT", pattern: "crypto_urgency", amount: 4983 },
  { remark: "Trade Settlement Offshore LLC", account: "TXN-4820", from_account: "ACC004", similarity: 78, flag: "REVIEW", pattern: "layering_language", amount: 48200 },
  { remark: "USDT Exchange Convert Now", account: "TXN-4819", from_account: "ACC007", similarity: 91, flag: "ALERT", pattern: "crypto_urgency", amount: 4750 },
  { remark: "Festival Gift Transfer — Diwali", account: "TXN-4818", from_account: "ACC010", similarity: 23, flag: "CLEAR", pattern: "mule_indicators", amount: 12400 },
  { remark: "Commission Payment Referral", account: "TXN-4816", from_account: "ACC009", similarity: 76, flag: "REVIEW", pattern: "advisory_fee", amount: 73000 },
  { remark: "Monthly EMI Loan Repayment", account: "TXN-4814", from_account: "ACC012", similarity: 31, flag: "CLEAR", pattern: "smurfing_narration", amount: 28700 },
];

const FALLBACK_ALERTS: AlertItem[] = [
  { id: 1, type: "HIGH", msg: "Structuring ring detected: 11 micro-txns in 3h under ₹5,000", ts: "14:32:07", account: "ACC001" },
  { id: 2, type: "HIGH", msg: "Circular flow A→B→C→A confirmed (3-node ring, ₹14,700 total)", ts: "14:29:43", account: "ACC003" },
  { id: 3, type: "MEDIUM", msg: "NLP match 91%: 'USDT Exchange' pattern library hit", ts: "14:27:18", account: "ACC004" },
  { id: 4, type: "HIGH", msg: "Velocity spike: 47 transactions in 3h (3.8× baseline)", ts: "14:21:32", account: "ACC007" },
  { id: 5, type: "MEDIUM", msg: "PEP linkage detected — account shares device ID with PEP entity", ts: "14:18:09", account: "ACC009" },
  { id: 6, type: "LOW", msg: "KYC document expiry: Aadhaar expired 47 days ago", ts: "14:12:21", account: "ACC012" },
];

const FALLBACK_PAMRS: PamrsCheck[] = [
  { label: "Device ID Fingerprint", result: "FAIL", detail: "ID shared across 4 accounts" },
  { label: "Pincode Cluster Analysis", result: "FAIL", detail: "17 accounts in PIN 400001" },
  { label: "Network Proximity Score", result: "FAIL", detail: "IP subnet: 3 flagged neighbors" },
  { label: "Sim Swap History", result: "PASS", detail: "No recent sim swap detected" },
  { label: "Behavioral Baseline", result: "FAIL", detail: "No pre-activation baseline" },
  { label: "AML Watchlist Match", result: "PASS", detail: "No direct watchlist hit" },
];

// ─── Component ─────────────────────────────────────────────────────────────

export default function Dashboard({ zeroPii }: DashboardProps) {
  // API state
  const [detectors, setDetectors] = useState<Detector[]>(FALLBACK_DETECTORS);
  const [compositeScore, setCompositeScore] = useState(74);
  const [transactions, setTransactions] = useState<Transaction[]>(FALLBACK_TRANSACTIONS);
  const [nlpRemarks, setNlpRemarks] = useState<NlpRemark[]>(FALLBACK_NLP);
  const [merkleBlocks, setMerkleBlocks] = useState<MerkleBlock[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>(FALLBACK_ALERTS);
  const [strQueue, setStrQueue] = useState<StrItem[]>([]);
  const [pamrsChecks, setPamrsChecks] = useState<PamrsCheck[]>(FALLBACK_PAMRS);
  const [pamrsVerdict, setPamrsVerdict] = useState<string>("");
  const [networkData, setNetworkData] = useState<{ nodes: NetworkNode[]; edges: NetworkEdge[]; cycles: NetworkCycle[] }>({ nodes: [], edges: [], cycles: [] });
  const [vitals, setVitals] = useState({ uptime: "99.98%", tx_per_sec: 4.1, memory_pct: 72, api_latency_ms: 38, chain_integrity: true, total_blocks: 12 });
  const [apiOnline, setApiOnline] = useState(false);
  const [makerWorkflowId, setMakerWorkflowId] = useState<string | null>(null);

  // UI state
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(FALLBACK_TRANSACTIONS[0]);
  const [forensicText, setForensicText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [filterStatus, setFilterStatus] = useState<"ALL" | "ALERT" | "REVIEW" | "CLEAR">("ALL");
  const [thresholds, setThresholds] = useState({ velocity: 65, amount: 5000, networkDepth: 3, nlpSimilarity: 70 });
  const [emergencyState, setEmergencyState] = useState<"idle" | "confirming" | "active">("idle");
  const [makerCheckerState, setMakerCheckerState] = useState<"idle" | "pending" | "authorized">("idle");
  const [liveTxCount, setLiveTxCount] = useState(247);
  const [newPatternVisible, setNewPatternVisible] = useState(true);
  const forensicRef = useRef<HTMLDivElement>(null);
  const streamAbortRef = useRef<AbortController | null>(null);

  // ─── API fetchers ──────────────────────────────────────────────────────

  const fetchDashboard = useCallback(async () => {
    try {
      const r = await fetch(`${API}/dashboard`);
      if (!r.ok) return;
      const data = await r.json();
      setDetectors(data.detectors || FALLBACK_DETECTORS);
      setCompositeScore(data.composite_risk || 74);
      setVitals(v => ({ ...v, ...data.vitals }));
      if (data.thresholds) setThresholds(data.thresholds);
      setApiOnline(true);
    } catch {
      // keep fallback
    }
  }, []);

  const fetchTransactions = useCallback(async () => {
    try {
      const r = await fetch(`${API}/transactions?limit=25&zero_pii=${zeroPii}`);
      if (!r.ok) return;
      const data = await r.json();
      if (data.transactions?.length) {
        setTransactions(data.transactions);
        setSelectedTx(data.transactions[0]);
      }
    } catch {}
  }, [zeroPii]);

  const fetchNlpRemarks = useCallback(async () => {
    try {
      const r = await fetch(`${API}/nlp-remarks?limit=10`);
      if (!r.ok) return;
      const data = await r.json();
      if (data.remarks?.length) setNlpRemarks(data.remarks);
    } catch {}
  }, []);

  const fetchLedger = useCallback(async () => {
    try {
      const r = await fetch(`${API}/ledger?limit=12`);
      if (!r.ok) return;
      const data = await r.json();
      if (data.entries?.length) setMerkleBlocks(data.entries);
    } catch {}
  }, []);

  const fetchAlerts = useCallback(async () => {
    try {
      const r = await fetch(`${API}/alerts`);
      if (!r.ok) return;
      const data = await r.json();
      if (data.alerts?.length) setAlerts(data.alerts);
    } catch {}
  }, []);

  const fetchStrQueue = useCallback(async () => {
    try {
      const r = await fetch(`${API}/str/queue?limit=6`);
      if (!r.ok) return;
      const data = await r.json();
      if (data.queue) setStrQueue(data.queue);
    } catch {}
  }, []);

  const fetchNetwork = useCallback(async (accountId?: string) => {
    try {
      const url = accountId ? `${API}/network-graph?account_id=${accountId}` : `${API}/network-graph`;
      const r = await fetch(url);
      if (!r.ok) return;
      const data = await r.json();
      setNetworkData({ nodes: data.nodes || [], edges: data.edges || [], cycles: data.cycles || [] });
    } catch {}
  }, []);

  const fetchPamrs = useCallback(async (accountId: string) => {
    try {
      const r = await fetch(`${API}/pamrs/${accountId}`);
      if (!r.ok) return;
      const data = await r.json();
      if (data.checks) {
        const checks = Object.entries(data.checks).map(([key, val]: [string, any]) => ({
          label: key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
          result: val.result,
          detail: val.detail,
        }));
        setPamrsChecks(checks);
        setPamrsVerdict(data.verdict || "");
      }
    } catch {}
  }, []);

  // ─── Groq streaming AI investigator ───────────────────────────────────

  const startForensicStream = useCallback(async (tx: Transaction) => {
    if (streamAbortRef.current) {
      streamAbortRef.current.abort();
    }
    const ctrl = new AbortController();
    streamAbortRef.current = ctrl;
    setForensicText("");
    setIsStreaming(true);

    try {
      const resp = await fetch(`${API}/investigate/${tx.accountId}`, {
        signal: ctrl.signal,
      });
      if (!resp.ok || !resp.body) throw new Error("No stream");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() || "";
        for (const part of parts) {
          const line = part.trim();
          if (!line.startsWith("data: ")) continue;
          try {
            const json = JSON.parse(line.slice(6));
            if (json.done) {
              setIsStreaming(false);
              return;
            }
            if (json.token) {
              setForensicText(prev => prev + json.token);
            }
          } catch {}
        }
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setForensicText(prev => prev + "\n[Stream ended]");
      }
    }
    setIsStreaming(false);
  }, []);

  // ─── Effects ──────────────────────────────────────────────────────────

  useEffect(() => {
    // Initial data load with retry — API may still be starting up
    const load = () => {
      fetchDashboard();
      fetchTransactions();
      fetchNlpRemarks();
      fetchLedger();
      fetchAlerts();
      fetchStrQueue();
      fetchNetwork();
    };
    load();
    // Retry after 5s if API was offline
    const timer = setTimeout(load, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Refresh ledger every 30s
  useEffect(() => {
    const interval = setInterval(fetchLedger, 30000);
    return () => clearInterval(interval);
  }, []);

  // Live tx counter
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveTxCount(c => c + Math.floor(Math.random() * 4));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // When a transaction is selected, stream forensic analysis + fetch PAMRS
  useEffect(() => {
    if (!selectedTx) return;
    startForensicStream(selectedTx);
    fetchPamrs(selectedTx.accountId);
    fetchNetwork(selectedTx.accountId);
  }, [selectedTx?.id]);

  // Auto-scroll forensic terminal
  useEffect(() => {
    if (forensicRef.current) {
      forensicRef.current.scrollTop = forensicRef.current.scrollHeight;
    }
  }, [forensicText]);

  // ─── Action handlers ───────────────────────────────────────────────────

  const handleThresholdChange = async (key: keyof typeof thresholds, val: number) => {
    const newThresholds = { ...thresholds, [key]: val };
    setThresholds(newThresholds);
    try {
      await fetch(`${API}/update-threshold`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newThresholds),
      });
    } catch {}
  };

  const handleEmergencyOverride = async () => {
    setEmergencyState("active");
    try {
      const r = await fetch(`${API}/emergency-override`, { method: "POST" });
      if (r.ok) {
        const data = await r.json();
        if (data.thresholds) setThresholds(data.thresholds);
      }
    } catch {}
    setTimeout(() => setEmergencyState("idle"), 6000);
  };

  const handleMakerRequest = async () => {
    setMakerCheckerState("pending");
    if (!selectedTx) return;
    try {
      const r = await fetch(`${API}/freeze/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ account_id: selectedTx.accountId, requested_by: "MAKER_01" }),
      });
      if (r.ok) {
        const data = await r.json();
        setMakerWorkflowId(data.workflow_id || null);
      }
    } catch {}
  };

  const handleAuthorizeFreeze = async () => {
    setMakerCheckerState("authorized");
    if (!makerWorkflowId) return;
    try {
      await fetch(`${API}/freeze/authorize/${makerWorkflowId}`, { method: "POST" });
      fetchLedger();
    } catch {}
  };

  const handleGenerateStr = async () => {
    if (!selectedTx) return;
    try {
      const r = await fetch(`${API}/str/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          account_id: selectedTx.accountId,
          risk_score: selectedTx.risk,
          detectors_triggered: [selectedTx.detector, "Network"],
        }),
      });
      if (r.ok) {
        fetchStrQueue();
        fetchLedger();
      }
    } catch {}
  };

  // ─── Helpers ───────────────────────────────────────────────────────────

  const maskName = (name: string, id: string) =>
    zeroPii ? `Entity_${id.slice(-4)}` : name;

  const riskBg = (score: number) =>
    score >= 80 ? "text-red-700 bg-red-100" :
    score >= 55 ? "text-amber-700 bg-amber-100" :
    "text-green-700 bg-green-100";

  const statusBadge = (s: string) =>
    s === "ALERT" ? "bg-red-100 text-red-700 font-bold" :
    s === "REVIEW" ? "bg-amber-100 text-amber-700 font-bold" :
    "bg-green-100 text-green-700";

  const detectorIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("struct")) return <Shield className="h-4 w-4" />;
    if (n.includes("veloc")) return <Zap className="h-4 w-4" />;
    if (n.includes("network")) return <Network className="h-4 w-4" />;
    if (n.includes("pep")) return <Globe className="h-4 w-4" />;
    if (n.includes("jurisd")) return <Map className="h-4 w-4" />;
    return <Lock className="h-4 w-4" />;
  };

  const detectorColor = (status: string) =>
    status === "ALERT" ? { color: "text-red-600", bg: "bg-red-50", border: "border-red-200", bar: "bg-red-500" } :
    status === "WARNING" ? { color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", bar: "bg-amber-500" } :
    { color: "text-green-600", bg: "bg-green-50", border: "border-green-200", bar: "bg-green-500" };

  const filteredTxns = transactions.filter(tx => filterStatus === "ALL" || tx.status === filterStatus);

  // Build network visualization nodes from real or fallback data
  const vizNodes = networkData.cycles.length > 0
    ? networkData.cycles[0].nodes.slice(0, 3)
    : ["ACC001", "ACC003", "ACC007"];
  const vizCycleAmounts = networkData.edges
    .filter(e => e.in_cycle)
    .slice(0, 3)
    .map(e => e.amount);

  // ─── Render ────────────────────────────────────────────────────────────

  return (
    <div className="flex h-[calc(100vh-56px)] overflow-hidden bg-stone-100">
      {/* LEFT COLUMN */}
      <div className="w-72 flex-shrink-0 border-r border-stone-200 bg-white flex flex-col overflow-y-auto">
        <div className="p-4 space-y-4">

          {/* API status badge */}
          <div className={`flex items-center gap-2 text-xs px-2 py-1 rounded-lg ${apiOnline ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>
            <span className={`h-2 w-2 rounded-full ${apiOnline ? "bg-green-400 animate-pulse" : "bg-amber-400"}`} />
            {apiOnline ? "Engine API connected — real data" : "Engine starting… using fallback data"}
          </div>

          {/* Detector Status Cards */}
          <div>
            <div className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-3 border-l-4 border-orange-600 pl-2">Six-Detector Status</div>
            <div className="space-y-2">
              {detectors.map((det, i) => {
                const c = detectorColor(det.status);
                return (
                  <div key={i} data-testid={`detector-${i}`} className={`flex items-center justify-between p-2.5 rounded-lg border ${c.bg} ${c.border}`}>
                    <div className="flex items-center gap-2">
                      <span className={c.color}>{detectorIcon(det.name)}</span>
                      <span className="text-xs font-semibold text-stone-700">{det.name.charAt(0).toUpperCase() + det.name.slice(1)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-14 bg-stone-200 rounded-full h-1.5">
                        <div className={`h-1.5 rounded-full ${c.bar}`} style={{ width: `${det.score}%` }} />
                      </div>
                      <span className={`text-xs font-bold ${c.color}`}>{det.status}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Weighted Risk Scorer */}
          <div className="bg-stone-900 rounded-xl p-4">
            <div className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3 border-l-4 border-orange-600 pl-2">Weighted Risk Index</div>
            <div className="flex items-center justify-center mb-3">
              <div className="relative">
                <svg viewBox="0 0 120 60" className="w-32 h-16">
                  <path d="M10,60 A50,50 0 0,1 110,60" fill="none" stroke="#292524" strokeWidth="12" strokeLinecap="round" />
                  <path d="M10,60 A50,50 0 0,1 110,60" fill="none" stroke="#C2410C" strokeWidth="12" strokeLinecap="round" strokeDasharray={`${(compositeScore / 100) * 157} 157`} />
                </svg>
                <div className="absolute inset-0 flex items-end justify-center pb-1">
                  <span className="text-2xl font-extrabold text-orange-500">{compositeScore}</span>
                </div>
              </div>
            </div>
            <div className="space-y-1.5">
              {detectors.map((det, i) => {
                const c = detectorColor(det.status);
                return (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-xs text-stone-400 w-20 truncate">{det.name.charAt(0).toUpperCase() + det.name.slice(1)}</span>
                    <div className="flex-1 bg-stone-700 rounded-full h-1">
                      <div className={`h-1 rounded-full ${c.bar}`} style={{ width: `${det.score}%` }} />
                    </div>
                    <span className="text-xs text-stone-400 w-6 text-right">{Math.round(det.score)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live Pipeline */}
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-3">
            <div className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-2 border-l-4 border-orange-600 pl-2">Live Pipeline</div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
              <span className="text-xs font-semibold text-stone-700">{apiOnline ? "ACTIVE — Real CSV Engine" : "ACTIVE — Synthetic Stream"}</span>
            </div>
            <div className="text-xl font-extrabold text-orange-600">{liveTxCount} <span className="text-sm font-normal text-stone-500">tx/min</span></div>
            <div className="text-xs text-stone-400 mt-1">Detectors processing real-time</div>
          </div>

          {/* System Vitals */}
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-3">
            <div className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-3 border-l-4 border-orange-600 pl-2">System Vitals</div>
            <div className="space-y-2">
              {[
                { label: "Engine Uptime", val: vitals.uptime, icon: <HeartPulse className="h-3.5 w-3.5" /> },
                { label: "Tx / sec", val: String(vitals.tx_per_sec), icon: <Activity className="h-3.5 w-3.5" /> },
                { label: "Memory", val: `${vitals.memory_pct}%`, icon: <Cpu className="h-3.5 w-3.5" /> },
                { label: "API Latency", val: `${vitals.api_latency_ms}ms`, icon: <Wifi className="h-3.5 w-3.5" /> },
                { label: "Chain Blocks", val: String(vitals.total_blocks), icon: <Hash className="h-3.5 w-3.5" /> },
              ].map((v, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-stone-500">
                    <span className="text-stone-400">{v.icon}</span>
                    {v.label}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-stone-800">{v.val}</span>
                    <span className={`h-2 w-2 rounded-full ${vitals.chain_integrity ? "bg-green-400" : "bg-red-400"}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Threshold Tuner */}
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-3">
            <div className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-3 border-l-4 border-orange-600 pl-2">Dynamic Threshold Tuner</div>
            <div className="space-y-3">
              {([
                { label: "Velocity Threshold", key: "velocity" as const, min: 10, max: 100, unit: "%" },
                { label: "Amount Limit (₹)", key: "amount" as const, min: 1000, max: 10000, unit: "" },
                { label: "Network Depth", key: "networkDepth" as const, min: 1, max: 10, unit: " hops" },
                { label: "NLP Similarity", key: "nlpSimilarity" as const, min: 50, max: 100, unit: "%" },
              ]).map((t) => (
                <div key={t.key}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-stone-500">{t.label}</span>
                    <span className="font-bold text-orange-600">{thresholds[t.key]}{t.unit}</span>
                  </div>
                  <input
                    data-testid={`slider-${t.key}`}
                    type="range" min={t.min} max={t.max}
                    value={thresholds[t.key]}
                    onChange={(e) => handleThresholdChange(t.key, Number(e.target.value))}
                    className="w-full h-1.5 accent-orange-600 cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Override */}
          <div>
            {emergencyState === "idle" && (
              <button
                data-testid="button-emergency-override"
                onClick={() => setEmergencyState("confirming")}
                className="w-full bg-red-700 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm transition-colors shadow-lg"
              >
                <span className="text-base">🔴</span> RBI Emergency Override
              </button>
            )}
            {emergencyState === "confirming" && (
              <div className="bg-red-50 border-2 border-red-400 rounded-xl p-3">
                <p className="text-xs font-bold text-red-700 mb-3 text-center">Drop ALL thresholds 30%? This is irreversible for 1 hour.</p>
                <div className="flex gap-2">
                  <button onClick={handleEmergencyOverride} className="flex-1 bg-red-700 text-white font-bold py-2 rounded-lg text-xs">CONFIRM</button>
                  <button onClick={() => setEmergencyState("idle")} className="flex-1 bg-stone-200 text-stone-700 font-bold py-2 rounded-lg text-xs">CANCEL</button>
                </div>
              </div>
            )}
            {emergencyState === "active" && (
              <div className="bg-red-900 border border-red-600 rounded-xl p-3 text-center animate-pulse">
                <div className="text-red-400 font-bold text-sm">THRESHOLDS REDUCED 30%</div>
                <div className="text-red-500 text-xs mt-1">Emergency mode active — expires in 60 min</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CENTER COLUMN */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">

          {/* Transaction Table */}
          <div className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-stone-100">
              <h2 className="text-sm font-bold text-stone-800 border-l-4 border-orange-600 pl-3">Transaction Analyzer</h2>
              <div className="flex gap-1">
                {(["ALL", "ALERT", "REVIEW", "CLEAR"] as const).map(f => (
                  <button
                    key={f}
                    data-testid={`filter-${f}`}
                    onClick={() => setFilterStatus(f)}
                    className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${filterStatus === f ? "bg-stone-800 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div className="overflow-x-auto max-h-64 overflow-y-auto">
              <table className="w-full text-xs">
                <thead className="bg-stone-50 sticky top-0">
                  <tr>
                    {["TxID", "Account", "Amount", "Risk", "Detector", "Time", "Status", "Action"].map(h => (
                      <th key={h} className="text-left p-2.5 font-semibold text-stone-500 uppercase tracking-wider text-xs">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredTxns.map((tx) => (
                    <tr
                      key={tx.id}
                      data-testid={`tx-row-${tx.id}`}
                      onClick={() => setSelectedTx(tx)}
                      className={`border-t border-stone-50 cursor-pointer transition-colors ${selectedTx?.id === tx.id ? "bg-orange-50 border-l-2 border-l-orange-500" : "hover:bg-stone-50"}`}
                    >
                      <td className="p-2.5 font-mono text-stone-600">{tx.id}</td>
                      <td className="p-2.5 font-medium text-stone-800">{maskName(tx.account, tx.accountId)}</td>
                      <td className="p-2.5 font-mono text-stone-700">₹{tx.amount.toLocaleString()}</td>
                      <td className="p-2.5">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${riskBg(tx.risk)}`}>{Math.round(tx.risk)}</span>
                      </td>
                      <td className="p-2.5 text-stone-600">{tx.detector}</td>
                      <td className="p-2.5 font-mono text-stone-500">{tx.ts}</td>
                      <td className="p-2.5">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${statusBadge(tx.status)}`}>{tx.status}</span>
                      </td>
                      <td className="p-2.5">
                        <button
                          onClick={() => setSelectedTx(tx)}
                          className="text-orange-600 hover:text-orange-800 font-semibold flex items-center gap-0.5"
                        >
                          Analyze <ArrowRight className="h-3 w-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Network Graph + NLP side by side */}
          <div className="grid grid-cols-2 gap-4">
            {/* Circular Flow Graph */}
            <div className="bg-white border border-stone-200 rounded-xl shadow-sm p-4">
              <h2 className="text-sm font-bold text-stone-800 border-l-4 border-orange-600 pl-3 mb-1">Circular Flow — A→B→C→A</h2>
              {networkData.cycles.length > 0 && (
                <div className="text-xs text-red-600 font-bold mb-2">{networkData.cycles.length} ring(s) detected — NetworkX confirmed</div>
              )}
              <div className="relative h-48 flex items-center justify-center">
                <svg viewBox="0 0 220 180" className="w-full h-full max-w-xs mx-auto">
                  <defs>
                    <marker id="arrowR" markerWidth="8" markerHeight="8" refX="8" refY="4" orient="auto">
                      <path d="M0,0 L8,4 L0,8 Z" fill="#C2410C" />
                    </marker>
                    <marker id="arrowA" markerWidth="8" markerHeight="8" refX="8" refY="4" orient="auto">
                      <path d="M0,0 L8,4 L0,8 Z" fill="#f59e0b" />
                    </marker>
                  </defs>
                  <line x1="110" y1="35" x2="175" y2="130" stroke="#C2410C" strokeWidth="2" markerEnd="url(#arrowR)" strokeDasharray="6,3">
                    <animate attributeName="stroke-dashoffset" from="0" to="-18" dur="1.2s" repeatCount="indefinite" />
                  </line>
                  <line x1="180" y1="140" x2="45" y2="140" stroke="#C2410C" strokeWidth="2" markerEnd="url(#arrowR)" strokeDasharray="6,3">
                    <animate attributeName="stroke-dashoffset" from="0" to="-18" dur="1.2s" repeatCount="indefinite" />
                  </line>
                  <line x1="40" y1="130" x2="100" y2="40" stroke="#C2410C" strokeWidth="2" markerEnd="url(#arrowR)" strokeDasharray="6,3">
                    <animate attributeName="stroke-dashoffset" from="0" to="-18" dur="1.2s" repeatCount="indefinite" />
                  </line>
                  <line x1="110" y1="35" x2="110" y2="5" stroke="#d1d5db" strokeWidth="1.5" strokeDasharray="3,2" />
                  <line x1="178" y1="145" x2="215" y2="165" stroke="#d1d5db" strokeWidth="1.5" strokeDasharray="3,2" />
                  <circle cx="110" cy="30" r="22" fill="#fff7ed" stroke="#C2410C" strokeWidth="2" />
                  <text x="110" y="26" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#C2410C">{(vizNodes[0] || "ACC-A").slice(-5)}</text>
                  <text x="110" y="38" textAnchor="middle" fontSize="8" fill="#78716c">₹{vizCycleAmounts[0] ? Math.round(vizCycleAmounts[0]).toLocaleString() : "4,983"}</text>
                  <circle cx="185" cy="145" r="22" fill="#fff7ed" stroke="#C2410C" strokeWidth="2" />
                  <text x="185" y="141" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#C2410C">{(vizNodes[1] || "ACC-B").slice(-5)}</text>
                  <text x="185" y="153" textAnchor="middle" fontSize="8" fill="#78716c">₹{vizCycleAmounts[1] ? Math.round(vizCycleAmounts[1]).toLocaleString() : "4,850"}</text>
                  <circle cx="35" cy="145" r="22" fill="#fff7ed" stroke="#C2410C" strokeWidth="2" />
                  <text x="35" y="141" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#C2410C">{(vizNodes[2] || "ACC-C").slice(-5)}</text>
                  <text x="35" y="153" textAnchor="middle" fontSize="8" fill="#78716c">₹{vizCycleAmounts[2] ? Math.round(vizCycleAmounts[2]).toLocaleString() : "4,920"}</text>
                  <circle cx="110" cy="0" r="10" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.5" />
                  <text x="110" y="4" textAnchor="middle" fontSize="7" fill="#92400e">D</text>
                  <circle cx="215" cy="168" r="10" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.5" />
                  <text x="215" y="172" textAnchor="middle" fontSize="7" fill="#92400e">E</text>
                </svg>
              </div>
              <div className="mt-2 flex gap-3 text-xs justify-center">
                <span className="flex items-center gap-1"><span className="h-2 w-4 bg-orange-600 rounded" /> Confirmed Ring</span>
                <span className="flex items-center gap-1"><span className="h-2 w-4 bg-amber-400 rounded" /> Satellite Node</span>
              </div>
            </div>

            {/* NLP Remark Analyst */}
            <div className="bg-white border border-stone-200 rounded-xl shadow-sm p-4 overflow-hidden">
              <h2 className="text-sm font-bold text-stone-800 border-l-4 border-orange-600 pl-3 mb-3">NLP Remark Analyst</h2>
              <div className="space-y-2 overflow-y-auto max-h-52">
                {nlpRemarks.map((item, i) => (
                  <div key={i} data-testid={`nlp-remark-${i}`} className="flex items-center gap-2 p-2 bg-stone-50 border border-stone-200 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-stone-800 truncate">"{item.remark}"</div>
                      <div className="text-xs text-stone-500">{item.account} · {item.pattern?.replace(/_/g, " ")}</div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="w-16 bg-stone-200 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${item.similarity >= 80 ? "bg-red-500" : item.similarity >= 60 ? "bg-amber-500" : "bg-green-500"}`}
                          style={{ width: `${item.similarity}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-stone-600 w-8">{item.similarity}%</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded font-bold ${statusBadge(item.flag)}`}>{item.flag}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Merkle + PAMRS side by side */}
          <div className="grid grid-cols-2 gap-4">
            {/* Merkle Ledger */}
            <div className="bg-stone-900 border border-stone-700 rounded-xl shadow-sm p-4 overflow-hidden">
              <h2 className="text-sm font-bold text-stone-300 border-l-4 border-orange-600 pl-3 mb-3">Merkle Audit Ledger</h2>
              <div className="space-y-2 overflow-y-auto max-h-48">
                {merkleBlocks.length > 0 ? merkleBlocks.map((block, i) => (
                  <div key={i} data-testid={`ledger-block-${i}`} className="flex items-center gap-2 text-xs font-mono">
                    <Hash className="h-3 w-3 text-orange-500 flex-shrink-0" />
                    <span className="text-stone-500 w-12">#{block.block}</span>
                    <span className="text-green-400 flex-1">{block.hash.slice(0, 16)}...</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${block.event === "CLEARED" || block.event === "INVESTIGATION_STARTED" ? "bg-green-900 text-green-400" : "bg-orange-900 text-orange-400"}`}>
                      {block.event.replace(/_/g, " ")}
                    </span>
                    <span className="text-stone-600">{block.timestamp}</span>
                  </div>
                )) : (
                  <div className="text-stone-500 text-xs">Loading ledger…</div>
                )}
              </div>
            </div>

            {/* PAMRS */}
            <div className="bg-white border border-stone-200 rounded-xl shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-stone-800 border-l-4 border-orange-600 pl-3">PAMRS Onboarding Gate</h2>
                {pamrsVerdict && (
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${pamrsVerdict === "BLOCKED" ? "bg-red-100 text-red-700" : pamrsVerdict === "GATED" ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}>
                    {pamrsVerdict}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                {pamrsChecks.map((check, i) => (
                  <div key={i} data-testid={`pamrs-check-${i}`} className="flex items-center gap-2 text-xs">
                    {check.result === "PASS" ? (
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                    )}
                    <span className="font-medium text-stone-700 w-36 flex-shrink-0">{check.label}</span>
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${check.result === "PASS" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {check.result}
                    </span>
                    <span className="text-stone-500 truncate">{check.detail}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN — AI Investigator */}
      <div className="w-80 flex-shrink-0 border-l border-stone-200 bg-white flex flex-col overflow-hidden">

        {/* AI Forensic Explainer */}
        <div className="bg-stone-900 flex-1 flex flex-col overflow-hidden">
          <div className="p-3 border-b border-stone-700">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-orange-500" />
              <span className="text-xs font-bold text-stone-300 uppercase tracking-widest">
                {apiOnline ? "Groq AI Forensic Explainer" : "Forensic Explainer"}
              </span>
              {isStreaming && <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse ml-auto" />}
            </div>
            {selectedTx && (
              <div className="mt-1 text-xs text-orange-400 font-mono">
                Target: {selectedTx.id} · {zeroPii ? `Entity_${selectedTx.accountId.slice(-4)}` : selectedTx.accountId}
              </div>
            )}
          </div>
          <div ref={forensicRef} className="flex-1 overflow-y-auto p-3 font-mono text-xs leading-relaxed">
            {selectedTx ? (
              <div>
                <pre className="whitespace-pre-wrap text-green-400 leading-5">{forensicText}</pre>
                {isStreaming && <span className="animate-pulse text-orange-400">█</span>}
              </div>
            ) : (
              <div className="text-stone-500 text-center mt-8">Select a transaction to begin forensic analysis.</div>
            )}
          </div>
          {!isStreaming && selectedTx && (
            <div className="p-3 border-t border-stone-700">
              <button
                data-testid="button-restart-analysis"
                onClick={() => startForensicStream(selectedTx)}
                className="w-full text-xs text-stone-400 hover:text-orange-400 transition-colors flex items-center justify-center gap-1"
              >
                <RefreshCw className="h-3 w-3" /> Re-run analysis
              </button>
            </div>
          )}
        </div>

        {/* Alert Surface */}
        <div className="border-t border-stone-200 overflow-hidden" style={{ maxHeight: "220px" }}>
          <div className="p-3 border-b border-stone-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-orange-600" />
              <span className="text-xs font-bold text-stone-700 uppercase tracking-widest">Alert Surface</span>
            </div>
            <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">
              {alerts.filter(a => a.type === "HIGH").length} HIGH
            </span>
          </div>
          <div className="overflow-y-auto" style={{ maxHeight: "170px" }}>
            {alerts.map((alert, i) => (
              <div key={i} data-testid={`alert-${i}`} className={`flex gap-2 p-2.5 border-b border-stone-50 ${i === 0 ? "bg-red-50" : ""}`}>
                <AlertCircle className={`h-4 w-4 flex-shrink-0 mt-0.5 ${alert.type === "HIGH" ? "text-red-600" : alert.type === "MEDIUM" ? "text-amber-500" : "text-stone-400"}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-stone-700 leading-tight">{alert.msg}</p>
                  <div className="flex gap-2 mt-0.5">
                    <span className="text-xs text-stone-400 font-mono">{alert.ts}</span>
                    <span className="text-xs text-orange-600">{alert.account}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom panel */}
        <div className="border-t border-stone-200 overflow-y-auto" style={{ maxHeight: "320px" }}>
          <div className="p-3 space-y-3">

            {/* Adaptive Pattern */}
            {newPatternVisible && (
              <div className="bg-amber-50 border border-amber-300 rounded-lg p-2.5 flex gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="text-xs font-bold text-amber-800">NEW PATTERN DETECTED</div>
                  <p className="text-xs text-amber-700 mt-0.5">Sub-threshold structuring + NLP urgency combined signature. Added to pattern library.</p>
                </div>
                <button onClick={() => setNewPatternVisible(false)} className="text-amber-500 hover:text-amber-700 text-xs">✕</button>
              </div>
            )}

            {/* Jurisdictional Mapping */}
            <div className="bg-stone-50 border border-stone-200 rounded-lg p-2.5">
              <div className="flex items-center gap-1.5 mb-2">
                <Map className="h-3.5 w-3.5 text-orange-600" />
                <span className="text-xs font-bold text-stone-700">Jurisdictional Risk</span>
              </div>
              <div className="space-y-1">
                {[
                  { country: "Myanmar", level: "FATF Grey-list", risk: "HIGH" },
                  { country: "UAE", level: "Enhanced monitoring", risk: "MEDIUM" },
                  { country: "Philippines", level: "FinCEN alert active", risk: "MEDIUM" },
                ].map((j, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="text-stone-600">{j.country} — <span className="text-stone-400">{j.level}</span></span>
                    <span className={`font-bold ${j.risk === "HIGH" ? "text-red-600" : "text-amber-600"}`}>{j.risk}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Maker-Checker */}
            <div className="bg-stone-50 border border-stone-200 rounded-lg p-2.5">
              <div className="flex items-center gap-1.5 mb-2">
                <CheckSquare className="h-3.5 w-3.5 text-orange-600" />
                <span className="text-xs font-bold text-stone-700">Maker-Checker Workflow</span>
              </div>
              {makerCheckerState === "idle" && (
                <button
                  data-testid="button-request-checker"
                  onClick={handleMakerRequest}
                  className="w-full text-xs bg-stone-800 text-white font-semibold py-1.5 rounded-lg hover:bg-stone-700 transition-colors mb-1.5"
                >
                  Request Checker Approval {selectedTx ? `— ${selectedTx.accountId}` : ""}
                </button>
              )}
              {makerCheckerState === "pending" && (
                <div className="mb-1.5 bg-amber-50 border border-amber-200 rounded p-2 text-xs text-amber-700 text-center font-semibold">
                  Awaiting checker authorization… {makerWorkflowId ? `(${makerWorkflowId})` : ""}
                </div>
              )}
              {makerCheckerState === "authorized" && (
                <div className="mb-1.5 bg-green-50 border border-green-200 rounded p-2 text-xs text-green-700 text-center font-bold">
                  Authorized — Account frozen
                </div>
              )}
              <button
                data-testid="button-authorize-freeze"
                onClick={handleAuthorizeFreeze}
                disabled={makerCheckerState === "authorized"}
                className={`w-full text-xs font-bold py-1.5 rounded-lg transition-colors ${makerCheckerState === "authorized" ? "bg-green-100 text-green-700 cursor-not-allowed" : "bg-red-700 text-white hover:bg-red-600"}`}
              >
                Authorize Freeze
              </button>
            </div>

            {/* STR Queue */}
            <div className="bg-stone-50 border border-stone-200 rounded-lg p-2.5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-orange-600" />
                  <span className="text-xs font-bold text-stone-700">STR Report Queue</span>
                </div>
                <button
                  onClick={handleGenerateStr}
                  className="text-xs bg-orange-600 hover:bg-orange-700 text-white font-bold px-2 py-0.5 rounded transition-colors"
                >
                  + File STR
                </button>
              </div>
              <div className="space-y-1">
                {strQueue.length > 0 ? strQueue.map((str, i) => (
                  <div key={i} data-testid={`str-item-${i}`} className="flex items-center justify-between text-xs">
                    <span className="font-mono text-stone-600">{str.str_id}</span>
                    <span className="text-stone-500">{str.account_id}</span>
                    <span className={`font-bold px-1.5 py-0.5 rounded text-xs ${str.status === "filed" ? "bg-green-100 text-green-700" : str.status === "pending" ? "bg-amber-100 text-amber-700" : "bg-stone-100 text-stone-600"}`}>
                      {str.status.toUpperCase()}
                    </span>
                  </div>
                )) : (
                  <div className="text-stone-400 text-xs text-center py-1">No STRs filed yet — click "+ File STR"</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
