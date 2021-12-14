export type EventDefinitionType = {
  category: "MAIN" | "TEST" | "URL";
  label:
    | "BUTTON"
    | "ERROR"
    | "EXTERNAL_LINK"
    | "INTERNAL_LINK"
    | "RESPONSE"
    | "REQUEST"
    | "TEST";
  action: string;
  value?: number;
};
