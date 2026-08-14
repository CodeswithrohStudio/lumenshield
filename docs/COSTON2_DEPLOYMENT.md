# Coston2 Deployment Workflow

This document is the deployment runbook for the LumenShield hackathon prototype. It is written as an evidence checklist, not as a claim that deployment has already happened.

## Current Status

- Target network: Flare Testnet Coston2
- Chain ID: `114`
- RPC: `https://coston2-api.flare.network/ext/C/rpc`
- Explorer: `https://coston2-explorer.flare.network`
- Contracts to deploy: `contracts/FlareFtsoPriceOracle.sol:FlareFtsoPriceOracle` and `contracts/LumenShieldVault.sol:LumenShieldVault`
- FXRP asset: `0x0b6A3645c240605887a5532109323A3E12273dc7`
- Deployment status: prepared, not yet evidenced in this repo

Do not add a contract address, explorer link, or deployed-contract claim until the transaction hash and address are recorded below.

## Prerequisites

- Foundry installed locally.
- A Coston2-funded deployer wallet.
- Deployer private key available only in the shell session or local secret manager.
- Repository dependencies already installed.

Never commit private keys, seed phrases, `.env`, Foundry keystores, or raw deployment wallets.

## Preflight

Run from the repository root:

```bash
forge test
npm run lint
npm run build
```

Expected current baseline:

- `forge test`: 7 tests pass
- `npm run lint`: clean
- `npm run build`: clean

If these checks fail, do not deploy until the failure is explained and fixed.

## Deployment Command

The current path is a broadcast-ready Foundry script. It deploys the FTSOv2 adapter, deploys the FXRP vault, and configures the vault to use the adapter.

Set local-only values:

```bash
export COSTON2_RPC_URL="https://coston2-api.flare.network/ext/C/rpc"
export DEPLOYER_PRIVATE_KEY="<local-secret>"
export LUMENSHIELD_OWNER="<owner-address>"
export COSTON2_FXRP_ADDRESS="0x0b6A3645c240605887a5532109323A3E12273dc7"
export LUMENSHIELD_MAX_PRICE_AGE="180"
```

Deploy:

```bash
forge script script/DeployLumenShieldVault.s.sol:DeployLumenShieldVault \
  --rpc-url "$COSTON2_RPC_URL" \
  --broadcast
```

Record the deployed oracle address, vault address, and transaction hashes before making any submission claim.

## Post-Deployment Smoke Checks

Replace the placeholders with the deployed address and owner:

```bash
export VAULT_ADDRESS="<deployed-vault-address>"
export ORACLE_ADDRESS="<deployed-oracle-address>"
cast chain-id --rpc-url "$COSTON2_RPC_URL"
cast call "$VAULT_ADDRESS" "owner()(address)" --rpc-url "$COSTON2_RPC_URL"
cast call "$VAULT_ADDRESS" "asset()(address)" --rpc-url "$COSTON2_RPC_URL"
cast call "$VAULT_ADDRESS" "priceOracle()(address)" --rpc-url "$COSTON2_RPC_URL"
cast call "$VAULT_ADDRESS" "nextShieldId()(uint256)" --rpc-url "$COSTON2_RPC_URL"
cast call "$ORACLE_ADDRESS" "latestPrice(bytes21)(uint256,int8,uint64)" \
  0x015852502f55534400000000000000000000000000 \
  --rpc-url "$COSTON2_RPC_URL"
```

Expected:

- `cast chain-id` returns `114`.
- `owner()` returns `LUMENSHIELD_OWNER`.
- `asset()` returns the Coston2 FXRP address.
- `priceOracle()` returns `ORACLE_ADDRESS`.
- `nextShieldId()` returns `1` on a fresh deployment.
- `latestPrice(...)` returns a non-zero XRP/USD value and timestamp.

Optional funded test flow on Coston2:

```bash
cast send "$COSTON2_FXRP_ADDRESS" "approve(address,uint256)" "$VAULT_ADDRESS" 1000000 \
  --rpc-url "$COSTON2_RPC_URL" \
  --private-key "$DEPLOYER_PRIVATE_KEY"

cast send "$VAULT_ADDRESS" "deposit(uint256)" 1000000 \
  --rpc-url "$COSTON2_RPC_URL" \
  --private-key "$DEPLOYER_PRIVATE_KEY"

cast call "$VAULT_ADDRESS" "principalBalance(address)(uint256)" "$LUMENSHIELD_OWNER" \
  --rpc-url "$COSTON2_RPC_URL"
```

Only run the funded flow with a disposable testnet wallet that has C2FLR for gas and FXRP for deposit.

## Evidence To Record

After deployment, update this section and `docs/EVIDENCE.md`.

- Deployer address: `TODO`
- Owner address: `TODO`
- Oracle address: `TODO`
- Vault address: `TODO`
- Deployment transaction hash: `TODO`
- Explorer address URL: `TODO`
- Explorer transaction URL: `TODO`
- Smoke-check command outputs: `TODO`
- App env updated with `NEXT_PUBLIC_LUMENSHIELD_VAULT_ADDRESS`: `TODO`
- App env updated with `NEXT_PUBLIC_LUMENSHIELD_ORACLE_ADDRESS`: `TODO`

## Submission Boundary

Until the evidence above is filled in, the honest submission wording is:

> LumenShield includes a Coston2-ready Solidity vault and deployment workflow, but this repository does not yet contain evidence of a live Coston2 deployment.

After the evidence is filled in, the wording can become:

> LumenShield includes a Coston2-deployed vault at the recorded address, with smoke-check outputs and explorer links included in the evidence docs.
