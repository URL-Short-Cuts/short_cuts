import NextLink from "next/link";
import AnalyticsWrapper from "../../analytics/analytics.link.internal/analytics.link.internal.component";
import type { PropsWithChildren } from "react";

interface ClickLinkProps {
  href: string;
}

export default function ClickInternalLink({
  children,
  href,
}: PropsWithChildren<ClickLinkProps>) {
  return (
    <NextLink href={href}>
      <AnalyticsWrapper href={href}>{children}</AnalyticsWrapper>
    </NextLink>
  );
}
