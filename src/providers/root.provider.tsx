import AnalyticsProvider from "./analytics/analytics.provider";
import NavBarProvider from "./navbar/navbar.provider";
import UserInterfaceRootProvider from "./ui/ui.root.provider";
import Header from "../components/header/header.component";
import type { HeaderProps } from "../components/header/header.component";
import type { ReactChild } from "react";

type RootProviderProps = {
  headerProps?: HeaderProps;
  children: ReactChild | ReactChild[];
};

const RootProvider = ({
  children,
  headerProps = { pageKey: "default" },
}: RootProviderProps) => {
  return (
    <UserInterfaceRootProvider>
      <AnalyticsProvider>
        <NavBarProvider>
          <Header pageKey={headerProps.pageKey} />
          {children}
        </NavBarProvider>
      </AnalyticsProvider>
    </UserInterfaceRootProvider>
  );
};

export default RootProvider;
