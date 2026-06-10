import { Box,Button,Form,Heading,Text } from "@metamask/snaps-sdk/jsx";
import { confirmInstallation } from "../api/installations";
import { getSmartAccountsEnvironment } from '@metamask/smart-accounts-kit';
export const handleConfirmInstallation = async ({
  id,
  event,
  skillId,
  userAddress,
  smartAccountAddress,
}: {
  id: string;
  event: any;
  skillId: string;
  userAddress: string;
  smartAccountAddress: string;
}) => {
  
    const state = (await snap.request({
      method: 'snap_manageState',
      params: { operation: 'get' },
    })) as any;
    const { resp, parameters } = state?.pendingInstallation || {};
    if (!resp || !resp.delegation) {
      throw new Error(
        'Installation session expired. Please re-configure your skill.',
      );
    }
    const originalDelegation = resp.delegation;
    const environment = getSmartAccountsEnvironment(resp.chainId);
	
const typedData = {
  domain: {
    name: 'DelegationManager',
    version: '1',
    chainId: resp.chainId, // Base Sepolia
    verifyingContract: environment.DelegationManager, // Biasanya smart account address
  },
  types: {
    EIP712Domain: [
      { name: 'name', type: 'string' },
      { name: 'version', type: 'string' },
      { name: 'chainId', type: 'uint256' },
      { name: 'verifyingContract', type: 'address' },
    ],
    Delegation: [
      { name: 'delegate', type: 'address' },
      { name: 'delegator', type: 'address' },
      { name: 'authority', type: 'bytes32' },
      { name: 'caveats', type: 'Caveat[]' },
      { name: 'salt', type: 'uint256' },
    ],
    Caveat: [
      { name: 'enforcer', type: 'address' },
      { name: 'terms', type: 'bytes' },
    ],
  },
  primaryType: 'Delegation',
  message: {
    delegate: originalDelegation.delegate,
    delegator: originalDelegation.delegator,
    authority: originalDelegation.authority,
    caveats: originalDelegation.caveats.map((c: any) => ({
      enforcer: c.enforcer,
      terms: c.terms,
    })),
    salt: originalDelegation.salt,
  },
};
    const salt = resp.salt;

    // 2. Request the user to sign the typed data via MetaMask
    // Gunakan window.ethereum atau ethereum jika objek 'provider' belum dideklarasikan di file global
    const signature = (await (window as any).ethereum.request({
      method: 'eth_signTypedData_v4',
      params: [
        userAddress,
        typedData, // 👈 Kirim objek langsung, jika masih eror baru coba JSON.stringify(typedData)
      ],
    })) as string;

    // 3. Construct the payload matching ConfirmInstallationDto
    const confirmBody = {
      skillId,
      userAddress: userAddress,
      smartAccountAddress: smartAccountAddress,
      delegationSalt: salt, // Sekarang sudah aman karena mengambil dari resp.salt
      signedDelegation: {
        ...originalDelegation,
        signature: signature,
      },
      parameters: parameters,
    };

    // 4. Send the data to your NestJS confirm endpoint
    await confirmInstallation(confirmBody);

  
    return;
}