"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  DatabaseZap,
  Menu,
  ShieldCheck,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { COSTON2, FLARE_EVIDENCE, SHIELD_PRODUCTS } from "@/lib/flare";

const BG_IMAGE_1 =
  "https://images.unsplash.com/photo-1639322537228-f710d846310a?w=1600&q=85";
const BG_IMAGE_2 =
  "https://images.unsplash.com/photo-1631603090989-93f9ef6f9d80?w=1600&q=85";
const ACCENT = "#e2832e";
const SPOTLIGHT_R = 260;

const NAV_LINKS = [
  { label: "Mechanism", scrollTo: "mechanism" },
  { label: "Flare proof", scrollTo: "flare-proof" },
  { label: "Shields", scrollTo: "shields" },
  { label: "Evidence", scrollTo: "evidence" },
];

const STEPS = [
  {
    n: "01",
    title: "Deposit FXRP",
    body: "The vault records principal as the protected base. It is not the margin budget for shields.",
    metric: "principal lane",
  },
  {
    n: "02",
    title: "Accrue yield",
    body: "Yield becomes a separate risk budget. The MVP proves the accounting invariant before adding production adapters.",
    metric: "yield lane",
  },
  {
    n: "03",
    title: "Open shields",
    body: "Shield positions can spend yield budget only. Losing shields settle without reducing principal accounting.",
    metric: "signal lane",
  },
];

