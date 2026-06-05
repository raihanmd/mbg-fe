import React, { useEffect, useState } from 'react';
import { getSkillById } from '../../api/skills';
import { useInvokeSnap } from '../../hooks';

const SkillDetail = ({ params }: { params: { id: string } }) => {
  const [skill, setSkill] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [connectLoading, setConnectLoading] = useState(false);
  const [selectorLoading, setSelectorLoading] = useState(false);
  const invokeSnap = useInvokeSnap();

  useEffect(() => {
    const fetchSkill = async () => {
      try {
        const data = await getSkillById(params.id);
        setSkill(data);
      } catch (error) {
        console.error('Error fetching skill:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchSkill();
    }
  }, [params.id]);

  const handleConnectAndPrepare = async () => {
    setConnectLoading(true);
    try {
      // === STEP 1: Connect MetaMask - get EOA ===
      console.log('--- [Step 1] Requesting accounts from MetaMask...');
      const accounts: string[] = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
      console.log('[Step 1] ✅ MetaMask accounts:', accounts);

      const userAddress = accounts[0];
      console.log('[Step 1] Using EOA address:', userAddress);

      // === STEP 2: Get Chain ID ===
      console.log('--- [Step 2] Getting chainId...');
      const chainIdHex: string = await (window as any).ethereum.request({ method: 'eth_chainId' });
      const chainId = parseInt(chainIdHex, 16);
      console.log('[Step 2] ✅ ChainId (hex):', chainIdHex, '=> (decimal):', chainId);

      // === STEP 3: Build prepareInstallation payload ===
      const skillData = skill?.payload ?? skill;
      const body = {
        userAddress,
        smartAccountAddress: userAddress, // using EOA as fallback until SA is deployed
        chainId,
        skillId: skillData?.skillId ?? params.id,
        config: ""
      };
      console.log('--- [Step 3] prepareInstallation payload:', body);

      // === STEP 4: Call prepareInstallation API ===
      console.log('--- [Step 4] Calling POST /installations/prepare ...');
      const { prepareInstallation } = await import('../../api/installations');
      const result = await prepareInstallation(body);
      console.log('[Step 4] ✅ prepareInstallation response:', result);
      console.log('[Step 4] Full response (JSON):\n', JSON.stringify(result, null, 2));

      alert(`✅ prepareInstallation Success!\n\nKeys returned: ${Object.keys(result ?? {}).join(', ')}\n\nCheck console (F12) for full response.`);
    } catch (error: any) {
      console.error('❌ Error during connect/prepare:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setConnectLoading(false);
    }
  };

  const handleOpenSnapSelector = async () => {
    setSelectorLoading(true);
    try {
      const skillData = skill?.payload ?? skill;
      console.log('[Snap] Calling wallet_invokeSnap with method: select_skill...');

      const interfaceId = await invokeSnap({
        method: 'select_skill',
        params: {
          skills: [
            {
              skillId: skillData?.skillId ?? params.id,
              name: skillData?.name ?? 'This Skill',
              description: skillData?.description ?? 'DCA Strategy',
            },
          ],
        },
      });

      console.log('[Snap] ✅ snap_createInterface returned interfaceId:', interfaceId);
      console.log('[Snap] Full response:', JSON.stringify(interfaceId, null, 2));
    } catch (error: any) {
      console.error('[Snap] ❌ Error invoking snap:', error);
      alert(`Snap error: ${error.message}`);
    } finally {
      setSelectorLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen items-center justify-start bg-gradient-to-b from-[var(--color-bg)] to-[#0a192f] text-white">
      <div className="w-full max-w-4xl px-6 py-24">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
          </div>
        ) : skill ? (
          <div className="bg-white/5 p-10 rounded-3xl border border-white/10 backdrop-blur-md shadow-2xl">
            <div className="inline-block px-4 py-1.5 rounded-full bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[var(--color-primary-light)] font-semibold text-sm tracking-wider uppercase mb-6">
              Skill Details
            </div>
            
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
              {skill.payload?.name || skill.name}
            </h1>
            
            <p className="text-xl text-gray-300 leading-relaxed mb-10 font-light">
              {skill.payload?.description || skill.description}
            </p>
            
            {/* Additional Info Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div className="bg-black/20 p-6 rounded-2xl border border-white/5">
                <span className="block text-sm text-gray-500 mb-1">Adapter</span>
                <span className="text-lg font-medium text-gray-200">{skill.payload?.adapter || skill.adapter || 'Unknown'}</span>
              </div>
              <div className="bg-black/20 p-6 rounded-2xl border border-white/5">
                <span className="block text-sm text-gray-500 mb-1">AI Mode</span>
                <span className="text-lg font-medium text-gray-200">{skill.payload?.aiMode || skill.aiMode || 'N/A'}</span>
              </div>
            </div>

            <div className="pt-8 border-t border-white/10 flex flex-wrap items-center gap-4 justify-between">
              <div className="flex flex-wrap gap-3">
                {/* Primary: Connect Smart Account & prepare installation */}
                <button 
                  className="bg-[var(--color-primary)] text-black px-8 py-4 rounded-xl font-bold hover:bg-[var(--color-primary-light)] hover:-translate-y-1 transition-all duration-300 shadow-[0_0_20px_rgba(0,200,83,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  onClick={handleConnectAndPrepare}
                  disabled={connectLoading}
                >
                  {connectLoading && (
                    <span className="inline-block w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  )}
                  {connectLoading ? 'Connecting...' : 'Connect Smart Account'}
                </button>

                {/* Secondary: Open MetaMask Snap Selector UI */}
                <button
                  className="border border-[var(--color-primary)]/50 text-[var(--color-primary-light)] px-8 py-4 rounded-xl font-bold hover:bg-[var(--color-primary)]/10 hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  onClick={handleOpenSnapSelector}
                  disabled={selectorLoading}
                >
                  {selectorLoading && (
                    <span className="inline-block w-4 h-4 border-2 border-[var(--color-primary)]/30 border-t-[var(--color-primary)] rounded-full animate-spin" />
                  )}
                  {selectorLoading ? 'Opening Snap...' : '🦊 Select via MetaMask Snap'}
                </button>
              </div>
              
              <button 
                className="text-gray-400 hover:text-white transition-colors"
                onClick={() => window.history.back()}
              >
                &larr; Back to Marketplace
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-red-400 mb-4">Skill not found</h2>
            <p className="text-gray-400">The requested skill ID ({params.id}) could not be loaded.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillDetail;
