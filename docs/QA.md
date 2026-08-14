# LumenShield QA Checklist

Use this checklist before demo handoff, submission edits, or final integration. The goal is to verify that LumenShield presents the finished product honestly: a Flare/Coston2-oriented prototype with a Solidity invariant for principal and yield separation, not a production vault or live FDC/FTSO/FAssets integration.

## Quick Setup

```bash
cd /Users/rohitpurkait/Documents/Codex/2026-08-14/https-dorahacks-io-hackathon-flaresummersignal-detail/work/lumenshield
npm install
```

Run the local app:

```bash
npm run dev
```

Default local URL:

```text
http://localhost:3000
```

## Automated Checks

Run these from the repository root before a demo or submission package:

```bash
forge test
npm run lint
npm run build
```

Expected results:

- `forge test` passes all vault tests in `test/LumenShieldVault.t.sol`.
- `npm run lint` completes without errors.
- `npm run build` completes successfully and all listed routes compile.

Contract tests that must remain covered:

- `testDepositTracksPrincipalOnly`
- `testAdminFundedYieldCredit`
- `testSimulatedYieldAccrual`
- `testOpenShieldConsumesYieldBudgetNeverPrincipal`
- `testCannotOpenShieldFromPrincipal`
- `testSettleLosingShieldAndWithdrawPrincipalAfterLoss`

## Route Checklist

### `/`

Purpose: public landing page.

Check:

- Hero says `Protect the principal. Send only the yield.`
- Submission chip says `Flare Summer Signal` and `Bounty 1`.
- Copy frames the product as a Flare-native FXRP vault.
- Mechanism cards show principal, yield budget, and XRP/USD signal lanes.
- Flare proof section includes Coston2, FXRP, FTSOv2 path, and FDC roadmap.
- Footer includes `Coston2 prototype` and `no risk-free yield claims`.
- `Launch demo`, `Open vault demo`, and `Enter the workbench` navigate to `/app`.

### `/app`

Purpose: Coston2 vault workbench.

Check:

- Header says `FXRP principal protected vault`.
- Dashboard describes demo mode, Coston2 network, FXRP principal, yield-only shields, and judge-readable evidence.
- Metrics show:
  - `Principal protected`: `1,000 FXRP`
  - `Yield available`: `12.84 FXRP`
  - `Shield margin used`: `3.36 FXRP`
  - `Network`: `Coston2`, `chainId 114`, `C2FLR`
- Vault separation section repeats the core invariant: shield PnL never reaches principal accounting.
- Submission invariants include `Principal accounting`, `Yield risk budget`, `Primary bounty`, and `FCC claim`.
- `FCC claim` is shown as `Not claimed`.
- Demo wallet link opens a Coston2 explorer address in a new tab.

### `/app/shields`

Purpose: yield-only shield catalog.

Check:

- Header says `Open a shield without touching principal.`
- Copy says shields can spend yield budget, not principal balance.
- Shield cards render:
  - `XRP Signal Shield`
  - `BTC Momentum Shield`
  - `ETH Volatility Shield`
  - `FLR Native Shield`
- Each card shows asset, leverage, and `Yield only`.
- `Preview shield` buttons do not imply live contract execution unless later wired.

### `/app/badges`

Purpose: judge evidence page, replacing the older badge concept.

Check:

- Header says `What is new, what is proven, what is roadmap.`
- Supporting copy says this page is an audit path through new work, Flare fit, and honest limitations.
- Flare integration map shows:
  - `Network`: `Coston2`, `chainId 114`
  - `Primary asset`: `FXRP`
  - `Pricing`: `FTSOv2 path`
  - `Proof roadmap`: `FDC`
- Evidence checklist includes original baseline, new product plan, brand system, contract proof, and Coston2 network target.

### `/app/leaderboard`

Purpose: submission readiness board.

Check:

- Header says `Score the build like a judge.`
- Copy maps the board to Flare Summer Signal judging criteria.
- Readiness rows include product usefulness, Flare integration, technical execution, new work evidence, and future potential.
- Future potential mentions FDC proof path and real yield adapters as documented future work.

### `/app/position/[id]`

Purpose: honest placeholder for future shield receipts.

Suggested manual URL:

```text
http://localhost:3000/app/position/demo
```

Check:

- Page says `Position detail placeholder`.
- Main headline says shield receipts come after contract integration.
- Copy says the future page will show shield ID, market, stake, settlement status, transaction hash, and explorer links after Coston2 vault deployment is wired to the frontend.
- Back link returns to `/app/shields`.

## Expected Flare/Coston2 Copy

These values should remain consistent across the app and docs:

- Network name: `Flare Testnet Coston2`
- Short network label: `Coston2`
- Chain ID: `114`
- Native currency: `C2FLR`
- RPC: `https://coston2-api.flare.network/ext/C/rpc`
- Explorer: `https://coston2-explorer.flare.network`
- Primary bounty: `Interoperable Asset Products`
- Primary asset framing: `FXRP` and `FAssets`
- Pricing language: `FTSOv2 path`, `XRP/USD valuation`, or clearly future-tense adapter language.
- Proof language: `FDC roadmap`, `FDC proof path`, or `XRPL payment attestations when enabled`.
- Confidential Compute claim: `Not claimed`.

## Claims Boundary Checks

Fail QA if the app, README, docs, or submission copy claims or implies any of the following before the underlying implementation exists:

- Risk-free yield.
- Guaranteed protection against all smart contract, market, oracle, bridge, or adapter risks.
- Audited contracts.
- Flare mainnet readiness.
- Live Confidential Compute support.
- Live FDC proof verification.
- Live FTSOv2 contract reads.
- Live FXRP or FAsset deposits through an adapter.
- Real production yield generation.
- A deployed Coston2 vault address, unless the address and explorer link are present.

Acceptable current claim:

```text
LumenShield is a Coston2-oriented prototype and Solidity proof that principal and yield budgets are separated, with the product path designed around FXRP/FAssets, FTSOv2 valuation, and future FDC proof flows.
```

## Manual Browser Checks

Desktop:

- Open `http://localhost:3000`.
- Verify the landing page has no horizontal scroll at common desktop widths.
- Navigate through every landing CTA.
- Open every sidebar route in `/app`.
- Confirm active sidebar state matches the current route.
- Confirm cards and metric text do not overlap or truncate awkwardly.
- Confirm the Coston2 explorer link opens in a new tab.

Mobile:

- Test a narrow viewport around 390px wide.
- Confirm the bottom nav is visible and usable.
- Tap Home, Shields, Badges, and Ranks.
- Confirm the app content is not hidden behind the bottom nav.
- Confirm hero and dashboard text wraps cleanly.

Interaction and honesty:

- Click `Preview shield` on `/app/shields`; it should not present a fake transaction success path.
- Visit `/app/position/demo`; verify it is clearly a placeholder.
- Scan all visible copy for absolute safety language such as `guaranteed`, `risk-free`, `mainnet ready`, or `audited`.
- If new integrations are added, require transaction hashes, addresses, or source evidence before upgrading roadmap language to live language.

## Handoff Notes

Before final submission, update `docs/EVIDENCE.md` and this QA file only if new evidence is real and reproducible:

- Hosted demo URL.
- Coston2 deployment transaction hash.
- Coston2 contract address and explorer link.
- FTSOv2 read proof or adapter transaction.
- FDC attestation proof.
- Updated automated check results.
