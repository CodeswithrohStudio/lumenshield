import {
  Activity,
  ArrowUpRight,
  DatabaseZap,
  Lock,
  ShieldCheck,
  Signal,
  Wallet,
} from "lucide-react";
import {
  COSTON2,
  DEMO_VAULT,
  FLARE_EVIDENCE,
  LUMENSHIELD_VAULT_ADDRESS,
  SHIELD_PRODUCTS,
  explorerAddress,
  truncateAddress,
} from "@/lib/flare";
import { getFlareLiveSnapshot } from "@/lib/flareLive";
import VaultActionsPanel from "@/components/VaultActionsPanel";
import VaultCompanionsPanel from "@/components/VaultCompanionsPanel";

const AUDIT_ROWS = [
  ["Principal accounting", "100% separated", "contract invariant"],
  ["Yield risk budget", `${DEMO_VAULT.yieldBudget} ${DEMO_VAULT.asset}`, "shield margin cap"],
  ["Primary bounty", "Interoperable Asset Products", "FXRP/FAssets"],
  ["FCC claim", "Not claimed", "roadmap only"],
];

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const live = await getFlareLiveSnapshot();

  return (
    <main className="min-h-dvh px-5 py-6 text-[var(--ls-text)] lg:px-8">
      <header className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm text-[var(--ls-muted)]">
            <Signal size={14} className="text-[var(--ls-accent)]" />
            LumenShield workbench
          </p>
          <h1 className="mt-4 font-unbounded text-3xl font-semibold tracking-[-0.02em]">
            FXRP principal protected vault
          </h1>
          <p className="mt-3 max-w-2xl text-[var(--ls-muted)]">
            Coston2 dashboard showing FXRP/FAssets discovery, FTSOv2 pricing,
            yield-only shields, and judge-readable evidence.
          </p>
        </div>
        <a
          href={explorerAddress(LUMENSHIELD_VAULT_ADDRESS)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[var(--ls-surface)] px-4 py-2 text-sm text-white/72"
        >
          <Wallet size={15} />
          {truncateAddress(LUMENSHIELD_VAULT_ADDRESS)}
          <ArrowUpRight size={14} />
        </a>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={Lock}
          label="Principal protected"
          value={`${DEMO_VAULT.principal.toLocaleString()} ${DEMO_VAULT.asset}`}
          detail={`$${DEMO_VAULT.usdValue.toLocaleString()} reference valuation`}
        />
        <MetricCard
          icon={Activity}
          label="Yield available"
          value={`${DEMO_VAULT.yieldBudget} ${DEMO_VAULT.asset}`}
          detail="Only budget allowed into shields"
        />
        <MetricCard
          icon={ShieldCheck}
          label="Shield margin used"
          value={`${DEMO_VAULT.shieldMarginUsed} ${DEMO_VAULT.asset}`}
          detail="Losses settle against yield"
        />
        <MetricCard
          icon={DatabaseZap}
          label="Network"
          value="Coston2"
          detail={
            live.ok && live.blockNumber
              ? `live block ${Number(live.blockNumber).toLocaleString()}`
              : `chainId ${COSTON2.chainId} · ${COSTON2.nativeCurrency}`
          }
        />
      </section>

      <VaultActionsPanel />

      <VaultCompanionsPanel />

      <section className="mt-6 rounded-lg border border-white/10 bg-[var(--ls-surface)] p-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <h2 className="font-unbounded text-xl font-semibold">Live Flare reads</h2>
            <p className="mt-2 max-w-2xl text-sm text-[var(--ls-muted)]">
              Public Coston2 reads through Flare Contract Registry, FAssets AssetManagerFXRP,
              and FTSOv2. These are read-only checks, separate from the vault deployment.
            </p>
          </div>
          <span className="rounded-full bg-[rgba(67,226,152,0.10)] px-3 py-1 text-xs font-semibold text-[#43e298]">
            {live.ok ? "Coston2 live" : "RPC fallback"}
          </span>
        </div>
        {live.ok ? (
          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <LiveReadCard label="LumenShield vault" value={live.vaultAddress ?? "Unavailable"} />
            <LiveReadCard label="FXRP token" value={live.fxrpAddress ?? "Unavailable"} />
            <LiveReadCard label="AssetManagerFXRP" value={live.assetManagerFXRP ?? "Unavailable"} />
            <LiveReadCard label="Vault oracle" value={live.vaultOracle ?? "Unavailable"} />
            <LiveReadCard label="FXRP lot size" value={`${live.lotSizeFXRP ?? "Unknown"} FXRP`} />
            <LiveReadCard label="XRP/USD FTSOv2" value={`$${live.xrpUsd ?? "Unknown"}`} />
            <LiveReadCard label="Next shield ID" value={live.nextShieldId ?? "Unavailable"} />
            <LiveReadCard label="Vault owner" value={live.vaultOwner ?? "Unavailable"} />
            <LiveReadCard label="Vault asset" value={live.vaultAsset ?? "Unavailable"} />
          </div>
        ) : (
          <p className="mt-5 rounded-md border border-white/10 bg-black/20 p-4 text-sm text-[var(--ls-muted)]">
            Live Coston2 read failed during render: {live.error}
          </p>
        )}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-lg border border-white/10 bg-[var(--ls-surface)] p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-unbounded text-xl font-semibold">Vault separation</h2>
              <p className="mt-2 text-sm text-[var(--ls-muted)]">
                The UI is designed around one invariant: shield PnL never reaches principal accounting.
              </p>
            </div>
            <span className="rounded-full bg-[rgba(226,131,46,0.12)] px-3 py-1 text-xs font-semibold text-[var(--ls-accent)]">
              yield-only risk
            </span>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ["Principal lane", "1000 FXRP", "withdrawable accounting base"],
              ["Yield lane", "12.84 FXRP", "available shield budget"],
              ["Signal lane", live.ok && live.xrpUsd ? `$${live.xrpUsd}` : "XRP/USD", "FTSOv2 valuation"],
            ].map(([title, value, detail]) => (
              <div key={title} className="rounded-md border border-white/10 bg-black/20 p-5">
                <p className="text-sm text-[var(--ls-muted)]">{title}</p>
                <p className="mt-3 font-unbounded text-2xl font-semibold">{value}</p>
                <p className="mt-2 text-sm text-white/50">{detail}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 h-3 overflow-hidden rounded-full bg-black/35">
            <div className="h-full w-[78%] rounded-full bg-[var(--ls-primary)]" />
          </div>
          <div className="mt-3 flex justify-between font-mono text-xs text-white/45">
            <span>protected principal</span>
            <span>yield budget</span>
            <span>open shields</span>
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-[var(--ls-surface)] p-6">
          <h2 className="font-unbounded text-xl font-semibold">Judge evidence</h2>
          <div className="mt-5 space-y-3">
            {FLARE_EVIDENCE.map((item) => (
              <div key={item.label} className="rounded-md border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-white/35">{item.label}</p>
                <p className="mt-2 font-semibold text-white">{item.value}</p>
                <p className="mt-1 text-sm text-[var(--ls-muted)]">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-lg border border-white/10 bg-[var(--ls-surface)] p-6">
          <h2 className="font-unbounded text-xl font-semibold">Submission invariants</h2>
          <div className="mt-5 divide-y divide-white/10">
            {AUDIT_ROWS.map(([label, value, detail]) => (
              <div key={label} className="grid grid-cols-[1fr_auto] gap-4 py-4">
                <div>
                  <p className="font-medium text-white/86">{label}</p>
                  <p className="mt-1 text-sm text-[var(--ls-muted)]">{detail}</p>
                </div>
                <p className="text-right font-mono text-sm text-[var(--ls-accent)]">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-[var(--ls-surface)] p-6">
          <h2 className="font-unbounded text-xl font-semibold">Available shields</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {SHIELD_PRODUCTS.map((shield) => (
              <article key={shield.id} className="rounded-md border border-white/10 bg-black/20 p-4">
                <p className="font-semibold">{shield.name}</p>
                <p className="mt-2 text-sm leading-6 text-[var(--ls-muted)]">{shield.description}</p>
                <div className="mt-4 flex flex-wrap gap-2 font-mono text-[11px] text-white/58">
                  <span>{shield.asset}</span>
                  <span>{shield.leverage}</span>
                  <span>{shield.budget}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function LiveReadCard({ label, value }: { label: string; value: string }) {
  const displayValue = value.startsWith("0x") ? truncateAddress(value) : value;

  return (
    <div className="rounded-md border border-white/10 bg-black/20 p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-white/35">{label}</p>
      <p className="mt-3 break-words font-mono text-sm text-white/82">{displayValue}</p>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: typeof Lock;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-[var(--ls-surface)] p-5">
      <Icon size={18} className="text-[var(--ls-accent)]" />
      <p className="mt-5 text-sm text-[var(--ls-muted)]">{label}</p>
      <p className="mt-2 font-unbounded text-xl font-semibold">{value}</p>
      <p className="mt-2 text-sm text-white/48">{detail}</p>
    </div>
  );
}
