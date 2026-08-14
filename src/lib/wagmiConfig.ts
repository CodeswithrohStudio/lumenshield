"use client";

import { createConfig } from "@privy-io/wagmi";
import { http } from "wagmi";
import { COSTON2 } from "@/lib/flare";
import { coston2Chain } from "@/lib/chains";

export const wagmiConfig = createConfig({
  chains: [coston2Chain],
  transports: {
    [COSTON2.chainId]: http(COSTON2.rpcUrl),
  },
});
