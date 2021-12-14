let colourIndex = 1;

function mockColour() {
  const colour = `mockColour${colourIndex}`;
  colourIndex++;
  return colour;
}

const mockColourHook = {
  bodyColour: {
    background: mockColour(),
  },
  buttonColour: {
    background: mockColour(),
    border: mockColour(),
    foreground: mockColour(),
    hoverBackground: mockColour(),
  },
  componentColour: {
    background: mockColour(),
    border: mockColour(),
    details: mockColour(),
    foreground: mockColour(),
    scheme: mockColour(),
  },
  consentColour: {
    accept: {
      background: mockColour(),
    },
    decline: {
      background: mockColour(),
    },
  },
  feedbackColour: {
    background: mockColour(),
    border: mockColour(),
    foreground: mockColour(),
  },
  highlightColour: {
    background: mockColour(),
    foreground: mockColour(),
    border: mockColour(),
  },
  inputColour: {
    background: mockColour(),
    border: mockColour(),
    foreground: mockColour(),
  },
  modalColour: {
    background: mockColour(),
    border: mockColour(),
    foreground: mockColour(),
  },
  navButtonColour: {
    background: mockColour(),
    hoverBackground: mockColour(),
    selectedBackground: mockColour(),
  },
  notificationColour: {
    background: mockColour(),
    border: mockColour(),
    foreground: mockColour(),
  },
  warningIconColour: {
    icon: mockColour(),
  },
  transparent: mockColour(),
};

export default mockColourHook;
