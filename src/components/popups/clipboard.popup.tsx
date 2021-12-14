import { useTranslation } from "next-i18next";
import ClipBoard from "./dialogues/clipboard.dialogue";
import PopUp from "./popup/popup.component";
import useUserInterface from "../../hooks/ui";

const popUpName = "ClipBoard" as const;

export default function FeedbackPopUp() {
  const ui = useUserInterface();
  const { t } = useTranslation("main");

  if (!ui.popups.status(popUpName)) {
    return null;
  }

  return (
    <PopUp
      name={popUpName}
      message={t(`popups.${popUpName}`)}
      Component={ClipBoard}
    />
  );
}
