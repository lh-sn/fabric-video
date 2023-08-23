import * as fabric from "fabric";
import { Image, ImageSource, ImageProps, classRegistry } from "fabric";

interface VideoProps extends ImageProps {}

export class Video extends Image {
  static type = "Video";
  constructor(element: ImageSource, options: VideoProps) {
    super(element, options);
    this.objectCaching = false;
  }
  getElement() {
    return this._element as HTMLVideoElement;
  }

  _renderFill(ctx: CanvasRenderingContext2D) {
    const elementToDraw = this._element;
    if (!elementToDraw) {
      return;
    }
    const scaleX = this._filterScalingX,
      scaleY = this._filterScalingY,
      w = this.width,
      h = this.height,
      // crop values cannot be lesser than 0.
      cropX = Math.max(this.cropX, 0),
      cropY = Math.max(this.cropY, 0),
      elWidth =
        (elementToDraw as HTMLVideoElement).videoWidth || elementToDraw.width,
      elHeight =
        (elementToDraw as HTMLVideoElement).videoHeight || elementToDraw.height,
      sX = cropX * scaleX,
      sY = cropY * scaleY,
      // the width height cannot exceed element width/height, starting from the crop offset.
      sW = Math.min(w * scaleX, elWidth - sX),
      sH = Math.min(h * scaleY, elHeight - sY),
      x = -w / 2,
      y = -h / 2,
      maxDestW = Math.min(w, elWidth / scaleX - cropX),
      maxDestH = Math.min(h, elHeight / scaleY - cropY);
    elementToDraw &&
      ctx.drawImage(elementToDraw, sX, sY, sW, sH, x, y, maxDestW, maxDestH);
  }

  static fromURL(url: string, options: any = {}): Promise<Video> {
    return createVideoElement(url, options).then((video) => {
      video.currentTime = 0;

      const height = video.videoHeight;
      const width = video.videoWidth;
      const element = new this(video, { ...options, height, width });
      return element;
    });
  }

  static fromObject(
    { filters: f, resizeFilter: rf, src, crossOrigin, ...object }: any,
    options: { signal: AbortSignal }
  ): Promise<Video> {
    return Promise.all([
      createVideoElement(src, { ...options, crossOrigin }),
      f && fabric.util.enlivenObjects(f, options),
      rf && fabric.util.enlivenObjects([rf], options),
      fabric.util.enlivenObjectEnlivables(object, options),
    ]).then(([el, filters = [], [resizeFilter] = [], hydratedProps = {}]) => {
      return new this(el, {
        ...object,
        src,
        crossOrigin,
        filters,
        resizeFilter,
        ...hydratedProps,
      });
    });
  }
}

const createVideoElement = async (
  src: string,
  options: any
): Promise<HTMLVideoElement> => {
  return new Promise((resolve, reject) => {
    const videoElement = document.createElement("video");
    videoElement.setAttribute("id", options.id);
    videoElement.setAttribute("src", src);
    videoElement.crossOrigin = "anonymous";
    videoElement.style.display = "none";
    videoElement.style.zIndex = "1000";
    videoElement.style.position = "absolute";
    videoElement.setAttribute("controls", "true");
    videoElement.addEventListener("loadedmetadata", () => {
      videoElement.currentTime = 0;
    });
    videoElement.addEventListener("seeked", function () {
      resolve(videoElement);
    });

    videoElement.addEventListener("error", function (error) {
      reject(error);
    });
  });
};

classRegistry.setClass(Video);
classRegistry.setSVGClass(Video);

export default Video;
