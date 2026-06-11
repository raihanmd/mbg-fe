# Plan: SkillWallet* Landing Page — HTML Port

Port the raw HTML reference design into Gatsby/React with Tailwind, preserving existing MetaMask hook wiring.

## Pre-existing Hooks (DO NOT MODIFY)
- `useMetaMask()` → `{ isFlask, snapsDetected, installedSnap }` from `../hooks`
- `useRequestSnap()` → returns `requestSnap` async function from `../hooks`
- `useMetaMaskContext()` → `{ error }` from `../hooks`
- `useInvokeSnap()` → for snap method calls from `../hooks`
- `defaultSnapOrigin` from `../config`

## Key HTML → Tailwind Mappings
- `--accent: #4da3ff` → update global.css `--color-primary` to `#4da3ff`
- Button: `rounded-full`, `min-h-[40px]`, `text-sm`, `font-bold`
- Hero H1: `text-[clamp(42px,6vw,76px)]` — use `text-4xl sm:text-5xl lg:text-6xl`
- Section H2: `text-[clamp(32px,4vw,52px)]` — use `text-3xl sm:text-4xl lg:text-5xl`
- Eyebrow: `text-xs font-extrabold uppercase tracking-[0.14em] text-primary`
- Section lead: `text-[17px]` or `text-base`
- Skill card H3: 21px → `text-xl`
- Step H3: 22px → `text-2xl`
- Core message: `text-[15px]` font-extrabold, blue tinted bg/border
- StatusPill: `text-xs font-extrabold`, green bg/border, dot indicator
- Config labels/values: `text-[13px]`
- Nav links: `text-sm`
- Brand: `text-[15px] font-[750]`

## TODOs

- [ ] A: Update `global.css` — replace color tokens to match HTML (#4da3ff primary, #7dd3a8 success, #d98b8b danger, #253449 border, etc.)
- [ ] B: Create `SectionHeading` component at `src/components/SectionHeading.tsx` — reusable eyebrow + h2 + optional lead paragraph
- [ ] C: Create `Header` component — replace existing `Header.tsx`, port HTML header design, wire `useMetaMask()` + `useRequestSnap()` for buttons
- [ ] D: Create `RuntimePanel` component — the dashboard/skill preview card from the hero sidebar
- [ ] E: Create `Hero` section at `src/components/Hero.tsx` — H1, description, core message box, 3 CTA buttons, RuntimePanel sidebar
- [ ] F: Create `Positioning` strip at `src/components/Positioning.tsx` — 3 text items in a bordered row
- [ ] G: Create `HowItWorks` section + `StepItem` sub-component — 4-step numbered flow from HTML
- [ ] H: Create `SkillCard` + `Skills` section — 3 installable skill cards matching HTML design with TODO install handlers
- [ ] I: Create `PermissionModel` component — "What AI can/cannot do" two-column
- [ ] J: Create `Architecture` component — 14-node runtime architecture grid
- [ ] K: Create `FinalCTA` component — closing CTA section
- [ ] L: Rewrite `pages/index.tsx` — assemble all new components, remove old component imports
- [ ] M: Cleanup — delete unused old components (HeroSections, ListSkills, ValuePillars, SecurityBoundary, HowToUse, ConfigureOptions, DashboardPreview, ClosingCTA, PoweredBy, FAQ)
- [ ] N: Verify — `lsp_diagnostics` clean, `yarn build` passes, all imports resolve

## Final Verification Wave
- [ ] F1: Verify all sections rendered match HTML layout, spacing, colors
- [ ] F2: Verify Connect Wallet + Install Snap buttons trigger existing hooks
- [ ] F3: Verify responsive at 980px and 640px breakpoints
- [ ] F4: Verify no old unused components remain

## Parallelization
Wave 1 (all independent — create new files only): A, B, C, D, E, F, G, H, I, J, K
Wave 2 (depends on Wave 1): L, M
Wave 3: N
Wave 4 (final): F1, F2, F3, F4