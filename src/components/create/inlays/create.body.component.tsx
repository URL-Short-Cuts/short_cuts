import { CopyIcon } from "@chakra-ui/icons";
import { Flex, Box, Center, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import useUserInterface from "../../../hooks/ui";
import Highlight from "../../highlight/highlight.component";
import DimOnHover from "../../styles/hover.dim/hover.dim.styles";

export const TestIDs = {
  CreateUrlClipBoard: "CreateUrlClipBoard",
};

export default function generateBody(url: string) {
  return function CreateBody() {
    const ui = useUserInterface();

    const clipBoard = () => {
      navigator.clipboard.writeText(url);
      ui.popups.open("ClipBoard");
    };

    useEffect(() => {
      return () => ui.popups.close("ClipBoard");
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <>
        <Center>
          <Box mb={7}>
            <Highlight p={5}>
              <Flex align={"center"}>
                <Text ml={2} fontSize={["xxs"]}>
                  {"/" + url.split("/").pop()}
                </Text>
                <DimOnHover>
                  <CopyIcon
                    data-testid={TestIDs.CreateUrlClipBoard}
                    cursor={"pointer"}
                    ml={3}
                    w={7}
                    h={7}
                    onClick={clipBoard}
                  />
                </DimOnHover>
              </Flex>
            </Highlight>
          </Box>
        </Center>
      </>
    );
  };
}
