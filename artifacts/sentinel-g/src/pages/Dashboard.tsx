import { useState, useEffect, useRef } from "react";
import {
  Shield, Zap, Network, Globe, Lock, Fingerprint,
  BarChart2, AlertTriangle, Activity, Bell, HeartPulse,
  Radio, RefreshCw, EyeOff, Terminal, Map, CheckSquare,
  FileText, Sliders, ChevronDown, ChevronUp, Hash,
  TrendingUp, Clock, CheckCircle, XCircle, AlertCircle,
  Database, Cpu, Wifi, ArrowRight
} from "lucide-react";

interface DashboardProps {
  zeroPii: boolean;
}

const TRANSACTIONS = [
  { id: "TXN-4821", account: "Rajesh Kumar", accountId: "E_4821", amount: 4983, risk: 92, detector: "Structuring", ts: "14:32:07", status: "ALERT" },
  { id: "TXN-4820", account: "Priya Sharma", accountId: "E_4820", amount: 48200, risk: 78, detector: "Velocity", ts: "14:29:43", status: "ALERT" },
  { id: "TXN-4819", account: "Amit Verma", accountId: "E_4819", amount: 4750, risk: 85, detector: "Network", ts: "14:27:18", status: "ALERT" },
  { id: "TXN-4818", account: "Sunita Patel", accountId: "E_4818", amount: 12400, risk: 34, detector: "Velocity", ts: "14:24:55", status: "CLEAR" },
  { id: "TXN-4817", account: "Deepak Nair", accountId: "E_4817", amount: 4850, risk: 88, detector: "Structuring", ts: "14:21:32", status: "ALERT" },
  { id: "TXN-4816", account: "Meena Joshi", accountId: "E_4816", amount: 73000, risk: 67, detector: "PEP", ts: "14:18:09", status: "REVIEW" },
  { id: "TXN-4815", account: "Vikram Singh", accountId: "E_4815", amount: 4990, risk: 91, detector: "Structuring", ts: "14:15:44", status: "ALERT" },
  { id: "TXN-4814", account: "Anjali Rao", accountId: "E_4814", amount: 28700, risk: 43, detector: "Jurisdiction", ts: "14:12:21", status: "CLEAR" },
  { id: "TXN-4813", account: "Suresh Kumar", accountId: "E_4813", amount: 4870, risk: 89, detector: "Network", ts: "14:09:58", status: "ALERT" },
  { id: "TXN-4812", account: "Kavitha Menon", accountId: "E_4812", amount: 15600, risk: 55, detector: "KYC", ts: "14:07:35", status: "REVIEW" },
  { id: "TXN-4811", account: "Rajan Pillai", accountId: "E_4811", amount: 4920, risk: 94, detector: "Structuring", ts: "14:04:12", status: "ALERT" },
  { id: "TXN-4810", account: "Divya Krishnan", accountId: "E_4810", amount: 8100, risk: 22, detector: "Velocity", ts: "14:01:49", status: "CLEAR" },
  { id: "TXN-4809", account: "Arun Gupta", accountId: "E_4809", amount: 4960, risk: 87, detector: "Structuring", ts: "13:58:26", status: "ALERT" },
  { id: "TXN-4808", account: "Pooja Saxena", accountId: "E_4808", amount: 95000, risk: 71, detector: "Jurisdiction", ts: "13:55:03", status: "REVIEW" },
  { id: "TXN-4807", account: "Nikhil Tiwari", accountId: "E_4807", amount: 4800, risk: 83, detector: "Network", ts: "13:51:40", status: "ALERT" },
  { id: "TXN-4806", account: "Shalini Mehta", accountId: "E_4806", amount: 33200, risk: 28, detector: "Velocity", ts: "13:48:17", status: "CLEAR" },
  { id: "TXN-4805", account: "Arjun Das", accountId: "E_4805", amount: 4770, risk: 90, detector: "Structuring", ts: "13:44:54", status: "ALERT" },
  { id: "TXN-4804", account: "Rekha Iyer", accountId: "E_4804", amount: 62500, risk: 58, detector: "PEP", ts: "13:41:31", status: "REVIEW" },
  { id: "TXN-4803", account: "Manoj Nanda", accountId: "E_4803", amount: 4910, risk: 86, detector: "Network", ts: "13:38:08", status: "ALERT" },
  { id: "TXN-4802", account: "Geeta Bose", accountId: "E_4802", amount: 7300, risk: 15, detector: "KYC", ts: "13:34:45", status: "CLEAR" },
];

