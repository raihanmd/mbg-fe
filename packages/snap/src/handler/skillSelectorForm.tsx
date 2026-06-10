import { getSkillById } from "../api/skills";
import {
  Text,
  Bold,
  Selector,
  SelectorOption,
  Card,
  Box,
  Divider,
  Button,
  Form,
  Heading,
  Row,
  Input,
  Field,
  Section,
  Link,
  Address,
  Copyable,
} from "@metamask/snaps-sdk/jsx";

const handleSkillSelectorFormSubmit = async ({
  id,
  event,
  usdcRawBalance,
  smartAccountAddress,
}: {
  id: string;
  event: any;
  usdcRawBalance: string;
  smartAccountAddress: string;
}): Promise<void> => {
  const { checkDeployed } = await import("../utils/deployment");
  const isDeployed = await checkDeployed(smartAccountAddress);
  if (!isDeployed) {
    await snap.request({
      method: "snap_updateInterface",
      params: {
        id,
        ui: (
          <Box>
            <Heading>Smart Account Not Deployed</Heading>
            <Text>
              Your smart account must be deployed on-chain before installing a
              skill. Please deploy first from the home page.
            </Text>
            <Button name="nav:deploy-account" variant="primary">
              Deploy Now
            </Button>
            <Button name="nav:home">Back to Home</Button>
          </Box>
        ),
      },
    });
    return;
  }

  await snap.request({
    method: "snap_updateInterface",
    params: {
      id,
      ui: (
        <Box>
          <Heading>Loading Skill...</Heading>
          <Text>Fetching skill configuration.</Text>
        </Box>
      ),
    },
  });

  try {
    const formValues = event.value as Record<string, any>;
    const selectedSkillId = formValues?.["skill-selector"];

    if (!selectedSkillId) {
      throw new Error("No skill selected. Please choose a skill first.");
    }

    const selectedSkill = await getSkillById(selectedSkillId);

    if (!selectedSkill || !selectedSkill.parameters) {
      throw new Error("Failed to load skill data");
    }

    const skillName = selectedSkill.name;
    const skillDescription = selectedSkill.description;
    const chainId = selectedSkill.chainId;
    const parameters = (selectedSkill.parameters || []) as any[];
    const usdcHumanBalance = (Number(usdcRawBalance) / 1_000_000).toFixed(2);

    await snap.request({
      method: "snap_updateInterface",
      params: {
        id,
        ui: (
          <Form
            name={`prepare-installation-form:${selectedSkill.skillId}:${selectedSkill.runType}`}
          >
            <Button name="nav:home">← Back to Home</Button>
            <Divider />

            <Heading>Configure Skill</Heading>

            <Section>
              <Row label="Strategy">
                <Text>
                  <Bold>{skillName}</Bold>
                </Text>
              </Row>
              <Row label="Network">
                <Text>
                  {chainId === 84532 ? "Base Sepolia" : `Chain ${chainId}`}
                </Text>
              </Row>
              <Row label="Smart Account">
                <Address address={smartAccountAddress} />
              </Row>
              <Copyable value={smartAccountAddress} />
              {selectedSkill.runType === "cron" &&
                selectedSkill.cronExpression && (
                  <Row label="Schedule">
                    <Text>
                      {selectedSkill.cronExpression === "0 9 * * *"
                        ? "Everyday at 09:00"
                        : selectedSkill.cronExpression}
                    </Text>
                  </Row>
                )}
            </Section>

            <Divider />

            <Text>{skillDescription}</Text>

            <Divider />

            {selectedSkill.aiConfig && (
              <Section>
                <Row label="AI Provider">
                  <Text>{selectedSkill.aiConfig.provider}</Text>
                </Row>
                <Text>
                  Uses AI for pre-execution analysis before each run.
                </Text>
              </Section>
            )}

            <Text>
              Balance: <Bold>{usdcHumanBalance} USDC</Bold>
            </Text>

            <Text>
              <Bold>Configure Parameters:</Bold>
            </Text>

            {parameters.map((param: any) => {
              const paramName = `param-${param.key}`;
              switch (param.type) {
                case "select":
                  return (
                    <Box key={param.key}>
                      <Field label={param.label}>
                        <Selector
                          name={paramName}
                          title={param.label}
                          value={param.defaultValue}
                        >
                          {param.options.map((opt: any) => {
                            let desc = "Standard Token";
                            if (opt.metadata?.address) {
                              const addr = opt.metadata.address;
                              desc = `${addr.slice(0, 6)}...${addr.slice(-4)}`;
                            } else if (opt.metadata?.symbol) {
                              desc = `${opt.metadata.symbol} Token`;
                            } else if (opt.value) {
                              desc = `${opt.value.toUpperCase()} Token`;
                            }
                            return (
                              <SelectorOption
                                key={opt.value}
                                value={opt.value}
                              >
                                <Card
                                  title={
                                    opt.label || opt.value.toUpperCase()
                                  }
                                  value={desc}
                                />
                              </SelectorOption>
                            );
                          })}
                        </Selector>
                      </Field>
                      {param.description && (
                        <Text color="muted">{param.description}</Text>
                      )}
                    </Box>
                  );
                case "number":
                  return (
                    <Box key={param.key}>
                      <Field label={param.label}>
                        <Input
                          name={paramName}
                          type="number"
                          min={param.min ?? 0}
                          max={param.max}
                          step={param.integer ? 1 : undefined}
                          placeholder={param.defaultValue?.toString()}
                        />
                      </Field>
                      {param.description && (
                        <Text color="muted">{param.description}</Text>
                      )}
                    </Box>
                  );
                case "boolean":
                  return (
                    <Box key={param.key}>
                      <Field label={param.label}>
                        <Input
                          name={paramName}
                          type="text"
                          placeholder="true or false"
                        />
                      </Field>
                      {param.description && (
                        <Text color="muted">{param.description}</Text>
                      )}
                    </Box>
                  );
                case "string":
                  return (
                    <Box key={param.key}>
                      <Field label={param.label}>
                        <Input
                          name={paramName}
                          type="text"
                          placeholder={param.defaultValue?.toString()}
                        />
                      </Field>
                      {param.description && (
                        <Text color="muted">{param.description}</Text>
                      )}
                    </Box>
                  );
                case "address":
                  return (
                    <Box key={param.key}>
                      <Field label={param.label}>
                        <Input
                          name={paramName}
                          type="text"
                          placeholder="0x..."
                          value={param.defaultValue}
                        />
                      </Field>
                      {param.description && (
                        <Text color="muted">{param.description}</Text>
                      )}
                    </Box>
                  );
                case "cron": {
                  const cronDefault = (param.defaultValue ||
                    "0 */6 * * *") as string;
                  const hourMatch = cronDefault.match(/\*\/(\d+)/);
                  const dayMatch = cronDefault.match(/0 0 \*\/(\d+)/);
                  const weekMatch = cronDefault.match(/0 0 \* \* (\d+)/);
                  let defaultNum = 6;
                  let defaultUnit: "hours" | "days" | "weeks" = "hours";
                  if (weekMatch) {
                    defaultNum = parseInt(weekMatch[1], 10);
                    defaultUnit = "weeks";
                  } else if (dayMatch) {
                    defaultNum = parseInt(dayMatch[1], 10);
                    defaultUnit = "days";
                  } else if (hourMatch) {
                    defaultNum = parseInt(hourMatch[1], 10);
                  }
                  return (
                    <Box key={param.key}>
                      <Field label={param.label}>
                        <Input
                          name={`${paramName}_freqNum`}
                          type="number"
                          min={1}
                          value={String(defaultNum)}
                        />
                      </Field>
                      <Field label="Frequency">
                        <Selector
                          name={`${paramName}_freqUnit`}
                          title="Frequency"
                          value={defaultUnit}
                        >
                          <SelectorOption value="hours">
                            <Card
                              title="Hours"
                              value="Run every N hours"
                            />
                          </SelectorOption>
                          <SelectorOption value="days">
                            <Card
                              title="Days"
                              value="Run every N days"
                            />
                          </SelectorOption>
                          <SelectorOption value="weeks">
                            <Card
                              title="Weeks"
                              value="Run every N weeks"
                            />
                          </SelectorOption>
                        </Selector>
                      </Field>
                      {param.description && (
                        <Text color="muted">{param.description}</Text>
                      )}
                    </Box>
                  );
                }
                default:
                  return null;
              }
            })}

            <Divider />

            <Text>
              <Bold>Required Permissions</Bold>
            </Text>

            {selectedSkill.delegationScopeMeta?.length
              ? selectedSkill.delegationScopeMeta.map((meta: any) => (
                  <Section key={meta.targetIndex}>
                    <Row label="Contract">
                      <Text>
                        <Bold>{meta.label}</Bold>
                      </Text>
                    </Row>
                    {meta.description && <Text>{meta.description}</Text>}
                    {meta.selectors.map((sel: any) => (
                      <Row key={sel.signature} label={sel.label}>
                        <Text>{sel.description}</Text>
                      </Row>
                    ))}
                    {meta.contractUrl && (
                      <Row label="Explorer">
                        <Link href={meta.contractUrl}>
                          View on BaseScan
                        </Link>
                      </Row>
                    )}
                    {meta.target && (
                      <Row label="Contract Address">
                        <Address address={meta.target} />
                      </Row>
                    )}
                  </Section>
                ))
              : (selectedSkill.delegationScope?.selectors || []).map(
                  (selector: string) => {
                    const functionName =
                      selector.split("(")[0] || selector;
                    return (
                      <Row key={selector} label="Allowed Method">
                        <Text>
                          <Bold>{functionName}</Bold>
                        </Text>
                      </Row>
                    );
                  },
                )}

            <Divider />

            <Button name="execute-prepare" type="submit" variant="primary">
              Confirm & Grant Permissions
            </Button>
          </Form>
        ),
      },
    });
  } catch (error: any) {
    throw error;
  }
};

export default handleSkillSelectorFormSubmit;
