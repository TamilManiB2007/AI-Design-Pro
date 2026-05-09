import {
  Shield, Zap, Network, Brain, Lock, ChevronRight,
  AlertTriangle, BarChart2, Fingerprint, Sliders, FileText,
  Database, GitBranch, MessageSquare, Activity, Bell,
  HeartPulse, RefreshCw, EyeOff, Terminal, Radio, Map,
  CheckSquare, BookOpen, ArrowRight, TrendingUp, Globe
} from "lucide-react";
import { Page } from "@/App";

interface LandingPageProps {
  onNavigate: (page: Page) => void;
}

const moatCards = [
  {
    icon: <Brain className="h-7 w-7 text-orange-600" />,
    gap: "Gap 1: Explainability",
    problem: "MuleHunter gives opaque risk scores with no reasoning.",
    solution: "SENTINEL-G delivers forensic WHY analysis — evidence chains, pattern citations, and linked entity trails for every flagged account.",
    badge: "Forensic AI Explainer",
  },
  {
    icon: <Fingerprint className="h-7 w-7 text-orange-600" />,
    gap: "Gap 2: Onboarding Gate",
    problem: "No pre-activation screening. Mules are onboarded freely.",
    solution: "PAMRS scans Device IDs, Pincode clustering, and Network Proximity before any account activates — stopping mules at the gate.",
    badge: "PAMRS Shield",
  },
  {
    icon: <GitBranch className="h-7 w-7 text-orange-600" />,
    gap: "Gap 3: Graph Topologies",
    problem: "Flat transaction lists miss circular laundering rings.",
    solution: "Our graph engine detects A→B→C→A circular flows and multi-hop laundering networks invisible to linear analysis.",
    badge: "Network Graph Engine",
  },
  {
    icon: <Sliders className="h-7 w-7 text-orange-600" />,
    gap: "Gap 4: Dynamic Thresholds",
    problem: "Static rules that go stale as fraud tactics evolve.",
    solution: "Thresholds adapt in real-time to live velocity patterns. Rules self-tune. Detection stays sharp.",
    badge: "Adaptive Thresholds",
  },
  {
    icon: <RefreshCw className="h-7 w-7 text-orange-600" />,
    gap: "Gap 5: Adaptive Rules",
    problem: "Pattern libraries frozen at deployment. New tactics go undetected.",
    solution: "Sentinel-G evolves its pattern library as new mule tactics emerge — continuous forensic intelligence, not static snapshots.",
    badge: "Pattern Evolution Engine",
  },
];

const features = [
  { icon: <Shield className="h-5 w-5" />, name: "Structuring Detector", desc: "Smurfing & sub-threshold splits" },
  { icon: <Zap className="h-5 w-5" />, name: "Velocity Detector", desc: "Transaction frequency spikes" },
  { icon: <Network className="h-5 w-5" />, name: "Network/Graph Detector", desc: "Multi-hop ring detection" },
  { icon: <Globe className="h-5 w-5" />, name: "PEP Detector", desc: "Politically exposed persons" },
  { icon: <Map className="h-5 w-5" />, name: "Jurisdiction Detector", desc: "FATF grey-list alignment" },
  { icon: <Lock className="h-5 w-5" />, name: "KYC Detector", desc: "Identity verification gaps" },
  { icon: <BarChart2 className="h-5 w-5" />, name: "Weighted Risk Scorer", desc: "Aggregated composite score" },
  { icon: <Fingerprint className="h-5 w-5" />, name: "PAMRS Onboarding Gate", desc: "Pre-activation screening" },
  { icon: <Sliders className="h-5 w-5" />, name: "Dynamic Threshold Tuner", desc: "Real-time limit adjustment" },
  { icon: <FileText className="h-5 w-5" />, name: "STR Generator", desc: "FIU-IND report automation" },
  { icon: <Database className="h-5 w-5" />, name: "Merkle Audit Ledger", desc: "SHA-256 immutable chain" },
  { icon: <Activity className="h-5 w-5" />, name: "Transaction Analyzer", desc: "Dense risk-tagged tables" },
  { icon: <GitBranch className="h-5 w-5" />, name: "Circular Flow Graph", desc: "A→B→C→A detection" },
  { icon: <MessageSquare className="h-5 w-5" />, name: "NLP Remark Analyst", desc: "Semantic similarity scoring" },
  { icon: <Radio className="h-5 w-5" />, name: "Live Streaming Pipeline", desc: "Real-time synthetic feed" },
  { icon: <Bell className="h-5 w-5" />, name: "Alert Surface", desc: "Weighted-risk notifications" },
  { icon: <HeartPulse className="h-5 w-5" />, name: "Health Check Monitor", desc: "Engine vitals & uptime" },
  { icon: <RefreshCw className="h-5 w-5" />, name: "Adaptive Pattern Evolution", desc: "Self-updating rule engine" },
  { icon: <EyeOff className="h-5 w-5" />, name: "Zero-PII Privacy Toggle", desc: "Entity masking for compliance" },
  { icon: <Terminal className="h-5 w-5" />, name: "AI Forensic Explainer", desc: "Streaming WHY analysis" },
  { icon: <AlertTriangle className="h-5 w-5" />, name: "Emergency Override", desc: "RBI threshold emergency drop" },
  { icon: <Map className="h-5 w-5" />, name: "Jurisdictional Mapping", desc: "FinCEN / FATF red-flags" },
  { icon: <CheckSquare className="h-5 w-5" />, name: "Maker-Checker Workflow", desc: "Dual-authorization freeze" },
  { icon: <BookOpen className="h-5 w-5" />, name: "Regulatory Alignment", desc: "FIU-IND / FATF / FinCEN map" },
];

