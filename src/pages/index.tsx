import { useTranslation } from "next-i18next";
import ErrorBoundary from "../components/errors/boundary/error.boundary.component";
import FormUI from "../components/forms/url/url.ui.component";
import routes from "../config/routes";
import Events from "../events/events";
import pagePropsGenerator from "../utils/page.props.static";
import { voidFn } from "../utils/voids";

export default function IndexPage() {
  const { t } = useTranslation("forms");

  return (
    <ErrorBoundary
      eventDefinition={Events.General.Error}
      route={routes.home}
      stateReset={voidFn}
    >
      <FormUI title={t("url.title")} route={routes.create} t={t} />
    </ErrorBoundary>
  );
}

export const getStaticProps = pagePropsGenerator({
  pageKey: "home",
  translations: ["forms"],
});
