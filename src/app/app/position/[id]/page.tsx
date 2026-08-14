"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PositionDetailPage() {
  return (
    <main className="min-h-dvh px-5 py-6 text-[var(--ls-text)] lg:px-8">
      <Link href="/app/shields" className="inline-flex items-center gap-2 text-sm text-white/58 hover:text-white">
        <ArrowLeft size={15} />
        Back to shields
      </Link>
      <section className="mt-8 rounded-lg border border-white/10 bg-[var(--ls-surface)] p-8">
        <p className="text-sm font-medium text-[var(--ls-accent)]">Position detail placeholder</p>
        <h1 className="mt-3 font-unbounded text-3xl font-semibold">Shield receipts come after contract integration.</h1>
        <p className="mt-4 max-w-2xl text-[var(--ls-muted)]">
          This route is intentionally honest during the port. Once the Coston2 vault
          deployment is wired to the frontend, this page will show shield ID,
          market, stake, settlement status, transaction hash, and explorer links.
        </p>
      </section>
    </main>
  );
}
