import useAnalytics from "../../../hooks/analytics";
import type { EventDefinitionType } from "../../../types/analytics/events.d";
import type { ReactNode } from "react";

interface AnalyticsGenericWrapperProps {
  eventDefinition: EventDefinitionType;
  children: ReactNode;
}

const AnalyticsGenericWrapper = ({
  eventDefinition,
  children,
}: AnalyticsGenericWrapperProps) => {
  const analytics = useAnalytics();

  return <div onClick={() => analytics.event(eventDefinition)}>{children}</div>;
};

export default AnalyticsGenericWrapper;
