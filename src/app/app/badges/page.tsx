"use client";

import { BadgeCheck, FileCode2 } from "lucide-react";
import { COSTON2, FLARE_EVIDENCE } from "@/lib/flare";

const BUILD_EVIDENCE = [
  ["Initial baseline", "Consumer vault prototype imported as commit 1"],
  ["New product plan", "LumenShield Flare product plan in docs/"],
  ["Brand system", "Tastemaker lock, reference board, LumenShield mark"],
  ["Contract proof", "Foundry vault tests for principal/yield separation"],
  ["Network target", `${COSTON2.name}, chainId ${COSTON2.chainId}`],
];

export default function EvidencePage() {
  return (
    <main className="min-h-dvh px-5 py-6 text-[var(--ls-text)] lg:px-8">
      <header className="mb-8">
        <p className="text-sm font-medium text-[var(--ls-accent)]">Judge evidence</p>
        <h1 className="mt-3 font-unbounded text-3xl font-semibold">What is new, what is proven, what is roadmap.</h1>
        <p className="mt-3 max-w-2xl text-[var(--ls-muted)]">
          This replaces collectible badges with the thing judges actually need:
          a clear audit path through new work, Flare fit, and honest limitations.
        </p>
      </header>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-lg border border-white/10 bg-[var(--ls-surface)] p-6">
          <h2 className="flex items-center gap-2 font-unbounded text-xl font-semibold">
            <BadgeCheck className="text-[var(--ls-accent)]" />
            Flare integration map
          </h2>
          <div className="mt-5 space-y-3">
            {FLARE_EVIDENCE.map((item) => (
              <div key={item.label} className="rounded-md border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-white/35">{item.label}</p>
                <p className="mt-2 font-semibold">{item.value}</p>
                <p className="mt-1 text-sm text-[var(--ls-muted)]">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-[var(--ls-surface)] p-6">
          <h2 className="flex items-center gap-2 font-unbounded text-xl font-semibold">
            <FileCode2 className="text-[var(--ls-primary)]" />
            Evidence checklist
          </h2>
          <div className="mt-5 divide-y divide-white/10">
            {BUILD_EVIDENCE.map(([label, value]) => (
              <div key={label} className="grid grid-cols-[0.75fr_1.25fr] gap-5 py-4">
                <p className="text-sm text-white/52">{label}</p>
                <p className="text-sm font-medium text-white/86">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
