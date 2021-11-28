import useAnalytics from "../../../hooks/analytics";
import type { ReactNode } from "react";

interface AnalyticsWrapperProps {
  buttonName: string;
  children: ReactNode;
}

const AnalyticsButtonWrapper = ({
  buttonName,
  children,
}: AnalyticsWrapperProps) => {
  const analytics = useAnalytics();

  return (
    <div onClick={(e) => analytics.trackButtonClick(e, buttonName)}>
      {children}
    </div>
  );
};

export default AnalyticsButtonWrapper;
