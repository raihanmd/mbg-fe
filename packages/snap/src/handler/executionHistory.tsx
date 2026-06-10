import {
  Box,
  Button,
  Divider,
  Heading,
  Row,
  Bold,
  Text,
  Section,
  Link,
  Address,
  Banner,
  Copyable,
} from '@metamask/snaps-sdk/jsx';
import {
  getInstallationExecutions,
  getInstallationById,
} from '../api/installations';
import {
  shortenAddress,
  formatDate,
  formatExecutionStatus,
  statusEmoji,
  formatTokenAmount,
  getExplorerTxUrl,
} from '../utils/format';

export const handleExecutionHistory = async ({
  id,
  installationId,
}: {
  id: string;
  installationId: string;
}): Promise<void> => {
  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: (
        <Box>
          <Heading>Execution History</Heading>
          <Text>Loading execution data...</Text>
        </Box>
      ),
    },
  });

  try {
    const [installation, executionsResp] = await Promise.all([
      getInstallationById(installationId),
      getInstallationExecutions(installationId),
    ]);

    const skillName =
      installation.skillId?.name ??
      installation.skillId?.skillId ??
      'Unknown';
    const rawAmount =
      (installation.parameters?.amountUsdc ??
        installation.parameters?.amountPerRun) as string | undefined;
    const humanAmount = rawAmount
      ? `${formatTokenAmount(rawAmount)} USDC`
      : '';
    const tokenTarget = installation.parameters?.outputToken
      ? ` → ${(installation.parameters.outputToken as string).toUpperCase()}`
      : '';

    const executions = executionsResp.data ?? [];

    await snap.request({
      method: 'snap_updateInterface',
      params: {
        id,
        ui: (
          <Box>
            <Button name="nav:home">← Back to Home</Button>
            <Divider />

            <Heading>Execution History</Heading>

            <Section>
              <Row label="Skill">
                <Text>
                  <Bold>{skillName}</Bold>
                </Text>
              </Row>
              {humanAmount && (
                <Row label="DCA">
                  <Text>
                    {humanAmount}
                    {tokenTarget}
                  </Text>
                </Row>
              )}
              <Row label="Status">
                <Text>
                  {statusEmoji(installation.status)}{' '}
                  {formatExecutionStatus(installation.status)}
                </Text>
              </Row>
              {installation.nextExecutionAt && (
                <Row label="Next Run">
                  <Text>{formatDate(installation.nextExecutionAt)}</Text>
                </Row>
              )}
              <Row label="Smart Account">
                <Address address={installation.smartAccountAddress} />
              </Row>
              <Copyable value={installation.smartAccountAddress} />
            </Section>

            <Divider />

            {executions.length === 0 ? (
              <Banner title="No Executions" severity="info">
                <Text>
                  No executions recorded yet for this installation. It
                  will appear here after the first run.
                </Text>
              </Banner>
            ) : (
              <Box>
                <Text>
                  <Bold>{`Executions (${executions.length})`}</Bold>
                </Text>
                {executions
                  .slice()
                  .reverse()
                  .map((exec) => (
                    <Box key={exec.executionId}>
                      <Divider />
                      <Section>
                        <Row label="Time">
                          <Text>{formatDate(exec.executedAt)}</Text>
                        </Row>
                        <Row
                          label="Status"
                          variant={
                            exec.status === 'failed'
                              ? 'error'
                              : exec.status === 'skipped'
                                ? 'warning'
                                : 'default'
                          }
                        >
                          <Text>
                            {statusEmoji(exec.status)}{' '}
                            {formatExecutionStatus(exec.status)}
                          </Text>
                        </Row>
                        {exec.txHash && (
                          <Row label="Transaction">
                            <Link
                              href={getExplorerTxUrl(
                                installation.chainId,
                                exec.txHash,
                              )}
                            >
                              {shortenAddress(exec.txHash, 8)}
                            </Link>
                          </Row>
                        )}
                        {exec.skippedReason && (
                          <Row label="Reason">
                            <Text>{exec.skippedReason}</Text>
                          </Row>
                        )}
                        {exec.errorMessage && (
                          <Row label="Error">
                            <Text color="error">
                              {exec.errorMessage}
                            </Text>
                          </Row>
                        )}
                        {exec.aiContext && (
                          <Row label="AI Context">
                            <Text>{exec.aiContext}</Text>
                          </Row>
                        )}
                      </Section>
                    </Box>
                  ))}
              </Box>
            )}

            <Divider />
            <Button name="nav:home">← Back to Home</Button>
          </Box>
        ),
      },
    });
  } catch (error: any) {
    await snap.request({
      method: 'snap_updateInterface',
      params: {
        id,
        ui: (
          <Box>
            <Button name="nav:home">← Back to Home</Button>
            <Divider />
            <Banner title="Error" severity="danger">
              <Text>
                {error?.message ??
                  'Something went wrong loading execution history.'}
              </Text>
            </Banner>
          </Box>
        ),
      },
    });
  }
};
