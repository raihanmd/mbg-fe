# API Installations - Learnings

- Existing pattern: `globalThis.fetch` with explicit method/headers/body, then `handleResponse<T>()` for error handling + JSON parsing
- `handleResponse<T>` is already defined in the file — reuses generic error handling from existing code
- All new API functions follow consistent signature: `(installationId: string, userAddress: string) => Promise<{ message: string }>`
- DELETE endpoint works with body for revoke (sends `{ userAddress }`)
- PATCH endpoints for pause/resume use sub-paths: `/pause`, `/resume`
