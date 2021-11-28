import ErrorBoundary from "../components/errors/boundary/error.boundary.component";
import routes from "../config/routes";
import Events from "../events/events";
import pagePropsGenerator from "../utils/page.props.static";
import { voidFn } from "../utils/voids";

export default function AboutPage() {
  return (
    <ErrorBoundary
      eventDefinition={Events.General.Error}
      route={routes.home}
      stateReset={voidFn}
    >
      <div>Mock About Page</div>
    </ErrorBoundary>
  );
}

export const getStaticProps = pagePropsGenerator({
  pageKey: "about",
  translations: [],
});
