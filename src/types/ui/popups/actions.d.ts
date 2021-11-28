import type { PopUpNameType } from "./state.d";

export type UserInterfacePopUpsActionType =
  | {
      type: "ShowPopUp";
      name: PopUpNameType;
    }
  | {
      type: "HidePopUp";
      name: PopUpNameType;
    };
