import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  Home, 
  Package, 
  Users, 
  Building,
  HardHat,
  Calculator,
  Wrench,
  BookOpen,
  ChevronDown,
  FileCode,
  MessageSquare,
  LogOut,
  User,
  UserCircle,
  ListTodo,
  Map
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface NavItem {
  href: string;
  label: string;
  icon: any;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  {
    href: "/",
    label: "Главная",
    icon: Home,
  },
  {
    href: "#",
    label: "Инструменты",
    icon: Package,
    children: [
      {
        href: "/tools",
        label: "Список инструментов",
        icon: Package,
      },
      {
        href: "/toolbox",
        label: "Ящик инструментов",
        icon: Wrench,
      },
    ]
  },
  {
    href: "/library",
    label: "Библиотека",
    icon: BookOpen,
  },
  {
    href: "#",
    label: "Персонал",
    icon: Users,
    children: [
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
        href: "/union",
        label: "Профсоюз",
        icon: MessageSquare,
      },
    ]
  },
  {
    href: "/sites",
    label: "Объекты",
    icon: Building,
  },
  {
    href: "/todos",
    label: "Задачи",
    icon: ListTodo,
  },
  {
    href: "/wiring-diagrams",
    label: "Схемы",
    icon: FileCode,
  },
  {
    href: "/accounting",
    label: "Бухгалтерия",
    icon: Calculator,
  },
  {
    name: 'Что я делал сегодня',
    path: '/today-activity',
    icon: Map,
  },
];

const Navbar = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { user, signOut } = useAuth();

  const isActiveRoute = (item: NavItem): boolean => {
    if (item.href === location.pathname) return true;
    if (item.children) {
      return item.children.some(child => child.href === location.pathname);
    }
    return false;
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  if (location.pathname === '/auth') {
    return null;
  }

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-full items-center justify-between">
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
                item.children ? (
                  <DropdownMenu key={item.label}>
                    <DropdownMenuTrigger asChild>
                      <button
                        className={cn(
                          "flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors hover:text-foreground",
                          isActiveRoute(item)
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground"
                        )}
                      >
                        /*<item.icon className="mr-2 h-4 w-4" />*/
                        {item.label}
                        <ChevronDown className="ml-1 h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      {item.children.map((child) => (
                        <DropdownMenuItem key={child.href} asChild>
                          <Link
                            to={child.href}
                            className={cn(
                              "flex w-full items-center",
                              location.pathname === child.href && "bg-accent/50"
                            )}
                          >
                           /* <child.icon className="mr-2 h-4 w-4" />*/
                            {child.label}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
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
                )
              ))}
            </div>
          )}
        </div>

        {user && (
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden md:inline">{user.email}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem disabled className="font-medium">
                  <User className="mr-2 h-4 w-4" />
                  {user.email}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex w-full cursor-pointer">
                    <UserCircle className="mr-2 h-4 w-4" />
                    Профиль
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Выйти
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {showMobileMenu && (
        <div className="container border-t md:hidden">
          <div className="grid grid-flow-row text-sm py-3 gap-2">
            {navItems.map((item) => (
              item.children ? (
                <div key={item.label} className="py-1">
                  <div className="flex items-center px-3 py-2 font-medium">
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </div>
                  <div className="pl-4 mt-1 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        to={child.href}
                        className={cn(
                          "flex w-full items-center rounded-md px-3 py-2",
                          location.pathname === child.href
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                        onClick={() => setShowMobileMenu(false)}
                      >
                        <child.icon className="mr-2 h-4 w-4" />
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
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
              )
            ))}
            
            {user && (
              <>
                <div className="h-px bg-border my-2" />
                <Link
                  to="/profile"
                  className="flex w-full items-center rounded-md px-3 py-2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <UserCircle className="mr-2 h-4 w-4" />
                  Профиль
                </Link>
                <button
                  className="flex w-full items-center rounded-md px-3 py-2 text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    setShowMobileMenu(false);
                    handleSignOut();
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Выйти
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
