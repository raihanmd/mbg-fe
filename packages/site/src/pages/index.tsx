import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Card } from '../components';
import { defaultSnapOrigin } from '../config';
import {
  useMetaMask,
  useInvokeSnap,
  useMetaMaskContext,
  useRequestSnap,
  useRequest,
} from '../hooks';
import { isLocalSnap } from '../utils';
import HeroSections from '../components/HeroSections';
import HowToUse from '../components/HowToUse';
import { Toaster } from '../components';


const Index = () => {
  const { error } = useMetaMaskContext();
  const { isFlask, snapsDetected, installedSnap } = useMetaMask();
  const invokeSnap = useInvokeSnap();
  const isMetaMaskReady = isLocalSnap(defaultSnapOrigin)
    ? isFlask
    : snapsDetected;

  return (
    <div className="flex flex-col w-full items-center justify-start pb-20">
      {/* Header is rendered by App component */}
      <HeroSections />
      <HowToUse />
    
      <Toaster error={error} />
    </div>
  );
};

export default Index;
