import { useState } from "react";
import { Shield, Hash, CheckCircle, XCircle, Search, Award, Users, Clock } from "lucide-react";

const teamMembers = [
  {
    initials: "AM",
    name: "Dr. Arjun Mehta",
    role: "Chief Forensic AI Architect",
    specialization: "Adaptive ML, Explainable AI, Graph Neural Networks",
    color: "bg-orange-700",
    publications: 14,
    yearsExp: 17,
    affiliation: "IIT Bombay · IDRBT Fellow",
  },
  {
    initials: "PN",
    name: "Priya Nair",
    role: "Lead ML Engineer",
    specialization: "NLP & Pattern Detection, Semantic Similarity Models",
    color: "bg-stone-700",
    publications: 8,
    yearsExp: 11,
    affiliation: "IISc Bangalore · Google AI Alumni",
  },
  {
    initials: "VS",
    name: "Vikram Singh",
    role: "Blockchain & Integrity Lead",
    specialization: "Merkle Ledger Systems, SHA-256 Audit Chains",
    color: "bg-teal-700",
    publications: 6,
    yearsExp: 9,
    affiliation: "NIT Trichy · IEEE Senior Member",
  },
  {
    initials: "SJ",
    name: "Sneha Joshi",
    role: "Regulatory Compliance Director",
    specialization: "FIU-IND · FATF · FinCEN · Basel AML Frameworks",
    color: "bg-orange-800",
    publications: 11,
    yearsExp: 14,
    affiliation: "NALSAR University of Law · RBI Consultant",
  },
  {
    initials: "RK",
    name: "Rajan Kumar",
    role: "Graph Topology Specialist",
    specialization: "Circular Flow Detection, Network Proximity Analysis",
    color: "bg-stone-600",
    publications: 7,
    yearsExp: 10,
    affiliation: "IIT Delhi · SWIFT Institute",
  },
  {
    initials: "AK",
    name: "Aisha Kapoor",
    role: "Command Interface Lead",
    specialization: "Enterprise UX, Real-Time Data Visualization",
    color: "bg-teal-800",
    publications: 3,
    yearsExp: 8,
    affiliation: "NID Ahmedabad · Ex-Bloomberg",
  },
];

const merkleBlocks = [
  { block: 4821, hash: "8f2d3a1c4b92e7f09d3c1a8b5e6f2d4c", prev: "7a1e9c3b2d8f4a5c6e1b3d9f7c2a4e8b", ts: "14:32:07", status: "verified" },
  { block: 4820, hash: "7a1e9c3b2d8f4a5c6e1b3d9f7c2a4e8b", prev: "6f3c2b1a9e8d7c4b5a3f2e1d8c9b6a7e", ts: "14:29:43", status: "verified" },
  { block: 4819, hash: "6f3c2b1a9e8d7c4b5a3f2e1d8c9b6a7e", prev: "5e4d3c2b1a9f8e7d6c5b4a3f2e1d8c9b", ts: "14:27:18", status: "verified" },
  { block: 4818, hash: "5e4d3c2b1a9f8e7d6c5b4a3f2e1d8c9b", prev: "4d5e6f7a8b9c1d2e3f4a5b6c7d8e9f1a", ts: "14:24:55", status: "verified" },
];