const MERKLE_BLOCKS = [
  { block: 4821, hash: "8f2d3a1c4b92e7f0", ts: "14:32:07", event: "STRUCTURING" },
  { block: 4820, hash: "7a1e9c3b2d8f4a5c", ts: "14:29:43", event: "VELOCITY" },
  { block: 4819, hash: "6f3c2b1a9e8d7c4b", ts: "14:27:18", event: "NETWORK" },
  { block: 4818, hash: "5e4d3c2b1a9f8e7d", ts: "14:24:55", event: "CLEARED" },
  { block: 4817, hash: "4d5e6f7a8b9c1d2e", ts: "14:21:32", event: "STRUCTURING" },
  { block: 4816, hash: "3c6d7e8f9a1b2c3d", ts: "14:18:09", event: "PEP_FLAG" },
  { block: 4815, hash: "2b7c8d9e1a2b3c4d", ts: "14:15:44", event: "STRUCTURING" },
  { block: 4814, hash: "1a8b9c1d2e3f4a5b", ts: "14:12:21", event: "CLEARED" },
  { block: 4813, hash: "9b1c2d3e4f5a6b7c", ts: "14:09:58", event: "NETWORK" },
  { block: 4812, hash: "8c2d3e4f5a6b7c8d", ts: "14:07:35", event: "KYC_GAP" },
  { block: 4811, hash: "7d3e4f5a6b7c8d9e", ts: "14:04:12", event: "STRUCTURING" },
  { block: 4810, hash: "6e4f5a6b7c8d9e1f", ts: "14:01:49", event: "CLEARED" },
];

const NLP_REMARKS = [
  { remark: "Urgent Crypto Payment Needed", similarity: 94, flag: "ALERT", account: "TXN-4821" },
  { remark: "Festival Gift Transfer — Diwali", similarity: 23, flag: "CLEAR", account: "TXN-4818" },
  { remark: "Trade Settlement Offshore LLC", similarity: 78, flag: "REVIEW", account: "TXN-4820" },
  { remark: "Medical Emergency Fund Transfer", similarity: 45, flag: "CLEAR", account: "TXN-4812" },
  { remark: "Loan Repayment Friend Account", similarity: 31, flag: "CLEAR", account: "TXN-4816" },
  { remark: "USDT Exchange Convert Now", similarity: 91, flag: "ALERT", account: "TXN-4819" },
  { remark: "Urgent Wire Before Close Today", similarity: 82, flag: "ALERT", account: "TXN-4817" },
  { remark: "Salary Credit Advance Release", similarity: 17, flag: "CLEAR", account: "TXN-4814" },
  { remark: "Commission Payment Hidden Fees", similarity: 76, flag: "REVIEW", account: "TXN-4808" },
  { remark: "Family Obligation Support Send", similarity: 29, flag: "CLEAR", account: "TXN-4802" },
];

