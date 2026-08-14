export const COSTON2 = {
  name: "Flare Testnet Coston2",
  chainId: 114,
  rpcUrl: "https://coston2-api.flare.network/ext/C/rpc",
  explorerUrl: "https://coston2-explorer.flare.network",
  systemsExplorerUrl: "https://coston2-systems-explorer.flare.network",
  nativeCurrency: "C2FLR",
};

export const FLARE_CONTRACT_REGISTRY = "0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019";
export const COSTON2_FXRP_ADDRESS = "0x0b6A3645c240605887a5532109323A3E12273dc7";
export const XRP_USD_FEED_ID = "0x015852502f55534400000000000000000000000000";

export const DEMO_WALLET = "0x8f2A1a0F0f7f84680f2D7Db84b9965dD4ed1f7E1";

export const FLARE_EVIDENCE = [
  {
    label: "Network",
    value: "Coston2",
    detail: "chainId 114",
  },
  {
    label: "Primary asset",
    value: "FXRP",
    detail: "FAssets-centered vault model",
  },
  {
    label: "Pricing",
    value: "FTSOv2 path",
    detail: "XRP/USD valuation and stale-feed gate",
  },
  {
    label: "Proof roadmap",
    value: "FDC",
    detail: "XRPL payment attestations when enabled",
  },
];

export const SHIELD_PRODUCTS = [
  {
    id: "xrp-signal",
    name: "XRP Signal Shield",
    asset: "XRP/USD",
    leverage: "1.5x",
    budget: "Yield only",
    status: "Ready for Coston2 contract path",
    description:
      "Uses earned vault yield as the only risk budget for XRP-side upside exposure.",
  },
  {
    id: "btc-momentum",
    name: "BTC Momentum Shield",
    asset: "BTC/USD",
    leverage: "1x",
    budget: "Yield only",
    status: "FTSO price adapter planned",
    description:
      "Conservative momentum exposure with principal isolated from shield PnL.",
  },
  {
    id: "eth-volatility",
    name: "ETH Volatility Shield",
    asset: "ETH/USD",
    leverage: "2x",
    budget: "Yield only",
    status: "Demo route",
    description:
      "A higher-volatility shield for users who accept yield-budget drawdown.",
  },
  {
    id: "flr-native",
    name: "FLR Native Shield",
    asset: "FLR/USD",
    leverage: "1x",
    budget: "Yield only",
    status: "Native ecosystem lane",
    description:
      "Keeps the Flare ecosystem visible without making FLR the whole product.",
  },
];

export const DEMO_VAULT = {
  principal: 1_000,
  asset: "FXRP",
  usdValue: 620,
  yieldBudget: 12.84,
  totalYieldEarned: 16.2,
  shieldMarginUsed: 3.36,
  protectedRatio: 100,
};

export function truncateAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function explorerAddress(address: string) {
  return `${COSTON2.explorerUrl}/address/${address}`;
}
