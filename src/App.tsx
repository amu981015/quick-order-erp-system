
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import OrderManagement from "./pages/OrderManagement";
import FinanceManagement from "./pages/FinanceManagement";
import InventoryManagement from "./pages/InventoryManagement";
import StaffManagement from "./pages/StaffManagement";
import ReportAnalysis from "./pages/ReportAnalysis";
import QRCodeGenerator from "./pages/QRCodeGenerator";
import TableOrder from "./pages/TableOrder";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Customer-facing routes */}
          <Route path="/table/:tableId" element={<TableOrder />} />
          
          {/* Admin routes */}
          <Route path="/" element={<MainLayout><Dashboard /></MainLayout>} />
          <Route path="/orders" element={<MainLayout><OrderManagement /></MainLayout>} />
          <Route path="/finance" element={<MainLayout><FinanceManagement /></MainLayout>} />
          <Route path="/inventory" element={<MainLayout><InventoryManagement /></MainLayout>} />
          <Route path="/staff" element={<MainLayout><StaffManagement /></MainLayout>} />
          <Route path="/reports" element={<MainLayout><ReportAnalysis /></MainLayout>} />
          <Route path="/qr-generator" element={<MainLayout><QRCodeGenerator /></MainLayout>} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
