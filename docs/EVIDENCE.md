# LumenShield Evidence

## Repository History

Readable milestone commits:

1. `Import Yoldr product baseline for Flare port`
2. `Define LumenShield Flare product plan`
3. `Establish LumenShield brand system`
4. `Add Flare vault contracts`
5. `Port product shell to Flare`

## Flare Requirements Mapping

### Interoperable Asset Products

Status: primary submission path.

Evidence:

- Product is framed around FXRP/FAssets as the main user-facing asset path.
- Coston2 constants are in `src/lib/flare.ts`.
- Dashboard and evidence pages surface Coston2, chain ID `114`, FXRP/FAssets, FTSOv2, and FDC boundaries.
- Solidity vault enforces principal/yield separation.

### Confidential Compute Apps

Status: not claimed.

Reason:

- No Flare Confidential Compute code has been implemented.
- A future private risk-profile or private strategy-selection flow could fit, but submitting to this bounty now would overclaim.

## Contract Evidence

File: `contracts/LumenShieldVault.sol`

Core invariant:

- `principalBalance[user]` is separate from `yieldBudget[user]`.
- `openShield` subtracts only from `yieldBudget`.
- `settleShield` returns or consumes shield stake and never touches `principalBalance`.
- `withdrawPrincipal` uses only `principalBalance`.

Tests:

- `testDepositTracksPrincipalOnly`
- `testAdminFundedYieldCredit`
- `testSimulatedYieldAccrual`
- `testOpenShieldConsumesYieldBudgetNeverPrincipal`
- `testCannotOpenShieldFromPrincipal`
- `testSettleLosingShieldAndWithdrawPrincipalAfterLoss`

Latest result:

```text
forge test
6 passed; 0 failed; 0 skipped
```

Deployment workflow:

- Coston2 runbook: `docs/COSTON2_DEPLOYMENT.md`
- Current deployment status: not yet evidenced in this repo
- Required before claiming live deployment: deployed vault address, transaction hash, explorer links, and smoke-check output

## Frontend Evidence

Routes:

- `/`: Flare-native landing page
- `/app`: Coston2 vault dashboard
- `/app/shields`: yield-only shield products
- `/app/badges`: judge evidence page
- `/app/leaderboard`: judging/readiness board

Latest result:

```text
npm run lint
clean

npm run build
compiled successfully
```

## Design Evidence

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

- No deployed Coston2 contract address yet.
- No live FXRP ERC-20 deposit adapter yet.
- No live FTSOv2 contract read yet.
- No live FDC attestation verification yet.
- No hosted demo URL yet.
- Dependency audit still reports inherited high-severity findings.

## Verification Checklist

Use this checklist before final submission wording is locked.

### Local Product Checks

- [x] `forge test` passes for principal/yield accounting.
- [x] `npm run lint` completes cleanly.
- [x] `npm run build` completes cleanly.
- [x] README states current implementation boundaries.
- [x] Evidence docs avoid live FTSO, FDC, or deployed-contract claims without proof.

### Coston2 Deployment Checks

- [ ] Deploy `LumenShieldVault` to Coston2.
- [ ] Record deployed vault address.
- [ ] Record deployment transaction hash.
- [ ] Add Coston2 explorer address and transaction links.
- [ ] Run `cast chain-id` and confirm `114`.
- [ ] Run `owner()` and confirm the intended owner address.
- [ ] Run `nextShieldId()` and confirm fresh contract state.
- [ ] Optionally run a small testnet deposit with a disposable funded wallet.
- [ ] Add `NEXT_PUBLIC_LUMENSHIELD_VAULT_ADDRESS` to hosted app environment only after deployment is verified.

### Submission Evidence Checks

- [ ] Add hosted demo URL if available.
- [ ] Add screenshots or video walkthrough if available.
- [ ] Confirm final public copy says Coston2-ready unless a live Coston2 deployment is evidenced.
- [ ] Confirm final public copy says FTSOv2/FDC roadmap or boundary unless live calls are implemented and evidenced.

## Next Evidence To Add

- Coston2 deployment transaction hash.
- Contract address and explorer link.
- FTSOv2 read transaction or UI data proof.
- Optional FDC attestation proof if implemented.
- Hosted demo URL.
