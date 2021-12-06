import { Input } from "@chakra-ui/react";
import useColour from "../../../hooks/colour";
import type { InputProps } from "@chakra-ui/react";

const StyledInput = (props: InputProps) => {
  const { inputColour } = useColour();
  return (
    <Input
      borderWidth={1}
      borderColor={inputColour.border}
      bg={inputColour.background}
      color={inputColour.foreground}
      {...props}
    />
  );
};

export default StyledInput;
