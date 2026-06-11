# Smart Account Address Flow Audit

Date: 2026-06-11
Scope: prepare-installation → confirm-installation → installation creation

---

## 1. Source of Truth: `getSmartAccountAddressInSnap()`

**File:** `packages/snap/src/utils/smartAccount.ts` (lines 124-132)

```typescript
export const getSmartAccountAddressInSnap = async (params = {}) => {
  const { eoaAddress, smartAccount } = await getSmartAccount(params);
  return {
    userAddress: eoaAddress,
    smartAccountAddress: smartAccount.address,
  };
};
```

- `userAddress` is always the **EOA address** (from `ethereum.request({ method: 'eth_requestAccounts' })`)
- `smartAccountAddress` is the **smart account address** from `toMetaMaskSmartAccount()`
- Depends on two inputs: `chainId` (default: 84532 Base Sepolia) and `accountType` (default: '4337')

## 2. Address Derivation by Account Type

**File:** `packages/snap/src/utils/smartAccount.ts` (lines 96-114)

### ERC-7702:
```typescript
smartAccount = await toMetaMaskSmartAccount({
  implementation: Implementation.Stateless7702,
  address: eoaAddress,  // ← EOA address directly
  signer: { walletClient },
});
```
→ `smartAccount.address === eoaAddress` (smartAccountAddress === userAddress). **CORRECT for 7702.**

### ERC-4337:
```typescript
smartAccount = await toMetaMaskSmartAccount({
  implementation: Implementation.Hybrid,
  deployParams: [eoaAddress, [], [], []],
  deploySalt: '0x...887',
  signer: { walletClient },
});
```
→ `smartAccount.address` is a counterfactual address (derived from factory + deploySalt + deployParams). Different from eoaAddress. **CORRECT for 4337.**

---

## 3. Where `getSmartAccountAddressInSnap()` Is Called

### 3a. `buildHomeContent()` ✅ PASSES accountType
**File:** `packages/snap/src/index.tsx` (lines 53-57)
```typescript
const { userAddress, smartAccountAddress } =
  await getSmartAccountAddressInSnap({
    chainId: selectedChainId,
    accountType: selectedAccountType,  // ← passes user's selection
  });
```
**Status: CORRECT.** Reads the user's selected chain AND account type from persisted state. For 7702, this returns `smartAccountAddress === userAddress`.

### 3b. `skill-selector-form` handler ❌ MISSING accountType
**File:** `packages/snap/src/index.tsx` (lines 307-308)
```typescript
const { smartAccountAddress } =
  await getSmartAccountAddressInSnap({ chainId: selectedChainId });
//                           ↖ accountType NOT passed — defaults to '4337'
```
**Status: BUG.** Only passes `chainId`, omits `accountType`. `getSmartAccountAddressInSnap` → `getSmartAccount` defaults `accountType` to `'4337'`. If user selected `'7702'`, the returned `smartAccountAddress` will be the **4337 counterfactual address**, NOT the EOA. This means:
- The ID displayed in the configure-skill UI may be wrong
- The address passed to subsequent prepare/confirm may be wrong

### 3c. `prepare-installation-form` handler ❌ MISSING chainId AND accountType
**File:** `packages/snap/src/index.tsx` (lines 323-324)
```typescript
const { userAddress, smartAccountAddress } =
  await getSmartAccountAddressInSnap();  // ← no params at all!
```
**Status: BUG.** Uses defaults: chainId=84532 (Base Sepolia), accountType='4337'. If user selected a different chain OR 7702, BOTH addresses will be computed against the wrong configuration.

### 3d. `sign-delegation-form` handler ❌ MISSING chainId AND accountType
**File:** `packages/snap/src/index.tsx` (lines 342-343)
```typescript
const { userAddress, smartAccountAddress } =
  await getSmartAccountAddressInSnap();  // ← no params at all!
```
**Status: BUG.** Same issue as 3c. The confirm step uses addresses from default config, not the user's actual selection.

---

