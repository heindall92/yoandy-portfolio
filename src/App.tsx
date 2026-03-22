import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Index from "./pages/Index";
import Report from "./pages/Report";
import Draft from "./pages/Draft";
import Draft2 from "./pages/Draft2";
import Machines from "./pages/Machines";
import Sherlocks from "./pages/Sherlocks";
import HackMyVM from "./pages/HackMyVM";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  // Hide global navbar on pages that have their own nav
  const hideNavbar = location.pathname === "/" || location.pathname === "/draft" || location.pathname === "/draft2" || location.pathname.startsWith("/report/");

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/machines" element={<Machines />} />
        <Route path="/sherlocks" element={<Sherlocks />} />
        <Route path="/hackmyvm" element={<HackMyVM />} />
        <Route path="/report/:slug" element={<Report />} />
        <Route path="/draft" element={<Draft />} />
        <Route path="/draft2" element={<Draft2 />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