export default function Team() {
  const [verifyInput, setVerifyInput] = useState("");
  const [verifyResult, setVerifyResult] = useState<null | { valid: boolean; block: number; hash: string; chain: string[] }>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = () => {
    if (!verifyInput.trim()) return;
    setIsVerifying(true);
    setTimeout(() => {
      const matchedBlock = merkleBlocks.find(b =>
        b.hash.includes(verifyInput.toLowerCase().replace(/\./g, "")) ||
        verifyInput === String(b.block)
      );
      if (matchedBlock) {
        setVerifyResult({
          valid: true,
          block: matchedBlock.block,
          hash: matchedBlock.hash,
          chain: [matchedBlock.hash, matchedBlock.prev, "4d5e6f7a8b9c1d2e3f4a5b6c7d8e9f1a", "GENESIS"],
        });
      } else {
        setVerifyResult({ valid: false, block: 0, hash: verifyInput, chain: [] });
      }
      setIsVerifying(false);
    }, 1400);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-8 border-l-4 border-orange-600 pl-4">
        <h1 className="text-2xl font-extrabold text-stone-900">Team & Audit Integrity</h1>
        <p className="text-stone-500 mt-1">The forensic intelligence team behind SENTINEL-G and Merkle chain verification.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { icon: <Users className="h-5 w-5 text-orange-600" />, label: "Core Team Members", value: "6" },
          { icon: <Shield className="h-5 w-5 text-orange-600" />, label: "Total Blocks Verified", value: "4,821" },
          { icon: <CheckCircle className="h-5 w-5 text-green-600" />, label: "Chain Integrity", value: "99.7%" },
          { icon: <Clock className="h-5 w-5 text-stone-600" />, label: "Last Audit", value: "14:32:07" },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-stone-200 rounded-xl p-5 flex items-center gap-3">
            <div className="p-2 bg-stone-50 rounded-lg">{stat.icon}</div>
            <div>
              <div className="text-xl font-extrabold text-stone-900">{stat.value}</div>
              <div className="text-xs text-stone-500">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Team Grid */}
      <div className="mb-12">
        <h2 className="text-lg font-bold text-stone-800 border-l-4 border-orange-600 pl-3 mb-6">Core Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member, i) => (
            <div
              key={i}
              data-testid={`team-card-${i}`}
              className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className={`${member.color} text-white font-bold text-lg rounded-xl h-14 w-14 flex items-center justify-center flex-shrink-0`}>
                  {member.initials}
                </div>
                <div>
                  <div className="font-bold text-stone-900 text-base">{member.name}</div>
                  <div className="text-orange-600 text-sm font-semibold">{member.role}</div>
                  <div className="text-xs text-stone-500 mt-0.5">{member.affiliation}</div>
                </div>
              </div>
              <div className="text-sm text-stone-600 mb-4 leading-relaxed">{member.specialization}</div>
              <div className="flex gap-4 text-xs text-stone-500 border-t border-stone-100 pt-3">
                <div className="flex items-center gap-1">
                  <Award className="h-3.5 w-3.5 text-orange-500" />
                  <span>{member.publications} publications</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-stone-400" />
                  <span>{member.yearsExp} years exp.</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Merkle Verification */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-stone-800 border-l-4 border-orange-600 pl-3 mb-5">
            Merkle Ledger Verification Utility
          </h2>
          <p className="text-sm text-stone-500 mb-4">
            Enter a block number (e.g. 4821) or partial hash to verify chain integrity.
          </p>
          <div className="flex gap-2 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
              <input
                data-testid="input-merkle-verify"
                value={verifyInput}
                onChange={(e) => { setVerifyInput(e.target.value); setVerifyResult(null); }}
                placeholder="Block # or partial hash..."
                className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded-lg text-sm font-mono focus:outline-none focus:border-orange-500"
              />
            </div>
            <button
              data-testid="button-verify"
              onClick={handleVerify}
              disabled={isVerifying}
              className="bg-orange-700 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-60"
            >
              {isVerifying ? "Verifying..." : "Verify"}
            </button>
          </div>

          {verifyResult && (
            <div className={`rounded-lg border p-4 ${verifyResult.valid ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
              <div className="flex items-center gap-2 mb-3">
                {verifyResult.valid ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                <span className={`font-bold text-sm ${verifyResult.valid ? "text-green-700" : "text-red-700"}`}>
                  {verifyResult.valid ? `Block #${verifyResult.block} — VERIFIED` : "Hash Not Found in Chain"}
                </span>
              </div>
              {verifyResult.valid && (
                <div>
                  <div className="text-xs text-stone-500 mb-2">Chain proof (head → genesis):</div>
                  {verifyResult.chain.map((h, idx) => (
                    <div key={idx} className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-stone-400 w-4">{idx + 1}.</span>
                      <code className="text-xs font-mono text-green-800 bg-green-100 px-2 py-0.5 rounded truncate">{h}</code>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-stone-800 border-l-4 border-orange-600 pl-3 mb-5">
            Recent Audit Trail
          </h2>
          <div className="space-y-3">
            {merkleBlocks.map((block, i) => (
              <div
                key={i}
                data-testid={`merkle-block-${i}`}
                className="flex items-center gap-3 p-3 bg-stone-50 border border-stone-200 rounded-lg"
              >
                <div className="flex items-center gap-1.5">
                  <Hash className="h-4 w-4 text-orange-500" />
                  <span className="text-xs font-bold text-stone-700">#{block.block}</span>
                </div>
                <code className="flex-1 text-xs font-mono text-stone-600 truncate">{block.hash.slice(0, 16)}...{block.hash.slice(-8)}</code>
                <span className="text-xs text-stone-400 font-mono">{block.ts}</span>
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
