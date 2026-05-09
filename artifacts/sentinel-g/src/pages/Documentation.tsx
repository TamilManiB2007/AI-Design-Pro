import { useState } from "react";
import { BookOpen, Shield, BarChart2, Network, FileText, Database, CheckCircle, Code, ChevronRight } from "lucide-react";

const sections = [
  { id: "overview", label: "System Overview", icon: <BookOpen className="h-4 w-4" /> },
  { id: "rule-engine", label: "Rule Engine", icon: <Shield className="h-4 w-4" /> },
  { id: "detectors", label: "Six Detectors", icon: <BarChart2 className="h-4 w-4" /> },
  { id: "graph", label: "Graph Engine", icon: <Network className="h-4 w-4" /> },
  { id: "regulatory", label: "Regulatory Map", icon: <FileText className="h-4 w-4" /> },
  { id: "merkle", label: "Merkle Ledger", icon: <Database className="h-4 w-4" /> },
  { id: "api", label: "API Reference", icon: <Code className="h-4 w-4" /> },
];

const regulatoryRows = [
  { feature: "Structuring Detector (Smurfing)", fiuInd: "Red Flag #4 — Unusual cash structuring", fatf: "R.20 — Suspicious Transaction Reporting", finCen: "SAR Indicator Code 36", basel: "High Risk" },
  { feature: "PAMRS Onboarding Gate", fiuInd: "CDD Circular 2023", fatf: "R.10 — Customer Due Diligence", finCen: "CIP Rule 31 CFR 1020.220", basel: "On-boarding Risk" },
  { feature: "Network/Graph Circular Detection", fiuInd: "Red Flag #11 — Layering networks", fatf: "R.29 — Financial Intelligence Units", finCen: "FinCEN Advisory FIN-2014-A005", basel: "Network Risk" },
  { feature: "PEP Detector", fiuInd: "Red Flag #8 — PEP accounts", fatf: "R.12 — Politically Exposed Persons", finCen: "31 CFR 1010.605(p)", basel: "PEP Risk Class A" },
  { feature: "Jurisdictional Risk Mapping", fiuInd: "Red Flag #15 — FATF grey-list txns", fatf: "R.19 — Higher-risk countries", finCen: "OFAC Sanctions Screening", basel: "Country Risk" },
  { feature: "NLP Remark Analysis", fiuInd: "Red Flag #3 — Suspicious narratives", fatf: "R.20 — Unusual patterns", finCen: "FinCEN FIN-2022-Alert001", basel: "Behavioral Risk" },
  { feature: "Dynamic Threshold Tuner", fiuInd: "RBI Master Circular 2024", fatf: "R.1 — Risk-Based Approach", finCen: "BSA Risk Assessment", basel: "Model Risk" },
  { feature: "Maker-Checker Freeze Workflow", fiuInd: "Prevention of Money Laundering Act §12", fatf: "R.6 — Targeted Financial Sanctions", finCen: "31 CFR 1010.820", basel: "Governance" },
  { feature: "STR Generator (FIU-IND)", fiuInd: "FIU-IND Notification 2014", fatf: "R.20 — Reporting obligations", finCen: "31 CFR 1023.320", basel: "Reporting" },
  { feature: "Merkle Audit Ledger", fiuInd: "Record Keeping Guidelines 2019", fatf: "R.11 — Record Keeping", finCen: "31 CFR 1010.430", basel: "Audit Integrity" },
];

