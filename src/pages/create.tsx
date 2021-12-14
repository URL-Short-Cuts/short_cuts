import { useEffect, useState } from "react";
import Create from "../components/create/create.url.component";
import ErrorBoundary from "../components/errors/boundary/error.boundary.component";
import routes from "../config/routes";
import Events from "../events/events";
import FourOhFour from "../pages/_notFound";
import pagePropsGenerator from "../utils/page.props.static";
import { voidFn } from "../utils/voids";

const NOT_YET_KNOWN = undefined;
const NOT_SPECIFIED = null;

export default function CreatePage() {
  const [createURL, setCreateUrl] = useState<
    string | typeof NOT_SPECIFIED | typeof NOT_YET_KNOWN
  >(undefined);

  useEffect(() => {
    if (createURL === undefined) {
      const urlParams = new URLSearchParams(window.location.search);
      setCreateUrl(urlParams.get("url"));
    }
  }, [createURL]);

  if (createURL === NOT_YET_KNOWN) {
    return null;
  }

  if (createURL === NOT_SPECIFIED) {
    return <FourOhFour />;
  }

  return (
    <ErrorBoundary
      eventDefinition={Events.General.Error}
      route={routes.home}
      stateReset={voidFn}
    >
      <Create url={createURL} />
    </ErrorBoundary>
  );
}

export const getStaticProps = pagePropsGenerator({
  pageKey: "home",
  translations: ["create"],
});
