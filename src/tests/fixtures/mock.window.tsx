const originalWindowLocation = { ...window.location };
export const mockWindowResponse = jest.fn();

export default function mockWindow() {
  Object.defineProperty(window, "location", {
    value: {
      hash: {
        endsWith: mockWindowResponse,
        includes: mockWindowResponse,
      },
      assign: mockWindowResponse,
    },
    writable: true,
  });
}

export function restoreWindow() {
  window.location = originalWindowLocation;
}