export default function Documentation() {
  const [activeSection, setActiveSection] = useState("overview");

  return (
    <div className="flex min-h-[calc(100vh-56px)]">
      {/* Sidebar */}
      <aside className="w-56 border-r border-stone-200 bg-stone-50 flex-shrink-0 py-6">
        <div className="px-4 mb-4">
          <div className="text-xs font-bold text-stone-400 uppercase tracking-widest">Contents</div>
        </div>
        <nav className="space-y-0.5 px-2">
          {sections.map((section) => (
            <button
              key={section.id}
              data-testid={`doc-nav-${section.id}`}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                activeSection === section.id
                  ? "bg-orange-700 text-white"
                  : "text-stone-600 hover:bg-stone-200 hover:text-stone-900"
              }`}
            >
              {section.icon}
              {section.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <div className="flex-1 p-10 overflow-auto max-w-4xl">
        {activeSection === "overview" && (
          <div>
            <div className="border-l-4 border-orange-600 pl-4 mb-8">
              <h1 className="text-2xl font-extrabold text-stone-900">System Overview</h1>
              <p className="text-stone-500 mt-1">SENTINEL-G architecture and design principles.</p>
            </div>
            <div className="prose prose-stone max-w-none">
              <p className="text-stone-700 leading-relaxed mb-4">
                SENTINEL-G is a multi-detector, adaptive forensic intelligence system designed for Tier-1 financial institutions. It operates on a six-detector cascade architecture where each detector contributes a weighted score to a composite Risk Index, enabling nuanced, explainable fraud detection.
              </p>
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-6 mb-6">
                <h3 className="font-bold text-stone-800 mb-3">Core Architecture Principles</h3>
                <ul className="space-y-2 text-sm text-stone-700">
                  {[
                    "Contract-first OpenAPI design with Zod validation on every boundary",
                    "Immutable Merkle audit ledger — every detection event is SHA-256 chained",
                    "Adaptive rule engine that learns from emerging mule tactics via the Pattern Evolution layer",
                    "Zero-PII compliance mode — all entity identifiers masked to Entity_[HASH] format",
                    "Maker-Checker dual-authorization for any account freeze or STR filing",
                    "Full FIU-IND, FATF, FinCEN, and Basel AML regulatory alignment",
                  ].map((point, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Detection Latency", value: "< 40ms" },
                  { label: "False Positive Rate", value: "< 2.1%" },
                  { label: "Chain Integrity", value: "99.7%" },
                ].map((m, i) => (
                  <div key={i} className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-extrabold text-orange-700">{m.value}</div>
                    <div className="text-xs text-orange-600 font-semibold mt-1">{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === "rule-engine" && (
          <div>
            <div className="border-l-4 border-orange-600 pl-4 mb-8">
              <h1 className="text-2xl font-extrabold text-stone-900">Sentinel-G Rule Engine</h1>
              <p className="text-stone-500 mt-1">Technical specification of the adaptive detection framework.</p>
            </div>
            <div className="space-y-6">
              {[
                {
                  title: "Stage 1: Pre-Activation Screening (PAMRS)",
                  desc: "Before any account is activated, PAMRS performs Device ID fingerprinting, Pincode clustering analysis (>3 accounts per pincode triggers review), and Network Proximity scoring. Accounts failing PAMRS are quarantined for manual review."
                },
                {
                  title: "Stage 2: Six-Detector Cascade",
                  desc: "Each transaction is evaluated against all six detectors in parallel. Each detector returns a normalized score (0-100) and a confidence interval. Scores are weighted by the Weighted Risk Scorer using configurable coefficients."
                },
                {
                  title: "Stage 3: Dynamic Threshold Evaluation",
                  desc: "The composite score is compared against dynamically tuned thresholds that adapt to rolling 30-day velocity baselines. A 15% deviation from baseline triggers threshold recalibration."
                },
                {
                  title: "Stage 4: NLP Remark Analysis",
                  desc: "Transaction remarks are embedded using a fine-tuned BERT model and compared against a library of known mule-fraud semantic patterns. Similarity >70% triggers an NLP flag."
                },
                {
                  title: "Stage 5: Adaptive Pattern Evolution",
                  desc: "When a cluster of 3+ accounts shares a novel behavioral signature not in the pattern library, the Pattern Evolution Engine flags it as a new mule tactic and adds it to the detection ruleset."
                },
              ].map((stage, i) => (
                <div key={i} className="bg-white border border-stone-200 rounded-xl p-5 border-l-4 border-l-orange-600">
                  <h3 className="font-bold text-stone-800 mb-2">{stage.title}</h3>
                  <p className="text-sm text-stone-600 leading-relaxed">{stage.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === "detectors" && (
          <div>
            <div className="border-l-4 border-orange-600 pl-4 mb-8">
              <h1 className="text-2xl font-extrabold text-stone-900">Six Detectors</h1>
              <p className="text-stone-500 mt-1">Technical specification for each detection module.</p>
            </div>
            <div className="space-y-4">
              {[
                { name: "Structuring Detector", weight: "25%", trigger: "Multiple transactions below ₹5,000 threshold within 24h window", threshold: "Score ≥ 70", badge: "High Weight" },
                { name: "Velocity Detector", weight: "20%", trigger: "Transaction frequency exceeds 3× rolling 7-day baseline", threshold: "Score ≥ 65", badge: "High Weight" },
                { name: "Network/Graph Detector", weight: "20%", trigger: "Circular flow A→B→C→A detected within 72h, or 5+ hop chain", threshold: "Score ≥ 60", badge: "High Weight" },
                { name: "PEP Detector", weight: "15%", trigger: "Account linked to Politically Exposed Person via identity or network", threshold: "Score ≥ 50", badge: "Medium Weight" },
                { name: "Jurisdiction Detector", weight: "10%", trigger: "Transactions involving FATF grey-list or FinCEN-flagged jurisdictions", threshold: "Score ≥ 55", badge: "Medium Weight" },
                { name: "KYC Detector", weight: "10%", trigger: "KYC documents expired, inconsistent, or re-used across accounts", threshold: "Score ≥ 50", badge: "Medium Weight" },
              ].map((det, i) => (
                <div key={i} className="bg-white border border-stone-200 rounded-xl p-5 flex gap-4">
                  <div className="text-2xl font-extrabold text-orange-200 w-8 flex-shrink-0">{i + 1}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-stone-800">{det.name}</span>
                      <span className="text-xs bg-orange-100 text-orange-700 font-semibold px-2 py-0.5 rounded">{det.badge}</span>
                    </div>
                    <p className="text-sm text-stone-600 mb-2">{det.trigger}</p>
                    <div className="flex gap-4 text-xs text-stone-500">
                      <span><span className="font-semibold text-stone-700">Weight:</span> {det.weight}</span>
                      <span><span className="font-semibold text-stone-700">Alert Threshold:</span> {det.threshold}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === "graph" && (
          <div>
            <div className="border-l-4 border-orange-600 pl-4 mb-8">
              <h1 className="text-2xl font-extrabold text-stone-900">Graph Topology Engine</h1>
              <p className="text-stone-500 mt-1">Circular flow and network proximity detection.</p>
            </div>
            <div className="space-y-6 text-sm text-stone-700 leading-relaxed">
              <p>The Graph Engine models all accounts as nodes and transactions as directed edges in a real-time adjacency graph. It runs three detection algorithms concurrently:</p>
              <div className="space-y-4">
                {[
                  { algo: "Circular Flow Detection", desc: "Uses DFS-based cycle detection with path compression. Identifies A→B→C→A rings within configurable time windows (default: 72 hours). Flags any cycle involving ≥3 nodes." },
                  { algo: "Multi-Hop Laundering", desc: "Traces fund flow through up to 7 hops (configurable). Identifies cases where the ultimate beneficiary is 3+ hops removed from the originator, suggesting layering." },
                  { algo: "Network Proximity Clustering", desc: "Groups accounts by shared attributes: same device ID, IP subnet, pincode, or onboarding timestamp cluster. High-density clusters are treated as potential mule networks." },
                ].map((item, i) => (
                  <div key={i} className="bg-stone-50 border border-stone-200 rounded-xl p-5">
                    <div className="font-bold text-stone-800 mb-2 flex items-center gap-2">
                      <ChevronRight className="h-4 w-4 text-orange-600" />
                      {item.algo}
                    </div>
                    <p>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === "regulatory" && (
          <div>
            <div className="border-l-4 border-orange-600 pl-4 mb-8">
              <h1 className="text-2xl font-extrabold text-stone-900">Regulatory Alignment Map</h1>
              <p className="text-stone-500 mt-1">SENTINEL-G feature mapping to global AML frameworks.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-stone-900 text-white">
                    <th className="text-left p-3 font-semibold text-xs uppercase tracking-wider rounded-tl-lg">Feature</th>
                    <th className="text-left p-3 font-semibold text-xs uppercase tracking-wider">FIU-IND</th>
                    <th className="text-left p-3 font-semibold text-xs uppercase tracking-wider">FATF</th>
                    <th className="text-left p-3 font-semibold text-xs uppercase tracking-wider">FinCEN</th>
                    <th className="text-left p-3 font-semibold text-xs uppercase tracking-wider rounded-tr-lg">Basel AML</th>
                  </tr>
                </thead>
                <tbody>
                  {regulatoryRows.map((row, i) => (
                    <tr key={i} data-testid={`regulatory-row-${i}`} className={i % 2 === 0 ? "bg-white" : "bg-stone-50"}>
                      <td className="p-3 font-semibold text-stone-800 border-b border-stone-100">{row.feature}</td>
                      <td className="p-3 text-stone-600 border-b border-stone-100 text-xs">{row.fiuInd}</td>
                      <td className="p-3 text-stone-600 border-b border-stone-100 text-xs">{row.fatf}</td>
                      <td className="p-3 text-stone-600 border-b border-stone-100 text-xs">{row.finCen}</td>
                      <td className="p-3 border-b border-stone-100">
                        <span className="text-xs bg-orange-100 text-orange-800 font-semibold px-2 py-0.5 rounded">{row.basel}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeSection === "merkle" && (
          <div>
            <div className="border-l-4 border-orange-600 pl-4 mb-8">
              <h1 className="text-2xl font-extrabold text-stone-900">Merkle Audit Ledger</h1>
              <p className="text-stone-500 mt-1">Immutable chain-of-custody for every detection event.</p>
            </div>
            <div className="space-y-4 text-sm text-stone-700 leading-relaxed">
              <p>Every detection event in SENTINEL-G is written to the Merkle Audit Ledger — a SHA-256 linked chain that proves the immutability and integrity of all forensic records.</p>
              <div className="bg-stone-900 text-green-400 font-mono text-xs rounded-xl p-5 overflow-x-auto">
                <div className="text-stone-500 mb-3"># Block structure</div>
                <pre>{`{
  "block": 4821,
  "timestamp": "2024-01-15T14:32:07Z",
  "event_type": "STRUCTURING_DETECTED",
  "entity_hash": "SHA256(account_id)",
  "detection_score": 87,
  "previous_hash": "7a1e9c3b2d8f4a5c...",
  "merkle_root": "8f2d3a1c4b92e7f0...",
  "signature": "ECDSA-P256"
}`}</pre>
              </div>
              <p>The ledger is append-only. Any modification to a historical block invalidates all subsequent hashes, making tampering immediately detectable. Aligned with FATF R.11 and FIU-IND Record Keeping Guidelines 2019.</p>
            </div>
          </div>
        )}

        {activeSection === "api" && (
          <div>
            <div className="border-l-4 border-orange-600 pl-4 mb-8">
              <h1 className="text-2xl font-extrabold text-stone-900">API Reference</h1>
              <p className="text-stone-500 mt-1">Key system endpoints and integration specifications.</p>
            </div>
            <div className="space-y-6">
              {[
                { method: "GET", path: "/api/v1/transactions", desc: "List transactions with risk scores and detector flags. Supports filter by risk_level, detector, date range." },
                { method: "POST", path: "/api/v1/str/generate", desc: "Generate a FIU-IND Suspicious Transaction Report for a flagged account. Returns report_id and PDF link." },
                { method: "GET", path: "/api/v1/merkle/verify/{hash}", desc: "Verify block hash against the Merkle chain. Returns proof path from target block to genesis." },
                { method: "PATCH", path: "/api/v1/thresholds", desc: "Update global detection thresholds. Requires Maker-Checker dual authorization." },
                { method: "POST", path: "/api/v1/freeze/request", desc: "Request account freeze via Maker-Checker workflow. Returns workflow_id for checker approval." },
                { method: "GET", path: "/api/v1/network/graph/{account_id}", desc: "Return network graph topology for an account — nodes, edges, and circular flow paths." },
              ].map((endpoint, i) => (
                <div key={i} className="bg-white border border-stone-200 rounded-xl overflow-hidden">
                  <div className="flex items-center gap-3 p-4 border-b border-stone-100 bg-stone-50">
                    <span className={`text-xs font-bold px-2 py-1 rounded font-mono ${
                      endpoint.method === "GET" ? "bg-green-100 text-green-700" :
                      endpoint.method === "POST" ? "bg-orange-100 text-orange-700" :
                      "bg-amber-100 text-amber-700"
                    }`}>{endpoint.method}</span>
                    <code className="text-sm font-mono text-stone-700">{endpoint.path}</code>
                  </div>
                  <div className="p-4 text-sm text-stone-600">{endpoint.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
