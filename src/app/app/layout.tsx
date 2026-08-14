"use client";

import AppSidebar from "@/components/AppSidebar";
import BottomNav from "@/components/BottomNav";
import ToastNotifications from "@/components/ToastNotifications";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToastNotifications />
      <AppSidebar />
      <div className="min-h-dvh bg-[var(--ls-bg)] pb-20 lg:pb-0 lg:pl-64">
        {children}
      </div>
      <BottomNav />
    </>
  );
}
