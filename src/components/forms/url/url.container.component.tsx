import { useRouter } from "next/router";
import { useEffect } from "react";
import FormComponent from "./url.form.component";
import useNavBar from "../../../hooks/navbar";
import type { URLFormInterface } from "../../../types/forms/url.d";
import type { TFunction } from "next-i18next";

interface FormContainerProps {
  route: string;
  closeError: (fieldName: string) => void;
  openError: (fieldName: string, message: string) => void;
  t: TFunction;
}

export default function FormContainer({
  route,
  closeError,
  openError,
  t,
}: FormContainerProps) {
  const { hideNavBar, showNavBar } = useNavBar();
  const router = useRouter();

  useEffect(() => {
    hideNavBar();
    window.addEventListener("resize", hideNavBar);
    return () => {
      window.removeEventListener("resize", hideNavBar);
      showNavBar();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validateURL = (value: string) => {
    if (!value) {
      openError("url", t("url.fields.url.errors.required"));
      return t("url.fields.url.errors.required");
    }
    try {
      const url = new URL(value);
      if (!url.hostname.split(".")[1])
        throw new Error("hostname without suffix.");
    } catch (err) {
      openError("url", t("url.fields.url.errors.invalid"));
      return t("url.fields.url.errors.invalid");
    }
    closeError("url");
    return undefined;
  };

  const handleSubmit = (values: URLFormInterface) => {
    const params = {
      url: values.url,
    };
    const query = new URLSearchParams(params);
    router.push(`${route}?${query.toString()}`);
  };

  return (
    <FormComponent
      t={t}
      validateURL={validateURL}
      handleSubmit={handleSubmit}
    />
  );
}
