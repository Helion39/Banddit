import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, Plus, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import BandditLogo from "../assets/Banddit.png";
import { useBreakpoint } from "@/hooks/use-is-desktop";

interface User {
  id: string;
  username: string;
  email: string;
}

interface HeaderProps {
  user: User;
  onCreatePost: () => void;
  onProfileClick: () => void;
  onToggleSidebar?: () => void;
  onToggleSidebarCollapse?: () => void;
  isSidebarCollapsed?: boolean;
  onSearch?: (query: string) => void;
}

export default function Header({ user, onCreatePost, onProfileClick, onToggleSidebar, onToggleSidebarCollapse, isSidebarCollapsed, onSearch }: HeaderProps) {
  const [inputValue, setInputValue] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const { isLg } = useBreakpoint();

  const getUserInitials = (username: string) => {
    return username.slice(0, 2).toUpperCase();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(inputValue);
    if (!isLg) {
      setIsSearchVisible(false);
    }
  };

  const renderSearchForm = () => (
    <form
      onSubmit={handleSearchSubmit}
      className="relative flex bg-input rounded-lg px-4 py-2 w-full max-w-lg items-center"
    >
      <Search size={16} className="text-muted-foreground mr-2" />
      <input
        type="text"
        placeholder="Search Banddit (Press Enter)"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          if (e.target.value === "") {
            onSearch?.("");
          }
        }}
        className="bg-transparent outline-none flex-1 text-foreground placeholder:text-muted-foreground"
        autoFocus
      />
      {!isLg && (
        <button type="button" onClick={() => setIsSearchVisible(false)} className="ml-2 text-muted-foreground">
          Cancel
        </button>
      )}
    </form>
  );

  if (isSearchVisible && !isLg) {
    return (
      <header className="bg-card border-b border-reddit-border sticky top-0 z-50 h-20">
        <div className="w-full h-full px-4 sm:px-6 py-4 flex items-center">
          {renderSearchForm()}
        </div>
      </header>
    );
  }

  return (
    <header className="bg-card border-b border-reddit-border sticky top-0 z-50 h-20">
      <div className="w-full h-full px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between w-full h-full gap-2">
          {/* Left Side - Logo & Sidebar Button */}
          <div className="flex items-center space-x-2">
            {/* Sidebar button: Chevron for both desktop and mobile, only one visible at a time */}
            {isLg ? (
              <button
                onClick={onToggleSidebarCollapse}
                className="p-2 hover:bg-muted rounded-lg transition-colors hidden lg:inline-flex"
                aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {isSidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
              </button>
            ) : (
              <button
                onClick={onToggleSidebar}
                className="p-2 hover:bg-muted rounded-lg transition-colors lg:hidden"
                aria-label={isSidebarCollapsed ? "Open sidebar" : "Close sidebar"}
              >
                {isSidebarCollapsed ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
              </button>
            )}
            <div className="flex items-center space-x-2">
              <img src={BandditLogo} alt="Banddit" className="w-10 h-10" />
              <span className="hidden sm:block text-lg font-bold text-foreground">
                Banddit
              </span>
            </div>
          </div>

          {/* Center - Desktop Search */}
          <div className="flex-1 justify-center px-4 hidden lg:flex items-center gap-2">
            {renderSearchForm()}
          </div>

          {/* Right Side - Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsSearchVisible(true)}
            >
              <Search size={20} />
            </Button>
            <Button
              onClick={onCreatePost}
              className="bg-reddit-orange text-white hover:bg-orange-600 rounded-full flex items-center gap-2"
              size={isLg ? 'default' : 'icon'}
            >
              <Plus size={16} />
              {isLg && "Create Post"}
            </Button>
            <div className="relative">
              <button
                onClick={onProfileClick}
                className="flex items-center space-x-2 bg-muted px-3 py-2 rounded-lg hover:bg-accent transition-colors"
              >
                <div className="w-8 h-8 bg-reddit-orange rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {getUserInitials(user.username)}
                  </span>
                </div>
                <span className="hidden md:block text-sm font-medium text-foreground">
                  {user.username}
                </span>
                <ChevronDown size={12} className="text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