const ALERTS = [
  { id: 1, type: "HIGH", msg: "Structuring ring detected: 11 micro-txns in 3h under ₹5,000", ts: "14:32:07", account: "TXN-4821" },
  { id: 2, type: "HIGH", msg: "Circular flow A→B→C→A confirmed (3-node ring, ₹14,700 total)", ts: "14:29:43", account: "TXN-4819" },
  { id: 3, type: "MEDIUM", msg: "NLP match 91%: 'USDT Exchange' pattern library hit", ts: "14:27:18", account: "TXN-4820" },
  { id: 4, type: "HIGH", msg: "Velocity spike: 47 transactions in 3h (3.8× baseline)", ts: "14:21:32", account: "TXN-4815" },
  { id: 5, type: "MEDIUM", msg: "PEP linkage detected — account shares device ID with PEP entity", ts: "14:18:09", account: "TXN-4816" },
  { id: 6, type: "LOW", msg: "KYC document expiry: Aadhaar expired 47 days ago", ts: "14:12:21", account: "TXN-4812" },
  { id: 7, type: "HIGH", msg: "New mule pattern: Sub-threshold structuring with NLP urgency", ts: "14:09:58", account: "TXN-4813" },
  { id: 8, type: "MEDIUM", msg: "Jurisdictional risk: FATF grey-list country transaction", ts: "14:07:35", account: "TXN-4808" },
];

const STR_QUEUE = [
  { id: "STR-2024-001", account: "TXN-4821", score: 92, status: "filed" },
  { id: "STR-2024-002", account: "TXN-4815", score: 91, status: "pending" },
  { id: "STR-2024-003", account: "TXN-4811", score: 94, status: "filed" },
  { id: "STR-2024-004", account: "TXN-4805", score: 90, status: "draft" },
];

