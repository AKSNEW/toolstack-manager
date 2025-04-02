
import React from 'react'; // Explicitly import React
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Index from "./pages/Index";
import ToolsPage from "./pages/ToolsPage";
import ToolboxPage from "./pages/ToolboxPage";
import LibraryPage from "./pages/LibraryPage";
import EmployeesPage from "./pages/EmployeesPage";
import CrewsPage from "./pages/CrewsPage";
import SitesPage from "./pages/SitesPage";
import AccountingPage from "./pages/AccountingPage";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";

// Create a new QueryClient instance outside the component
const queryClient = new QueryClient();

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                <AnimatePresence mode="wait">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/tools" element={<ToolsPage />} />
                    <Route path="/toolbox" element={<ToolboxPage />} />
                    <Route path="/library" element={<LibraryPage />} />
                    <Route path="/employees" element={<EmployeesPage />} />
                    <Route path="/crews" element={<CrewsPage />} />
                    <Route path="/sites" element={<SitesPage />} />
                    <Route path="/accounting" element={<AccountingPage />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </AnimatePresence>
              </main>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
