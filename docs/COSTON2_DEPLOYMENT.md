# Coston2 Deployment Workflow

This document is the deployment runbook for the LumenShield hackathon prototype. It is written as an evidence checklist, not as a claim that deployment has already happened.

## Current Status

- Target network: Flare Testnet Coston2
- Chain ID: `114`
- RPC: `https://coston2-api.flare.network/ext/C/rpc`
- Explorer: `https://coston2-explorer.flare.network`
- Contract to deploy: `contracts/LumenShieldVault.sol:LumenShieldVault`
- Deployment status: not yet evidenced in this repo

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

- `forge test`: 6 tests pass
- `npm run lint`: clean
- `npm run build`: clean

If these checks fail, do not deploy until the failure is explained and fixed.

## Deployment Command

The safest current path is `forge create` because `script/DeployLumenShieldVault.s.sol` is a simple deployer contract, not a broadcast-ready Foundry `Script`.

Set local-only values:

```bash
export COSTON2_RPC_URL="https://coston2-api.flare.network/ext/C/rpc"
export DEPLOYER_PRIVATE_KEY="<local-secret>"
export LUMENSHIELD_OWNER="<owner-address>"
```

Deploy:

```bash
forge create contracts/LumenShieldVault.sol:LumenShieldVault \
  --rpc-url "$COSTON2_RPC_URL" \
  --private-key "$DEPLOYER_PRIVATE_KEY" \
  --constructor-args "$LUMENSHIELD_OWNER"
```

Record the deployed address and transaction hash before making any submission claim.

## Post-Deployment Smoke Checks

Replace the placeholders with the deployed address and owner:

```bash
export VAULT_ADDRESS="<deployed-vault-address>"
cast chain-id --rpc-url "$COSTON2_RPC_URL"
cast call "$VAULT_ADDRESS" "owner()(address)" --rpc-url "$COSTON2_RPC_URL"
cast call "$VAULT_ADDRESS" "nextShieldId()(uint256)" --rpc-url "$COSTON2_RPC_URL"
```

Expected:

- `cast chain-id` returns `114`.
- `owner()` returns `LUMENSHIELD_OWNER`.
- `nextShieldId()` returns `1` on a fresh deployment.

Optional funded test flow on Coston2:

```bash
cast send "$VAULT_ADDRESS" "deposit()" \
  --value 0.001ether \
  --rpc-url "$COSTON2_RPC_URL" \
  --private-key "$DEPLOYER_PRIVATE_KEY"

cast call "$VAULT_ADDRESS" "principalBalance(address)(uint256)" "$LUMENSHIELD_OWNER" \
  --rpc-url "$COSTON2_RPC_URL"
```

Only run the funded flow with a disposable testnet wallet.

## Evidence To Record

After deployment, update this section and `docs/EVIDENCE.md`.

- Deployer address: `TODO`
- Owner address: `TODO`
- Vault address: `TODO`
- Deployment transaction hash: `TODO`
- Explorer address URL: `TODO`
- Explorer transaction URL: `TODO`
- Smoke-check command outputs: `TODO`
- App env updated with `NEXT_PUBLIC_LUMENSHIELD_VAULT_ADDRESS`: `TODO`

## Submission Boundary

Until the evidence above is filled in, the honest submission wording is:

> LumenShield includes a Coston2-ready Solidity vault and deployment workflow, but this repository does not yet contain evidence of a live Coston2 deployment.

After the evidence is filled in, the wording can become:

> LumenShield includes a Coston2-deployed vault at the recorded address, with smoke-check outputs and explorer links included in the evidence docs.
