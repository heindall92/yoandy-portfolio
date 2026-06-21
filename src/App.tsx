import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { UIProvider } from "@/contexts/UIContext";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Report from "./pages/Report";
import Login from "./pages/Login";

import Machines from "./pages/Machines";
import Sherlocks from "./pages/Sherlocks";
import HackMyVM from "./pages/HackMyVM";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Bifrost from "./pages/Bifrost";
import Privacy from "./pages/Privacy";
import Legal from "./pages/Legal";
import NotFound from "./pages/NotFound";
import Cristal from "./pages/Cristal";
import VetClinica from "./pages/VetClinica";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const hideNavbar = location.pathname === "/" || location.pathname === "/login" || location.pathname === "/bifrost" || location.pathname === "/cristal" || location.pathname === "/vet-meneses";

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/machines" element={<Machines />} />
        <Route path="/sherlocks" element={<Sherlocks />} />
        <Route path="/hackmyvm" element={<HackMyVM />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />
        <Route path="/report/:slug" element={<Report />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/legal" element={<Legal />} />
        <Route path="/cristal" element={<Cristal />} />
        <Route path="/vet-meneses" element={<VetClinica />} />

        <Route path="/bifrost" element={<ProtectedRoute><Bifrost /></ProtectedRoute>} />
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
        <UIProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </UIProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
