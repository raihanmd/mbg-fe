import {
  Box,
  Button,
  Heading,
  Text,
  Section,
  Row,
  Divider,
  Bold,
  Banner,
} from '@metamask/snaps-sdk/jsx';
import {
  revokeInstallation,
  pauseInstallation,
  resumeInstallation,
} from '../api/installations';

const ACTION_LABELS = {
  revoke: 'Revoke',
  pause: 'Pause',
  resume: 'Resume',
} as const;

const ACTION_PAST_TENSE = {
  revoke: 'revoked',
  pause: 'paused',
  resume: 'resumed',
} as const;

const DESCRIPTIONS = {
  revoke:
    'This will permanently revoke the skill installation and remove all permissions. Execution will stop immediately.',
  pause:
    'This will temporarily pause the skill execution. The configuration will be preserved and can be resumed later.',
  resume:
    'This will resume the skill execution from its paused state.',
} as const;

type Action = keyof typeof ACTION_LABELS;

/**
 * Shows confirmation UI for managing a skill (revoke/pause/resume).
 * The confirm button triggers a ButtonClickEvent with name pattern:
 * confirm-manage:{installationId}:{action}
 *
 * When confirmed, onUserInput should call executeManageAction to
 * perform the actual API call and show the result UI.
 */
export const handleManageSkill = async ({
  id,
  installationId,
  action,
  userAddress,
  skillName,
}: {
  id: string;
  installationId: string;
  action: Action;
  userAddress: string;
  skillName: string;
}): Promise<void> => {
  const label = ACTION_LABELS[action];

  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: (
        <Box>
          <Button name="nav:home">{'← Back to Home'}</Button>
          <Divider />
          <Heading>Manage Skill</Heading>
          <Section>
            <Row label="Skill">
              <Text>
                <Bold>{skillName}</Bold>
              </Text>
            </Row>
            <Row label="Action">
              <Text>{label}</Text>
            </Row>
            <Row label="Description">
              <Text>{DESCRIPTIONS[action]}</Text>
            </Row>
            <Row label="Smart Account">
              <Text>{userAddress}</Text>
            </Row>
          </Section>
          <Button
            name={`confirm-manage:${installationId}:${action}`}
            variant="primary"
          >
            {label}
          </Button>
          <Button name="nav:home">Cancel</Button>
        </Box>
      ),
    },
  });
};

/**
 * Executes a confirmed skill management action.
 * Shows processing → calls API → shows success/error result.
 *
 * Intended to be called from onUserInput when a ButtonClickEvent
 * with name `confirm-manage:{installationId}:{action}` is received.
 */
export const executeManageAction = async ({
  id,
  installationId,
  action,
  userAddress,
  skillName,
}: {
  id: string;
  installationId: string;
  action: Action;
  userAddress: string;
  skillName: string;
}): Promise<void> => {
  const label = ACTION_LABELS[action];
  const pastTense = ACTION_PAST_TENSE[action];

  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: (
        <Box>
          <Heading>Processing {label}</Heading>
          <Text>Processing {label.toLocaleLowerCase()} request...</Text>
        </Box>
      ),
    },
  });

  try {
    switch (action) {
      case 'revoke':
        await revokeInstallation(installationId, userAddress);
        break;
      case 'pause':
        await pauseInstallation(installationId, userAddress);
        break;
      case 'resume':
        await resumeInstallation(installationId, userAddress);
        break;
    }

    await snap.request({
      method: 'snap_updateInterface',
      params: {
        id,
        ui: (
          <Box>
            <Banner title="Action Successful" severity="success">
              <Text>
                {skillName} has been {pastTense}.
              </Text>
            </Banner>
            <Button name="nav:home">Back to Home</Button>
          </Box>
        ),
      },
    });
  } catch (error: any) {
    const errorMsg =
      error?.message ?? 'Something went wrong. Please try again.';

    await snap.request({
      method: 'snap_updateInterface',
      params: {
        id,
        ui: (
          <Box>
            <Banner title="Action Failed" severity="danger">
              <Text>{errorMsg}</Text>
            </Banner>
            <Button name="nav:home">Back to Home</Button>
          </Box>
        ),
      },
    });
  }
};
