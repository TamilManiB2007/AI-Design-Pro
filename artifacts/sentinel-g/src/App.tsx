import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navigation from "@/components/Navigation";
import LandingPage from "@/pages/LandingPage";
import Dashboard from "@/pages/Dashboard";
import Documentation from "@/pages/Documentation";
import Team from "@/pages/Team";

const queryClient = new QueryClient();

export type Page = "landing" | "dashboard" | "documentation" | "team";

function App() {
  const [currentPage, setCurrentPage] = useState<Page>("landing");
  const [zeroPii, setZeroPii] = useState(false);
  const [strStatus, setStrStatus] = useState<"idle" | "generating" | "ready">("idle");

  const handleGenerateStr = () => {
    setStrStatus("generating");
    setTimeout(() => setStrStatus("ready"), 2500);
    setTimeout(() => setStrStatus("idle"), 6000);
  };

  const renderPage = () => {
    switch (currentPage) {
      case "landing":
        return <LandingPage onNavigate={setCurrentPage} />;
      case "dashboard":
        return <Dashboard zeroPii={zeroPii} />;
      case "documentation":
        return <Documentation />;
      case "team":
        return <Team />;
      default:
        return <LandingPage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background flex flex-col">
          <Navigation
            currentPage={currentPage}
            onNavigate={setCurrentPage}
            zeroPii={zeroPii}
            onZeroPiiToggle={() => setZeroPii(!zeroPii)}
            strStatus={strStatus}
            onGenerateStr={handleGenerateStr}
          />
          <main className="flex-1">
            {renderPage()}
          </main>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
