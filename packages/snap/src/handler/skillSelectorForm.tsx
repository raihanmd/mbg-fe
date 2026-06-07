import { getSkillById } from "../api/skills";
import { Text, Bold, Selector, SelectorOption, Card, Box, Divider, Button, Form, Heading, Row, Input } from "@metamask/snaps-sdk/jsx";
import { SkillOptions } from "src/types/SkillItem";

const handleSkillSelectorFormSubmit = async ({id, event}: {id: string, event: any}): Promise<void> => {
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

      if (!selectedSkill || !selectedSkill.parameters) {
       await snap.request({
         method: 'snap_dialog',
         params: {
           type: 'alert',
           content: (
             <Box>
               <Text>Gagal memuat data strategi. Data tidak valid.</Text>
             </Box>
           ),
         },
       });
       throw new Error('Failed to load skill data');
      }
     const skillName = selectedSkill.name;
     const skillDescription = selectedSkill.description;
     const chainId = selectedSkill.chainId;

     const spendModeParam = selectedSkill.parameters?.find(
       (p: any) => p.key === 'spendMode',
     );
     const percentOfInboundParam = selectedSkill.parameters?.find(
       (p: any) => p.key === 'percentOfInboundBps',
     );
    const amountPerRunParam = selectedSkill.parameters?.find(
      (p: any) => p.key === 'amountPerRun',
    );
    const amountUsdcParam = selectedSkill.parameters?.find(
      (p: any) => p.key === 'amountUsdc',
    );
    const dailyLimitParam = selectedSkill.parameters?.find(
      (p: any) => p.key === 'dailySpendLimit',
    );
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
           <Form name={'prepare-installation-form:' + selectedSkill.skillId}>
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
                   <Bold>{amountUsdcParam.label}:</Bold>
                   {amountUsdcParam.defaultValue} 
                 </Text>
                 <Text>{amountUsdcParam.description}</Text>
                 <Input
                   name="param-amount-usdc"
                   type="number"
                   value={amountUsdcParam.defaultValue}
                 />
               </Box>
             ) : null}

             {/* 2. SELECTOR SPEND MODE */}
             {spendModeParam ? (
               <Box>
                 <Text>
                   <Bold>{spendModeParam.label}:</Bold>
                   {spendModeParam.defaultValue}
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

             {percentOfInboundParam ? (
               <Box>
                 <Text>
                   <Bold>{percentOfInboundParam.label}:</Bold>
                   {percentOfInboundParam.defaultValue}
                 </Text>
                 <Text>{percentOfInboundParam.description}</Text>
                 <Input
                   name="param-percent-inbound"
                   type="number"
                   value={percentOfInboundParam.defaultValue}
                 />
               </Box>
             ) : null}

             {amountPerRunParam ? (
               <Box>
                 <Text>
                   <Bold>{amountPerRunParam.label}:</Bold>
                   {amountPerRunParam.defaultValue}
                 </Text>
                 <Text>{amountPerRunParam.description}</Text>
                 <Input
                   name="param-amount-per-run"
                   type="number"
                   value={amountPerRunParam.defaultValue}
                 />
               </Box>
             ) : null}

             {dailyLimitParam ? (
               <Box>
                 <Text>
                   <Bold>{dailyLimitParam.label}:</Bold>
                   {dailyLimitParam.defaultValue}
                 </Text>
                 <Text>{dailyLimitParam.description}</Text>
                 <Input
                   name="param-daily-limit"
                   type="number"
                   value={dailyLimitParam.defaultValue}
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
}


export default handleSkillSelectorFormSubmit;