import type { UserInterfacePopUpsActionType } from "./actions.d";
import type { UserInterfacePopUpsStateInterface } from "./state.d";

export type userDispatchType = (action: UserInterfacePopUpsActionType) => void;

export interface UserInterfacePopUpsContextInterface {
  status: UserInterfacePopUpsStateInterface;
  dispatch: userDispatchType;
}
