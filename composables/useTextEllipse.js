import { SVG } from "@svgdotjs/svg.js";

export const useTextEllipse = (options) => {
  let content = options.text || "Hello World";
  const x = options.x || 0;
  const y = options.y || 0;
  const r = options.r || 100;
  const speed = options.speed || 0.01;
  const svgSelector = options.svgSelector || "mySvg";
  const offset = options.offset || 25;
  const color = options.color || "rgba(0,0,0,255)";
  const front = options.front || false;
  const blend = options.blend || false;
  let text;

  useRafFn(() => {
    text.rotate(speed, x, y);
  });

  onMounted(() => {
    var draw = SVG(svgSelector);
    let circlePath;
    circlePath = draw.path(
      `M ${x},${y} m -${r},0 a ${r},${r} 0 1,0 ${2 * r},0 a ${r},${r} 0 1,0 -${
        2 * r
      },0`
    );
    circlePath.fill("none").stroke({ color: "transparent", width: 0 });
    circlePath.attr(
      "id",
      "circlePath" + Math.floor(Math.random() * 10000000000)
    );
    circlePath.plot(
      `M ${x},${y} m -${r},0 a ${r},${r} 0 1,1 ${2 * r},0 a ${r},${r} 0 1,1 -${
        2 * r
      },0`
    );

    text = draw
      .text(function (add) {
        add.tspan("");
      })
      .fill(color);
    if (front) text.front();
    else text.back();
    if (blend) text.addClass("mix-blend-difference");
    let textPath = text.path(circlePath);
    textPath.tspan(content);
    textPath.attr("startOffset", offset + "%");
  });

  return 0;
};
