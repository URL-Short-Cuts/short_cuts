import useAnalytics from "../../../hooks/analytics";
import type { ReactNode } from "react";

interface AnalyticsLinkWrapperProps {
  href: string;
  children: ReactNode;
}

const AnalyticsExternalLinkWrapper = ({
  href,
  children,
}: AnalyticsLinkWrapperProps) => {
  const analytics = useAnalytics();

  return (
    <div onClick={(e) => analytics.trackExternalLinkClick(e, href)}>
      {children}
    </div>
  );
};

export default AnalyticsExternalLinkWrapper;
