import { useTranslation } from "next-i18next";
import generateBody from "./inlays/create.body.component";
import FooterComponent from "./inlays/create.footer.component";
import Dialogue from "../dialogues/resizable/dialogue.resizable.component";

export interface CreateUrlProps {
  url: string;
}

export default function CreateUrl({ url }: CreateUrlProps) {
  const { t } = useTranslation("create");

  return (
    <Dialogue
      t={t}
      titleKey={"title"}
      HeaderComponent={() => <></>}
      ToggleComponent={() => <></>}
      BodyComponent={generateBody(url)}
      FooterComponent={FooterComponent}
    />
  );
}
