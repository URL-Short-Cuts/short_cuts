import { voidFn } from "../../../utils/voids";
import type { UserInterfaceImagesContextInterface } from "../../../types/ui/images/provider.d";
import type { UserInterfaceImagesStateInterface } from "../../../types/ui/images/state.d";

export const InitialState = <UserInterfaceImagesStateInterface>{
  loadedCount: 0,
};

const InitialContext = <UserInterfaceImagesContextInterface>{
  ...InitialState,
  setLoadedCount: voidFn,
};

export default InitialContext;
