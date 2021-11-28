import useAnalytics from "../../../hooks/analytics";
import type { ReactNode } from "react";

interface AnalyticsLinkWrapperProps {
  href: string;
  children: ReactNode;
}

const AnalyticsInternalLinkWrapper = ({
  href,
  children,
}: AnalyticsLinkWrapperProps) => {
  const analytics = useAnalytics();

  return (
    <div onClick={(e) => analytics.trackInternalLinkClick(e, href)}>
      {children}
    </div>
  );
};

export default AnalyticsInternalLinkWrapper;
