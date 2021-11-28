import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  HStack,
  IconButton,
  useDisclosure,
  Stack,
} from "@chakra-ui/react";
import { useEffect, useContext } from "react";
import NavBarColorModeToggle from "./navbar.color.mode/navbar.color.mode.component";
import { fetchPlaceHolderHook } from "./navbar.fetch.hook";
import NavBarLogo from "./navbar.logo/navbar.logo.component";
import NavBarOptions from "./navbar.options/navbar.options.component";
import Spinner from "./navbar.spinner/navbar.spinner.component";
import useColour from "../../hooks/colour";
import { NavBarContext } from "../../providers/navbar/navbar.provider";
import Condition from "../condition/condition.component";

export const testIDs = {
  NavBarRoot: "NavBarRoot",
  NavBarMenu: "NavBarMenu",
  NavBarMobileMenu: "NavBarMobileMenu",
  NavBarMobileMenuButton: "NavBarMobileMenuButton",
};

interface NavBarProps {
  menuConfig: { [index: string]: string };
}

export default function NavBar({ menuConfig }: NavBarProps) {
  const { componentColour, transparent } = useColour();
  const { isVisible } = useContext(NavBarContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isFetching, data } = fetchPlaceHolderHook();

  useEffect(() => {
    if (isFetching) onClose;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetching]);

  if (!isVisible) return null;

  return (
    <>
      <Box
        zIndex={100}
        fontSize={[18, 18, 20]}
        style={{ position: "fixed", top: 0, width: "100%" }}
        data-testid={testIDs.NavBarRoot}
        bg={componentColour.background}
        color={componentColour.foreground}
        borderColor={componentColour.border}
        px={4}
        sx={{
          caretColor: transparent,
        }}
        borderBottomWidth={"1px"}
        borderBottomStyle={"solid"}
      >
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <NavBarLogo href={data.avatarLink} image={data.avatarImage} />
          <Spinner whileTrue={isFetching}>
            <Flex
              data-testid={testIDs.NavBarMenu}
              h={16}
              alignItems={"center"}
              justifyContent={"flex-end"}
            >
              <NavBarColorModeToggle />
              <IconButton
                ml={1}
                data-testid={testIDs.NavBarMobileMenuButton}
                size={"md"}
                icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                aria-label={"Open Menu"}
                display={{ sm: "none" }}
                onClick={isOpen ? onClose : onOpen}
              />
              <HStack spacing={8} alignItems={"center"}>
                <HStack
                  as={"nav"}
                  spacing={2}
                  display={{ base: "none", sm: "flex" }}
                >
                  <NavBarOptions menuConfig={menuConfig} />
                </HStack>
              </HStack>
            </Flex>
          </Spinner>
        </Flex>
        <Condition isTrue={isOpen}>
          <Box
            data-testid={testIDs.NavBarMobileMenu}
            pb={4}
            display={{ sm: "none" }}
          >
            <Stack as={"nav"} spacing={4}>
              <div onClick={onClose}>
                <NavBarOptions menuConfig={menuConfig} />
              </div>
            </Stack>
          </Box>
        </Condition>
      </Box>
    </>
  );
}
