import { defineChain } from "viem";
import { COSTON2 } from "@/lib/flare";

export const coston2Chain = defineChain({
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
  testnet: true,
});
