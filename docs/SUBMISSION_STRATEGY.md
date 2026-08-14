# Flare Summer Signal Submission Strategy

## Selected Bounty

**Bounty 1 - Interoperable Asset Products**

Do not select Bounty 2 unless Flare Confidential Compute is implemented and demoable.

## Submission Description

LumenShield is a Flare-native port of Yoldr: a principal-protected DeFi vault where users deposit supported Flare assets, keep their principal protected in vault accounting, and use only earned yield as the risk budget for higher-upside shield positions.

## Target User

Crypto holders who want upside exposure through DeFi but are unwilling to risk their principal in raw leveraged positions.

## What Existed Before

- Yoldr on Flow.
- Flow wallet/FCL integration.
- Cadence contracts.
- Consumer vault UX.
- Principal/yield separation concept.
- Shield position and badge/pet experience.

## Newly Built for Flare

- LumenShield brand and repo.
- Flare/Coston2 app shell.
- Solidity contracts.
- FXRP/FAsset-centered product model.
- Flare evidence panel.
- Coston2 deployment workflow.
- FTSO/FDC integration boundaries documented honestly.

Not yet evidenced:

- Live Coston2 contract deployment.
- Live FTSOv2 read.
- Live FDC attestation verification.

## Judge Path

1. Read README.
2. Open the hosted demo or run locally.
3. Connect wallet or use demo mode.
4. Review dashboard evidence panel.
5. Inspect contracts and tests.
6. Review `docs/COSTON2_DEPLOYMENT.md`.
7. Verify Coston2 deployment details only if address and transaction evidence have been added.

## Differentiation

Most DeFi products ask users to accept principal risk. LumenShield makes the risk budget explicit: principal is the protected base, yield is the adventurous layer. Flare matters because FAssets can bring assets like XRP into DeFi and Flare data infrastructure can make price and proof paths more credible.

## Known Risks

- Production principal protection requires robust yield sources, audits, and risk controls.
- A hackathon demo may simulate yield accrual.
- FTSO/FDC integration must be accurately represented based on what is actually implemented.
- Any deployment on Coston2 is testnet evidence, not production readiness.

## Final Copy Guardrails

Use these phrases until deployment evidence exists:

- "Coston2-oriented prototype"
- "Coston2-ready vault module"
- "deployment workflow included"
- "FTSOv2 and FDC integration boundaries documented"

Avoid these phrases until actual evidence exists:

- "live Coston2 deployment"
- "deployed contract"
- "uses live FTSO prices"
- "verifies FDC attestations"
- "production-ready principal protection"
