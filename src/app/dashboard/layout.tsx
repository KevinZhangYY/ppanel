"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Server, 
  Bell, 
  Settings, 
  LogOut,
  Menu
} from "lucide-react";
import { useState, useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession() || { status: "loading" };
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "My VPS", href: "/dashboard/vps", icon: Server },
    { name: "Alerts", href: "/dashboard/alerts", icon: Bell },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-surface">
      {/* Sidebar for mobile */}
      <div className={`fixed inset-0 z-50 bg-black/50 transition-opacity lg:hidden ${isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`} onClick={() => setIsSidebarOpen(false)} />
      
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-surface-variant/30 backdrop-blur-md border-r border-surface-variant/50 transform transition-transform lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-primary">PPanel</h2>
        </div>
        <nav className="mt-4 px-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-full transition-colors ${
                  isActive 
                    ? "bg-primary-container text-on-primary-container" 
                    : "text-on-surface-variant hover:bg-surface-variant/50"
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-8 w-full px-4">
          <button
            onClick={() => signOut()}
            className="flex items-center space-x-3 px-4 py-3 w-full rounded-full text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`lg:ml-64 transition-all`}>
        <header className="h-16 flex items-center justify-between px-6 border-b border-surface-variant/50 lg:hidden">
          <button onClick={() => setIsSidebarOpen(true)}>
            <Menu className="text-on-surface" />
          </button>
          <h2 className="text-xl font-bold text-primary">PPanel</h2>
          <div className="w-6" />
        </header>
        <div className="p-6 lg:p-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
