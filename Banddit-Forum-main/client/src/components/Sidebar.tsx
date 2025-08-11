import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useBreakpoint } from "@/hooks/use-is-desktop";
import { Home, TrendingUp, HelpCircle, Compass, List } from "lucide-react";

const navigationItems = [
  { icon: Home, label: "Home", active: true },
  { icon: TrendingUp, label: "Popular" },
  { icon: HelpCircle, label: "Answers", badge: "BETA" },
  { icon: Compass, label: "Explore" },
  { icon: List, label: "All" },
];

const communities = [
  { name: "b/ios", avatar: "i", color: "#007AFF" },
  { name: "b/ChatGPT", avatar: "C", color: "#10A37F" },
  { name: "b/jawascript", avatar: "j", color: "#F7DF1E" },
  { name: "b/3Dprinting", avatar: "3", color: "#FF6B35" },
  { name: "b/seiyuu", avatar: "s", color: "#FF69B4" },
  { name: "b/gamedev", avatar: "g", color: "#8B5CF6" },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
}

const SidebarContent = () => (
  <div className="p-4 w-64 overflow-y-auto h-full">
    {/* Navigation Section */}
    <div className="space-y-1 mb-6 pb-4 border-b border-reddit-border mt-12">
      {navigationItems.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.label}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
              item.active
                ? "bg-reddit-orange text-white"
                : "text-foreground hover:bg-muted"
            }`}
          >
            <Icon size={20} />
            <span className="font-medium">{item.label}</span>
            {item.badge && (
              <span className="text-xs font-bold text-red-500 ml-auto">
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>

    {/* Communities Section */}
    <div>
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
        Communities
      </h3>
      <div className="space-y-1">
        {communities.map((community) => (
          <button
            key={community.name}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left hover:bg-muted transition-colors"
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
              style={{ backgroundColor: community.color }}
            >
              {community.avatar}
            </div>
            <span className="text-sm font-medium text-foreground">
              {community.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  </div>
);

export default function Sidebar({ isOpen, onClose, isCollapsed }: SidebarProps) {
  const { isLg } = useBreakpoint();

  if (isLg) {
    return (
      <aside
        className={`bg-card border-r border-reddit-border h-[calc(100vh-5rem)] sticky top-20 transition-all duration-300 overflow-hidden ${
          isCollapsed ? "w-0 -translate-x-full" : "w-64"
        }`}
      >
        <SidebarContent />
      </aside>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="p-0 w-64 bg-card border-r border-reddit-border">
        <SidebarContent />
      </SheetContent>
    </Sheet>
  );
} 