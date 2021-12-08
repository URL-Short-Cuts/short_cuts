export const maximumLength = 2048;

export const isValidUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    if (!parsedUrl.hostname.split(".")[1]) return false;
    if (url.length >= maximumLength) return false;
    return true;
  } catch (_) {
    return false;
  }
};
