export interface UserInterfacePopUpsStateInterface {
  FeedBack: { status: boolean };
  ClipBoard: { status: boolean };
}

export type PopUpNameType = keyof UserInterfacePopUpsStateInterface;
