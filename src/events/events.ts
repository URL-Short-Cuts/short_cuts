import EventDefinition from "./event.class";

const Events = {
  General: {
    Error: new EventDefinition({
      category: "MAIN",
      label: "ERROR",
      action: "UNSPECIFIED ERROR WAS CAUGHT BY THE ERROR BOUNDARY.",
    }),
    Test: new EventDefinition({
      category: "TEST",
      label: "TEST",
      action: "TEST EVENT WAS PROCESSED.",
    }),
  },
  URL: {
    Request: new EventDefinition({
      category: "URL",
      label: "REQUEST",
      action: "SHORTCUT",
    }),
    Success: new EventDefinition({
      category: "URL",
      label: "RESPONSE",
      action: "SHORTCUT GENERATED SUCCESSFULLY",
    }),
    Error: new EventDefinition({
      category: "URL",
      label: "ERROR",
      action: "ERROR DURING SHORTCUT REQUEST",
    }),
  },
};

export default Events;
