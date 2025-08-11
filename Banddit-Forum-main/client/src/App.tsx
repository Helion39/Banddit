import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Provider, useSelector } from "react-redux";
import { store, RootState } from "./store/store";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import NotFound from "@/pages/not-found";
import EmailVerified from "@/pages/EmailVerified";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ProfileModal from "@/components/ProfileModal";
import CreatePostModal from "@/components/CreatePostModal";
import { useState } from "react";
import Profile from "@/pages/Profile";

function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = useSelector((state: RootState) => state.auth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  if (!user) return <>{children}</>; // fallback for unauthenticated

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        user={user}
        onCreatePost={() => setIsCreateModalOpen(true)}
        onProfileClick={() => setIsProfileModalOpen(true)}
        onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
        onToggleSidebarCollapse={() => setIsSidebarCollapsed((collapsed) => !collapsed)}
        isSidebarCollapsed={isSidebarCollapsed}
        onSearch={() => {}}
      />
      <div className="flex flex-1">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          isCollapsed={isSidebarCollapsed}
        />
        <main className="flex-1">
          {children}
        </main>
      </div>
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={user}
      />
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}

function Router() {
  const location = useLocation();
  // Only wrap Home and Profile with AppLayout (Header/Sidebar), keep auth pages minimal
  return (
    <Routes>
      <Route
        path="/"
        element={
          <AppLayout>
            <Home />
          </AppLayout>
        }
      />
      <Route
        path="/profile"
        element={
          <AppLayout>
            <Profile />
          </AppLayout>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/email-verified" element={<EmailVerified />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Router />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
