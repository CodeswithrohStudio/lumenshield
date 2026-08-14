# Coston2 Deployment Workflow

This document is the deployment runbook and evidence checklist for the LumenShield hackathon prototype.

## Current Status

- Target network: Flare Testnet Coston2
- Chain ID: `114`
- RPC: `https://coston2-api.flare.network/ext/C/rpc`
- Explorer: `https://coston2-explorer.flare.network`
- Contracts to deploy: `contracts/FlareFtsoPriceOracle.sol:FlareFtsoPriceOracle` and `contracts/LumenShieldVault.sol:LumenShieldVault`
- FXRP asset: `0x0b6A3645c240605887a5532109323A3E12273dc7`
- Oracle address: `0x46930F19B28921cee5b608a6571b65D36502B925`
- Vault address: `0x41365634247e7E8CE4d5109057c6356b52930479`
- Deployment status: deployed and smoke-checked on Coston2

The deployment evidence is recorded below. Future redeploys should update all addresses and transaction hashes in one commit.

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
```

Deploy:

```bash
forge script script/DeployLumenShieldVault.s.sol:DeployLumenShieldVault \
  --rpc-url "$COSTON2_RPC_URL" \
  --broadcast
```

Record the deployed oracle address, vault address, and transaction hashes after every redeploy.

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

## Recorded Deployment Evidence

- Deployer address: `0xE20D41E77bF1d2121E4bc50411e4523300b72B9a`
- Owner address: `0xE20D41E77bF1d2121E4bc50411e4523300b72B9a`
- Oracle address: `0x46930F19B28921cee5b608a6571b65D36502B925`
- Vault address: `0x41365634247e7E8CE4d5109057c6356b52930479`
- Oracle deployment transaction: `0x672fba6004a5e3e9af0589bf91cd9bf5cb534694694984d7354f694f0963d715`
- Vault deployment transaction: `0x93c8f99a45de1d91195dad5995b09584f9bc063a899c8925f17b456ac232bd3f`
- Oracle configuration transaction: `0x731470c4203de2a0b7f319765f65511de3f36ecc95a4e3b983074c9b8183cc0d`
- Oracle explorer URL: `https://coston2-explorer.flare.network/address/0x46930F19B28921cee5b608a6571b65D36502B925`
- Vault explorer URL: `https://coston2-explorer.flare.network/address/0x41365634247e7E8CE4d5109057c6356b52930479`
- Oracle deployment URL: `https://coston2-explorer.flare.network/tx/0x672fba6004a5e3e9af0589bf91cd9bf5cb534694694984d7354f694f0963d715`
- Vault deployment URL: `https://coston2-explorer.flare.network/tx/0x93c8f99a45de1d91195dad5995b09584f9bc063a899c8925f17b456ac232bd3f`
- Oracle configuration URL: `https://coston2-explorer.flare.network/tx/0x731470c4203de2a0b7f319765f65511de3f36ecc95a4e3b983074c9b8183cc0d`
- App env updated with `NEXT_PUBLIC_LUMENSHIELD_VAULT_ADDRESS`: yes
- App env updated with `NEXT_PUBLIC_LUMENSHIELD_ORACLE_ADDRESS`: yes

Smoke-check outputs:

```text
cast chain-id -> 114
owner() -> 0xE20D41E77bF1d2121E4bc50411e4523300b72B9a
asset() -> 0x0b6A3645c240605887a5532109323A3E12273dc7
priceOracle() -> 0x46930F19B28921cee5b608a6571b65D36502B925
maxPriceAge() -> 180
nextShieldId() -> 1
latestPrice(XRP/USD) -> 1010592, 6, 1786671693
```

## Submission Boundary

> LumenShield includes a Coston2-deployed vault at the recorded address, with smoke-check outputs and explorer links included in the evidence docs.
