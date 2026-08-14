"use client";

import { usePrivy } from "@privy-io/react-auth";
import { ArrowUpRight, CheckCircle2, Loader2, PlugZap } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { formatEther, formatUnits, parseUnits } from "viem";
import {
  useAccount,
  useBalance,
  useReadContract,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { COSTON2, explorerTx, truncateAddress } from "@/lib/flare";
import { addresses, erc20Abi, lumenShieldVaultAbi } from "@/lib/contracts";

const FAUCET_URL = "https://faucet.flare.network/";
const FXRP_DECIMALS = 6;

export default function VaultActionsPanel() {
  const { ready, authenticated, login, logout, user } = usePrivy();
  const { address, chainId, isConnected } = useAccount();
  const { switchChainAsync, isPending: isSwitching } = useSwitchChain();
  const { writeContractAsync, isPending: isWriting } = useWriteContract();
  const [amount, setAmount] = useState("1");
  const [lastHash, setLastHash] = useState<`0x${string}` | undefined>();
  const [status, setStatus] = useState<string>();
  const [error, setError] = useState<string>();

  const parsedAmount = useMemo(() => {
    try {
      return parseUnits(amount || "0", FXRP_DECIMALS);
    } catch {
      return 0n;
    }
  }, [amount]);

  const wrongNetwork = Boolean(isConnected && chainId !== COSTON2.chainId);

  const nativeBalance = useBalance({
    address,
    chainId: COSTON2.chainId,
    query: { enabled: Boolean(address) },
  });

  const fxrpBalance = useReadContract({
    address: addresses.fxrp,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: Boolean(address) },
  });

  const allowance = useReadContract({
    address: addresses.fxrp,
    abi: erc20Abi,
    functionName: "allowance",
    args: address ? [address, addresses.vault] : undefined,
    query: { enabled: Boolean(address) },
  });

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

  const txReceipt = useWaitForTransactionReceipt({
    hash: lastHash,
    chainId: COSTON2.chainId,
    query: { enabled: Boolean(lastHash) },
  });

  const hasAllowance = (allowance.data ?? 0n) >= parsedAmount && parsedAmount > 0n;
  const hasFxrp = (fxrpBalance.data ?? 0n) >= parsedAmount && parsedAmount > 0n;

  const refreshReads = useCallback(async () => {
    await Promise.all([
      nativeBalance.refetch(),
      fxrpBalance.refetch(),
      allowance.refetch(),
      principal.refetch(),
      yieldBudget.refetch(),
    ]);
  }, [allowance, fxrpBalance, nativeBalance, principal, yieldBudget]);

  async function ensureCoston2() {
    if (!isConnected || chainId === COSTON2.chainId) return;
    setStatus("Switching wallet to Coston2...");
    await switchChainAsync({ chainId: COSTON2.chainId });
  }

  async function approveFxrp() {
    setError(undefined);
    try {
      await ensureCoston2();
      setStatus("Approving FXRP for the deployed vault...");
      const hash = await writeContractAsync({
        address: addresses.fxrp,
        abi: erc20Abi,
        functionName: "approve",
        args: [addresses.vault, parsedAmount],
        chainId: COSTON2.chainId,
      });
      setLastHash(hash);
      setStatus("Approval submitted. Waiting for Coston2 confirmation...");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Approval failed");
      setStatus(undefined);
    }
  }

  async function depositFxrp() {
    setError(undefined);
    try {
      await ensureCoston2();
      setStatus("Depositing FXRP into the deployed vault...");
      const hash = await writeContractAsync({
        address: addresses.vault,
        abi: lumenShieldVaultAbi,
        functionName: "deposit",
        args: [parsedAmount],
        chainId: COSTON2.chainId,
      });
      setLastHash(hash);
      setStatus("Deposit submitted. Waiting for Coston2 confirmation...");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Deposit failed");
      setStatus(undefined);
    }
  }

  useEffect(() => {
    if (!txReceipt.isSuccess || !status?.includes("Waiting")) return;

    setStatus("Transaction confirmed on Coston2.");
    void refreshReads();
  }, [refreshReads, status, txReceipt.isSuccess]);

  return (
    <section className="mt-6 rounded-lg border border-white/10 bg-[var(--ls-surface)] p-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ls-accent)]">
            <PlugZap size={14} />
            Privy wallet
          </p>
          <h2 className="mt-4 font-unbounded text-xl font-semibold">Test the deployed vault</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--ls-muted)]">
            Connect with Privy, switch to Coston2, approve FXRP, and deposit into the live
            LumenShield vault. Judges can use the official Flare faucet for C2FLR gas and FXRP.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href={FAUCET_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-white/72"
          >
            Flare faucet <ArrowUpRight size={14} />
          </a>
          {authenticated ? (
            <button
              onClick={logout}
              className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white"
            >
              Disconnect
            </button>
          ) : (
            <button
              disabled={!ready}
              onClick={login}
              className="rounded-full bg-[var(--ls-accent)] px-5 py-2 text-sm font-semibold text-black disabled:opacity-50"
            >
              Connect wallet
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <StateCard label="Wallet" value={address ? truncateAddress(address) : "Not connected"} />
        <StateCard label="Auth" value={authenticated ? user?.wallet?.walletClientType ?? "Privy connected" : "Waiting"} />
        <StateCard label="Network" value={chainId ? `${chainId}` : "No chain"} detail={wrongNetwork ? "Switch required" : "Coston2"} />
        <StateCard label="C2FLR gas" value={nativeBalance.data ? formatNumber(formatEther(nativeBalance.data.value)) : "0"} />
        <StateCard label="FXRP wallet" value={formatToken(fxrpBalance.data)} />
        <StateCard label="FXRP allowance" value={formatToken(allowance.data)} />
        <StateCard label="Vault principal" value={formatToken(principal.data)} />
        <StateCard label="Yield budget" value={formatToken(yieldBudget.data)} />
      </div>

      <div className="mt-6 grid gap-4 rounded-md border border-white/10 bg-black/20 p-4 lg:grid-cols-[1fr_auto] lg:items-end">
        <label className="block">
          <span className="text-sm text-[var(--ls-muted)]">FXRP amount</span>
          <input
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            inputMode="decimal"
            className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-4 py-3 font-mono text-lg text-white outline-none transition-colors focus:border-[var(--ls-accent)]"
          />
        </label>
        <div className="flex flex-wrap gap-3">
          {wrongNetwork && (
            <button
              onClick={() => void ensureCoston2()}
              disabled={isSwitching}
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black disabled:opacity-50"
            >
              {isSwitching && <Loader2 size={15} className="animate-spin" />}
              Switch to Coston2
            </button>
          )}
          <button
            onClick={() => void approveFxrp()}
            disabled={!authenticated || wrongNetwork || parsedAmount === 0n || isWriting || hasAllowance}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white disabled:opacity-40"
          >
            {hasAllowance ? <CheckCircle2 size={15} /> : null}
            Approve FXRP
          </button>
          <button
            onClick={() => void depositFxrp()}
            disabled={!authenticated || wrongNetwork || !hasAllowance || !hasFxrp || isWriting}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--ls-primary)] px-5 py-3 text-sm font-semibold text-white disabled:opacity-40"
          >
            {isWriting && <Loader2 size={15} className="animate-spin" />}
            Deposit to vault
          </button>
        </div>
      </div>

      {(status || error || lastHash) && (
        <div className="mt-4 rounded-md border border-white/10 bg-black/20 p-4 text-sm">
          {status && <p className="text-white/78">{status}</p>}
          {error && <p className="mt-2 break-words text-red-300">{error}</p>}
          {lastHash && (
            <a
              href={explorerTx(lastHash)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-2 font-mono text-xs text-[var(--ls-accent)]"
            >
              {truncateAddress(lastHash)} <ArrowUpRight size={13} />
            </a>
          )}
        </div>
      )}
    </section>
  );
}

function StateCard({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <div className="rounded-md border border-white/10 bg-black/20 p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-white/35">{label}</p>
      <p className="mt-3 break-words font-mono text-sm text-white/82">{value}</p>
      {detail && <p className="mt-1 text-xs text-[var(--ls-muted)]">{detail}</p>}
    </div>
  );
}

function formatToken(value?: bigint) {
  return value === undefined ? "0" : `${formatNumber(formatUnits(value, FXRP_DECIMALS))} FXRP`;
}

function formatNumber(value: string) {
  const number = Number(value);
  if (!Number.isFinite(number)) return value;
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 6,
  }).format(number);
}
