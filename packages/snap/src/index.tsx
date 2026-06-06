import {
  heading,
  OnHomePageHandler,
  OnUserInputHandler,
  panel,
  text,
  UserInputEventType,
  type OnRpcRequestHandler,
} from '@metamask/snaps-sdk';
import {
  Box,
  Text,
  Bold,
  Selector,
  SelectorOption,
  Card,
  Heading,
  Field,
  Input,
  Button,
  Image,
  Divider,
  Form,
  Row,
} from '@metamask/snaps-sdk/jsx';
import { getAllSkills, getSkillById } from './api/skills';

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns The result of `snap_dialog`.
 * @throws If the request method is not valid for this snap.
 */
export const onHomePage: OnHomePageHandler = async () => {
  const skill = await getAllSkills();

  return {
    content: (
      <Form name="skill-selector-form">
        <Heading>DCA Skill Wallet</Heading>
        <Text>Choose The Skill To Install</Text>
        <Divider />
        <Selector
          name="skill-selector"
          title="Choose Skill"
          value={skill[0]?._id}
        >
          {skill.map((item) => (
            <SelectorOption value={item._id}>
              <Card value={item.name} title={''} image={item.iconUrl} />
            </SelectorOption>
          ))}
        </Selector>

        <Button name="submit-dca" type="submit" variant="primary" size="md">
          Install Skill
        </Button>
      </Form>
    ),
  };
};
export const onUserInput: OnUserInputHandler = async ({ id, event }) => {
  // 1. Validasi harus mengecek nama FORM-nya, bukan nama tombolnya!
  if (
    event.type === UserInputEventType.FormSubmitEvent &&
    event.name === 'skill-selector-form'
  ) {
    // Tampilkan UI Loading secepatnya
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
      // 2. Ambil ID dari dalam objek event.value menggunakan key dari nama Selector kamu
      const formValues = event.value as Record<string, any>;
      const selectedSkillId = formValues?.['skill-selector'];

      console.log('ID Skill yang dipilih:', selectedSkillId);

      if (!selectedSkillId) {
        throw new Error('Kamu belum memilih strategi di halaman awal!');
      }

      // 3. Panggil API ke NestJS
      const selectedSkill = await getSkillById(selectedSkillId);
      console.log('Data Skill Terpilih:', selectedSkill);

      if (!selectedSkill) {
        throw new Error('Strategi tidak ditemukan di database backend.');
      }
      const skillName = selectedSkill.name;
      const skillDescription = selectedSkill.description;
      const chainId = selectedSkill.chainId;
      const cronExpression = selectedSkill.cronExpression;
      const selectors = selectedSkill.delegationScope?.selectors || [];
      const outputTokenParam = selectedSkill.parameters?.find(
        (p: any) => p.key === 'outputToken',
      );

      // Update UI Sukses dengan struktur <Row> dan <Form>
      await snap.request({
        method: 'snap_updateInterface',
        params: {
          id,
          ui: (
            <Form name="confirm-installation-form">
              <Heading>Konfirmasi Strategi 📝</Heading>

              {/* DETAIL STRATEGI MENGGUNAKAN ROW */}
              <Box>
                <Row label="Strategi">
                  <Text>
                    <Bold>{skillName}</Bold>
                  </Text>
                </Row>
                <Row label="Network">
                  <Text>Base Sepolia</Text>
                </Row>
                <Row label="Jadwal Run">
                  <Text>
                    {cronExpression === '0 9 * * *'
                      ? 'Setiap Hari (09:00)'
                      : cronExpression}
                  </Text>
                </Row>
              </Box>

              <Divider />

              <Text>
                <Bold>Cara Kerja:</Bold>
              </Text>
              <Text>{skillDescription}</Text>

              <Divider />

              {/* INPUT PARAMETER DINAMIS USER */}
              <Text>
                <Bold>Configure Skill Parameters:</Bold>
              </Text>

              <Text>Target Token:</Text>
              <Selector
                name="param-output-token"
                title="Select Token"
                value={outputTokenParam?.defaultValue}
              >
                {(outputTokenParam?.options || []).map((opt: string) => (
                  <SelectorOption key={opt} value={opt}>
                    <Card
                      title={opt.toUpperCase()}
                      value=""
                      image={
                        opt === 'weth'
                          ? 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/eth.png'
                          : ''
                      }
                    />
                  </SelectorOption>
                ))}
              </Selector>

              <Text>Amount per run (USDC):</Text>
              <Input
                name="param-amount-usdc"
                placeholder="Example: 10"
                type="number"
                value="10"
              />

              <Divider />

              {/* DAFTAR IZIN KONTRAK MENGGUNAKAN ROW */}
              <Text>
                <Bold>Izin Kontrak (ERC-7715):</Bold>
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
      console.error('Error di onUserInput:', error);

      // 5. Update UI Error jika proses di atas ada yang gagal/crash
      await snap.request({
        method: 'snap_updateInterface',
        params: {
          id,
          ui: (
            <Box>
              <Heading>System Error ❌</Heading>
              <Text>Gagal menyiapkan instalasi strategi.</Text>
              <Text>
                Alasan: <Bold>{error.message || 'Unknown Error'}</Bold>
              </Text>
              <Divider />
              <Text>
                Pastikan backend NestJS kamu sudah aktif di localhost.
              </Text>
            </Box>
          ),
        },
      });
    }
  }

  // == HANDLE UNTUK TOMBOL CONFIRM INSTALLATION ==
  if (
    event.type === UserInputEventType.ButtonClickEvent &&
    event.name === 'confirm-installation'
  ) {
    // Di sini nanti tempat kamu memanggil fungsi POST /installations/prepare kamu!
    console.log('User mengonfirmasi instalasi, saatnya tembak prepare!');
  }
};