## 4. What Gets Sent to Backend — Prepare

**File:** `packages/snap/src/handler/prepareInstallation.tsx` (lines 69-74)
```typescript
const body = {
  skillId: selectedSkillId,
  userAddress: userAddress,
  smartAccountAddress: smartAccountAddress,
  parameters: parametersArray as any,
};
```
Sent to `POST /installations/prepare` as JSON.

## 5. What Gets Sent to Backend — Confirm

**File:** `packages/snap/src/handler/confirmInstallation.tsx` (lines 82-92)
```typescript
const confirmBody = {
  skillId,
  userAddress: userAddress,
  smartAccountAddress: smartAccountAddress,
  delegationSalt: salt,
  signedDelegation: { ...originalDelegation, signature: signature },
  parameters: parameters,
};
```
Sent to `POST /installations/confirm` as JSON.

## 6. Type Mismatch in confirmInstallation API

**File:** `packages/snap/src/api/installations.tsx` (lines 41-53)
```typescript
export const confirmInstallation = async (
  body: PrepareInstallation,  // ← WRONG TYPE
): Promise<PrepareInstallationResponse> => {
```

`PrepareInstallation` is `{ skillId, userAddress, smartAccountAddress, parameters? }` but the actual body includes `delegationSalt` and `signedDelegation`. This is a **TypeScript type error** — the type doesn't match the actual payload. Works at runtime (extra fields are sent), but TypeScript would catch it if `strict` enough.

## 7. Backend Installation Record

Based on `InstallationItem` type in `packages/snap/src/types/installationResponse.ts` (lines 57-73):
```typescript
interface InstallationItem {
  _id: string;
  userAddress: string;         // ← EOA address
  smartAccountAddress: string; // ← Smart account address
  skillId: SkillId;
  signedDelegation: SignedDelegation;
  delegationSalt: string;
  chainId: number;
  parameters: InstallationParameters;
  status: InstallationStatus;
  // ...
}
```
The installation record stores BOTH `userAddress` and `smartAccountAddress`. The backend creates this record in the confirm endpoint.

## 8. Signature Request Uses userAddress

**File:** `packages/snap/src/handler/confirmInstallation.tsx` (lines 73-79)
```typescript
const signature = await (window as any).ethereum.request({
  method: 'eth_signTypedData_v4',
  params: [userAddress, typedData],
});
```
The EIP-712 signature is signed by `userAddress` (the EOA), which is correct for both account types.

## 9. Minor: extractedRunType Passed But Ignored

**File:** `packages/snap/src/index.tsx` (line 332) passes `extractedRunType: extractedRunType!` to `handlePrepareInstallation`, but `prepareInstallation.tsx` (lines 17-29) doesn't destructure this parameter. It's silently ignored — not harmful, but dead code.

---

## Summary of Issues

| # | Severity | Location | Issue |
|---|----------|----------|-------|
| 1 | **HIGH** | index.tsx:323-324 | `prepare-installation-form` handler calls `getSmartAccountAddressInSnap()` with NO params → defaults to chainId=84532, accountType='4337' regardless of user selection |
| 2 | **HIGH** | index.tsx:342-343 | `sign-delegation-form` handler (confirm) calls `getSmartAccountAddressInSnap()` with NO params → same default issue |
| 3 | **MEDIUM** | index.tsx:307-308 | `skill-selector-form` handler passes `chainId` but NOT `accountType` → defaults to '4337' even if user selected '7702' |
| 4 | **LOW** | installations.tsx:42 | `confirmInstallation` typed as `PrepareInstallation` but actual payload is different structure (`delegationSalt`, `signedDelegation`) |
| 5 | **LOW** | index.tsx:332 | `extractedRunType` passed to `handlePrepareInstallation` but never destructured/used |

### Root Cause
All three HIGH/MEDIUM issues stem from the same root: `getSmartAccountAddressInSnap()` is called without the user's persisted `accountType` (and sometimes `chainId`), so it falls back to defaults. For 7702 users, this means `smartAccountAddress` is computed as a 4337 counterfactual address instead of the EOA address.

