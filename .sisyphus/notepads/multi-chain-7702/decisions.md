# Plan: Multi-Chain Support + ERC-7702 Smart Account Option

**Intent**: Expand Snap from Base Sepolia-only to 8 networks (Optimism/Base/Arbitrum/BSC × mainnet+testnet), add ERC-7702 smart account as optional alternative to ERC-4337, and display network names per skill.

**Approach**: Centralize network config → refactor smart account for multi-chain + 7702 → add network selector UI → update all handlers.

## Scope
**In scope**: Network config, chain-aware smart account creation, ERC-7702 deployment option, network selector UI, network name display per skill, explorer URL expansion.
**Out of scope**: Pimlico support for non-Base chains (use same Pimlico key, works on all supported chains), changing backend chainId, multi-network skill installation.

## TODOs

- [ ] A: Create centralized network config (`utils/networkConfig.ts`) — all chain metadata + Pimlico URLs
- [ ] B: Update `format.ts` — add `getNetworkName()`, expand explorer maps
- [ ] C: Refactor `smartAccount.ts` — accept chainId + accountType params, support both Hybrid (4337) and Stateless7702
- [ ] D: Update `deployment.ts` — accept chainId param, chain-specific RPC
- [ ] E: Update `deploySmartAccount.tsx` — multi-chain + ERC-7702 authorization flow + UI toggle
- [ ] F: Update `index.tsx` home page — add network selector + 7702 toggle, use `getNetworkName()`
- [ ] G: Update remaining handlers — `skillSelectorForm`, `prepareInstallation`, chainId from state
- [ ] H: Update `getUsdcBalance.ts` — use networkConfig for USDC addresses

## Final Verification Wave
- [ ] Verify all 8 networks display correct name, explorer, USDC address
- [ ] Verify ERC-7702 deploy flow: authorize → deploy → receipt
- [ ] Verify ERC-4337 deploy flow unchanged
- [ ] Verify no hardcoded `84532` remains in source

## Notepad Paths
- READ: `.sisyphus/notepads/multi-chain-7702/*.md`
- WRITE: Append to appropriate category

## Inherited Wisdom
- Snap JSX: no raw numbers as children → use template strings
- chainId lives at `item.chainId` (top-level) AND `item.skillId.chainId` (nested)
- Snap state via `snap_manageState` — add `selectedChainId` + `accountType`
- `@metamask/smart-accounts-kit`: `Implementation.Hybrid` (4337) vs `Implementation.Stateless7702` (7702)
- 7702 needs local account signer, NOT walletClient
- Pimlico URL pattern: `https://api.pimlico.io/v2/{pimlico-chain-id}/rpc?apikey=...`