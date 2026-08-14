# LumenShield Contracts

This Foundry module is the Flare/Coston2 technical core for LumenShield.

## Vault

`contracts/LumenShieldVault.sol` tracks:

- `asset`: the configured FXRP/FAsset-style ERC-20 used for principal and yield accounting.
- `principalBalance[user]`: deposited asset principal that must not be spent on shields.
- `yieldBudget[user]`: earned yield available to fund shield positions.
- `totalYieldEarned[user]`: cumulative yield credited for reporting.
- `shieldPositions[id]`: yield-funded shield stakes, entry FTSO feed data, PnL, and settlement state.

Opening a shield checks a configured `IShieldPriceOracle`, stores the entry price, then subtracts only from `yieldBudget`. Principal is held in separate accounting and remains withdrawable after a shield loses.

## Flare Adapter

`contracts/FlareFtsoPriceOracle.sol` resolves `FtsoV2` through Flare's cross-network `FlareContractRegistry` at:

```text
0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019
```

The adapter exposes the minimal `latestPrice(bytes21 feedId)` surface that the vault needs. The current deploy script configures the vault to use this adapter and the documented Coston2 FXRP address:

```text
0x0b6A3645c240605887a5532109323A3E12273dc7
```

## Yield Boundary

`creditYield(user, amount)` is an owner-gated funded yield credit. It transfers the same asset into the vault before increasing `yieldBudget`.

`accrueSimulatedYield(user, amount)` is explicitly demo-only and unfunded. It exists for testnet storytelling and must not be described as production yield.

## Tests

Focused Foundry tests cover:

- FXRP-style ERC-20 principal deposits.
- Funded yield credits in the same asset.
- Simulated yield as separate demo state.
- FTSO entry price capture when opening a shield.
- Stale price rejection.
- Failed attempts to spend principal on shields.
- Losing settlement followed by full principal withdrawal.

Latest result:

```text
forge test
7 passed; 0 failed; 0 skipped
```

## Coston2 Deployment

Deployment is prepared but not yet evidenced in this repository because no funded `DEPLOYER_PRIVATE_KEY` is available in the current shell.

Use `docs/COSTON2_DEPLOYMENT.md` for the broadcast command and only update submission materials with a live address after the deployment transaction, explorer links, and smoke checks are recorded.
