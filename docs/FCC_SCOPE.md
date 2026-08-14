# Flare Confidential Compute Scope

## Current Decision

LumenShield does not claim a Flare Confidential Compute implementation in the current submission.

The primary submission path is Bounty 1: Interoperable Asset Products. The implemented technical center is FXRP/FAsset vault accounting, Coston2 reads, and FTSOv2-priced shield entry.

## Why Not Claim FCC Yet

Flare Confidential Compute is a real fit for LumenShield, but it should not be treated as a label. The useful private-app feature would be:

- User submits private portfolio preferences, risk limits, and strategy constraints.
- A Flare Compute Extension evaluates the private risk profile inside a TEE.
- The extension returns only a signed shield eligibility result or strategy bucket.
- The vault accepts the result without publishing the user's raw risk profile.

That requires an actual FCC/FCE service, attestation flow, signed result schema, and on-chain verifier path. Those pieces are not implemented in this repo yet.

## Submission Boundary

Use:

- "FCC roadmap: private risk scoring for shield selection"
- "Not claimed for Bounty 2 in the current build"
- "Primary technical proof is Bounty 1"

Avoid:

- "built with FCC"
- "private computation is live"
- "TEE-backed strategy selection"
- "eligible for Confidential Compute Apps"

## Later Technical Plan

1. Define a private risk-input schema.
2. Build a Flare Compute Extension that scores the risk profile inside a TEE.
3. Sign an output containing wallet, strategy bucket, expiry, and nonce.
4. Add a Solidity verifier that accepts the signed result before `openShield`.
5. Show only the proof status in the UI, not the private inputs.

This would make LumenShield a good Bounty 2 candidate in a later iteration. For the current build, honesty is stronger than overclaiming.