### For 7702: What Should Happen
- `smartAccountAddress` should equal `userAddress` (the EOA)
- This is correctly implemented in `getSmartAccount()` for 7702 — the issue is just that the callers don't ask for 7702

### Fix
All three callers of `getSmartAccountAddressInSnap()` (at lines 308, 324, 343) should pass both `chainId` and `accountType` from persisted state, matching what `buildHomeContent()` does at lines 53-57.

---

## 10. LIBRARY-CONFIRMED: `toMetaMaskSmartAccount` Address Derivation for 7702

**File:** `node_modules/@metamask/smart-accounts-kit/dist/index.cjs` (lines 251-267)
**Version:** `@metamask/smart-accounts-kit@1.6.0`

The library source confirms the exact logic:

```javascript
let address, factoryData;
if (params.address) {                 // ← 7702 passes address param
    factoryData = void 0;
    address = params.address;          // ← DIRECT assignment: address = eoaAddress
} else {
    if (implementation === "Stateless7702") {
        throw new Error("Stateless7702 does not support counterfactual accounts");
    }
    const accountData = await getCounterfactualAccountData({
        factory: environment.SimpleFactory,
        implementations: environment.implementations,
        implementation,
        deployParams: params.deployParams,
        deploySalt: params.deploySalt
    });
    address = accountData.address;     // ← counterfactual computed address
    factoryData = accountData.factoryData;
}
```

And `getAddress` is then simply:
```javascript
const getAddress = async () => address;  // returns params.address for 7702
```

**CONCLUSION: For 7702, `smartAccount.address === eoaAddress` at the library level. ✅ The derivation itself is correct.**

The problem is solely in **which parameters callers pass** to `getSmartAccountAddressInSnap()`.

## 11. Default Mismatch: Two Different '4337' vs '7702' Defaults

| Function | Default | File:Line |
|----------|---------|-----------|
| `getSmartAccount()` → `accountType` param default | `'4337'` | `smartAccount.ts:62` |
| `getSelectedAccountType()` return default | `'7702'` | `smartAccount.ts:188` |

This means:
- Code calling `getSelectedAccountType()` (like `buildHomeContent`) gets `'7702'` as default → **correct for the 7702-first UI**
- Code calling `getSmartAccountAddressInSnap()` without params gets `'4337'` → **wrong if user intends 7702**

The UI only renders a `'7702'` selector option (index.tsx:96-101), so the persisted state always becomes/stays `'7702'` after first form submit. But the internal function default in `getSmartAccount` contradicts this.

## 12. Deployment Status Check (isDeployed) Flow

### 12a. `buildHomeContent()` — index.tsx:63
```typescript
const isDeployed = selectedAccountType === '7702' || await checkDeployed(smartAccountAddress, selectedChainId);
```
For 7702: **skips** `checkDeployed` entirely → always shows "✅ Deployed" ✓
For 4337: calls `checkDeployed(smartAccountAddress, chainId)` — uses the correct address ✓

### 12b. `skillSelectorForm.tsx` — lines 36-61
```typescript
const accountType = await getSelectedAccountType();
if (accountType === '4337') {
    const isDeployed = await checkDeployed(smartAccountAddress);
    // ...
}
```
For 7702: skips deployment check ✓
For 4337: checks `smartAccountAddress` — **but this address was derived with default `accountType='4337'` at the call site in index.tsx:307-308, so it's coincidentally correct for 4337**. For 7702 the check is skipped entirely so the wrong address doesn't matter here.

### 12c. `deploySmartAccount.tsx` — lines 259-298
- Reads `accountType` from `getSelectedAccountType()` ✓
- For 7702: calls `deploy7702()` which just shows info message (no actual transaction) ✓
- For 4337: calls `deploy4337()` which calls `getSmartAccount({ chainId, accountType: '4337' })` with explicit type ✓

## 13. Analysis of `getAllInstalledSkills` Usage

