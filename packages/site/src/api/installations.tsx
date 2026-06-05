export type SkillConfig = Record<string, any>; // Placeholder for skillConfigSchema

export type PrepareSmartAccount = {
  userAddress: string;
  smartAccountAddress: string;
  chainId: number;
  skillId: string;
  skillType?: string;
  config: string;
};

// export interface PermissionReview {
//   prepareId: string;
//   skill: { skillId: string; name: string; adapter: string };
//   chainId: number;
//   smartAccountstring: string;
//   delegate: string;
//   feeCollector: string;
//   paymentToken: string;
//   requiredPaymentAmount: string;
//   amountOut?: string;
//   minAmountOut?: string;
//   allowedTargets: Array<{ string: string; label: string }>;
//   allowedSelectors: Array<{ selector: string; label: string }>;
//   delegationScope: {
//     type: 'function-call';
//     targets: string[];
//     selectors: HexString[];
//     valueLte: { maxValue: '0x0' };
//   };
//   previewCalls: PreparedExecutionCall[];
//   prepareSnapshot: Record<string, unknown>;
//   expiresAt: string;
// }

export const prepareInstallation = async (
  body: PrepareSmartAccount,
): Promise<any> => {
  const response = await fetch(`${process.env.API_URL}/installations/prepare`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  return await response.json();
};
// Hook implementation will go here
