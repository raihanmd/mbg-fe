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
import { useRecommendation, type SkillItem } from '../hooks/useRecommendation';
import SkillsCard from '../components/SkillsCard';

const Span = styled.span`
  color: ${(props) => props.theme.colors.primary?.default};
`;


const SkillGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.6rem;
  width: 100%;
  max-width: 64.8rem;
  margin-top: 1.5rem;
`;

const ErrorMessage = styled.div`
  background-color: ${({ theme }) => theme.colors.error?.muted};
  border: 1px solid ${({ theme }) => theme.colors.error?.default};
  color: ${({ theme }) => theme.colors.error?.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-bottom: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;
  ${({ theme }) => theme.mediaQueries.small} {
    padding: 1.6rem;
    margin-bottom: 1.2rem;
    margin-top: 1.2rem;
    max-width: 100%;
  }
`;

const Index = () => {
  const { error } = useMetaMaskContext();
  const { isFlask, snapsDetected, installedSnap } = useMetaMask();

  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [skillsLoading, setSkillsLoading] = useState(false);

  const isMetaMaskReady = isLocalSnap(defaultSnapOrigin)
    ? isFlask
    : snapsDetected;

  useEffect(() => {
    const loadSkills = async () => {
      setSkillsLoading(true);

      try {
        const data = await useRecommendation();
        setSkills(data);
      } catch {
        setSkills([]);
      } finally {
        setSkillsLoading(false);
      }
    };

    loadSkills().catch(() => setSkills([]));
  }, []);

  return (
    <div className="flex  flex-col w-full h-screen items-center justify-center">
      <div className="text-4xl font-bold mt-40  mb-4">
        DCA <Span>Wallet Skills</Span>
      </div>
      <div className="text-base font-medium mt-4 mb-4">
        Choose an asset, pick a schedule, and create an AI-assisted DCA skill.
        {error && (
          <ErrorMessage>
            <b>An error happened:</b> {error.message}
          </ErrorMessage>
        )}
        <SkillGrid>
          
          {skills.map((skill) => (
            <SkillsCard skill={skill} installedSnap={installedSnap} />
          ))}
        </SkillGrid>
      </div>
    </div>
  );
};

export default Index;
