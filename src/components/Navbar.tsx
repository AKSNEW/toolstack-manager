
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  Home, 
  Package, 
  Users, 
  Building,
  HardHat
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface NavItem {
  href: string;
  label: string;
  icon: any;
}

const navItems: NavItem[] = [
  {
    href: "/",
    label: "Главная",
    icon: Home,
  },
  {
    href: "/tools",
    label: "Инструменты",
    icon: Package,
  },
  {
    href: "/employees",
    label: "Сотрудники",
    icon: Users,
  },
  {
    href: "/crews",
    label: "Бригады",
    icon: HardHat,
  },
  {
    href: "/sites",
    label: "Объекты",
    icon: Building,
  },
];

const Navbar = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-full items-center">
        <div className="mr-4 flex">
          <Link to="/" className="flex items-center mr-6 space-x-2">
            <span className="hidden font-bold sm:inline-block">
              ToolManagerPro
            </span>
          </Link>

          <Button
            variant="ghost"
            className="mr-2 px-0 text-base hover:bg-transparent focus:bg-transparent md:hidden"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>

          {!isMobile && (
            <div className="hidden gap-1 md:flex">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors hover:text-foreground",
                    location.pathname === item.href
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {showMobileMenu && (
        <div className="container border-t md:hidden">
          <div className="grid grid-flow-row text-sm py-3 gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex w-full items-center rounded-md px-3 py-2",
                  location.pathname === item.href
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => setShowMobileMenu(false)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
