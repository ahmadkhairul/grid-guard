import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useNavigate, BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { migrateOldSaves, migrateLightningToFire } from "@/lib/storage";
import { LoadingScreen } from "@/components/game/LoadingScreen";
import Home from "./pages/Home";
import Play from "./pages/Play";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    migrateOldSaves();
    migrateLightningToFire();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {isInitialLoad ? (
          <LoadingScreen onComplete={() => setIsInitialLoad(false)} />
        ) : (
          <>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/play/:mapId" element={<Play />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </>
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
