"use client";

const READINESS = [
  ["Product usefulness", "Clear user problem: safer participation in DeFi upside"],
  ["Flare integration", "FXRP/FAssets positioning, Coston2 target, FTSOv2 path"],
  ["Technical execution", "Next app + Foundry vault invariant tests"],
  ["New work evidence", "Brand, docs, contracts, and app shell in new commits"],
  ["Future potential", "FDC proof path and real yield adapters documented honestly"],
];

export default function LeaderboardPage() {
  return (
    <main className="min-h-dvh px-5 py-6 text-[var(--ls-text)] lg:px-8">
      <header className="mb-8">
        <p className="text-sm font-medium text-[var(--ls-accent)]">Submission readiness</p>
        <h1 className="mt-3 font-unbounded text-3xl font-semibold">Score the build like a judge.</h1>
        <p className="mt-3 max-w-2xl text-[var(--ls-muted)]">
          The old gamified leaderboard becomes a readiness board mapped directly to
          Flare Summer Signal judging criteria.
        </p>
      </header>
      <section className="rounded-lg border border-white/10 bg-[var(--ls-surface)] p-6">
        <div className="divide-y divide-white/10">
          {READINESS.map(([criterion, evidence], index) => (
            <div key={criterion} className="grid gap-4 py-5 md:grid-cols-[80px_0.8fr_1.2fr] md:items-center">
              <p className="font-mono text-sm text-[var(--ls-accent)]">0{index + 1}</p>
              <h2 className="font-unbounded text-lg font-semibold">{criterion}</h2>
              <p className="text-sm leading-6 text-[var(--ls-muted)]">{evidence}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
