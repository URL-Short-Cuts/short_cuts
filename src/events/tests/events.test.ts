import Events from "../events";
import type EventDefinition from "../event.class";

describe("Dynamic Events", () => {
  const checkEvent = (event1: EventDefinition, event2: EventDefinition) => {
    expect(JSON.stringify(event1)).toBe(JSON.stringify(event2));
  };

  describe("No Dynamic Events Categories", () => {
    describe("No Dynamic Events", () => {
      it("should pass as this is a placeholder test", () => {
        // TODO: Replace me with a proper dynamic event generator test
        checkEvent(Events.General.Test, Events.General.Test);
      });
    });
  });
});
