"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/sidebar";
import { MobileNav } from "@/components/dashboard/navigation/mobile-nav";
import { Breadcrumb } from "@/components/breadcrumb";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Development authentication bypass
		// In production, this would check for proper authentication
		if (typeof window !== "undefined") {
			// For development, always authenticate
			setIsAuthenticated(true);
		}
		setLoading(false);
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
			<div className="hidden lg:block">
				<Sidebar />
			</div>

			{/* Mobile Navigation */}
			<div className="lg:hidden">
				<MobileNav />
			</div>

			{/* Main Content */}
			<div className="flex min-w-0 flex-1 flex-col lg:ml-64">
				<div className="p-4 pt-20 pb-20 lg:p-6 lg:pt-6 lg:pb-0">
					<Breadcrumb />
					{children}
				</div>
			</div>

			{/* Fixed Notifications */}
			<div className="fixed top-4 right-4 z-50 space-y-2">
				{/* Add notification components here */}
			</div>
		</div>
	);
}
