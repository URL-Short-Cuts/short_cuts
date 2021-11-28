import type { ReactNode } from "react";

export interface AnalyticsContextInterface {
  initialized: boolean;
  setInitialized: (setting: boolean) => void;
}
export interface AnalyticsProviderInterface {
  children: ReactNode;
}
