"use client";

import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Target,
  FileText,
  Settings,
  HelpCircle,
} from "lucide-react";
import Logo from "../logo";
import { usePathname, useRouter } from "next/navigation";

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
}

export default function UserSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const res = await fetch('/backend/api/users', {
          credentials: 'include',
        });
        const body = await res.json().catch(() => null);
        if (res.ok && body?.success && body?.user) {
          setUserData({
            firstName: body.user.firstName || '',
            lastName: body.user.lastName || '',
            email: body.user.email || '',
          });
        }
      } catch (err) {
        console.error('Failed to fetch user data:', err);
      }
    }
    fetchUserData();
  }, []);

  async function handleLogout() {
    try {
      setIsLoggingOut(true);
      const res = await fetch('/backend/api/auth/login', {
        method: 'DELETE',
        credentials: 'include',
      })

      const body = await res.json().catch(() => null)

      if (res.ok && body?.success) {
        // navigate to login page
        router.push('/auth/login')
      } else {
        console.error('Logout failed', body)
        router.push('/auth/login')
      }
    } catch (err) {
      console.error('Logout error', err)
      router.push('/auth/login')
    } finally {
      setIsLoggingOut(false)
    }
  }

  const menuSections = [
    {
      title: "MAIN",
      items: [
        { name: "Dashboard", icon: LayoutDashboard, href: "/user-dashboard" },
        { name: "Diagnostics & Readiness", icon: Target, href: "/user-dashboard/diagnostics" },
        { name: "Documents", icon: FileText, href: "/user-dashboard/documents" },
        // { name: "Capital Facilitation", icon: DollarSign, href: "/capital" },
        // { name: "GEDSI Tracker", icon: BarChart3, href: "/gedsi" },
        // { name: "Investor Management", icon: Users, href: "/investors" },
        // { name: "Funding Round Tracker", icon: TrendingUp, href: "/funding" },
      ],
    },
    // {
    //   title: "REPORTS",
    //   items: [
    //     { name: "Impact Reports", icon: FileText, href: "/reports/impact" },
    //     {
    //       name: "Performance Analytics",
    //       icon: PieChart,
    //       href: "/reports/analytics",
    //     },
    //   ],
    // },
    {
      title: "SETTINGS",
      items: [
        {
          name: "System Settings",
          icon: Settings,
          href: "/user-dashboard/profile",
        },
        { name: "Help & Support", icon: HelpCircle, href: "/user-dashboard/support" },
      ],
    },
  ];

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground shadow-lg transition-all duration-300">
      {/* Logo Section */}
      <div className="flex items-center gap-3 border-b border-sidebar-border p-6">
        <Logo size={"md"} />
        <div>
          <h1 className="text-xl font-bold tracking-wide text-sidebar-foreground">MIV</h1>
          <p className="text-xs font-medium text-sidebar-foreground/65">Impact Dashboard</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto px-4 py-6">
        {menuSections.map((section, sectionIdx) => (
          <div key={sectionIdx} className="mb-8">
            <h3 className="mb-3 px-4 text-xs font-bold tracking-wider text-sidebar-foreground/55">
              {section.title}
            </h3>
            <ul className="space-y-1">
              {section.items.map((item, itemIdx) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/user-dashboard" && pathname.startsWith(item.href));

                return (
                  <li key={itemIdx}>
                    <button
                      type="button"
                      onClick={() => {
                        router.push(item.href);
                      }}
                      className={`flex w-full cursor-pointer items-center gap-3 rounded-md px-4 py-3 text-left text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-sidebar-primary text-sidebar-primary-foreground"
                          : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      }`}
                    >
                      <Icon
                        className="h-5 w-5"
                      />
                      <span>{item.name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer - Optional User Section */}
      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3 rounded-md bg-sidebar-accent px-3 py-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sidebar-primary text-sm font-bold text-sidebar-primary-foreground">
            {userData ? (userData.firstName.charAt(0) + userData.lastName.charAt(0)).toUpperCase() : 'U'}
          </div>
          <div className="flex-1 min-w-0" id="userdata">
            <p className="truncate text-sm font-medium text-sidebar-foreground">
              {userData ? `${userData.firstName} ${userData.lastName}` : 'User Portal'}
            </p>
            <p className="truncate text-xs text-sidebar-foreground/60">{userData?.email || 'portal@mekong.vc'}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-sidebar-primary px-1 py-2 text-sm text-sidebar-primary-foreground transition-colors hover:bg-sidebar-primary/90 disabled:opacity-60"
        >
         {isLoggingOut ? 'Logging out...' : 'Logout'}
        </button>
      </div>
    </aside>
  );
}
