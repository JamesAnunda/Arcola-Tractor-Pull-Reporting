import { Link, useLocation } from "wouter";
import { 
  BarChart,
  Clipboard,
  Coffee,
  Home, 
  Menu, 
  ShoppingBag, 
  Settings, 
  X 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useEffect, useState } from "react";
import { useMobile } from "@/hooks/use-mobile";

type SidebarProps = {
  activeRoute: string;
}

export default function Sidebar({ activeRoute }: SidebarProps) {
  const [_, setLocation] = useLocation();
  const isMobile = useMobile();
  const [open, setOpen] = useState(false);
  
  // Close the mobile sidebar when location changes
  useEffect(() => {
    if (isMobile && open) {
      setOpen(false);
    }
  }, [activeRoute, isMobile]);

  const navItems = [
    { name: "Dashboard", path: "/", icon: <Home className="mr-3 h-5 w-5" />, id: "dashboard" },
    { name: "Food", path: "/food", icon: <Coffee className="mr-3 h-5 w-5" />, id: "food" },
    { name: "Drinks", path: "/drinks", icon: <Coffee className="mr-3 h-5 w-5" />, id: "drinks" },
    { name: "Merchandise", path: "/merchandise", icon: <ShoppingBag className="mr-3 h-5 w-5" />, id: "merchandise" },
    { name: "Inventory Count", path: "/inventory-count", icon: <Clipboard className="mr-3 h-5 w-5" />, id: "inventory-count" },
    { name: "Reports", path: "/reports", icon: <BarChart className="mr-3 h-5 w-5" />, id: "reports" },
    { name: "Settings", path: "/settings", icon: <Settings className="mr-3 h-5 w-5" />, id: "settings" },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <span className="text-lg font-medium">Square Inventory</span>
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="lg:hidden">
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
      <nav className="mt-4 flex-1">
        <ul>
          {navItems.map((item) => (
            <li key={item.id}>
              <div
                onClick={() => setLocation(item.path)}
                className={cn(
                  "flex items-center px-4 py-3 hover:bg-white/10 cursor-pointer",
                  activeRoute === item.id && "bg-primary/20 border-l-4 border-primary"
                )}
              >
                {item.icon}
                <span>{item.name}</span>
              </div>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 mt-auto">
        <div className="flex items-center space-x-2 mb-4">
          <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium">Downtown Cafe</p>
            <p className="text-xs opacity-70">Connected to Square</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Mobile sidebar using Sheet component
  if (isMobile) {
    return (
      <>
        <Button 
          variant="ghost" 
          size="icon" 
          className="fixed top-3 left-4 z-40 lg:hidden"
          onClick={() => setOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </Button>
        
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent side="left" className="p-0 w-64 bg-[#1E293B] text-white">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </>
    );
  }

  // Desktop sidebar
  return (
    <aside className="w-64 bg-[#1E293B] text-white hidden lg:block transition-all duration-300">
      <SidebarContent />
    </aside>
  );
}
