import { Box,Heading,Text } from "@metamask/snaps-sdk/jsx";
import { confirmInstallation } from "../api/installations";
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
const currentInterfaceId = event.context;
    const { resp, parameters } = state?.pendingInstallation || {};

    if (!resp || !resp.delegation) {
      throw new Error(
        'Installation session expired. Please re-configure your skill.',
      );
	}
    const originalDelegation = resp.delegation;
	
const typedData = {
  domain: {
    name: 'MetaMask Hybrid Smart Account', // 👈 Sesuaikan dengan nama domain ERC-5267 dari SDK kamu
    version: '1',
    chainId: resp.chainId, // Base Sepolia
    verifyingContract: originalDelegation.delegator, // Biasanya smart account address
  },
  types: {
    // Definisikan struct EIP-712 yang sesuai dengan skema Delegation kamu
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
      { name: 'args', type: 'bytes' },
    ],
  },
  primaryType: 'Delegation',
  message: {
    delegate: originalDelegation.delegate,
    delegator: originalDelegation.delegator,
    authority: originalDelegation.authority,
    caveats: originalDelegation.caveats,
    salt: BigInt(originalDelegation.salt).toString(), // Pastikan salt aman jika berupa hex/large int
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
    const confirmResp = await confirmInstallation(confirmBody);
    console.log('Installation confirmed:', confirmResp);

    // 5. Show success screen to the user
    await snap.request({
      method: 'snap_updateInterface',
      params: {
       id: currentInterfaceId,
        ui: (
          <Box>
            <Heading>Robot Activated</Heading>
            <Text>
              Your DCA Automation Skill has been successfully signed and
              activated on the server. The bot is now running.
            </Text>
          </Box>
        ),
      },
    });
    return;
}