function RevealLayer({
  image,
  cursorX,
  cursorY,
}: {
  image: string;
  cursorX: number;
  cursorY: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const reveal = revealRef.current;
    if (!canvas || !reveal) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const gradient = ctx.createRadialGradient(
      cursorX,
      cursorY,
      0,
      cursorX,
      cursorY,
      SPOTLIGHT_R
    );
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.42, "rgba(255,255,255,1)");
    gradient.addColorStop(0.62, "rgba(255,255,255,0.72)");
    gradient.addColorStop(0.78, "rgba(255,255,255,0.34)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(cursorX, cursorY, SPOTLIGHT_R, 0, Math.PI * 2);
    ctx.fill();

    const url = canvas.toDataURL();
    reveal.style.maskImage = `url(${url})`;
    reveal.style.webkitMaskImage = `url(${url})`;
    reveal.style.maskSize = "100% 100%";
    reveal.style.webkitMaskSize = "100% 100%";
  }, [cursorX, cursorY]);

  return (
    <>
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 hidden" />
      <div
        ref={revealRef}
        className="pointer-events-none absolute inset-0 z-30 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${image})` }}
      />
    </>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const { ready, authenticated, login } = usePrivy();
  const [menuOpen, setMenuOpen] = useState(false);
  const [appLaunchPending, setAppLaunchPending] = useState(false);
  const mouse = useRef({ x: -999, y: -999 });
  const smooth = useRef({ x: -999, y: -999 });
  const rafRef = useRef<number>(0);
  const [cursorPos, setCursorPos] = useState({ x: -999, y: -999 });

  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      mouse.current = { x: event.clientX, y: event.clientY };
    };
    window.addEventListener("mousemove", onMove);

    const loop = () => {
      smooth.current.x += (mouse.current.x - smooth.current.x) * 0.1;
      smooth.current.y += (mouse.current.y - smooth.current.y) * 0.1;
      setCursorPos({ x: smooth.current.x, y: smooth.current.y });
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const openApp = useCallback(async () => {
    setMenuOpen(false);

    if (authenticated) {
      router.push("/app");
      return;
    }

    if (!ready || appLaunchPending) return;

    setAppLaunchPending(true);
    try {
      await login();
    } catch {
      setAppLaunchPending(false);
    }
  }, [appLaunchPending, authenticated, login, ready, router]);

  useEffect(() => {
    if (!appLaunchPending || !authenticated) return;
    router.push("/app");
  }, [appLaunchPending, authenticated, router]);

  const handleNav = useCallback((scrollTo: string) => {
    setMenuOpen(false);
    document.getElementById(scrollTo)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <main className="min-h-dvh overflow-x-clip bg-black text-white">
      <nav className="fixed left-0 right-0 top-0 z-[100] flex items-center justify-between p-4 sm:p-5">
        <button onClick={() => router.push("/")} className="flex items-center gap-2.5">
          <Image src="/lumenshield-mark.svg" alt="" width={30} height={30} />
          <span className="font-unbounded text-lg font-semibold text-white">
            LumenShield
          </span>
        </button>

        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full border border-white/20 bg-white/10 px-2 py-2 backdrop-blur-md md:flex">
          {NAV_LINKS.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNav(link.scrollTo)}
              className="rounded-full px-4 py-1.5 text-sm font-medium text-white/75 transition-colors hover:bg-white/15 hover:text-white"
            >
              {link.label}
            </button>
          ))}
        </div>

        <button
          onClick={openApp}
          disabled={!ready || appLaunchPending}
          className="hidden rounded-full bg-[var(--ls-accent)] px-6 py-2.5 text-sm font-semibold text-black transition-transform hover:scale-[1.03] active:scale-95 disabled:opacity-60 md:flex"
          style={{ boxShadow: `0 8px 24px -8px ${ACCENT}88` }}
        >
          {appLaunchPending ? "Connecting..." : "Launch app"}
        </button>

        <button
          onClick={() => setMenuOpen((open) => !open)}
          className="p-2 text-white md:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 z-[98] bg-black/60 backdrop-blur-sm transition-opacity md:hidden ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <div
        className={`fixed right-0 top-0 z-[99] flex h-dvh w-[78%] max-w-xs flex-col border-l border-white/10 bg-[#090b11] px-6 pb-8 pt-24 transition-transform duration-300 ease-out md:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNav(link.scrollTo)}
              className="rounded-lg px-2 py-3 text-left text-lg font-medium text-white/70 hover:bg-white/5 hover:text-white"
            >
              {link.label}
            </button>
          ))}
        </div>
        <button
          onClick={openApp}
          disabled={!ready || appLaunchPending}
          className="mt-auto rounded-full bg-[var(--ls-accent)] px-7 py-3.5 text-base font-semibold text-black disabled:opacity-60"
        >
          {appLaunchPending ? "Connecting..." : "Launch app"}
        </button>
      </div>

      <section className="relative h-dvh w-full overflow-hidden bg-black">
        <div
          className="hero-zoom absolute inset-0 z-10 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${BG_IMAGE_1})` }}
        />
        <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-b from-black/60 via-black/28 to-black/85" />
        <RevealLayer image={BG_IMAGE_2} cursorX={cursorPos.x} cursorY={cursorPos.y} />
        <div
          className="pointer-events-none absolute inset-0 z-40"
          style={{
            background:
              "radial-gradient(ellipse 58% 52% at 50% 48%, rgba(0,0,0,0.76) 0%, rgba(0,0,0,0.48) 45%, transparent 78%)",
          }}
        />

        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center px-5 text-center">
          <div
            className="hero-anim hero-fade pointer-events-none mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-md"
            style={{ animationDelay: "0.1s" }}
          >
            <span className="h-2 w-2 rounded-full bg-[var(--ls-accent)]" />
            <span className="text-xs font-medium tracking-wide text-white/85">
              FXRP principal vaults for Flare
            </span>
          </div>

          <h1 className="pointer-events-none leading-[0.95] text-white">
            <span
              className="hero-anim hero-reveal block font-unbounded text-5xl font-semibold sm:text-7xl md:text-8xl"
              style={{ letterSpacing: "-0.05em", animationDelay: "0.25s" }}
            >
              Principal stays.
            </span>
            <span
              className="hero-anim hero-reveal block font-unbounded text-5xl font-semibold sm:text-7xl md:text-8xl"
              style={{ letterSpacing: "-0.06em", animationDelay: "0.42s" }}
            >
              Yield signals.
            </span>
          </h1>

          <p
            className="hero-anim hero-fade pointer-events-none mt-7 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg"
            style={{ animationDelay: "0.62s" }}
          >
            A Flare-native vault where FXRP principal is isolated in
            vault accounting and only earned yield can fund shield positions.
          </p>

          <div
            className="hero-anim hero-fade mt-9 flex flex-col items-center gap-4"
            style={{ animationDelay: "0.78s" }}
          >
            <button
              onClick={openApp}
              disabled={!ready || appLaunchPending}
              className="rounded-full bg-[var(--ls-accent)] px-9 py-4 text-base font-semibold text-black transition-transform hover:scale-[1.04] active:scale-95 disabled:opacity-60"
              style={{ boxShadow: `0 16px 44px -10px ${ACCENT}aa` }}
            >
              {appLaunchPending ? "Connecting..." : "Open Coston2 vault"}
            </button>
            <button
              onClick={() => handleNav("mechanism")}
              className="text-sm font-medium text-white/65 transition-colors hover:text-white"
            >
              or see how the vault works
            </button>
          </div>

          <div
            className="hero-anim hero-fade mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-white/60 sm:text-sm"
            style={{ animationDelay: "0.92s" }}
          >
            {["Coston2 target", "Yield-only shield risk", "No FCC claim unless built"].map((text) => (
              <span key={text} className="inline-flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-[var(--ls-accent)]" />
                {text}
              </span>
            ))}
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-6 left-0 right-0 z-50 hidden justify-center sm:flex">
          <span className="text-[11px] tracking-wide text-white/45">
            move your cursor to reveal the protected vault
          </span>
        </div>
      </section>

      <section id="mechanism" className="mx-auto max-w-7xl px-5 py-28">
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <h2 className="font-unbounded text-4xl font-semibold leading-tight tracking-[-0.03em]">
              The product is the separation.
            </h2>
            <p className="mt-5 text-base leading-7 text-white/58">
              LumenShield does not call markets safe. It makes the risk budget
              visible and bounded: principal sits in one lane, yield moves in another.
            </p>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-3">
            {STEPS.map((step, index) => (
              <motion.article
                key={step.n}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group rounded-lg border border-white/10 bg-white/[0.035] p-6 transition-colors hover:border-white/20 hover:bg-white/[0.055]"
              >
                <p className="font-mono text-sm text-[var(--ls-accent)]">{step.n}</p>
                <div className="my-6 h-24 rounded-md border border-white/10 bg-black/25 p-4">
                  <div className="h-2 rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-[var(--ls-accent)]"
                      style={{ width: `${38 + index * 24}%` }}
                    />
                  </div>
                  <p className="mt-5 font-mono text-xs text-white/48">{step.metric}</p>
                </div>
                <h3 className="font-unbounded text-lg font-semibold">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/55">{step.body}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="flare-proof" className="border-y border-white/10 bg-white/[0.025]">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-28 lg:grid-cols-[1fr_1.1fr]">
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <h2 className="font-unbounded text-4xl font-semibold leading-tight tracking-[-0.03em]">
              Built around Coston2, not painted over later.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/58">
              The current MVP proves vault accounting in Solidity and keeps FAssets,
              FTSOv2, and FDC boundaries visible instead of claiming integrations
              that are not yet live.
            </p>
            <p className="mt-6 rounded-lg border border-white/10 bg-black/25 p-4 font-mono text-xs leading-6 text-white/52">
              {COSTON2.rpcUrl}
            </p>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2">
            {FLARE_EVIDENCE.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.45 }}
                className="rounded-lg border border-white/10 bg-[var(--ls-bg)] p-6"
              >
                <DatabaseZap size={20} className="text-[var(--ls-accent)]" />
                <p className="mt-6 text-sm text-white/48">{item.label}</p>
                <p className="mt-1 font-unbounded text-lg font-semibold">{item.value}</p>
                <p className="mt-3 text-sm leading-6 text-white/52">{item.detail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="shields" className="mx-auto max-w-7xl px-5 py-28">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mb-10 max-w-3xl"
        >
          <h2 className="font-unbounded text-4xl font-semibold leading-tight tracking-[-0.03em]">
            Every shield starts with the same constraint: yield only.
          </h2>
        </motion.div>
        <div className="grid gap-4 md:grid-cols-2">
          {SHIELD_PRODUCTS.map((shield, index) => (
            <motion.article
              key={shield.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.45 }}
              className="rounded-lg border border-white/10 bg-white/[0.035] p-6"
            >
              <div className="flex items-start justify-between gap-5">
                <div>
                  <h3 className="font-unbounded text-xl font-semibold">{shield.name}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/55">{shield.description}</p>
                </div>
                <BadgeCheck className="text-[var(--ls-primary)]" />
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3 rounded-md border border-white/10 bg-black/25 p-4 font-mono text-xs text-white/58">
                <span>{shield.asset}</span>
                <span>{shield.leverage}</span>
                <span>{shield.budget}</span>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section id="evidence" className="mx-auto max-w-7xl px-5 pb-28">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="rounded-lg border border-white/10 bg-[var(--ls-surface)] p-8 md:p-12"
        >
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="mb-4 font-mono text-xs uppercase tracking-[0.24em] text-[var(--ls-accent)]">
                Evidence
              </p>
              <h2 className="font-unbounded text-3xl font-semibold leading-tight">
                Deployed contracts, live reads, and boundaries are visible.
              </h2>
              <p className="mt-5 text-base leading-7 text-white/58">
                The repo history shows the Flare product plan, brand system,
                Solidity contracts, Coston2 deployment, and submission evidence.
              </p>
              <button
                onClick={openApp}
                disabled={!ready || appLaunchPending}
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--ls-primary)] px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
              >
                {appLaunchPending ? "Connecting..." : "Inspect workbench"} <ArrowRight size={16} />
              </button>
            </div>
            <div className="grid gap-3">
              {[
                ["Foundry tests", "7 passed, 0 failed"],
                ["Next build", "compiled successfully"],
                ["Primary bounty", "Interoperable Asset Products"],
                ["Claims boundary", "FCC and FDC not claimed until built"],
              ].map(([label, value]) => (
                <div key={label} className="grid grid-cols-[0.8fr_1.2fr] gap-4 rounded-md border border-white/10 bg-black/20 p-4">
                  <p className="text-sm text-white/45">{label}</p>
                  <p className="font-mono text-sm text-white/78">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      <footer className="border-t border-white/10 px-5 py-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 text-sm text-white/42 md:flex-row">
          <span>LumenShield</span>
          <span>Coston2 prototype · no risk-free yield claims · built for Flare Summer Signal</span>
        </div>
      </footer>
    </main>
  );
}
