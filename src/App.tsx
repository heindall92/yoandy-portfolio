import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Index from "./pages/Index";
import Report from "./pages/Report";
import Login from "./pages/Login";
import Draft from "./pages/Draft";
import Draft2 from "./pages/Draft2";
import Draft3 from "./pages/Draft3";
import Draft4 from "./pages/Draft4";
import Machines from "./pages/Machines";
import Sherlocks from "./pages/Sherlocks";
import HackMyVM from "./pages/HackMyVM";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const hideNavbar = location.pathname === "/" || location.pathname === "/draft" || location.pathname === "/draft2" || location.pathname === "/draft3" || location.pathname === "/draft4" || location.pathname === "/login";

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/machines" element={<Machines />} />
        <Route path="/sherlocks" element={<Sherlocks />} />
        <Route path="/hackmyvm" element={<HackMyVM />} />
        <Route path="/report/:slug" element={
          <ProtectedRoute>
            <Report />
          </ProtectedRoute>
        } />
        <Route path="/draft" element={<Draft />} />
        <Route path="/draft2" element={<Draft2 />} />
        <Route path="/draft3" element={<Draft3 />} />
        <Route path="/draft4" element={<Draft4 />} />
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
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
