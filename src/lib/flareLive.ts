import {
  iAssetManagerAbi,
  iFlareContractRegistryAbi,
} from "@flarenetwork/flare-wagmi-periphery-package/contracts/coston2";
import { createPublicClient, defineChain, formatUnits, http, type Address } from "viem";
import { COSTON2, FLARE_CONTRACT_REGISTRY, XRP_USD_FEED_ID } from "@/lib/flare";

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
  error?: string;
};

export async function getFlareLiveSnapshot(): Promise<FlareLiveSnapshot> {
  try {
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
