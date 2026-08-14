import {
  iAssetManagerAbi,
  iFlareContractRegistryAbi,
} from "@flarenetwork/flare-wagmi-periphery-package/contracts/coston2";
import { createPublicClient, defineChain, formatUnits, http, type Address } from "viem";
import {
  COSTON2,
  FLARE_CONTRACT_REGISTRY,
  LUMENSHIELD_VAULT_ADDRESS,
  XRP_USD_FEED_ID,
} from "@/lib/flare";

const coston2Chain = defineChain({
  id: COSTON2.chainId,
  name: COSTON2.name,
  nativeCurrency: {
    decimals: 18,
    name: COSTON2.nativeCurrency,
    symbol: COSTON2.nativeCurrency,
  },
  rpcUrls: {
    default: {
      http: [COSTON2.rpcUrl],
    },
  },
  blockExplorers: {
    default: {
      name: "Coston2 Explorer",
      url: COSTON2.explorerUrl,
    },
  },
});

const publicClient = createPublicClient({
  chain: coston2Chain,
  transport: http(COSTON2.rpcUrl),
});

const ftsoV2ReadAbi = [
  {
    type: "function",
    name: "getFeedById",
    stateMutability: "view",
    inputs: [{ name: "_feedId", type: "bytes21" }],
    outputs: [
      { name: "_value", type: "uint256" },
      { name: "_decimals", type: "int8" },
      { name: "_timestamp", type: "uint64" },
    ],
  },
] as const;

const lumenShieldVaultReadAbi = [
  {
    type: "function",
    name: "owner",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "address" }],
  },
  {
    type: "function",
    name: "asset",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "address" }],
  },
  {
    type: "function",
    name: "priceOracle",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "address" }],
  },
  {
    type: "function",
    name: "nextShieldId",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
] as const;

export type FlareLiveSnapshot = {
  ok: boolean;
  blockNumber?: string;
  assetManagerFXRP?: Address;
  fxrpAddress?: Address;
  lotSizeFXRP?: string;
  assetDecimals?: string;
  ftsoV2?: Address;
  xrpUsd?: string;
  priceTimestamp?: string;
  vaultAddress?: Address;
  vaultOwner?: Address;
  vaultAsset?: Address;
  vaultOracle?: Address;
  nextShieldId?: string;
  error?: string;
};

export async function getFlareLiveSnapshot(): Promise<FlareLiveSnapshot> {
  try {
    const vaultAddress = LUMENSHIELD_VAULT_ADDRESS as Address;
    const [blockNumber, assetManagerFXRP, ftsoV2] = await Promise.all([
      publicClient.getBlockNumber(),
      publicClient.readContract({
        address: FLARE_CONTRACT_REGISTRY,
        abi: iFlareContractRegistryAbi,
        functionName: "getContractAddressByName",
        args: ["AssetManagerFXRP"],
      }),
      publicClient.readContract({
        address: FLARE_CONTRACT_REGISTRY,
        abi: iFlareContractRegistryAbi,
        functionName: "getContractAddressByName",
        args: ["FtsoV2"],
      }),
    ]);

    const [fxrpAddress, settings, price] = await Promise.all([
      publicClient.readContract({
        address: assetManagerFXRP,
        abi: iAssetManagerAbi,
        functionName: "fAsset",
      }),
      publicClient.readContract({
        address: assetManagerFXRP,
        abi: iAssetManagerAbi,
        functionName: "getSettings",
      }),
      publicClient.readContract({
        address: ftsoV2,
        abi: ftsoV2ReadAbi,
        functionName: "getFeedById",
        args: [XRP_USD_FEED_ID],
      }),
    ]);

    const [vaultOwner, vaultAsset, vaultOracle, nextShieldId] = await Promise.all([
      publicClient.readContract({
        address: vaultAddress,
        abi: lumenShieldVaultReadAbi,
        functionName: "owner",
      }),
      publicClient.readContract({
        address: vaultAddress,
        abi: lumenShieldVaultReadAbi,
        functionName: "asset",
      }),
      publicClient.readContract({
        address: vaultAddress,
        abi: lumenShieldVaultReadAbi,
        functionName: "priceOracle",
      }),
      publicClient.readContract({
        address: vaultAddress,
        abi: lumenShieldVaultReadAbi,
        functionName: "nextShieldId",
      }),
    ]);

    const assetDecimals = Number(settings.assetDecimals);
    const priceValue = price[0];
    const priceDecimals = Number(price[1]);

    return {
      ok: true,
      blockNumber: blockNumber.toString(),
      assetManagerFXRP,
      fxrpAddress,
      lotSizeFXRP: formatUnits(settings.lotSizeAMG, assetDecimals),
      assetDecimals: settings.assetDecimals.toString(),
      ftsoV2,
      xrpUsd: formatOracleValue(priceValue, priceDecimals),
      priceTimestamp: price[2].toString(),
      vaultAddress,
      vaultOwner,
      vaultAsset,
      vaultOracle,
      nextShieldId: nextShieldId.toString(),
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Unknown Coston2 read failure",
    };
  }
}

function formatOracleValue(value: bigint, decimals: number) {
  if (decimals >= 0) {
    return formatUnits(value, decimals);
  }

  return (value * BigInt(10) ** BigInt(Math.abs(decimals))).toString();
}
