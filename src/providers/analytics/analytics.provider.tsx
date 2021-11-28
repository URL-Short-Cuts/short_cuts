import { createContext, useState } from "react";
import InitialValues from "./analytics.initial";
import type { AnalyticsProviderInterface } from "../../types/analytics/provider.d";

export const AnalyticsContext = createContext(InitialValues);

const AnalyticsProvider = ({ children }: AnalyticsProviderInterface) => {
  const [initialized, setInitialized] = useState(false);

  return (
    <AnalyticsContext.Provider
      value={{
        initialized,
        setInitialized,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
};

export default AnalyticsProvider;
