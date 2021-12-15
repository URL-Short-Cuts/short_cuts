import { useRouter } from "next/router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Create from "./create.component";
import routes from "../../config/routes";
import useUrl from "../../hooks/url";
import BillBoardSpinner from "../billboard/billboard.spinner/billboard.spinner.component";
import Condition from "../condition/condition.component";
import ErrorDisplay from "../errors/display/error.display.component";

export interface CreateUrlInterface {
  url: string;
}

export default function CreateUrlContainer({ url }: CreateUrlInterface) {
  const { createUrl, resetCreateUrl, status, created } = useUrl();
  const { t } = useTranslation("main");
  const router = useRouter();

  const goHome = () => {
    router.push(routes.home);
  };

  useEffect(() => {
    if (status !== null) {
      resetCreateUrl();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (status === null) {
      createUrl(url);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <>
      <Condition isTrue={status === null}>
        <BillBoardSpinner title={t("loading")} visible={true} />
      </Condition>
      <Condition isTrue={status === 201 && url !== null}>
        <>
          <Create url={String(created)} />;
        </>
      </Condition>
      <Condition isTrue={status !== 201 && status !== null}>
        <>
          <ErrorDisplay errorKey={"generic"} resetError={goHome} />
        </>
      </Condition>
    </>
  );
}
