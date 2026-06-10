import { prepareInstallation } from '../api/installations';
import { frequencyToCron } from '../utils/format';
import {
  Box,
  Button,
  Divider,
  Form,
  Row,
  Bold,
  Heading,
  Text,
  Section,
  Address,
  Copyable,
} from '@metamask/snaps-sdk/jsx';

export const handlePrepareInstallation = async ({
  id,
  event,
  selectedSkillId,
  userAddress,
  smartAccountAddress,
}: {
  id: string;
  event: any;
  selectedSkillId: string;
  userAddress: string;
  smartAccountAddress: string;
}) => {
  try {
    const formVals = event.value as Record<string, any>;
    console.log(formVals);

    const params: Record<string, any> = {};

    for (const [key, value] of Object.entries(formVals ?? {})) {
      if (key.startsWith('param-')) {
        const paramKey = key.slice(6);
        params[paramKey] = value;
      }
    }

    const freqParamKeys = Object.keys(params).filter((k) =>
      k.endsWith('_freqNum'),
    );
    for (const freqKey of freqParamKeys) {
      const targetKey = freqKey.slice(0, -8);
      const num = parseInt(params[freqKey], 10);
      const unit = params[`${targetKey}_freqUnit`] as
        | 'hours'
        | 'days'
        | 'weeks'
        | undefined;
      if (num > 0 && unit) {
        params[targetKey] = frequencyToCron(num, unit);
      }
      delete params[freqKey];
      delete params[`${targetKey}_freqUnit`];
    }

    console.log('Form values:', JSON.stringify(formVals));
    console.log('Extracted params:', JSON.stringify(params));

    const parametersArray = Object.entries(params).map(([key, value]) => ({
      key,
      value,
    }));

    const body = {
      skillId: selectedSkillId,
      userAddress: userAddress,
      smartAccountAddress: smartAccountAddress,
      parameters: parametersArray as any,
    };

    console.log('Request body:', JSON.stringify(body));

    const resp = await prepareInstallation(body);
    console.log('prepareInstallation response:', JSON.stringify(resp));
    await snap.request({
      method: 'snap_manageState',
      params: {
        operation: 'update',
        newState: {
          pendingInstallation: {
            resp,
            parameters: body.parameters,
          } as any,
        },
      },
    });
    await snap.request({
      method: 'snap_updateInterface',
      params: {
        id,
        ui: (
          <Box>
            <Heading>DCA Robot Activation 🤖</Heading>
            <Text>
              The installation payload has been prepared. Please review the
              automation delegation rules below before activation:
            </Text>
            <Divider />
            <Section>
              <Row label="Smart Account">
                <Address address={resp.delegation.delegator} />
              </Row>
              <Copyable value={resp.delegation.delegator} />
              <Row label="Bot Executor">
                <Address address={resp.executorAddress} />
              </Row>
              <Copyable value={resp.executorAddress} />
              <Row label="Network">
                <Text>
                  <Bold>Base Sepolia</Bold> ({resp.chainId.toString()})
                </Text>
              </Row>
              <Row label="Security Constraints">
                <Text>
                  <Bold>{resp.delegation.caveats.length.toString()}</Bold>{' '}
                  Active Rules
                </Text>
              </Row>
            </Section>
            <Divider />
            <Text>
              <Bold>Notice:</Bold> Clicking the button below will prompt a
              secure cryptographic signature request. This authorization is{' '}
              <Bold>gasless</Bold> and grants the permission to execute swaps
              strictly within the defined constraints.
            </Text>
            <Form name={`sign-delegation-form:${resp.skillId}`}>
              <Button type="submit" variant="primary">
                Sign and Activate Robot 🚀
              </Button>
            </Form>
          </Box>
        ),
      },
    });
    } catch (e: any) {
    console.error('prepareInstallation error', e);
    const status = e?.response?.status;
    let errorMsg = '';
    if (status === 409) {
      errorMsg = e?.response?.data?.message ?? 'Skill already installed.';
    } else {
      errorMsg = e?.response?.data?.message ?? e?.message ?? 'Unexpected error';
    }
    await snap.request({
      method: 'snap_updateInterface',
      params: {
        id,
        ui: (
          <Box>
            <Heading>Installation Error</Heading>
            <Text color="error">{errorMsg}</Text>
            <Button name="nav:home">Back to Home</Button>
          </Box>
        ),
      },
    });
  }
};
