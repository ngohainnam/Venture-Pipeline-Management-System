"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Breadcrumb } from "@/components/breadcrumb";
import { HelpCircle, Search } from "lucide-react";
import UserSidebar from "@/components/user-dashboard/user-sidebar";

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
}

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    // Development authentication bypass
    // In production, this would check for proper authentication
    if (typeof window !== "undefined") {
      // For development, always authenticate
      setIsAuthenticated(true);
    }
    setLoading(false);

    // Fetch user data
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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          <span className="text-muted-foreground">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-foreground">
            Access Required
          </h1>
          <p className="mb-6 text-muted-foreground">
            Please sign in to access the dashboard.
          </p>
          <Link
            href="/"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="app-surface flex min-h-screen text-foreground transition-colors duration-300">
      {/* Desktop Sidebar */}
      <div>
        <UserSidebar />
      </div>

      {/* Main Content */}
      <div className="flex min-w-0 flex-1 flex-col lg:ml-64">
        <div>
          <header className="border-b border-border bg-card px-6 py-4">
            <div className="flex items-center justify-between gap-6">
              {/* Left Section - Logo and Status */}
              <div className="flex items-center gap-4">
                <h1 className="whitespace-nowrap text-2xl font-bold text-foreground">
                  Venture Pipeline 
                </h1>
                <div className="flex items-center gap-2 rounded-full bg-success/10 px-3 py-1">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-success"></div>
                  <span className="text-sm font-medium text-success">
                    Live
                  </span>
                </div>
              </div>

              {/* Center Section - Search */}
              <div className="flex-1 max-w-2xl">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search"
                    className="w-full rounded-md border border-input bg-background py-3 pl-12 pr-4 text-foreground transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              {/* Right Section - Actions */}
              <div className="flex items-center gap-3">

                {/* Help */}
                <button className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
                  <HelpCircle className="h-6 w-6" />
                </button>
                {/* User Avatar */}
                <Link href="/user-dashboard/profile" className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
                  {userData ? (userData.firstName.charAt(0) + userData.lastName.charAt(0)).toUpperCase() : ''}
                </Link>
              </div>
            </div>
          </header>
          <div className="p-4 lg:p-6">
            <Breadcrumb />
            {children}
          </div>
        </div>
      </div>

      {/* Fixed Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {/* Add notification components here */}
      </div>
    </div>
  );
}
