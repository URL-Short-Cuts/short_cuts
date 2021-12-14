import { voidFn } from "../../../utils/voids";
import type { UserInterfacePopUpsContextInterface } from "../../../types/ui/popups/provider.d";
import type { UserInterfacePopUpsStateInterface } from "../../../types/ui/popups/state.d";

export const InitialState = <UserInterfacePopUpsStateInterface>{
  FeedBack: { status: false },
  ClipBoard: { status: false },
};

const InitialContext = <UserInterfacePopUpsContextInterface>{
  status: InitialState,
  dispatch: voidFn,
};

export default InitialContext;
