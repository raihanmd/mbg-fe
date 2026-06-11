import { Header } from '../components/Header';
import Hero from '../components/Hero';
import Positioning from '../components/Positioning';
import HowItWorks from '../components/HowItWorks';
import Skills from '../components/Skills';
import PermissionModel from '../components/PermissionModel';
import Architecture from '../components/Architecture';
import FinalCTA from '../components/FinalCTA';
import { Footer } from '../components/Footer';
import { Toaster } from '../components';
import { useMetaMaskContext } from '../hooks';

const Index = () => {
  const { error } = useMetaMaskContext();
  return (
    <main className="page">
      <Hero />
      <Positioning />
      <HowItWorks />
      <Skills />
      <PermissionModel />
      <Architecture />
      <FinalCTA />
      <Toaster error={error} />
    </main>
  );
};

export default Index;
