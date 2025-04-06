
import React from 'react'; // Explicitly import React
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import ToolsPage from "./pages/ToolsPage";
import ToolboxPage from "./pages/ToolboxPage";
import LibraryPage from "./pages/LibraryPage";
import EmployeesPage from "./pages/EmployeesPage";
import CrewsPage from "./pages/CrewsPage";
import SitesPage from "./pages/SitesPage";
import AccountingPage from "./pages/AccountingPage";
import UnionPage from "./pages/UnionPage";
import WiringDiagramsPage from "./pages/WiringDiagramsPage";
import SiteIncidentsPage from "./pages/SiteIncidentsPage";
import DesiredToolsPage from "./pages/DesiredToolsPage";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";

// Create a new QueryClient instance outside the component
const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return <div className="flex justify-center items-center h-screen">Загрузка...</div>;
  
  if (!user) return <Navigate to="/auth" replace />;
  
  return <>{children}</>;
};

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow">
                  <AnimatePresence mode="wait">
                    <Routes>
                      <Route path="/auth" element={<AuthPage />} />
                      <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
                      <Route path="/tools" element={<ProtectedRoute><ToolsPage /></ProtectedRoute>} />
                      <Route path="/toolbox" element={<ProtectedRoute><ToolboxPage /></ProtectedRoute>} />
                      <Route path="/desired-tools" element={<ProtectedRoute><DesiredToolsPage /></ProtectedRoute>} />
                      <Route path="/library" element={<ProtectedRoute><LibraryPage /></ProtectedRoute>} />
                      <Route path="/employees" element={<ProtectedRoute><EmployeesPage /></ProtectedRoute>} />
                      <Route path="/crews" element={<ProtectedRoute><CrewsPage /></ProtectedRoute>} />
                      <Route path="/sites" element={<ProtectedRoute><SitesPage /></ProtectedRoute>} />
                      <Route path="/site-incidents" element={<ProtectedRoute><SiteIncidentsPage /></ProtectedRoute>} />
                      <Route path="/accounting" element={<ProtectedRoute><AccountingPage /></ProtectedRoute>} />
                      <Route path="/union" element={<ProtectedRoute><UnionPage /></ProtectedRoute>} />
                      <Route path="/wiring-diagrams" element={<ProtectedRoute><WiringDiagramsPage /></ProtectedRoute>} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </AnimatePresence>
                </main>
              </div>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
