import type { Dispatch, ReactNode, SetStateAction } from "react";

export interface NavBarContextInterface {
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
}

export interface NavBarProviderInterface {
  children: ReactNode;
}
