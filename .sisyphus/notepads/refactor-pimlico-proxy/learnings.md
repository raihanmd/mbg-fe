# Learnings

## Pimlico Proxy Refactor (deploySmartAccount.tsx)

### Key patterns:
- `walletClient.chain` exposes viem Chain object — avoid re-importing viem/chains for publicClient creation
- `smartAccount.getInitCode?.()` uses optional chaining (not on MetaMaskSmartAccount type), needs `as any` cast
- `PIMLICO_EXEC_KEY` must be in `snap.config.ts environment` block for webpack injection
- BSC check: use `network.pimlicoId` instead of `getPimlicoUrl(chainId)` — same null logic, cleaner
- `deployAndExecute` (Phase 1) → `submitUserOp` (Phase 2) → `pollReceipt` (Phase 3)

### Response types from backend:
- `DeployAndExecuteResponse`: nonce, gas limits, paymaster fields as strings
- `SubmitUserOpResponse`: userOpHash
- `PollReceiptResponse`: userOpHash, transactionHash, success, blockNumber, status

### UserOp building:
- InitCode = factory(42 hex chars) + factoryData(rest), for v0.7 format
- Only add factory/factoryData fields if initCode is non-empty ('0x' means already deployed)
- Use `estimateFeesPerGas()` from publicClient for gas prices with fallback values
