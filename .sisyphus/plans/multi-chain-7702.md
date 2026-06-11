# Plan: Multi-Chain + ERC-7702

## TODOs
- [ ] A: Create `utils/networkConfig.ts` — centralized chain metadata, Pimlico URLs, USDC addresses, explorer URLs, network names
- [ ] B: Update `utils/format.ts` — add `getNetworkName()`, expand explorer maps from networkConfig
- [ ] C: Refactor `utils/smartAccount.ts` — accept `chainId` + `accountType` params, support `Implementation.Hybrid` (4337) and `Implementation.Stateless7702` (7702)
- [ ] D: Update `utils/deployment.ts` — accept `chainId`, chain-aware RPC
- [ ] E: Update `handler/deploySmartAccount.tsx` — multi-chain Pimlico, ERC-7702 authorization flow, UI for account type selection
- [ ] F: Update `index.tsx` home — network selector UI, 7702/4337 toggle for undeployed, use `getNetworkName()` for all skill displays, persist selection to snap state
- [ ] G: Update `handler/skillSelectorForm.tsx` — read chainId from snap state, display network name
- [ ] H: Update remaining references — `getUsdcBalance.ts`, `prepareInstallation.tsx`, `confirmInstallation.tsx`

## Final Verification Wave
- [ ] F1: Verify all 8 networks display correct name, explorer link, USDC address
- [ ] F2: Verify ERC-7702 deploy flow works end-to-end
- [ ] F3: Verify ERC-4337 deploy flow still works across chains
- [ ] F4: Verify no hardcoded `84532` remains in source (except as one entry in config)