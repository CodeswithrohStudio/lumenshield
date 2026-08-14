# LumenShield Contracts

This Foundry module is a minimal Solidity proof for the Flare/Coston2 version of LumenShield.

## Vault

`contracts/LumenShieldVault.sol` tracks:

- `principalBalance[user]`: native Coston2 FLR-style deposits that must not be spent on shields.
- `yieldBudget[user]`: earned yield available to fund shield positions.
- `totalYieldEarned[user]`: cumulative yield credited for reporting.
- `shieldPositions[id]`: yield-funded shield stakes and settlement state.

Opening a shield checks `yieldBudget` and subtracts only from that budget. Principal is held in separate accounting and remains withdrawable after a shield loses.

## Integration Boundaries

The contract includes placeholder interfaces for:

- `IFlarePriceOracle`: a future adapter to Flare FTSO or another approved price feed.
- `IFAssetYieldSource`: a future adapter for FAssets or another real yield source.

These interfaces are intentionally not wired to mocked production behavior. In this MVP, yield can be credited by the owner with funded native value via `creditYield`, or simulated on testnet via `accrueSimulatedYield`. Production deployment should replace the admin/simulation path with audited adapters and explicit Coston2/mainnet addresses.

## Tests

Focused Foundry tests cover deposit accounting, funded admin yield credit, simulated yield accrual, opening shields from yield only, failed attempts to spend principal on shields, losing settlement, and principal withdrawal after loss.
