import * as fabric from "fabric";

// Please ignore all the type uglyness. it's to avoid someone from shooting themselves in the foot.
interface NonMovableObject {
  selectable: false;
  moveCursor: "default";
  hoverCursor: "default";
}

interface MovableObject {
  selectable: true;
}

function getMovableProps(
  selectable: boolean,
): NonMovableObject | MovableObject {
  return selectable
    ? {
        selectable: true,
      }
    : {
        selectable: false,
        moveCursor: "default",
        hoverCursor: "default",
      };
}

interface ICachingDisabled {
  objectCaching: false;
  noScaleCache: false;
}

const caching_disabled: ICachingDisabled = {
  noScaleCache: false,
  objectCaching: false,
};

interface ICircleOptions {
  x: number;
  y: number;
  radius: number;
  fill: string;
  opacity: number;
}

/**
 * Draws a circle on the canvas
 * @param x - X coordinate of the circle
 * @param y - Y coordinate of the circle
 * @param radius - Radius of the circle
 * @param fill - Color of the circle
 * @param opacity - Opacity of the circle
 * @returns - The created circle
 */
export const drawCircle = async (
  { x, y, radius, fill, opacity }: ICircleOptions,
  { selectable }: ISelectable,
) => {
  const circle = new fabric.Circle({
    left: x,
    top: y,
    radius: radius,
    fill: fill,
    opacity: opacity,
    ...caching_disabled,
    ...getMovableProps(selectable),
  });

  return circle;
};

interface ISquareOptions {
  x: number;
  y: number;
  size: number;
  fill: string;
  opacity: number;
}

export const drawSquare = async (
  { x, y, size, fill, opacity }: ISquareOptions,
  { selectable }: ISelectable,
) => {
  const square = new fabric.Rect({
    left: x,
    top: y,
    height: size,
    width: size,
    fill: fill,
    opacity: opacity,
    ...caching_disabled,
    ...getMovableProps(selectable),
  });

  return square;
};

interface IDimensions {
  height: number;
  width: number;
}

interface ISelectable {
  selectable: boolean;
}
/**
 * Draws a scaled image on the canvas
 * @param url - URL of the image
 * @param height - The height to scale to
 * @param width - The width to scale to
 * @returns - The created scaled image
 */
export const drawScaledImageFromURL = async (
  url: string,
  { height, width }: Partial<IDimensions>,
  { selectable }: ISelectable,
): Promise<fabric.FabricImage> => {
  //const img = await fabric.FabricImage.fromURL(url);

  const img = await fabric.FabricImage.fromURL(
    url,
    {},
    {
      ...caching_disabled,
      ...getMovableProps(selectable),
    },
  );

  if (height && width) {
    img.scale(Math.min(height / img.height, width / img.width));

    img.set({
      left: (height - img.getScaledWidth()) / 2,
      top: (width - img.getScaledHeight()) / 2,
    });
  } else if (height) {
    img.scaleToHeight(height);
  } else if (width) {
    img.scaleToWidth(width);
  } else {
    // Do nothing, comment only exists in case we later want to do something
  }

  return img;
};

/**
 * Draws a scaled square image on the canvas
 * @param url - URL of the image
 * @param size - The size to scale to
 */
export const drawSquareScaledImageFromURL = async (
  url: string,
  size: number,
  selectable_options: ISelectable,
): Promise<fabric.FabricImage> => {
  return drawScaledImageFromURL(
    url,
    { height: size, width: size },
    selectable_options,
  );
};

interface ITextOptions {
  color: string;
  italic?: boolean;
  underline?: boolean;
  bold?: boolean;
  fontSize: number;
  fontFamily: string;
}

export const drawText = (
  content: string,
  { color, italic, underline, bold, fontSize, fontFamily }: ITextOptions,
  { selectable }: ISelectable,
): fabric.FabricText => {
  const text = new fabric.FabricText(content, {
    fontFamily: fontFamily,
    fontSize: fontSize,
    fill: color,
    fontStyle: italic ? "italic" : "normal",
    fontWeight: bold ? "bold" : "normal",
    underline: underline,
    ...caching_disabled,
    ...getMovableProps(selectable),
  });

  return text;
};

export const drawSvg = async (url: string, { selectable }: ISelectable) => {
  const { objects } = await fabric.loadSVGFromURL(url);

  let props = getMovableProps(selectable);

  const object = fabric.util.groupSVGElements(
    // Just a filter to avoid mischiveous svg images, though I could have just
    // type cast to make ts happy.
    objects.filter((o) => o !== null),
    {
      ...caching_disabled,
      ...props,
    },
  );

  Object.entries(props).forEach(([k, v]) => object.set(k, v));
  Object.entries(caching_disabled).forEach(([k, v]) => object.set(k, v));

  return object;
};

export function debug_fabric_obj(object: fabric.FabricObject) {
  object.on("mousedown", () => {
    console.log({
      top: object.get("top"),
      left: object.get("left"),
      height: object.getScaledHeight(),
      width: object.getScaledWidth(),
    });
  });
}
