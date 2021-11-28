import "../styles/globals.css";
import { appWithTranslation } from "next-i18next";
import Consent from "../components/consent/consent.component";
import NavBar from "../components/navbar/navbar.component";
import PopUps from "../components/popups/root.popup";
import NavConfig from "../config/navbar";
import RootProvider from "../providers/root.provider";
import type { AppProps } from "next/app";

function App({
  Component,
  pageProps: { headerProps, ...otherProps },
}: AppProps) {
  return (
    <RootProvider headerProps={headerProps}>
      <NavBar menuConfig={NavConfig.menuConfig} />
      <Component {...otherProps} />
      <PopUps />
      <Consent />
    </RootProvider>
  );
}
export default appWithTranslation(App);
