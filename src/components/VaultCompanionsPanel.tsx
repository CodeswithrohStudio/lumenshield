"use client";

import Image from "next/image";
import { useMemo } from "react";
import { formatUnits } from "viem";
import { useAccount, useReadContract } from "wagmi";
import { HeartPulse, ShieldCheck, Sparkles, Trophy } from "lucide-react";
import { addresses, lumenShieldVaultAbi } from "@/lib/contracts";

const FXRP_DECIMALS = 6;

const COMPANIONS = [
  {
    name: "Signal Kit",
    role: "oracle mood reader",
    trait: "gains glow from every confirmed vault deposit",
  },
  {
    name: "Yield Warden",
    role: "principal guardian",
    trait: "unlocks armor when yield budget appears",
  },
  {
    name: "Flare Sprout",
    role: "streak keeper",
    trait: "levels faster when users keep shields active",
  },
];

const STAGES = [
  { name: "Hatch", threshold: 0, next: 1, detail: "connect a wallet and make the first FXRP deposit" },
  { name: "Spark", threshold: 1, next: 10, detail: "vault has real Coston2 principal" },
  { name: "Guard", threshold: 10, next: 50, detail: "principal is large enough for stronger shield identity" },
  { name: "Mythic", threshold: 50, next: 100, detail: "top-tier vault companion state for judge scoring" },
];

export default function VaultCompanionsPanel() {
  const { address } = useAccount();

  const principal = useReadContract({
    address: addresses.vault,
    abi: lumenShieldVaultAbi,
    functionName: "principalBalance",
    args: address ? [address] : undefined,
    query: { enabled: Boolean(address) },
  });

  const yieldBudget = useReadContract({
    address: addresses.vault,
    abi: lumenShieldVaultAbi,
    functionName: "yieldBudget",
    args: address ? [address] : undefined,
    query: { enabled: Boolean(address) },
  });

  const petState = useMemo(() => {
    const principalFxrp = Number(formatUnits(principal.data ?? 0n, FXRP_DECIMALS));
    const yieldFxrp = Number(formatUnits(yieldBudget.data ?? 0n, FXRP_DECIMALS));
    const displayPrincipal = principalFxrp;
    const activeStage =
      [...STAGES].reverse().find((stage) => displayPrincipal >= stage.threshold) ?? STAGES[0];
    const nextStage = STAGES.find((stage) => stage.threshold > displayPrincipal);
    const stageStart = activeStage.threshold;
    const stageEnd = nextStage?.threshold ?? activeStage.next;
    const progress =
      stageEnd <= stageStart
        ? 100
        : Math.min(100, Math.round(((displayPrincipal - stageStart) / (stageEnd - stageStart)) * 100));
    const level = Math.max(1, Math.floor(displayPrincipal / 5) + 1);
    const bonded = principalFxrp > 0;
    const health = Math.min(100, Math.round(72 + Math.min(20, yieldFxrp * 3) + (bonded ? 8 : 0)));

    return {
      bonded,
      principalFxrp,
      yieldFxrp,
      displayPrincipal,
      stage: activeStage,
      nextStage,
      progress,
      level,
      health,
    };
  }, [principal.data, yieldBudget.data]);

  return (
    <section className="mt-6 overflow-hidden rounded-lg border border-white/10 bg-[var(--ls-surface)]">
      <div className="grid gap-0 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="relative min-h-[360px] border-b border-white/10 bg-black/20 p-6 xl:border-b-0 xl:border-r">
          <Image
            src="/pets-codex-pack.png"
            alt=""
            fill
            priority={false}
            className="object-cover opacity-[0.12]"
            sizes="(min-width: 1280px) 40vw, 100vw"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(226,131,46,0.20),rgba(9,11,17,0.92)_64%)]" />
          <div className="relative flex h-full flex-col items-center justify-center text-center">
            <div className="relative">
              <div className="absolute inset-4 rounded-full bg-[var(--ls-accent)] blur-3xl opacity-30" />
              <div className="relative h-44 w-44 overflow-hidden rounded-full border border-white/15 bg-white/5 p-2 shadow-2xl shadow-black/35">
                <Image
                  src="/pets-codex-icon.png"
                  alt="Signal Kit companion"
                  width={176}
                  height={176}
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 rounded-full border border-white/15 bg-black px-3 py-1 font-mono text-xs text-[var(--ls-accent)]">
                Lv.{petState.level}
              </div>
            </div>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ls-accent)]">
              Vault companion
            </p>
            <h2 className="mt-2 font-unbounded text-2xl font-semibold">Signal Kit</h2>
            <p className="mt-3 max-w-sm text-sm leading-6 text-[var(--ls-muted)]">
              A Codex Pets inspired companion that grows from the same Coston2 vault reads judges can test.
            </p>
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ls-accent)]">
                <Sparkles size={14} />
                Gamified vault layer
              </p>
              <h3 className="mt-4 font-unbounded text-xl font-semibold">
                Pets evolve with principal, yield, and shield activity
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--ls-muted)]">
                Deposits bond the pet to a wallet, yield budget improves vitality, and each vault stage unlocks
                a stronger companion identity without changing the principal-protection invariant.
              </p>
            </div>
            <a
              href="https://codex-pets.net/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-white/10 px-4 py-2 text-sm text-white/72 transition-colors hover:bg-white/[0.04]"
            >
              Art source
            </a>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <CompanionStat icon={ShieldCheck} label="Bond state" value={petState.bonded ? "On-chain" : "Preview"} />
            <CompanionStat icon={Trophy} label="Growth stage" value={petState.stage.name} />
            <CompanionStat icon={HeartPulse} label="Vitality" value={`${petState.health}%`} />
          </div>

          <div className="mt-6 rounded-md border border-white/10 bg-black/20 p-4">
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
              <div>
                <p className="text-sm font-semibold text-white">Evolution progress</p>
                <p className="mt-1 text-sm text-[var(--ls-muted)]">
                  {petState.nextStage
                    ? `${formatFxrp(petState.displayPrincipal)} FXRP toward ${petState.nextStage.name}`
                    : `${formatFxrp(petState.displayPrincipal)} FXRP at top vault stage`}
                </p>
              </div>
              <p className="font-mono text-sm text-[var(--ls-accent)]">{petState.progress}%</p>
            </div>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,#5170cf,#e2832e,#43e298)] transition-all duration-700"
                style={{ width: `${petState.progress}%` }}
              />
            </div>
            <p className="mt-3 text-xs leading-5 text-white/45">{petState.stage.detail}</p>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {COMPANIONS.map((companion, index) => (
              <article key={companion.name} className="rounded-md border border-white/10 bg-black/20 p-4">
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 overflow-hidden rounded-md border border-white/10 bg-white/[0.04]">
                    <Image
                      src={index === 0 ? "/pets-codex-icon.png" : "/pets-codex-pack.png"}
                      alt=""
                      fill
                      className={index === 0 ? "object-cover" : "object-cover"}
                      sizes="48px"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white/88">{companion.name}</p>
                    <p className="text-xs text-[var(--ls-muted)]">{companion.role}</p>
                  </div>
                </div>
                <p className="mt-3 text-xs leading-5 text-white/50">{companion.trait}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CompanionStat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof ShieldCheck;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-md border border-white/10 bg-black/20 p-4">
      <Icon size={16} className="text-[var(--ls-accent)]" />
      <p className="mt-3 text-xs uppercase tracking-[0.18em] text-white/35">{label}</p>
      <p className="mt-2 font-mono text-sm text-white/82">{value}</p>
    </div>
  );
}

function formatFxrp(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(value);
}
