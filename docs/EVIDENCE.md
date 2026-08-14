# LumenShield Evidence

## Repository History

Readable milestone commits:

1. `Import product baseline for Flare port`
2. `Define LumenShield Flare product plan`
3. `Establish LumenShield brand system`
4. `Add Flare vault contracts`
5. `Port product shell to Flare`
6. `Integrate FXRP vault with FTSO pricing`
7. `Surface live Flare FAssets data`
8. `Deploy LumenShield contracts on Coston2`
9. `Add Privy Coston2 wallet actions`

## Flare Requirements Mapping

### Interoperable Asset Products

Status: primary submission path.

Evidence:

- Product and contracts are framed around FXRP/FAssets as the main user-facing asset path.
- Coston2 constants are in `src/lib/flare.ts`.
- Deployed vault: `0x41365634247e7E8CE4d5109057c6356b52930479`
- Deployed FTSO adapter: `0x46930F19B28921cee5b608a6571b65D36502B925`
- Dashboard reads public Coston2 data through `src/lib/flareLive.ts`.
- Live read evidence includes `AssetManagerFXRP`, FXRP token address, FXRP lot size, `FtsoV2`, and XRP/USD.
- Dashboard includes Privy wallet connection, Coston2 switching, FXRP approval, and live `deposit(uint256)` calls to the deployed vault.
- Dashboard includes a vault companion layer that reads connected-wallet `principalBalance` and `yieldBudget` from the deployed vault.
- Solidity vault enforces principal/yield separation for an FXRP/FAsset-style ERC-20.
- `FlareFtsoPriceOracle` resolves `FtsoV2` through Flare Contract Registry.

### Confidential Compute Apps

Status: not claimed.

Reason:

- No Flare Confidential Compute code has been implemented.
- A future private risk-profile or private strategy-selection flow could fit, but submitting to this bounty now would overclaim.
- See `docs/FCC_SCOPE.md`.

## Contract Evidence

File: `contracts/LumenShieldVault.sol`

Core invariant:

- `principalBalance[user]` is separate from `yieldBudget[user]`.
- `openShield` reads a configured FTSO adapter and subtracts only from `yieldBudget`.
- `settleShield` returns or consumes shield stake and never touches `principalBalance`.
- `withdrawPrincipal` uses only `principalBalance`.

Tests:

- `testDepositTracksFAssetPrincipalOnly`
- `testAdminFundedYieldCreditUsesSameAsset`
- `testSimulatedYieldAccrualIsUnfundedDemoState`
- `testOpenShieldConsumesYieldBudgetAndRecordsFtsoEntry`
- `testCannotOpenShieldFromPrincipal`
- `testCannotOpenShieldWithStalePrice`
- `testSettleLosingShieldAndWithdrawPrincipalAfterLoss`

Latest result:

```text
forge test
7 passed; 0 failed; 0 skipped
```

Deployment workflow:

- Coston2 runbook: `docs/COSTON2_DEPLOYMENT.md`
- Current deployment status: deployed and smoke-checked on Coston2
- Vault deployment transaction: `0x93c8f99a45de1d91195dad5995b09584f9bc063a899c8925f17b456ac232bd3f`
- Oracle deployment transaction: `0x672fba6004a5e3e9af0589bf91cd9bf5cb534694694984d7354f694f0963d715`
- Oracle configuration transaction: `0x731470c4203de2a0b7f319765f65511de3f36ecc95a4e3b983074c9b8183cc0d`

## Frontend Evidence

Routes:

- `/`: Flare-native landing page
- `/app`: Coston2 vault dashboard with Privy wallet actions and vault companion progression
- `/app/shields`: yield-only shield products
- `/app/badges`: judge evidence page
- `/app/leaderboard`: judging/readiness board

Live Coston2 read result captured locally:

```json
{
  "block": "34030791",
  "assetManager": "0xc1Ca88b937d0b528842F95d5731ffB586f4fbDFA",
  "fxrp": "0x0b6A3645c240605887a5532109323A3E12273dc7",
  "lotSizeFXRP": "10",
  "assetDecimals": "6",
  "ftso": "0xC4e9c78EA53db782E28f28Fdf80BaF59336B304d",
  "xrpUsd": "1.010483",
  "priceTimestamp": "1786670203"
}
```

Latest result:

```text
npm run lint
clean

npm run build
compiled successfully
```

## Design Evidence

Gamification:

- `src/components/VaultCompanionsPanel.tsx` renders a Codex Pets inspired growth layer.
- Public Codex Pets art assets are stored as `public/pets-codex-icon.png` and `public/pets-codex-pack.png`.
- Growth stage, level, and vitality derive from the same Coston2 vault reads used by the transaction dashboard.

Tastemaker files:

- `.tastemaker/style-lock.md`
- `.tastemaker/reference-board.md`
- `.tastemaker/log.json`
- `.tastemaker/decisions.log`

Latest scan:

```text
anti_slop_scan.py
passed
```

Motion audit:

- No high findings after cleanup.
- Medium notes remain for marketing-duration hero animations and scanner false positives on route files.

## Known Gaps

- No live FDC attestation verification yet.
- Dependency audit currently reports inherited low, high, and critical findings after adding Flare/viem dependencies.
- Privy and wallet connector dependencies increase the browser bundle size for `/app`.

## Verification Checklist

Use this checklist before final submission wording is locked.

### Local Product Checks

- [x] `forge test` passes for principal/yield accounting.
- [x] `npm run lint` completes cleanly.
- [x] `npm run build` completes cleanly.
- [x] README states current implementation boundaries.
- [x] App performs live Coston2 FAssets and FTSOv2 reads.
- [x] App lets judges connect with Privy and submit real Coston2 FXRP approval/deposit transactions.
- [x] App shows vault companion progression from connected-wallet Coston2 vault reads.
- [x] Evidence docs avoid live FDC, FCC, or deployed-vault claims without proof.

### Coston2 Deployment Checks

- [x] Deploy `LumenShieldVault` to Coston2.
- [x] Record deployed vault address.
- [x] Record deployment transaction hash.
- [x] Add Coston2 explorer address and transaction links.
- [x] Run `cast chain-id` and confirm `114`.
- [x] Run `owner()` and confirm the intended owner address.
- [x] Run `nextShieldId()` and confirm fresh contract state.
- [ ] Optionally run a small testnet deposit with a disposable funded wallet.
- [x] Add `NEXT_PUBLIC_LUMENSHIELD_VAULT_ADDRESS` to hosted app environment only after deployment is verified.

### Submission Evidence Checks

- [x] Add hosted demo URL if available.
- [ ] Add screenshots or video walkthrough if available.
- [x] Confirm final public copy says Coston2-deployed only after live Coston2 deployment is evidenced.
- [x] Confirm final public copy treats FTSOv2 as live and FDC/FCC as roadmap unless implemented.

## Next Evidence To Add

- Optional FDC attestation proof if implemented.
- Hosted demo URL.
