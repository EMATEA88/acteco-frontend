import images from "../config/recharge-images";

export function getLogo(fileName?: string): string {

  if (!fileName) {
    return "";
  }

  const normalized = fileName.toUpperCase();

  for (const path in images) {

    if (path.toUpperCase().endsWith(normalized)) {
      return images[path];
    }

  }

  return "";

}