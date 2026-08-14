"use client";

import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  Activity,
  ArrowUpRight,
  BadgeCheck,
  LayoutDashboard,
  LogOut,
  Shield,
  Trophy,
} from "lucide-react";
import {
  COSTON2,
  DEMO_WALLET,
  explorerAddress,
  truncateAddress,
} from "@/lib/flare";
import { GradientAvatar } from "@/components/ui/gradient-avatar";

const NAV = [
  { label: "Vault", path: "/app", icon: LayoutDashboard },
  { label: "Shields", path: "/app/shields", icon: Shield },
  { label: "Evidence", path: "/app/badges", icon: BadgeCheck },
  { label: "Leaderboard", path: "/app/leaderboard", icon: Trophy },
];

export default function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <aside
      className="hidden lg:flex fixed left-0 top-0 z-40 h-dvh w-64 flex-col border-r border-white/[0.07] bg-[var(--ls-bg)] px-4 py-6"
      style={{ fontFamily: "'Albert Sans', sans-serif" }}
    >
      <button
        onClick={() => router.push("/app")}
        className="mb-8 flex items-center gap-2 px-2 text-left"
      >
        <Image src="/lumenshield-mark.svg" alt="" width={28} height={28} />
        <span className="font-unbounded text-lg font-semibold text-[var(--ls-text)]">
          LumenShield
        </span>
      </button>

      <div className="mb-5 rounded-lg border border-[var(--ls-border)] bg-[var(--ls-surface)] p-3">
        <div className="flex items-center gap-2 text-xs font-medium text-[var(--ls-muted)]">
          <Activity size={14} className="text-[var(--ls-accent)]" />
          {COSTON2.name}
        </div>
        <p className="mt-1 font-mono text-[11px] text-[var(--ls-text)]">
          chainId {COSTON2.chainId} · {COSTON2.nativeCurrency}
        </p>
      </div>

      <nav className="flex flex-col gap-1">
        {NAV.map((item) => {
          const active =
            item.path === "/app" ? pathname === "/app" : pathname.startsWith(item.path);
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
              style={{
                color: active ? "#ffffff" : "rgba(236,242,254,0.58)",
                background: active ? "rgba(81,112,207,0.18)" : "transparent",
                boxShadow: active ? "inset 3px 0 0 #5170cf" : "none",
              }}
            >
              <Icon
                size={18}
                style={{ color: active ? "var(--ls-accent)" : "currentColor" }}
                strokeWidth={2}
              />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="flex-1" />

      <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
        <a
          href={explorerAddress(DEMO_WALLET)}
          target="_blank"
          rel="noopener noreferrer"
          title={DEMO_WALLET}
          className="flex items-center gap-2.5 rounded-md px-1 py-1 transition-colors hover:bg-white/[0.04]"
        >
          <GradientAvatar addr={DEMO_WALLET} size={32} />
          <div className="min-w-0 flex-1">
            <p className="text-[10px] text-white/40">Judge wallet</p>
            <p className="truncate font-mono text-xs text-white/80">
              {truncateAddress(DEMO_WALLET)}
            </p>
          </div>
          <ArrowUpRight size={13} className="text-white/30" />
        </a>
        <button className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-md border border-white/10 py-2 text-xs text-white/45 transition-colors hover:bg-white/[0.05] hover:text-white/70">
          <LogOut size={12} />
          Workbench mode
        </button>
      </div>
    </aside>
  );
}
