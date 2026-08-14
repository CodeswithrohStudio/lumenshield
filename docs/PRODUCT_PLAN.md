# LumenShield Product Plan

## Product Decision

**Name:** LumenShield

**One-liner:** Principal-protected FXRP and FAsset vaults on Flare where principal stays shielded while earned yield funds upside exposure.

**Origin:** LumenShield ports the Yoldr idea from Flow to Flare. The original Yoldr promise remains: users should not need to risk their principal to participate in higher-upside DeFi. The new product must make Flare the core path, not a deployment label.

## Hackathon Fit

Primary bounty: **Bounty 1 - Interoperable Asset Products**

Why this is the right lane:

- Flare is built to unlock DeFi for assets without native smart contracts, starting with XRP through FAssets.
- LumenShield turns FXRP/FAssets into a consumer-safe structured product.
- FTSO pricing and FAssets/FDC evidence can make the vault more credible than a mock price-feed demo.

Secondary bounty: **Bounty 2 - Confidential Compute Apps**

Current decision: roadmap only. Do not submit to this bounty unless a real Flare Confidential Compute path is implemented. A possible privacy feature is private risk-profile scoring for shield selection, but it should not be claimed in the MVP. See `docs/FCC_SCOPE.md`.

## Positioning

Users want DeFi upside, but raw leverage makes principal loss feel unacceptable. LumenShield separates capital into two lanes:

- **Principal lane:** user deposit remains protected in the vault accounting model.
- **Signal lane:** earned yield becomes the only budget used for upside exposure.

If exposure wins, users collect extra upside. If exposure loses, only the earned yield budget absorbs the loss.

## Flare-Native Requirements

The product is Flare-native only if at least two of these are implemented and visible:

- Coston2 deployment with contract addresses and explorer links.
- FXRP or FAsset-centered vault accounting, not generic test tokens only.
- FTSOv2 price feed reads for supported shield assets.
- FDC-backed proof path for relevant external asset/payment state.
- Explicit evidence bundle in the app or README showing chain ID, contract addresses, test transactions, and what was newly built.

## Screen Flow

### Public Landing

Classification: marketing narrative.

Goal: explain the promise quickly and route users into the app.

Sections:

- Hero: "Protect the principal. Send only the yield."
- Mechanism visual: deposit lane, yield lane, shield exposure lane.
- Flare proof: FXRP/FAssets, FTSO, Coston2, FDC roadmap.
- Product flow: deposit, accrue, open shield, settle.
- Close: launch app and review technical evidence.

### App Dashboard

Classification: app shell and data view.

Goal: show vault health, principal, yield budget, active shields, and Flare evidence.

Panels:

- Wallet/network status.
- Principal protected.
- Yield available for shields.
- Shield exposure chart.
- Flare evidence panel with live `AssetManagerFXRP`, FXRP, FTSOv2, and XRP/USD read status.

### Deposit Flow

Classification: transactional form.

Goal: deposit supported asset into the vault.

States:

- Empty wallet or wrong network.
- Amount entry.
- Review and confirm.
- Pending transaction.
- Success receipt.
- Error and retry.

### Shields

Classification: transactional form and data view.

Goal: open yield-funded exposure to supported assets.

Shield types:

- XRP Signal Shield.
- BTC Momentum Shield.
- ETH Volatility Shield.
- FLR Native Shield.

### Evidence

Classification: read and verification.

Goal: help judges verify the Flare integration without hunting.

Content:

- What existed before.
- What was newly built.
- Deployment addresses.
- Transaction hashes.
- Tests and local run commands.
- Known limitations.

## Milestones and Commits

1. **Baseline import**
   - Import original Yoldr code into new repo.
   - Commit: `Import Yoldr product baseline for Flare port`

2. **Product specification**
   - Add product plan, submission plan, and task breakdown.
   - Commit: `Define LumenShield Flare product plan`

3. **Brand lock**
   - Create Tastemaker style lock for LumenShield.
   - Preserve the best Yoldr visual ideas while making the brand Flare-native.
   - Commit: `Establish LumenShield brand system`

4. **Flare app shell**
   - Replace Flow/FCL app naming, copy, navigation, and demo data.
   - Add network/evidence surfaces.
   - Commit: `Port product shell to Flare`

5. **Contracts**
   - Add Solidity vault and shield contracts.
   - Add tests for principal/yield separation.
   - Commit: `Add Flare vault contracts`

6. **Frontend integration**
   - Add EVM wallet/network layer and Coston2 config.
   - Connect contract reads/writes where possible.
   - Commit: `Connect app to Flare Coston2`

7. **Verification and submission**
   - Run lint/build/tests.
   - Record evidence in README.
   - Commit: `Prepare Flare Summer Signal submission`

## Honest Claims Boundary

Allowed in MVP if implemented:

- Principal and yield are separated in contract accounting.
- Shield positions can only consume yield budget.
- The app is ported to Flare/Coston2.
- FTSO/FAssets/FDC are integrated only where actual code and evidence exist.

Not allowed unless implemented:

- Real production yield generation.
- Guaranteed principal protection against all smart contract, market, oracle, or bridge risks.
- Confidential compute support.
- Mainnet readiness.
- Real FAssets custody or redemption beyond tested demo paths.
