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
- Flare evidence panel with live Coston2 reads.
- Coston2 deployment workflow.
- FTSOv2 adapter and dashboard read path.
- FDC/FCC integration boundaries documented honestly.

Not yet evidenced:

- Live Coston2 contract deployment.
- Live FDC attestation verification.
- Live FCC private compute.

## Judge Path

1. Read README.
2. Open the hosted demo or run locally.
3. Review dashboard evidence panel and live Coston2 reads.
4. Inspect the FXRP vault and FTSO adapter.
5. Inspect contracts and tests.
6. Review `docs/COSTON2_DEPLOYMENT.md`.
7. Verify Coston2 deployment details only if address and transaction evidence have been added.

## Differentiation

Most DeFi products ask users to accept principal risk. LumenShield makes the risk budget explicit: principal is the protected base, yield is the adventurous layer. Flare matters because FAssets can bring assets like XRP into DeFi and Flare data infrastructure can make price and proof paths more credible.

## Known Risks

- Production principal protection requires robust yield sources, audits, and risk controls.
- A hackathon demo may simulate yield accrual.
- FTSOv2 read-only integration is implemented, while FDC and FCC must be represented as roadmap unless implemented later.
- Any deployment on Coston2 is testnet evidence, not production readiness.

## Final Copy Guardrails

Use these phrases until deployment evidence exists:

- "Coston2-oriented prototype"
- "Coston2-ready FXRP vault module"
- "deployment workflow included"
- "live read-only FAssets and FTSOv2 data"
- "FDC and FCC integration boundaries documented"

Avoid these phrases until actual evidence exists:

- "live Coston2 deployment"
- "deployed contract"
- "verifies FDC attestations"
- "built with FCC"
- "production-ready principal protection"