**File:** `packages/snap/src/api/installations.tsx:55-63`
```typescript
export const getAllInstalledSkills = async (userAddress: string) => {
    const response = await globalThis.fetch(
        `${API_URL}/installations?userAddress=${userAddress}`,
    );
    ...
};
```

Used in `buildHomeContent()` (index.tsx:60):
```typescript
getAllInstalledSkills(userAddress)  // ← uses EOA address
```

**This is correct** for both account types because:
- Backend installations are keyed/looked up by `userAddress` (the EOA) per the `InstallationItem` type
- For 7702, `userAddress === smartAccountAddress` anyway
- For 4337, the installations are associated with the EOA, not the counterfactual address

## 14. Execution History — Uses Backend-Stored Address

**File:** `packages/snap/src/handler/executionHistory.tsx`

Reads `installation.smartAccountAddress` from the **backend response** (not re-derived):
```typescript
<Address address={installation.smartAccountAddress} />
```

This is the address that was stored when the installation was created on the backend. It will show whatever the backend has — if the wrong address was sent during `confirmInstallation`, the wrong address will be displayed in execution history.

## 15. Delegation Signature: `verifyingContract` Clarification

**File:** `packages/snap/src/handler/confirmInstallation.tsx:36`

```typescript
verifyingContract: environment.DelegationManager, // Biasanya smart account address
```

The comment ("Usually the smart account address") is **misleading**. For ERC-7710 delegations, the `verifyingContract` in the EIP-712 domain is always `DelegationManager`, **not** the smart account. This is correct code with a wrong comment.

## 16. Key Insight: No `accountType` Propagation in Installation Flow

The installation flow is:
1. Home page → user selects skill → `skill-selector-form` submit
2. Skill config → user fills params → `prepare-installation-form` submit
3. Delegation review → user signs → `sign-delegation-form` submit

At step 1, `getSmartAccountAddressInSnap()` is called with only `chainId` (no `accountType`)
At steps 2 & 3, `getSmartAccountAddressInSnap()` is called with **no params at all**

The `accountType` is never read from persisted state and passed through during the installation flow. Each step re-derives addresses independently with wrong defaults.

## 17. Updated Issue Matrix

| # | Severity | Location | Issue | For 7702 Effect |
|---|----------|----------|-------|-----------------|
| 1 | **HIGH** | index.tsx:323-324 | `prepare-installation-form` calls `getSmartAccountAddressInSnap()` with NO params | Derives 4337 counterfactual address instead of EOA address |
| 2 | **HIGH** | index.tsx:342-343 | `sign-delegation-form` calls `getSmartAccountAddressInSnap()` with NO params | Derives 4337 counterfactual address instead of EOA address |
| 3 | **MEDIUM** | index.tsx:307-308 | `skill-selector-form` passes `chainId` but NOT `accountType` | Derives 4337 counterfactual address instead of EOA address |
| 4 | **MEDIUM** | smartAccount.ts:62 | `getSmartAccount()` defaults `accountType` to `'4337'` which contradicts `getSelectedAccountType()` default of `'7702'` | Callers that don't pass `accountType` always get 4337 behavior |
| 5 | **LOW** | installations.tsx:42 | `confirmInstallation` typed as `PrepareInstallation` but actual payload different | Runtime works; type mismatch |
| 6 | **LOW** | confirmInstallation.tsx:36 | Comment says "Biasanya smart account address" but DelegationManager is correct | Misleading comment only |

### Fix Required
In `index.tsx`, all three installation-flow callers of `getSmartAccountAddressInSnap()` must be updated to pass the user's persisted selection:

```typescript
// Before (line 307-308):
const { smartAccountAddress } = await getSmartAccountAddressInSnap({ chainId: selectedChainId });

// After:
const selectedAccountType = await getSelectedAccountType();
const { smartAccountAddress } = await getSmartAccountAddressInSnap({
    chainId: selectedChainId,
    accountType: selectedAccountType,
});
```

And similarly for lines 323-324 and 342-343.
