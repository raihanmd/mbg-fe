import {
  OnHomePageHandler,
  OnUserInputHandler,
  UserInputEventType,
  type OnRpcRequestHandler,
} from '@metamask/snaps-sdk';
import {
  Box,
  Text,
  Selector,
  SelectorOption,
  Card,
  Heading,
  Button,
  Divider,
  Form,
} from '@metamask/snaps-sdk/jsx';
import { getAllSkills, getSkillById } from './api/skills';
import handleSkillSelectorFormSubmit from './handler/skillSelectorForm';
import { handlePrepareInstallation } from './handler/prepareInstallation';

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
  try {
    // 1. Validasi harus mengecek nama FORM-nya, bukan nama tombolnya!
    if (
      event.type === UserInputEventType.FormSubmitEvent &&
      event.name === 'skill-selector-form'
    ) {
     await handleSkillSelectorFormSubmit({ id, event });
    }
    // == HANDLE UNTUK TOMBOL CONFIRM INSTALLATION ==
    if (
      event.type === UserInputEventType.FormSubmitEvent &&
      event.name.startsWith('prepare-installation-form')
    ) {
     const eventNameParts = event.name.split(':');
     const extractedSkillId = eventNameParts[1];
      await handlePrepareInstallation({ event, selectedSkillId: extractedSkillId!});
    }
  } catch (error) {
    console.error('Error in onUserInput:', error);
    await snap.request({
      method: 'snap_dialog',
      params: {
        type: 'alert',
        content: (
          <Box>
            <Text>Error when controlling your DCA Skill</Text>
          </Box>
        ),
      },
    });
  }
};