type ContentType = "text" | "link" | "image";

export const isURL = (url: string) => {
  try {
    return Boolean(new URL(url));
  } catch (e) {
    return false;
  }
};

export const isImageURL = (url: string) => {
  return /\.(jpg|gif|png)$/.test(url);
};

export function guessContentType(type: string): ContentType {
  if (isImageURL(type)) return "image";
  if (isURL(type)) return "link";
  return "text";
}
