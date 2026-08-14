"use client";

import { ArrowRight, ShieldCheck } from "lucide-react";
import { SHIELD_PRODUCTS } from "@/lib/flare";

export default function ShieldsPage() {
  return (
    <main className="min-h-dvh px-5 py-6 text-[var(--ls-text)] lg:px-8">
      <header className="mb-8">
        <p className="text-sm font-medium text-[var(--ls-accent)]">Yield-only risk products</p>
        <h1 className="mt-3 font-unbounded text-3xl font-semibold">Open a shield without touching principal.</h1>
        <p className="mt-3 max-w-2xl text-[var(--ls-muted)]">
          These are the Flare-native shield lanes. The contract invariant is simple:
          a shield can spend yield budget, not principal balance.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        {SHIELD_PRODUCTS.map((shield) => (
          <article key={shield.id} className="rounded-lg border border-white/10 bg-[var(--ls-surface)] p-6">
            <div className="flex items-start justify-between gap-5">
              <div>
                <h2 className="font-unbounded text-xl font-semibold">{shield.name}</h2>
                <p className="mt-3 text-sm leading-6 text-[var(--ls-muted)]">{shield.description}</p>
              </div>
              <ShieldCheck className="text-[var(--ls-accent)]" />
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3 rounded-md border border-white/10 bg-black/20 p-4 font-mono text-xs text-white/58">
              <span>{shield.asset}</span>
              <span>{shield.leverage}</span>
              <span>{shield.budget}</span>
            </div>
            <button className="mt-5 inline-flex items-center gap-2 rounded-full bg-[var(--ls-primary)] px-4 py-2 text-sm font-semibold text-white">
              Preview shield <ArrowRight size={15} />
            </button>
          </article>
        ))}
      </section>
    </main>
  );
}
