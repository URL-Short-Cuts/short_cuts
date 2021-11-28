import { useTranslation } from "next-i18next";
import Feedback from "./dialogues/feedback.dialogue";
import PopUp from "./popup/popup.component";
import useUserInterface from "../../hooks/ui";

const popUpName = "FeedBack" as const;

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
      Component={Feedback}
    />
  );
}
