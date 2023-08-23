import { type Rect, type Canvas } from "fabric";

export const getArboardCenterZoom = (canvas: Canvas, artboard: Rect) => {
  const widthRatio = (canvas.width / artboard.width) * 0.7;
  const heightRatio = (canvas.height / artboard.height) * 0.8;

  return Math.min(widthRatio, heightRatio);
};

export const centerArtboard = (canvas: Canvas, artboard: Rect) => {
  const zoom = getArboardCenterZoom(canvas, artboard);
  canvas.setZoom(zoom);

  const vpt = canvas.viewportTransform;
  vpt[4] = (canvas.width - artboard.width * zoom) / 2;
  vpt[5] = (canvas.height - artboard.height * zoom) / 2;

  canvas.requestRenderAll();
};
