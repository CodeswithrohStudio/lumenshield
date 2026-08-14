# LumenShield Task Breakdown

## PM and Strategy

- Lock product name and one-liner.
- Choose primary bounty.
- Define user, problem, and proof narrative.
- Write honest claims boundary.
- Create judge-facing evidence checklist.

## Branding

- Use Tastemaker build workflow.
- Create `.tastemaker/reference-board.md`.
- Create `.tastemaker/style-lock.md`.
- Update logo/wordmark assets from Yoldr to LumenShield.
- Update favicon, manifest, metadata, and OG image.

## Repository

- Import Yoldr source as baseline.
- Initialize clean git history.
- Add product docs before implementation.
- Keep commits milestone-shaped and readable.
- Avoid rewriting or hiding original Yoldr lineage.

## Frontend

- Rename app surface from Yoldr to LumenShield.
- Replace Flow wallet language with Flare/Coston2 language.
- Update landing flow:
  - Landing
  - Dashboard
  - Deposit
  - Shields
  - Evidence
- Add wrong-network and demo-mode states.
- Add Flare evidence panel for judges.

## Smart Contracts

- Add Foundry project.
- Implement `LumenShieldVault.sol`.
- Track principal, yield budget, total yield earned, and active shield count.
- Enforce that shield margin comes from yield budget only.
- Add shield open/close events.
- Add tests for:
  - deposit increases principal
  - yield accrual increases available shield budget
  - opening a shield cannot consume principal
  - losing shield only reduces yield budget
  - withdrawing principal remains possible after a losing shield

## Flare Integration

- Add Coston2 network config.
- Add contract deployment script.
- Add FTSO/FAssets/FDC integration notes.
- Implement actual Flare calls where feasible.
- Keep roadmap claims clearly marked.

## Verification

- Run `npm run lint`.
- Run `npm run build`.
- Run `forge test`.
- Start local dev server.
- Browser-check landing and app shell.
- Capture evidence in `docs/EVIDENCE.md`.

## Submission

- Update README with judge path.
- Include selected bounty.
- Include target user.
- Include what existed before.
- Include what was newly built.
- Include demo link or local run path.
- Include contract addresses if deployed.
- Include known limitations.

## Systematic Next Steps

1. Re-run local verification.
   - `forge test`
   - `npm run lint`
   - `npm run build`

2. Deploy only if local checks pass.
   - Follow `docs/COSTON2_DEPLOYMENT.md`.
   - Use a funded Coston2 test wallet.
   - Record deployer, owner, address, transaction hash, and explorer links.

3. Smoke-check the deployed vault.
   - Confirm chain ID `114`.
   - Confirm `owner()` returns the intended owner.
   - Confirm `nextShieldId()` starts at `1`.
   - Optionally run one tiny testnet deposit and record the receipt.

4. Update public evidence.
   - Deployment evidence is filled in `docs/COSTON2_DEPLOYMENT.md`.
   - `docs/EVIDENCE.md` includes deployed addresses, transactions, and smoke checks.
   - `NEXT_PUBLIC_LUMENSHIELD_VAULT_ADDRESS` is set after verified deployment.

5. Lock final submission claims.
   - Say "Coston2-deployed" with explorer evidence recorded.
   - Treat FTSOv2 as live read-only integration.
   - Keep FDC and FCC as roadmap/boundary items unless implemented and evidenced.
