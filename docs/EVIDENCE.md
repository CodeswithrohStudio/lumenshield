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

## Next Evidence To Add

- Coston2 deployment transaction hash.
- Contract address and explorer link.
- FTSOv2 read transaction or UI data proof.
- Optional FDC attestation proof if implemented.
- Hosted demo URL.
