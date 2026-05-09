import { Shield, FileText, AlertTriangle, Eye, EyeOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Page } from "@/App";

interface NavigationProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  zeroPii: boolean;
  onZeroPiiToggle: () => void;
  strStatus: "idle" | "generating" | "ready";
  onGenerateStr: () => void;
}

export default function Navigation({
  currentPage,
  onNavigate,
  zeroPii,
  onZeroPiiToggle,
  strStatus,
  onGenerateStr,
}: NavigationProps) {
  const navLinks: { key: Page; label: string }[] = [
    { key: "landing", label: "Intelligence" },
    { key: "dashboard", label: "Dashboard" },
    { key: "documentation", label: "Documentation" },
    { key: "team", label: "Team" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-stone-900 shadow-md">
      <div className="flex items-center justify-between px-6 h-14">
        <div className="flex items-center gap-8">
          <button
            data-testid="nav-logo"
            onClick={() => onNavigate("landing")}
            className="flex items-center gap-2 group"
          >
            <Shield className="h-6 w-6 text-orange-600" />
            <span className="text-white font-bold text-lg tracking-tight">
              SENTINEL<span className="text-orange-500">-G</span>
            </span>
          </button>

          <nav className="flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.key}
                data-testid={`nav-${link.key}`}
                onClick={() => onNavigate(link.key)}
                className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${
                  currentPage === link.key
                    ? "bg-orange-700 text-white"
                    : "text-stone-300 hover:text-white hover:bg-stone-700"
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            {zeroPii ? (
              <EyeOff className="h-4 w-4 text-orange-400" />
            ) : (
              <Eye className="h-4 w-4 text-stone-400" />
            )}
            <span className={`text-xs font-medium ${zeroPii ? "text-orange-400" : "text-stone-400"}`}>
              Zero-PII
            </span>
            <Switch
              data-testid="toggle-zero-pii"
              checked={zeroPii}
              onCheckedChange={onZeroPiiToggle}
              className="data-[state=checked]:bg-orange-600"
            />
          </div>

          <button
            data-testid="button-generate-str"
            onClick={onGenerateStr}
            disabled={strStatus === "generating"}
            className={`flex items-center gap-2 px-4 py-1.5 rounded text-sm font-semibold transition-all ${
              strStatus === "ready"
                ? "bg-green-600 text-white"
                : strStatus === "generating"
                ? "bg-orange-800 text-orange-200 cursor-not-allowed"
                : "bg-orange-700 text-white hover:bg-orange-600"
            }`}
          >
            <FileText className="h-4 w-4" />
            {strStatus === "generating"
              ? "Generating STR..."
              : strStatus === "ready"
              ? "Report Ready"
              : "Generate FIU-IND STR"}
          </button>

          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-stone-400 font-mono">LIVE</span>
          </div>
        </div>
      </div>
    </header>
  );
}
