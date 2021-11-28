import { InitialState } from "./ui.popups.initial";
import type { UserInterfacePopUpsActionType } from "../../../types/ui/popups/actions.d";
import type { UserInterfacePopUpsStateInterface } from "../../../types/ui/popups/state.d";

class UserInterfacePopUpsReducerStates {
  wrongTypeError = "Received wrong action type.";

  HidePopUp(
    state: UserInterfacePopUpsStateInterface,
    action: UserInterfacePopUpsActionType
  ): UserInterfacePopUpsStateInterface {
    if (action.type === "HidePopUp") {
      const name = action.name;
      return {
        ...this.getInitialState(),
        [name]: { status: false },
      };
    }
    throw new Error(this.wrongTypeError);
  }
  ShowPopUp(
    state: UserInterfacePopUpsStateInterface,
    action: UserInterfacePopUpsActionType
  ): UserInterfacePopUpsStateInterface {
    if (action.type === "ShowPopUp") {
      const name = action.name;
      return {
        ...this.getInitialState(),
        [name]: { status: true },
      };
    }
    throw new Error(this.wrongTypeError);
  }

  private getInitialState = () => JSON.parse(JSON.stringify(InitialState));
}

export default UserInterfacePopUpsReducerStates;
