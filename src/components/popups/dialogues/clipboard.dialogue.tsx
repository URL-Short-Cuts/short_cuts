import { CloseIcon } from "@chakra-ui/icons";
import { Box, Flex, Text } from "@chakra-ui/react";
import useColour from "../../../hooks/colour";
import DimOnHover from "../../styles/hover.dim/hover.dim.styles";
import type { UserInterfacePopUpsComponentProps } from "../../../types/ui/popups/component.d";

export const testIDs = {
  FeedBackDialogueCloseButton: "FeedBackDialogueCloseButton",
  FeedBackDialogueIcon: "FeedBackDialogueIcon",
};

export default function FeedbackDialogue({
  message,
  onClose,
}: UserInterfacePopUpsComponentProps) {
  const { notificationColour } = useColour();

  return (
    <Box
      mb={[5, 5, 8]}
      bg={notificationColour.background}
      color={notificationColour.foreground}
      borderColor={notificationColour.border}
      borderWidth={1}
      borderRadius={20}
    >
      <Flex align={"center"} justify={"space-between"} mt={2}>
        <Text ml={2} mb={2} mr={2} fontSize={["sm", "sm", "l"]}>
          {message}
        </Text>
        <DimOnHover pr={2}>
          <CloseIcon
            data-testid={testIDs.FeedBackDialogueCloseButton}
            mb={2}
            width={4}
            height={4}
            onClick={onClose}
          />
        </DimOnHover>
      </Flex>
    </Box>
  );
}
