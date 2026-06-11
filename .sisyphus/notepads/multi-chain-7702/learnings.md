# Learnings — multi-chain-7702

## networkConfig.ts

- 8 networks: Optimism, Optimism Sepolia, Base, Base Sepolia, Arbitrum One, Arbitrum Sepolia, BSC, BSC Testnet
- Pimlico unavailable for BSC chains (56, 97) — `pimlicoId: null`, `getPimlicoUrl` returns `null`
- Pimlico URL pattern: `https://api.pimlico.io/v2/{id}/rpc?apikey=pim_...`
- Pimlico sponsorship policy: `sp_milky_cassandra_nova` (same across all chains)
- Public RPCs used for `getRpcUrl`; Pimlico only used for bundler/paymaster
- `as const` on `SUPPORTED_NETWORKS` enables `ChainId` type derivation
- `NETWORK_OPTIONS` maps to `value: string, label: string` for Snap Selector UI
## Pause/Resume/Revoke Implementation (2026-06-11)

### Pattern used
- API functions follow existing `handleResponse` helper for PATCH (pause/resume), inline error handling for DELETE (revoke) to handle potential 204 responses
- Event handlers follow existing `handleExecutionHistory` pattern: loading UI → API call → renderHomePage on success → error UI with "Back to Home" button
- Buttons conditionally rendered based on `item.status` ('active' → Pause+Revoke, 'paused' → Resume+Revoke)
- User address obtained via `getSmartAccountAddressInSnap()` in handlers

### Files modified
- `packages/snap/src/api/installations.tsx` — 3 new exports: revokeInstallation, pauseInstallation, resumeInstallation
- `packages/snap/src/index.tsx` — imports, conditional buttons in buildHomeContent, 3 event handlers in onUserInput
