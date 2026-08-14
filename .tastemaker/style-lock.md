# Style lock — LumenShield

Established: 2026-08-14. Source: Tastemaker build workflow, Yoldr visual inheritance, Flare Summer Signal requirements, and generated premium/dark palette seed `114`.

## Palette

- Background: `#090b11` — page and app-shell base.
- Surface: `#14161c` — cards, panels, sidebars.
- Primary: `#5170cf` — primary actions, network status, selected app states.
- Accent: `#e2832e` — Flare signal, evidence highlights, yield/action emphasis.
- Secondary: `#222d48` — quiet filled surfaces and selected rows.
- Border: `#202228` — decorative hairlines only unless paired with Accent or Primary.
- Text primary: `#ecf2fe` — contrast vs background: 17.51.
- Text muted: `#9aa6bb` — derived muted role for body support copy.
- Button label color: `#ffffff` on Primary — contrast 4.60.
- Dark mode: not needed. LumenShield is a single locked dark product surface.

## Color Contract

Verified via `scripts/generate_palette.py --mood premium --mode dark --seed 114`.

- Text-safe (>=4.5): bg/on-primary, surface/on-primary, text/bg, text/surface, border/on-primary, text/border, bg/accent, surface/accent, accent/border, primary/on-primary
- UI-safe (>=3.0 and <4.5): bg/primary, text/primary, surface/primary, primary/border
- Decorative (<3.0): accent/on-primary, text/accent, primary/accent, bg/border, surface/border, text/on-primary, bg/surface

Use `#ffffff` on Primary. Do not use white text on Accent. Use Accent as a line, icon, number, glow, or dark-background highlight.

## Typography

- Display/heading font: Unbounded — premium fintech confidence, not playful consumer.
- Body/UI font: Albert Sans — clean product surface with good scanning.
- Data/technical labels: IBM Plex Mono only for chain IDs, addresses, tx hashes, and feed IDs.
- Scale: restrained display; hero can be large, section headings stay below hero scale.

## Shape Language

- Corner radius: 8px for cards and panels, 999px only for small status pills.
- Shadow depth: mostly flat; use glow only around active signal/evidence elements.
- Border usage: 1px hairline borders, with Accent/Primary only for active or evidence-bearing states.

## Density & Spacing

- Base unit: 4px.
- Landing section padding: connective `space-16` (64px), standard `space-24` (96px), pivotal `space-32` to `space-40` (128-160px).
- Content card internal padding: `space-6` (24px).
- Compact app tiles: `space-3` to `space-4` (12-16px).
- Showcase panels: `space-8` (32px).
- Overall density: premium but judge-useful; landing breathes, dashboard scans.
- Section separation: whitespace plus occasional hairline dividers, not alternating color bands everywhere.

## Structure

- Macrostructure used: landing uses Product Demo / Workbench.
- Narrative arc: hook(H2 split demo) -> problem(specific principal-risk beat) -> solution(F3 sticky workflow) -> how(F4 step sequence) -> proof(F5 annotated evidence + P4 honest evidence strip) -> close(C2 statement). No beats skipped.
- Shared chrome: Nav N2 balanced product bar; Footer Ft2 inline single line.
- Per-page body archetypes: landing H2 split demo, F3 sticky workflow, F5 annotated capture/evidence, P4 stat/evidence strip, C2 statement. App shell uses sidebar + topbar cockpit.
- Build stamp/log: `.tastemaker/log.json` carries per-build structure records.

## Reference Intelligence

- Reference board: `.tastemaker/reference-board.md` viewed/inferred blend.
- Design read: landing + app shell for cautious DeFi users and hackathon judges, mode Persuade plus Operate, premium dark financial cockpit lane.
- Dials: variance 7, motion 5, density 6, art direction 7.
- Foundation: existing Next.js/Tailwind/Radix/Zustand/Recharts stack; add EVM libraries only where required for Flare integration.
- Quality bar: Yoldr shipped landing interaction for emotional hook; Flare docs for technical credibility; professional DeFi dashboards for evidence clarity.
- Direction contract: Thesis "principal stays shielded, yield follows the signal"; First viewport split between promise and vault/evidence mockup; System dark premium panels, blue primary, Flare-orange signal; Risk overclaiming production safety or making Flare integration superficial.
- Anti-references: generic DeFi purple gradients, security-shield logos, fake browser chrome, invented metrics, "risk-free" language.

## Taste Memory

- Profile priors used: none found in this repo; original Yoldr lock used as lineage, not binding.
- Decision log: `.tastemaker/decisions.log`.
- Last resolved decisions: Yoldr shield logo rejected as too common; vault-circle + departing comet concept kept as a stronger brand metaphor.
- Pending review: LumenShield name and premium/dark Flare palette.
- Profile promotion: none.
- Memory precedence note: current request asks for a new premium Flare-native repo, so old Yoldr brand lock is superseded.

## Navigation Chrome

- Sidebar background: Surface. Content area background: Background.
- Active nav item treatment: Primary-filled or Primary-left-edge row depending density.
- Inactive hover treatment: Surface lift plus text primary.
- Breadcrumb treatment: muted parent, text primary current segment.
- Shell density: 36-44px row height, 13-14px labels.

## Mood Descriptors

Premium, protected, signal-native, credible.

## Assets

- Anchor asset: `design/assets/logo/lumenshield-mark.svg`.
- Asset style: flat geometric mark, 2-3 colors max, no gradient logo.
- Illustration vs. photography split: product UI mockups and code-native diagrams instead of generic stock; photography only if a real-use or physical context section is introduced.
- Illustration source used: code-native diagrams for initial build.
- Logo: shield silhouettes are banned. The mark is a protected principal orb with a separate signal flare crossing its perimeter, preserving the Yoldr "principal stays / yield moves" metaphor in a Flare-native language.

## Motion

- Feel: precise, restrained, signal-like.
- Curves: `cubic-bezier(0.16, 1, 0.3, 1)` for entrances; no bounce on finance UI.
- Durations: press 120ms, panel 180-220ms, marketing reveal 700-1100ms.
- Entrance duration/distance: 700ms, 16-24px rise for landing sections.
- Screen tracks: marketing uses hero + scroll reveal; app shell uses panel/list/state transitions.
- Frequency rules: transaction state changes animate; repeated data refreshes should not celebrate.
- Reduced motion: spatial motion collapses to opacity.
- Verified by: pending.

## Do Not

- Do not claim guaranteed or risk-free yield.
- Do not claim Confidential Compute support until implemented.
- Do not use old Flow/FCL language in final product surfaces.
- Do not submit with only copy changes; Flare must appear in app architecture and evidence.
- Do not reintroduce a generic shield-only mark.
- Do not use purple/cyan DeFi gradients or gradient headline text.
