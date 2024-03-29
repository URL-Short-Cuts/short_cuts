import NextLink from "next/link";
import AnalyticsWrapper from "../../analytics/analytics.link.external/analytics.link.external.component";
import type { PropsWithChildren } from "react";

interface ClickLinkProps {
  href: string;
}

export default function ClickExternalLink({
  children,
  href,
}: PropsWithChildren<ClickLinkProps>) {
  return (
    <NextLink href={href} target={"_blank"}>
      <AnalyticsWrapper href={href}>{children}</AnalyticsWrapper>
    </NextLink>
  );
}
