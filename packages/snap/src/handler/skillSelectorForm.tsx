import { getSkillById } from "../api/skills";
import { Text, Bold, Selector, SelectorOption, Card, Box, Divider, Button, Form, Heading, Row, Input } from "@metamask/snaps-sdk/jsx";
import { SkillOptions } from "src/types/SkillItem";
import { formatUnits } from "viem";


const handleSkillSelectorFormSubmit = async ({
  id,
  event,
  usdcRawBalance,
}: {
  id: string;
  event: any;
  usdcRawBalance: string;
}): Promise<void> => {
  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: (
        <Box>
          <Heading>Fetching Strategy... ⏳</Heading>
          <Text>Sedang mengambil data strategi dari backend NestJS...</Text>
        </Box>
      ),
    },
  });

  try {
    const formValues = event.value as Record<string, any>;
    const selectedSkillId = formValues?.['skill-selector'];

    console.log('ID Skill yang dipilih:', selectedSkillId);

    if (!selectedSkillId) {
      throw new Error('Kamu belum memilih strategi di halaman awal!');
    }

    // 3. Panggil API ke NestJS
    const selectedSkill = await getSkillById(selectedSkillId);
    console.log('Data Skill Terpilih:', selectedSkill);

    if (!selectedSkill || !selectedSkill.parameters) {
      throw new Error('Failed to load skill data');
    }
    const skillName = selectedSkill.name;
    const skillDescription = selectedSkill.description;
    const chainId = selectedSkill.chainId;

    const usdcHumanBalance = (Number(usdcRawBalance) / 1_000_000).toFixed(2);
    const spendModeParam = selectedSkill.parameters?.find(
      (p: any) => p.key === 'spendMode',
    );
    const percentOfInboundParam = selectedSkill.parameters?.find(
      (p: any) => p.key === 'percentOfInboundBps',
    );
    const defaultHumanPercent = percentOfInboundParam?.defaultValue
      ? (Number(percentOfInboundParam.defaultValue) / 100).toString()
      : '50';
    const amountPerRunParam = selectedSkill.parameters?.find(
      (p: any) => p.key === 'amountPerRun',
    );

    const amountUsdcParam = selectedSkill.parameters?.find(
      (p: any) => p.key === 'amountUsdc',
    );
    const dailyLimitParam = selectedSkill.parameters?.find(
      (p: any) => p.key === 'dailySpendLimit',
    );
    const defaultHumanDailyLimit = dailyLimitParam?.defaultValue
      ? formatUnits(BigInt(dailyLimitParam.defaultValue), 6)
      : '50';

    const selectors = selectedSkill.delegationScope?.selectors || [];
    const outputTokenParam = selectedSkill.parameters?.find(
      (p: any) => p.key === 'outputToken',
    );

    await snap.request({
      method: 'snap_updateInterface',
      params: {
        id,
        ui: (
          <Form
            name={`prepare-installation-form:${selectedSkill.skillId}:${selectedSkill.runType}`}
          >
            <Heading>Konfirmasi Strategi 📝</Heading>

            <Box>
              <Row label="Strategi">
                <Text>
                  <Bold>{skillName}</Bold>
                </Text>
              </Row>
              <Row label="Network">
                <Text>Base Sepolia</Text>
              </Row>
              {selectedSkill.runType === 'cron' &&
              selectedSkill.cronExpression ? (
                <Row label="Jadwal Run">
                  <Text>
                    {selectedSkill.cronExpression === '0 9 * * *'
                      ? 'Everyday at 09:00'
                      : selectedSkill.cronExpression}
                  </Text>
                </Row>
              ) : null}
            </Box>

            <Divider />

            <Text>
              <Bold>Description:</Bold>
            </Text>
            <Text>{skillDescription}</Text>
            <Text>
              <Bold>Chain ID: </Bold>
              {chainId.toString()}
            </Text>

            <Divider />

            {/* INPUT PARAMETER DINAMIS USER */}
            <Text>
              <Bold>Configure Parameters:</Bold>
            </Text>

            {/* 1. SELECTOR TARGET TOKEN */}
            <Text>Target Token:</Text>
            <Selector
              name="param-output-token"
              title="Select Token"
              value={outputTokenParam?.defaultValue}
            >
              {(outputTokenParam?.options || []).map((opt: SkillOptions) => {
                let cardValueDescription = 'Standard Token';

                if (opt.metadata) {
                  if (opt.metadata.address) {
                    cardValueDescription = `${opt.metadata.address.slice(0, 6)}...${opt.metadata.address.slice(-4)}`;
                  } else if (opt.metadata.symbol) {
                    cardValueDescription = `${opt.metadata.symbol} Token`;
                  }
                } else if (opt.value) {
                  cardValueDescription = `${opt.value.toUpperCase()} Token`;
                }

                return (
                  <SelectorOption key={opt.value} value={opt.value}>
                    <Card
                      title={opt.label || opt.value.toUpperCase()}
                      value={cardValueDescription}
                    />
                  </SelectorOption>
                );
              })}
            </Selector>

            {amountUsdcParam ? (
              <Box>
                <Text>
                  <Bold>{amountUsdcParam.label} :</Bold>
                </Text>
                <Text>{amountUsdcParam.description}</Text>
                <Text>
                  Current USDC Balance: <Bold>{usdcHumanBalance} USDC</Bold>
                </Text>
                <Input
                  name="param-amount-usdc"
                  type="number"
                  step={0.01}
                  max={Number(usdcHumanBalance)}
                  min={0}
                  placeholder={`Maximal: ${usdcHumanBalance}`}
                  value={usdcHumanBalance}
                />
              </Box>
            ) : null}

            {/* 2. SELECTOR SPEND MODE */}
            {spendModeParam ? (
              <Box>
                <Text>
                  <Bold>{spendModeParam.label} :</Bold>
                </Text>
                <Text>{spendModeParam.description}</Text>
                <Selector
                  name="param-spend-mode"
                  title="Select Mode"
                  value={spendModeParam.defaultValue}
                >
                  {(spendModeParam.options || []).map((opt: SkillOptions) => (
                    <SelectorOption key={opt.value} value={opt.value}>
                      <Card title={opt.label} value={`Mode: ${opt.value}`} />
                    </SelectorOption>
                  ))}
                </Selector>
              </Box>
            ) : null}

            {amountPerRunParam || percentOfInboundParam ? (
              <Box>
                <Text>
                  <Bold>Allocation Per Run :</Bold>
                </Text>
                <Text>Configure the amount of USDC or Percentage</Text>
                <Text>
                  Current USDC Balance: <Bold>{usdcHumanBalance} USDC</Bold>
                </Text>
                <Input
                  name="param-allocation"
                  type="number"
                  step={0.01}
                  max={
                    spendModeParam?.defaultValue === 'fixed'
                      ? Number(usdcHumanBalance)
                      : 100
                  }
                  min={0}
                  placeholder="e.g. 10 for 10 USDC or 10%"
                  value={usdcHumanBalance}
                />
              </Box>
            ) : null}

            {dailyLimitParam ? (
              <Box>
                <Text>
                  <Bold>{dailyLimitParam.label} :</Bold>
                </Text>
                <Text>{dailyLimitParam.description}</Text>
                <Input
                  name="param-daily-limit"
                  type="number"
                  step={0.01}
                  max={Number(usdcHumanBalance)}
                  min={0}
                  placeholder={`Maximal: ${usdcHumanBalance}`}
                  value={defaultHumanDailyLimit}
                />
              </Box>
            ) : null}
            <Divider />

            {/* DAFTAR IZIN KONTRAK MENGGUNAKAN ROW */}
            <Text>
              <Bold>Allowed Method:</Bold>
            </Text>
            <Box>
              {selectors.map((selector: string) => {
                const functionName = selector.split('(')[0] as string;
                return (
                  <Row key={selector} label="Allowed Method">
                    <Text>
                      <Bold>{functionName}</Bold>
                    </Text>
                  </Row>
                );
              })}
            </Box>

            <Divider />

            <Button name="execute-prepare" type="submit" variant="primary">
              Confirm & Grant Permissions 🚀
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