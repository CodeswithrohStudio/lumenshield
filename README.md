# LumenShield

Principal-protected FXRP and FAsset vaults on Flare.

LumenShield is a Flare-native port of the Yoldr product concept: users keep principal isolated in vault accounting while only earned yield can be used as risk capital for higher-upside shield positions.

## Hackathon

- Event: Flare Summer Signal
- Primary bounty: Bounty 1, Interoperable Asset Products
- Target network: Flare Testnet Coston2
- Chain ID: `114`
- RPC: `https://coston2-api.flare.network/ext/C/rpc`
- Explorer: `https://coston2-explorer.flare.network`

## Product Thesis

Most DeFi products ask users to accept principal risk before they can access upside. LumenShield separates the vault into two lanes:

- Principal lane: user principal remains tracked separately and withdrawable in the vault accounting model.
- Yield lane: earned yield becomes the only budget allowed into shield positions.

If a shield wins, yield budget grows. If a shield loses, the loss settles against yield stake and cannot touch the principal balance.

## What Existed Before

This repo started from Yoldr, a Flow-based principal-protected vault product:

- Flow/FCL wallet experience
- Cadence contracts
- Consumer vault UX
- Shield-position concept
- Gamified retention surfaces

That lineage is intentional and visible in the commit history. The hackathon work is the Flare-native product direction, contract module, brand system, and app shell.

## Newly Built For Flare

- LumenShield brand, product plan, and Tastemaker style lock
- Flare/Coston2 landing and dashboard
- Judge-facing evidence and readiness pages
- Foundry Solidity vault module
- Principal/yield separation tests
- Coston2 network configuration constants
- FAssets/FXRP, FTSOv2, and FDC integration boundaries documented honestly

## Current Implementation

The Solidity MVP is intentionally focused on the core invariant:

- Deposits increase `principalBalance`
- Funded or simulated yield increases `yieldBudget`
- `openShield` can spend only `yieldBudget`
- `settleShield` cannot reduce principal
- Users can withdraw principal after a losing shield

The app currently runs as a Coston2-oriented demo shell. It does not claim mainnet readiness, real yield generation, or live FDC proof verification yet.

## Commands

```bash
cd /Users/rohitpurkait/Documents/Codex/2026-08-14/https-dorahacks-io-hackathon-flaresummersignal-detail/work/lumenshield
npm install
npm run dev
```

```bash
forge test
npm run lint
npm run build
```

## Deployment Workflow

Coston2 deployment instructions are in `docs/COSTON2_DEPLOYMENT.md`.

Current deployment status: this repo does not yet contain evidence of a live Coston2 deployment. Add a contract address, deployment transaction, explorer links, and smoke-check outputs before claiming a deployed vault in final submission materials.

## Verification Snapshot

Latest local verification:

- `forge test`: 6 passed, 0 failed
- `npm run lint`: clean
- `npm run build`: clean
- Tastemaker anti-slop scan: passed
- Tastemaker motion audit: no high findings; medium notes remain for intentional marketing-duration motion and scanner false positives

Dependency note: `npm install` currently reports 9 high-severity audit findings inherited from the baseline dependency tree. These have not been remediated yet.

## Important Boundaries

LumenShield does not claim:

- risk-free yield
- guaranteed protection against all smart contract, market, oracle, bridge, or adapter risks
- audited contracts
- Flare mainnet readiness
- live Confidential Compute support
- live FDC proof verification
- real production yield generation

The current claim is narrower: a Coston2-oriented prototype and Solidity proof that principal and yield budgets are separated, with the product path designed around FXRP/FAssets, FTSOv2 valuation, and future FDC proof flows.

## Structure

```text
contracts/
  LumenShieldVault.sol
test/
  LumenShieldVault.t.sol
script/
  DeployLumenShieldVault.s.sol
docs/
  PRODUCT_PLAN.md
  TASK_BREAKDOWN.md
  SUBMISSION_STRATEGY.md
  CONTRACTS.md
  EVIDENCE.md
src/
  app/
  components/
  lib/flare.ts
```

## License

MIT