const stats = [
  { value: "24", label: "Detection Features" },
  { value: "6", label: "Active Detectors" },
  { value: "99.7%", label: "Chain Integrity" },
  { value: "<40ms", label: "Avg Response Time" },
];

export default function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative bg-stone-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-600 rounded-full filter blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-orange-800 rounded-full filter blur-3xl" />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-orange-900/40 border border-orange-700/50 text-orange-400 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-8">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-pulse" />
            Next Generation Mule Fraud Detection
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
            Adaptive Forensic Intelligence
            <span className="block text-orange-500">for the New Era of Mule Fraud.</span>
          </h1>
          <p className="text-xl text-stone-300 max-w-3xl mx-auto mb-4">
            SENTINEL-G goes beyond risk scores. We deliver forensic evidence chains, graph topology detection, and adaptive rule evolution — everything MuleHunter.AI cannot.
          </p>
          <p className="text-sm text-stone-500 mb-10 font-mono">
            Aligned with FIU-IND · FATF · FinCEN · Basel AML Index
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <button
              data-testid="button-enter-command"
              onClick={() => onNavigate("dashboard")}
              className="flex items-center gap-2 bg-orange-700 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-lg transition-colors text-base shadow-lg"
            >
              Enter Command Center <ArrowRight className="h-5 w-5" />
            </button>
            <button
              data-testid="button-view-docs"
              onClick={() => onNavigate("documentation")}
              className="flex items-center gap-2 bg-stone-700 hover:bg-stone-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors text-base"
            >
              View Documentation <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
            {stats.map((stat, i) => (
              <div key={i} className="bg-stone-800/60 border border-stone-700 rounded-xl p-5">
                <div className="text-3xl font-extrabold text-orange-500">{stat.value}</div>
                <div className="text-stone-400 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Moat Section */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            Competitive Intelligence
          </div>
          <h2 className="text-3xl font-extrabold text-stone-900 mb-3">
            The MuleHunter.AI Gap Analysis
          </h2>
          <p className="text-stone-500 text-lg max-w-2xl mx-auto">
            Five critical capabilities where MuleHunter.AI falls short — and SENTINEL-G closes the gap.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {moatCards.map((card, i) => (
            <div
              key={i}
              data-testid={`moat-card-${i}`}
              className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-orange-600"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="p-2 bg-orange-50 rounded-lg">{card.icon}</div>
                <div>
                  <div className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">{card.gap}</div>
                  <div className="inline-block bg-orange-100 text-orange-800 text-xs font-semibold px-2 py-0.5 rounded">
                    {card.badge}
                  </div>
                </div>
              </div>
              <div className="mb-3 p-3 bg-red-50 border border-red-100 rounded-lg">
                <div className="text-xs font-bold text-red-600 uppercase mb-1">Competitor Gap</div>
                <p className="text-sm text-red-700">{card.problem}</p>
              </div>
              <div className="p-3 bg-green-50 border border-green-100 rounded-lg">
                <div className="text-xs font-bold text-green-700 uppercase mb-1">SENTINEL-G Solution</div>
                <p className="text-sm text-green-800">{card.solution}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Engine Showcase */}
      <section className="bg-stone-50 border-t border-stone-200 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-stone-200 text-stone-700 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
              24 Detection Features
            </div>
            <h2 className="text-3xl font-extrabold text-stone-900 mb-3">The SENTINEL-G Engine</h2>
            <p className="text-stone-500 max-w-2xl mx-auto">
              Every capability across our three detection rounds, visually represented.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {features.map((feature, i) => (
              <div
                key={i}
                data-testid={`feature-card-${i}`}
                className="bg-white border border-stone-200 rounded-xl p-4 flex flex-col items-center text-center hover:border-orange-300 hover:shadow-sm transition-all group"
              >
                <div className="p-2.5 bg-stone-100 group-hover:bg-orange-50 rounded-lg text-stone-600 group-hover:text-orange-600 transition-colors mb-3">
                  {feature.icon}
                </div>
                <div className="text-xs font-bold text-stone-800 mb-1 leading-tight">{feature.name}</div>
                <div className="text-xs text-stone-500 leading-tight">{feature.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-stone-900 py-16 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-extrabold text-white mb-4">
            Ready to Eliminate Mule Fraud?
          </h2>
          <p className="text-stone-400 mb-8 text-lg">
            Enter the command center and experience adaptive forensic intelligence in action.
          </p>
          <button
            data-testid="button-cta-dashboard"
            onClick={() => onNavigate("dashboard")}
            className="bg-orange-700 hover:bg-orange-600 text-white font-bold px-10 py-4 rounded-xl transition-colors text-lg shadow-xl"
          >
            Open Command Center
          </button>
        </div>
      </section>
    </div>
  );
}
