import type { BaseSyntheticEvent, ReactNode } from "react";

export type ButtonClickHandlerType = (
  e: BaseSyntheticEvent,
  buttonName: ReactNode | string
) => void;

export type LinkClickHandlerType = (
  e: BaseSyntheticEvent,
  href: string
) => void;
