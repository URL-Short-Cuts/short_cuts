import { Box, Flex, useToast, Avatar } from "@chakra-ui/react";
import { HiScissors } from "react-icons/hi";
import FormContainer from "./url.container.component";
import Billboard from "../../billboard/billboard.component";
import type { TFunction } from "../../../types/translations/hook.types";

interface FormUIProps {
  route: string;
  title: string;
  t: TFunction;
}

export const SizedIcon = () => <HiScissors size={50} />;

export default function FormUI({ route, title, t }: FormUIProps) {
  const toast = useToast();

  const closeError = (fieldName: string) => {
    if (toast.isActive(fieldName)) {
      toast.close(fieldName);
    }
  };

  const openError = (fieldName: string, message: string) => {
    if (!toast.isActive(fieldName)) {
      toast({
        id: fieldName,
        title: message,
        status: "error",
        duration: 1000,
        isClosable: false,
      });
    } else {
      toast.update(fieldName, {
        title: message,
        status: "error",
        duration: 1000,
        isClosable: false,
      });
    }
  };

  return (
    <Billboard title={title}>
      <Flex justify={"center"} align={"center"} w={"100%"}>
        <Box mb={10}>
          <Avatar icon={<SizedIcon />} width={75} height={75} />
        </Box>
        <Box pl={5}>
          <FormContainer
            route={route}
            closeError={closeError}
            openError={openError}
            t={t}
          />
        </Box>
      </Flex>
    </Billboard>
  );
}
