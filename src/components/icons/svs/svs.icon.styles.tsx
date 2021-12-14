import { Img } from "@chakra-ui/image";
import styled from "@emotion/styled";

export const Icon = styled(Img)`
  border-radius: 50%;
  width: ${(props) => `${props.width}px`};
  height: ${(props) => `${props.height}px`};
  background-color: black;
`;
