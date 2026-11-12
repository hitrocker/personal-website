import OpenGraphImage, { alt as ogAlt } from "./opengraph-image";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = ogAlt;

/** Same card as the Open Graph image. */
export default function TwitterImage() {
  return OpenGraphImage();
}
