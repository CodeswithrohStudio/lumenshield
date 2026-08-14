"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowRight, BadgeCheck, DatabaseZap, ShieldCheck, Signal } from "lucide-react";
import { COSTON2, FLARE_EVIDENCE, SHIELD_PRODUCTS } from "@/lib/flare";

const MECHANISM = [
  {
    label: "Principal",
    value: "1,000 FXRP",
    detail: "Shielded in vault accounting",
  },
  {
    label: "Yield budget",
    value: "12.84 FXRP",
    detail: "Only this can enter risk",
  },
  {
    label: "Signal",
    value: "XRP/USD",
    detail: "FTSO-ready valuation path",
  },
];

export default function LandingPage() {
  const router = useRouter();

  return (
    <main className="min-h-dvh overflow-x-clip bg-[var(--ls-bg)] text-[var(--ls-text)]">
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-[rgba(9,11,17,0.78)] px-5 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <button onClick={() => router.push("/")} className="flex items-center gap-2.5">
            <Image src="/lumenshield-mark.svg" alt="" width={32} height={32} />
            <span className="font-unbounded text-lg font-semibold">LumenShield</span>
          </button>
          <div className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 md:flex">
            {["Mechanism", "Flare proof", "Shields"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(" ", "-")}`}
                className="rounded-full px-4 py-2 text-sm text-white/62 transition-colors hover:bg-white/[0.06] hover:text-white"
              >
                {item}
              </a>
            ))}
          </div>
          <button
            onClick={() => router.push("/app")}
            className="rounded-full bg-[var(--ls-primary)] px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 active:translate-y-0"
          >
            Launch demo
          </button>
        </div>
      </nav>

      <section className="relative mx-auto grid min-h-[780px] max-w-7xl grid-cols-1 items-center gap-14 px-5 pb-20 pt-36 lg:grid-cols-[0.9fr_1.1fr] lg:pt-28">
        <div className="absolute inset-x-0 top-0 -z-0 h-[520px] bg-[radial-gradient(circle_at_72%_20%,rgba(81,112,207,0.24),transparent_34%),radial-gradient(circle_at_18%_36%,rgba(226,131,46,0.16),transparent_28%)]" />
        <div className="relative z-10">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--ls-border)] bg-white/[0.04] px-3 py-1.5 text-sm text-[var(--ls-muted)]">
            <Signal size={14} className="text-[var(--ls-accent)]" />
            Flare Summer Signal · Bounty 1
          </p>
          <h1 className="max-w-4xl font-unbounded text-5xl font-semibold leading-[1.04] tracking-[-0.02em] text-balance md:text-7xl">
            Protect the principal. Send only the yield.
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-[var(--ls-muted)]">
            LumenShield turns Yoldr into a Flare-native FXRP vault: principal stays
            isolated, earned yield becomes the only risk budget, and every judge can
            inspect the Coston2 evidence path.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => router.push("/app")}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[var(--ls-primary)] px-6 text-sm font-semibold text-white"
            >
              Open vault demo <ArrowRight size={16} />
            </button>
            <a
              href="#flare-proof"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/12 px-6 text-sm font-semibold text-white/72 transition-colors hover:bg-white/[0.05] hover:text-white"
            >
              Review Flare path
            </a>
          </div>
        </div>

        <div className="relative z-10 rounded-lg border border-white/10 bg-[rgba(20,22,28,0.84)] p-4 shadow-2xl shadow-black/40 backdrop-blur-xl">
          <div className="grid gap-3 md:grid-cols-3">
            {MECHANISM.map((item) => (
              <div key={item.label} className="rounded-md border border-white/10 bg-white/[0.035] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--ls-muted)]">{item.label}</p>
                <p className="mt-3 font-unbounded text-xl font-semibold">{item.value}</p>
                <p className="mt-2 text-sm leading-6 text-[var(--ls-muted)]">{item.detail}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-md border border-[rgba(226,131,46,0.34)] bg-[rgba(226,131,46,0.07)] p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-[var(--ls-accent)]">Yield-only shield rule</p>
                <p className="mt-2 max-w-xl text-sm leading-6 text-white/68">
                  A shield can open only when yield budget is available. Loss settlement
                  reduces yield budget first; principal accounting remains untouched.
                </p>
              </div>
              <ShieldCheck className="mt-1 shrink-0 text-[var(--ls-accent)]" />
            </div>
            <div className="mt-6 h-3 overflow-hidden rounded-full bg-black/40">
              <div className="h-full w-[82%] rounded-full bg-[var(--ls-primary)]" />
            </div>
            <div className="mt-3 flex justify-between font-mono text-xs text-white/52">
              <span>principal lane</span>
              <span>yield lane</span>
              <span>signal lane</span>
            </div>
          </div>
        </div>
      </section>

      <section id="mechanism" className="mx-auto max-w-7xl px-5 py-24">
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <h2 className="font-unbounded text-3xl font-semibold tracking-[-0.02em]">
              A structured product, made inspectable.
            </h2>
            <p className="mt-5 text-base leading-7 text-[var(--ls-muted)]">
              This is not a promise that markets are safe. It is a contract-level
              separation between what users want protected and what users are willing
              to risk.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["Deposit FXRP", "Vault accounting tracks principal separately from yield budget."],
              ["Accrue yield", "The MVP can simulate yield while the production roadmap connects real sources."],
              ["Open shield", "Only yield budget can fund shield margin, never principal."],
            ].map(([title, body], index) => (
              <div key={title} className="rounded-lg border border-white/10 bg-[var(--ls-surface)] p-6">
                <p className="font-mono text-sm text-[var(--ls-accent)]">0{index + 1}</p>
                <h3 className="mt-4 font-unbounded text-lg font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--ls-muted)]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="flare-proof" className="border-y border-white/10 bg-white/[0.025]">
        <div className="mx-auto max-w-7xl px-5 py-24">
          <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <h2 className="font-unbounded text-3xl font-semibold">Flare is in the product path.</h2>
              <p className="mt-4 max-w-2xl text-[var(--ls-muted)]">
                The submission target is Coston2 with FXRP/FAssets framing, FTSOv2
                valuation, and FDC only where a real verification flow exists.
              </p>
            </div>
            <p className="font-mono text-sm text-white/48">{COSTON2.rpcUrl}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {FLARE_EVIDENCE.map((item) => (
              <div key={item.label} className="rounded-lg border border-white/10 bg-[var(--ls-bg)] p-5">
                <DatabaseZap size={18} className="text-[var(--ls-accent)]" />
                <p className="mt-5 text-sm text-[var(--ls-muted)]">{item.label}</p>
                <p className="mt-1 font-unbounded text-lg font-semibold">{item.value}</p>
                <p className="mt-3 text-sm leading-6 text-white/52">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="shields" className="mx-auto max-w-7xl px-5 py-24">
        <h2 className="max-w-2xl font-unbounded text-3xl font-semibold">
          Shield products use yield as the only adventurous capital.
        </h2>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {SHIELD_PRODUCTS.map((shield) => (
            <article key={shield.id} className="rounded-lg border border-white/10 bg-[var(--ls-surface)] p-6">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <h3 className="font-unbounded text-xl font-semibold">{shield.name}</h3>
                  <p className="mt-3 text-sm leading-6 text-[var(--ls-muted)]">{shield.description}</p>
                </div>
                <BadgeCheck className="text-[var(--ls-primary)]" />
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3 font-mono text-xs text-white/58">
                <span>{shield.asset}</span>
                <span>{shield.leverage}</span>
                <span>{shield.budget}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-24">
        <div className="rounded-lg border border-white/10 bg-[var(--ls-surface)] p-8 md:p-12">
          <h2 className="max-w-3xl font-unbounded text-3xl font-semibold">
            Built from Yoldr, judged as new Flare work.
          </h2>
          <p className="mt-5 max-w-2xl text-[var(--ls-muted)]">
            The repo keeps the lineage visible: Yoldr existed on Flow, while
            LumenShield adds a Flare-native product model, brand, contracts, app shell,
            and submission evidence for Summer Signal.
          </p>
          <button
            onClick={() => router.push("/app")}
            className="mt-8 rounded-full bg-[var(--ls-primary)] px-6 py-3 text-sm font-semibold text-white"
          >
            Enter the workbench
          </button>
        </div>
      </section>

      <footer className="border-t border-white/10 px-5 py-7">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 text-sm text-white/42 md:flex-row">
          <span>LumenShield</span>
          <span>Coston2 prototype · no risk-free yield claims · built for Flare Summer Signal</span>
        </div>
      </footer>
    </main>
  );
}
