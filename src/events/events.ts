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
};

export default Events;