const DETECTORS = [
  { name: "Structuring", icon: <Shield className="h-4 w-4" />, status: "ALERT", score: 92, color: "text-red-600", bg: "bg-red-50", border: "border-red-200" },
  { name: "Velocity", icon: <Zap className="h-4 w-4" />, status: "ALERT", score: 87, color: "text-red-600", bg: "bg-red-50", border: "border-red-200" },
  { name: "Network/Graph", icon: <Network className="h-4 w-4" />, status: "ALERT", score: 78, color: "text-red-600", bg: "bg-red-50", border: "border-red-200" },
  { name: "PEP", icon: <Globe className="h-4 w-4" />, status: "WARNING", score: 61, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" },
  { name: "Jurisdiction", icon: <Map className="h-4 w-4" />, status: "WARNING", score: 54, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" },
  { name: "KYC", icon: <Lock className="h-4 w-4" />, status: "ACTIVE", score: 38, color: "text-green-600", bg: "bg-green-50", border: "border-green-200" },
];

const FORENSIC_LINES = [
  "Initializing forensic analysis for selected entity...",
  "PATTERN: 11 micro-transactions in 3h, avg ₹4,983 (below ₹5,000 threshold)",
  "STRUCTURING: Confidence 94% — Classic smurfing signature detected",
  "NETWORK: Connected to 3 flagged mule accounts via 2-hop graph analysis",
  "NODE A → NODE B: ₹4,983 (14:12) | NODE B → NODE C: ₹4,850 (14:18) | NODE C → NODE A: ₹4,920 (14:24)",
  "CIRCULAR FLOW CONFIRMED: A→B→C→A ring, total ₹14,753 in 12 minutes",
  "NLP: Transaction remark 'Urgent Crypto Payment' — 94% match with fraud pattern library",
  "VELOCITY: 47 transactions in 3h vs. 12.3 baseline (382% spike)",
  "JURISDICTION: 2 transactions originate from FATF grey-list routing",
  "KYC: Identity document last verified 847 days ago — expired threshold: 365 days",
  "PAMRS: Device ID shared with 4 other flagged accounts (pincode cluster: 400001)",
  "WEIGHTED RISK INDEX: 92/100 — HIGH CONFIDENCE MULE ACCOUNT",
  "VERDICT: Recommend immediate STR filing with FIU-IND and account freeze request.",
  "Generating evidence chain hash: 8f2d3a1c4b92e7f09d3c1a8b5e6f2d4c...",
  "Evidence chain committed to Merkle Ledger — Block #4821",
];

const PAMRS_CHECKS = [
  { label: "Device ID Fingerprint", result: "FAIL", detail: "ID shared across 4 accounts" },
  { label: "Pincode Cluster Analysis", result: "FAIL", detail: "17 accounts in PIN 400001" },
  { label: "Network Proximity Score", result: "FAIL", detail: "IP subnet: 3 flagged neighbors" },
  { label: "Sim Swap History", result: "PASS", detail: "No recent sim swap detected" },
  { label: "Behavioral Baseline", result: "FAIL", detail: "No pre-activation baseline" },
  { label: "AML Watchlist Match", result: "PASS", detail: "No direct watchlist hit" },
];

export default function Dashboard({ zeroPii }: DashboardProps) {
  const [selectedTx, setSelectedTx] = useState<string | null>("TXN-4821");
  const [forensicText, setForensicText] = useState("");
  const [forensicLine, setForensicLine] = useState(0);
  const [forensicCharIdx, setForensicCharIdx] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [filterStatus, setFilterStatus] = useState<"ALL" | "ALERT" | "REVIEW" | "CLEAR">("ALL");
  const [thresholds, setThresholds] = useState({ velocity: 65, amount: 5000, networkDepth: 3, nlpSimilarity: 70 });
  const [emergencyState, setEmergencyState] = useState<"idle" | "confirming" | "active">("idle");
  const [makerCheckerState, setMakerCheckerState] = useState<"idle" | "pending" | "authorized">("idle");
  const [liveTxCount, setLiveTxCount] = useState(247);
  const [newPatternVisible, setNewPatternVisible] = useState(true);
  const forensicRef = useRef<HTMLDivElement>(null);
  const ledgerRef = useRef<HTMLDivElement>(null);

  const maskName = (name: string, id: string) => zeroPii ? `Entity_${id.replace("E_", "")}` : name;

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveTxCount(c => c + Math.floor(Math.random() * 4));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Typewriter effect
  useEffect(() => {
    if (!selectedTx) return;
    setForensicText("");
    setForensicLine(0);
    setForensicCharIdx(0);
    setIsTyping(true);
  }, [selectedTx]);

  useEffect(() => {
    if (!isTyping) return;
    if (forensicLine >= FORENSIC_LINES.length) { setIsTyping(false); return; }
    const line = FORENSIC_LINES[forensicLine];
    if (forensicCharIdx < line.length) {
      const t = setTimeout(() => {
        setForensicText(prev => prev + line[forensicCharIdx]);
        setForensicCharIdx(c => c + 1);
      }, 18);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setForensicText(prev => prev + "\n");
        setForensicLine(l => l + 1);
        setForensicCharIdx(0);
      }, 120);
      return () => clearTimeout(t);
    }
  }, [isTyping, forensicLine, forensicCharIdx]);

  useEffect(() => {
    if (forensicRef.current) {
      forensicRef.current.scrollTop = forensicRef.current.scrollHeight;
    }
  }, [forensicText]);

  const filteredTxns = TRANSACTIONS.filter(tx => filterStatus === "ALL" || tx.status === filterStatus);
  const compositeScore = Math.round(DETECTORS.reduce((acc, d) => acc + d.score * (d.name === "Structuring" ? 0.25 : d.name === "Velocity" ? 0.20 : d.name === "Network/Graph" ? 0.20 : d.name === "PEP" ? 0.15 : d.name === "Jurisdiction" ? 0.10 : 0.10), 0));

  const riskBg = (score: number) => score >= 80 ? "text-red-700 bg-red-100" : score >= 55 ? "text-amber-700 bg-amber-100" : "text-green-700 bg-green-100";
  const statusBadge = (s: string) => s === "ALERT" ? "bg-red-100 text-red-700 font-bold" : s === "REVIEW" ? "bg-amber-100 text-amber-700 font-bold" : "bg-green-100 text-green-700";

  return (
    <div className="flex h-[calc(100vh-56px)] overflow-hidden bg-stone-100">
      {/* LEFT COLUMN */}
      <div className="w-72 flex-shrink-0 border-r border-stone-200 bg-white flex flex-col overflow-y-auto">
        <div className="p-4 space-y-4">
          {/* Detector Status Cards */}
          <div>
            <div className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-3 border-l-4 border-orange-600 pl-2">Six-Detector Status</div>
            <div className="space-y-2">
              {DETECTORS.map((det, i) => (
                <div key={i} data-testid={`detector-${i}`} className={`flex items-center justify-between p-2.5 rounded-lg border ${det.bg} ${det.border}`}>
                  <div className="flex items-center gap-2">
                    <span className={det.color}>{det.icon}</span>
                    <span className="text-xs font-semibold text-stone-700">{det.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-14 bg-stone-200 rounded-full h-1.5">
                      <div className={`h-1.5 rounded-full ${det.status === "ALERT" ? "bg-red-500" : det.status === "WARNING" ? "bg-amber-500" : "bg-green-500"}`} style={{ width: `${det.score}%` }} />
                    </div>
                    <span className={`text-xs font-bold ${det.color}`}>{det.status}</span>
                  </div>
                </div>
              ))}
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
              {DETECTORS.map((det, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-xs text-stone-400 w-20 truncate">{det.name}</span>
                  <div className="flex-1 bg-stone-700 rounded-full h-1">
                    <div className={`h-1 rounded-full ${det.status === "ALERT" ? "bg-orange-500" : det.status === "WARNING" ? "bg-amber-500" : "bg-green-500"}`} style={{ width: `${det.score}%` }} />
                  </div>
                  <span className="text-xs text-stone-400 w-6 text-right">{det.score}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Live Pipeline */}
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-3">
            <div className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-2 border-l-4 border-orange-600 pl-2">Live Pipeline</div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
              <span className="text-xs font-semibold text-stone-700">ACTIVE — Synthetic Data Stream</span>
            </div>
            <div className="text-xl font-extrabold text-orange-600">{liveTxCount} <span className="text-sm font-normal text-stone-500">tx/min</span></div>
            <div className="text-xs text-stone-400 mt-1">Detectors processing real-time</div>
          </div>

          {/* System Health */}
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-3">
            <div className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-3 border-l-4 border-orange-600 pl-2">System Vitals</div>
            <div className="space-y-2">
              {[
                { label: "Engine Uptime", val: "99.98%", icon: <HeartPulse className="h-3.5 w-3.5" />, ok: true },
                { label: "Tx / sec", val: "4.1", icon: <Activity className="h-3.5 w-3.5" />, ok: true },
                { label: "Memory", val: "72%", icon: <Cpu className="h-3.5 w-3.5" />, ok: true },
                { label: "API Latency", val: "38ms", icon: <Wifi className="h-3.5 w-3.5" />, ok: true },
              ].map((v, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-stone-500">
                    <span className="text-stone-400">{v.icon}</span>
                    {v.label}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-stone-800">{v.val}</span>
                    <span className="h-2 w-2 rounded-full bg-green-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Threshold Tuner */}
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-3">
            <div className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-3 border-l-4 border-orange-600 pl-2">Dynamic Threshold Tuner</div>
            <div className="space-y-3">
              {[
                { label: "Velocity Threshold", key: "velocity" as const, min: 10, max: 100, unit: "%" },
                { label: "Amount Limit (₹)", key: "amount" as const, min: 1000, max: 10000, unit: "" },
                { label: "Network Depth", key: "networkDepth" as const, min: 1, max: 10, unit: " hops" },
                { label: "NLP Similarity", key: "nlpSimilarity" as const, min: 50, max: 100, unit: "%" },
              ].map((t) => (
                <div key={t.key}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-stone-500">{t.label}</span>
                    <span className="font-bold text-orange-600">{thresholds[t.key]}{t.unit}</span>
                  </div>
                  <input
                    data-testid={`slider-${t.key}`}
                    type="range"
                    min={t.min}
                    max={t.max}
                    value={thresholds[t.key]}
                    onChange={(e) => setThresholds(prev => ({ ...prev, [t.key]: Number(e.target.value) }))}
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
                  <button onClick={() => { setEmergencyState("active"); setTimeout(() => setEmergencyState("idle"), 6000); }} className="flex-1 bg-red-700 text-white font-bold py-2 rounded-lg text-xs">CONFIRM</button>
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
                  {filteredTxns.map((tx, i) => (
                    <tr
                      key={tx.id}
                      data-testid={`tx-row-${tx.id}`}
                      onClick={() => setSelectedTx(tx.id)}
                      className={`border-t border-stone-50 cursor-pointer transition-colors ${selectedTx === tx.id ? "bg-orange-50 border-l-2 border-l-orange-500" : "hover:bg-stone-50"}`}
                    >
                      <td className="p-2.5 font-mono text-stone-600">{tx.id}</td>
                      <td className="p-2.5 font-medium text-stone-800">{maskName(tx.account, tx.accountId)}</td>
                      <td className="p-2.5 font-mono text-stone-700">₹{tx.amount.toLocaleString()}</td>
                      <td className="p-2.5">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${riskBg(tx.risk)}`}>{tx.risk}</span>
                      </td>
                      <td className="p-2.5 text-stone-600">{tx.detector}</td>
                      <td className="p-2.5 font-mono text-stone-500">{tx.ts}</td>
                      <td className="p-2.5">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${statusBadge(tx.status)}`}>{tx.status}</span>
                      </td>
                      <td className="p-2.5">
                        <button onClick={() => setSelectedTx(tx.id)} className="text-orange-600 hover:text-orange-800 font-semibold flex items-center gap-0.5">
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
              <h2 className="text-sm font-bold text-stone-800 border-l-4 border-orange-600 pl-3 mb-4">Circular Flow — A→B→C→A</h2>
              <div className="relative h-48 flex items-center justify-center">
                <svg viewBox="0 0 220 180" className="w-full h-full max-w-xs mx-auto">
                  {/* Edges with arrows */}
                  <defs>
                    <marker id="arrowR" markerWidth="8" markerHeight="8" refX="8" refY="4" orient="auto">
                      <path d="M0,0 L8,4 L0,8 Z" fill="#C2410C" />
                    </marker>
                    <marker id="arrowA" markerWidth="8" markerHeight="8" refX="8" refY="4" orient="auto">
                      <path d="M0,0 L8,4 L0,8 Z" fill="#f59e0b" />
                    </marker>
                  </defs>
                  {/* A→B */}
                  <line x1="110" y1="35" x2="175" y2="130" stroke="#C2410C" strokeWidth="2" markerEnd="url(#arrowR)" strokeDasharray="6,3">
                    <animate attributeName="stroke-dashoffset" from="0" to="-18" dur="1.2s" repeatCount="indefinite" />
                  </line>
                  {/* B→C */}
                  <line x1="180" y1="140" x2="45" y2="140" stroke="#C2410C" strokeWidth="2" markerEnd="url(#arrowR)" strokeDasharray="6,3">
                    <animate attributeName="stroke-dashoffset" from="0" to="-18" dur="1.2s" repeatCount="indefinite" />
                  </line>
                  {/* C→A */}
                  <line x1="40" y1="130" x2="100" y2="40" stroke="#C2410C" strokeWidth="2" markerEnd="url(#arrowR)" strokeDasharray="6,3">
                    <animate attributeName="stroke-dashoffset" from="0" to="-18" dur="1.2s" repeatCount="indefinite" />
                  </line>
                  {/* Flagged satellite */}
                  <line x1="110" y1="35" x2="110" y2="5" stroke="#d1d5db" strokeWidth="1.5" strokeDasharray="3,2" />
                  <line x1="178" y1="145" x2="215" y2="165" stroke="#d1d5db" strokeWidth="1.5" strokeDasharray="3,2" />
                  {/* Nodes */}
                  <circle cx="110" cy="30" r="22" fill="#fff7ed" stroke="#C2410C" strokeWidth="2" />
                  <text x="110" y="26" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#C2410C">NODE A</text>
                  <text x="110" y="38" textAnchor="middle" fontSize="8" fill="#78716c">₹4,983</text>
                  <circle cx="185" cy="145" r="22" fill="#fff7ed" stroke="#C2410C" strokeWidth="2" />
                  <text x="185" y="141" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#C2410C">NODE B</text>
                  <text x="185" y="153" textAnchor="middle" fontSize="8" fill="#78716c">₹4,850</text>
                  <circle cx="35" cy="145" r="22" fill="#fff7ed" stroke="#C2410C" strokeWidth="2" />
                  <text x="35" y="141" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#C2410C">NODE C</text>
                  <text x="35" y="153" textAnchor="middle" fontSize="8" fill="#78716c">₹4,920</text>
                  {/* Satellite nodes */}
                  <circle cx="110" cy="0" r="10" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.5" />
                  <text x="110" y="4" textAnchor="middle" fontSize="7" fill="#92400e">D</text>
                  <circle cx="215" cy="168" r="10" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.5" />
                  <text x="215" y="172" textAnchor="middle" fontSize="7" fill="#92400e">E</text>
                  {/* Amount labels on edges */}
                  <text x="155" y="82" textAnchor="middle" fontSize="8" fill="#78716c" transform="rotate(52 155 82)">₹14.7K</text>
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
                {NLP_REMARKS.map((item, i) => (
                  <div key={i} data-testid={`nlp-remark-${i}`} className="flex items-center gap-2 p-2 bg-stone-50 border border-stone-200 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-stone-800 truncate">"{item.remark}"</div>
                      <div className="text-xs text-stone-500">{item.account}</div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="w-16 bg-stone-200 rounded-full h-1.5">
                        <div className={`h-1.5 rounded-full ${item.similarity >= 80 ? "bg-red-500" : item.similarity >= 60 ? "bg-amber-500" : "bg-green-500"}`} style={{ width: `${item.similarity}%` }} />
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
              <div ref={ledgerRef} className="space-y-2 overflow-y-auto max-h-48">
                {MERKLE_BLOCKS.map((block, i) => (
                  <div key={i} data-testid={`ledger-block-${i}`} className="flex items-center gap-2 text-xs font-mono">
                    <Hash className="h-3 w-3 text-orange-500 flex-shrink-0" />
                    <span className="text-stone-500 w-12">#{block.block}</span>
                    <span className="text-green-400 flex-1">{block.hash}...</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${block.event === "CLEARED" ? "bg-green-900 text-green-400" : "bg-orange-900 text-orange-400"}`}>{block.event}</span>
                    <span className="text-stone-600">{block.ts}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* PAMRS */}
            <div className="bg-white border border-stone-200 rounded-xl shadow-sm p-4">
              <h2 className="text-sm font-bold text-stone-800 border-l-4 border-orange-600 pl-3 mb-3">PAMRS Onboarding Gate</h2>
              <div className="space-y-2">
                {PAMRS_CHECKS.map((check, i) => (
                  <div key={i} data-testid={`pamrs-check-${i}`} className="flex items-center gap-2 text-xs">
                    {check.result === "PASS" ? (
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                    )}
                    <span className="font-medium text-stone-700 w-36 flex-shrink-0">{check.label}</span>
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${check.result === "PASS" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{check.result}</span>
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
        {/* AI Explainer */}
        <div className="bg-stone-900 flex-1 flex flex-col overflow-hidden">
          <div className="p-3 border-b border-stone-700">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-orange-500" />
              <span className="text-xs font-bold text-stone-300 uppercase tracking-widest">Forensic AI Explainer</span>
              {isTyping && <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse ml-auto" />}
            </div>
            {selectedTx && (
              <div className="mt-1 text-xs text-orange-400 font-mono">Target: {selectedTx}</div>
            )}
          </div>
          <div ref={forensicRef} className="flex-1 overflow-y-auto p-3 font-mono text-xs leading-relaxed">
            {selectedTx ? (
              <div>
                <pre className="whitespace-pre-wrap text-green-400 leading-5">{forensicText}</pre>
                {isTyping && <span className="animate-pulse text-orange-400">█</span>}
              </div>
            ) : (
              <div className="text-stone-500 text-center mt-8">Select a transaction to begin forensic analysis.</div>
            )}
          </div>
          {!isTyping && selectedTx && (
            <div className="p-3 border-t border-stone-700">
              <button
                data-testid="button-restart-analysis"
                onClick={() => { setForensicText(""); setForensicLine(0); setForensicCharIdx(0); setIsTyping(true); }}
                className="w-full text-xs text-stone-400 hover:text-orange-400 transition-colors flex items-center justify-center gap-1"
              >
                <RefreshCw className="h-3 w-3" /> Re-run analysis
              </button>
            </div>
          )}
        </div>

        {/* Alerts */}
        <div className="border-t border-stone-200 overflow-hidden" style={{ maxHeight: "220px" }}>
          <div className="p-3 border-b border-stone-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-orange-600" />
              <span className="text-xs font-bold text-stone-700 uppercase tracking-widest">Alert Surface</span>
            </div>
            <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">{ALERTS.filter(a => a.type === "HIGH").length} HIGH</span>
          </div>
          <div className="overflow-y-auto" style={{ maxHeight: "170px" }}>
            {ALERTS.map((alert, i) => (
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

        {/* Bottom panel: Adaptive Pattern + Zero-PII + Maker-Checker + STR + Jurisdiction */}
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
                  onClick={() => setMakerCheckerState("pending")}
                  className="w-full text-xs bg-stone-800 text-white font-semibold py-1.5 rounded-lg hover:bg-stone-700 transition-colors mb-1.5"
                >
                  Request Checker Approval
                </button>
              )}
              {makerCheckerState === "pending" && (
                <div className="mb-1.5 bg-amber-50 border border-amber-200 rounded p-2 text-xs text-amber-700 text-center font-semibold">
                  Awaiting checker authorization...
                </div>
              )}
              {makerCheckerState === "authorized" && (
                <div className="mb-1.5 bg-green-50 border border-green-200 rounded p-2 text-xs text-green-700 text-center font-bold">
                  Authorized — Account frozen
                </div>
              )}
              <button
                data-testid="button-authorize-freeze"
                onClick={() => setMakerCheckerState("authorized")}
                disabled={makerCheckerState === "authorized"}
                className={`w-full text-xs font-bold py-1.5 rounded-lg transition-colors ${makerCheckerState === "authorized" ? "bg-green-100 text-green-700 cursor-not-allowed" : "bg-red-700 text-white hover:bg-red-600"}`}
              >
                Authorize Freeze
              </button>
            </div>

            {/* STR Queue */}
            <div className="bg-stone-50 border border-stone-200 rounded-lg p-2.5">
              <div className="flex items-center gap-1.5 mb-2">
                <FileText className="h-3.5 w-3.5 text-orange-600" />
                <span className="text-xs font-bold text-stone-700">STR Report Queue</span>
              </div>
              <div className="space-y-1">
                {STR_QUEUE.map((str, i) => (
                  <div key={i} data-testid={`str-item-${i}`} className="flex items-center justify-between text-xs">
                    <span className="font-mono text-stone-600">{str.id}</span>
                    <span className="text-stone-500">{str.account}</span>
                    <span className={`font-bold px-1.5 py-0.5 rounded text-xs ${str.status === "filed" ? "bg-green-100 text-green-700" : str.status === "pending" ? "bg-amber-100 text-amber-700" : "bg-stone-100 text-stone-600"}`}>
                      {str.status.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
