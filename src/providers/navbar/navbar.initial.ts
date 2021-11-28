import { voidFn } from "../../utils/voids";
import type { NavBarContextInterface } from "../../types/navbar/provider.d";

const InitialValues = <NavBarContextInterface>{
  isVisible: true,
  setIsVisible: voidFn,
};

export default InitialValues;
