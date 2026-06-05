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
} from '@metamask/snaps-sdk/jsx';

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
let temporarySelectedSkill = '';
export const onHomePage: OnHomePageHandler = async () => {
  return {
    content: (
      <Box>
        <Heading>AI Investment Copilot 🤖</Heading>
        <Text>Silakan pilih strategi DCA bertenaga AI kamu:</Text>

        {/* Selector ini akan langsung tampil di dalam MetaMask */}
        <Selector name="skill-selector" title="Pilih Strategi">
          <SelectorOption value="dca-reasoning-btc">
            <Card
              title="BTC Smart Timing (AI)"
              value="DCA otomatis dengan analisa sentimen pasar via x402 Bazaar."
            />
          </SelectorOption>
          <SelectorOption value="dca-standard-eth">
            <Card
              title="Standard ETH DCA"
              value="Membeli ETH berkala secara kaku setiap minggu tanpa AI."
            />
          </SelectorOption>
        </Selector>
        <Field label="Nominal Investasi (USDC)">
          <Input
            name="dca-amount-input"
            placeholder="Masukkan jumlah, contoh: 10"
            type="number"
          />
        </Field>
        <Button name="submit-dca" variant="primary">
          Submit
        </Button>
      </Box>
    ),
  };
};
export const onUserInput: OnUserInputHandler = async ({ id, event }) => {
  // Kita hanya perlu mendengarkan ketika tombol "submit-dca" diklik
  if (event.name === 'submit-dca') {
    // 1. Ambil nilai nominal dari Input
    const inputAmount = event.context?.['dca-amount-input'] || '0';

    // 2. Ambil nilai strategi dari Selector (MetaMask menyimpannya di dalam context sesuai nama Selector-nya)
    const selectedSkillId =
      event.context?.['skill-selector'] || 'Belum memilih';

    // 3. Update UI menjadi Loading/Memproses
    await snap.request({
      method: 'snap_updateInterface',
      params: {
        id,
        ui: (
          <Box>
            <Heading>Memproses Data... ⏳</Heading>
            <Text>Strategi: **{selectedSkillId}**</Text>
            <Text>Nominal: **{inputAmount} USDC**</Text>
            <Text>
              Sedang mendaftarkan konfigurasi ke backend NestJS kamu...
            </Text>
          </Box>
        ),
      },
    });

    // 4. DI SINI TEMPAT KAMU FETCH KE BACKEND NESTJS KAMU NANTI!
    // try {
    //   const response = await fetch('http://localhost:3000/installations/prepare', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //       skillId: selectedSkillId,
    //       config: { amount: inputAmount }
    //     })
    //   });
    //   const data = await response.json();
    //
    //   // Jika sukses, pemicu pop-up grant permission ERC-7715 di sini
    // } catch (err) { ... }
  }
};

export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  switch (request.method) {
    case 'hello': {
      return snap.request({
        method: 'snap_dialog',
        params: {
          type: 'confirmation',
          content: (
            <Box>
              <Text>Helo</Text>
            </Box>
          ),
        },
      });
    }
    case 'test': {
      return snap.request({
        method: 'snap_dialog',
        params: {
          type: 'prompt',
          content: (
            <Box>
              <Heading>What is the wallet address?</Heading>
              <Text>Please enter the wallet address to be monitored</Text>
            </Box>
          ),
          placeholder: '0x123...',
        },
      });
    }

    case 'nyoba': {
      const interfaceId = await snap.request({
        method: 'snap_createInterface',
        params: {
          ui: (
            <Selector name="selector-example" title="Select an option">
              <SelectorOption value="option-1">
                <Card title="Option 1" value="First option" />
              </SelectorOption>
              <SelectorOption value="option-2">
                <Card title="Option 2" value="Second option" />
              </SelectorOption>
            </Selector>
          ),
        },
      });
      return snap.request({
        method: 'snap_dialog',
        params: {
          type: 'confirmation', // Bisa 'confirmation' atau 'alert'
          id: interfaceId, // <--- Masukkan ID interface yang kita buat di atas
        },
      });
    }


    default:
      throw new Error('Method not found.');
  }
};
