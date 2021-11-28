export type EventDefinitionType = {
  category: "MAIN" | "TEST";
  label: "BUTTON" | "ERROR" | "EXTERNAL_LINK" | "INTERNAL_LINK" | "TEST";
  action: string;
  value?: number;
};
