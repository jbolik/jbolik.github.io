(() => {
  "use strict";

  const SVG_NS = "http://www.w3.org/2000/svg";
  const $ = (selector, root = document) => root.querySelector(selector);
  const math = (element, tex) => window.FigureMath.render(element, tex);

  const state = { L: 18 };
  const coefficients = { a1: 2, a2: 4, b1: 1, b2: 1 };
  const boxes = {
    upper: { xMin: 0.6, yMin: 0.7, label: "outer tail" },
    lower: { xMin: 2.2, yMin: 1.9, label: "inner tail: continuous factor ≥ c" },
  };
  const frame = { left: 72, right: 640, top: 38, bottom: 440, max: 7 };

  const xScale = (value) => frame.left + value / frame.max * (frame.right - frame.left);
  const yScale = (value) => frame.bottom - value / frame.max * (frame.bottom - frame.top);
  const pointString = (points) => points.map(({ x, y }) => `${xScale(x)},${yScale(y)}`).join(" ");

  function createSvg(tag, attributes = {}) {
    const element = document.createElementNS(SVG_NS, tag);
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
    return element;
  }

  function drawGrid(svg) {
    const layer = $(".grid-layer", svg);
    layer.replaceChildren();
    for (let value = 1; value <= 7; value += 1) {
      layer.append(
        createSvg("line", {
          x1: xScale(value), y1: frame.top, x2: xScale(value), y2: frame.bottom,
          class: "grid-line",
        }),
        createSvg("line", {
          x1: frame.left, y1: yScale(value), x2: frame.right, y2: yScale(value),
          class: "grid-line",
        }),
      );
      const xLabel = createSvg("text", {
        x: xScale(value), y: frame.bottom + 22, class: "grid-label", "text-anchor": "middle",
      });
      xLabel.textContent = value;
      const yLabel = createSvg("text", {
        x: frame.left - 14, y: yScale(value) + 4, class: "grid-label", "text-anchor": "end",
      });
      yLabel.textContent = value;
      layer.append(xLabel, yLabel);
    }
  }

  function clipToConstraint(polygon) {
    const value = ({ x, y }) => coefficients.a1 * x + coefficients.a2 * y - state.L;
    const result = [];
    for (let index = 0; index < polygon.length; index += 1) {
      const current = polygon[index];
      const previous = polygon[(index + polygon.length - 1) % polygon.length];
      const currentValue = value(current);
      const previousValue = value(previous);
      const currentInside = currentValue >= 0;
      const previousInside = previousValue >= 0;
      if (currentInside !== previousInside) {
        const ratio = previousValue / (previousValue - currentValue);
        result.push({
          x: previous.x + ratio * (current.x - previous.x),
          y: previous.y + ratio * (current.y - previous.y),
        });
      }
      if (currentInside) result.push(current);
    }
    return result;
  }

  function lineSegment(box, c1, c2, level) {
    const candidates = [];
    const add = (x, y) => {
      if (x < box.xMin - 1e-8 || x > frame.max + 1e-8) return;
      if (y < box.yMin - 1e-8 || y > frame.max + 1e-8) return;
      if (candidates.some((point) => Math.hypot(point.x - x, point.y - y) < 1e-7)) return;
      candidates.push({ x, y });
    };
    add(box.xMin, (level - c1 * box.xMin) / c2);
    add(frame.max, (level - c1 * frame.max) / c2);
    add((level - c2 * box.yMin) / c1, box.yMin);
    add((level - c2 * frame.max) / c1, frame.max);
    if (candidates.length < 2) return null;
    return candidates.slice(0, 2);
  }

  function setLine(element, segment) {
    if (!segment) {
      element.setAttribute("visibility", "hidden");
      return;
    }
    element.removeAttribute("visibility");
    element.setAttribute("x1", xScale(segment[0].x));
    element.setAttribute("y1", yScale(segment[0].y));
    element.setAttribute("x2", xScale(segment[1].x));
    element.setAttribute("y2", yScale(segment[1].y));
  }

  function supportPoints() {
    return [
      { x: 0.95, y: frame.max },
      { x: 0.88, y: 5.4 },
      { x: 1.08, y: 4.4 },
      { x: 1.30, y: 3.4 },
      { x: 1.18, y: 2.65 },
      { x: 1.52, y: 2.05 },
      { x: 2.15, y: 1.55 },
      { x: 2.95, y: 1.42 },
      { x: 3.85, y: 1.18 },
      { x: 4.85, y: 0.93 },
      { x: frame.max, y: 0.98 },
      { x: frame.max, y: frame.max },
    ];
  }

  const closedPath = (points) => points.length ? `M ${pointString(points)} Z` : "";

  function optimizer(box) {
    const yOnConstraint = (state.L - coefficients.a1 * box.xMin) / coefficients.a2;
    if (yOnConstraint >= box.yMin) {
      return { x: box.xMin, y: yOnConstraint };
    }
    return { x: (state.L - coefficients.a2 * box.yMin) / coefficients.a1, y: box.yMin };
  }

  function drawPanel(svg, box, kind) {
    const polygon = [
      { x: box.xMin, y: box.yMin },
      { x: frame.max, y: box.yMin },
      { x: frame.max, y: frame.max },
      { x: box.xMin, y: frame.max },
    ];
    const feasible = clipToConstraint(polygon);
    $(".feasible-region", svg).setAttribute("d", closedPath(feasible));

    const support = supportPoints();
    const supportPath = closedPath(support);
    $(".support-region", svg).setAttribute("d", supportPath);
    $(".active-support-region", svg).setAttribute("d", closedPath(clipToConstraint(support)));
    $(".support-outline", svg).setAttribute("d", supportPath);

    const rectangle = $(".tail-box", svg);
    rectangle.setAttribute("x", xScale(box.xMin));
    rectangle.setAttribute("y", yScale(frame.max));
    rectangle.setAttribute("width", xScale(frame.max) - xScale(box.xMin));
    rectangle.setAttribute("height", yScale(box.yMin) - yScale(frame.max));

    const optimum = optimizer(box);
    const optimumCost = coefficients.b1 * optimum.x + coefficients.b2 * optimum.y;
    setLine(
      $(".constraint-line", svg),
      lineSegment(box, coefficients.a1, coefficients.a2, state.L),
    );
    setLine(
      $(".cost-line", svg),
      lineSegment(box, coefficients.b1, coefficients.b2, optimumCost),
    );

    const point = $(".optimum-point", svg);
    point.setAttribute("cx", xScale(optimum.x));
    point.setAttribute("cy", yScale(optimum.y));
    const pointLabel = $(".optimum-label", svg);
    pointLabel.setAttribute("x", xScale(optimum.x) + 12);
    pointLabel.setAttribute("y", yScale(optimum.y) - 12);
    pointLabel.textContent = "min B";

    const boxLabel = $(".box-label", svg);
    boxLabel.setAttribute("x", xScale(box.xMin) + 10);
    boxLabel.setAttribute("y", yScale(frame.max) + 22);
    boxLabel.textContent = box.label;

    const lambda = coefficients.b2 / coefficients.a2;
    const intercept = (coefficients.b1 - lambda * coefficients.a1) * box.xMin;
    math(
      $(`#${kind}Formula`),
      `${kind === "upper" ? "F_T" : "F_{T'}"}(L):=\\frac14L+${intercept.toFixed(2)}
      =${optimumCost.toFixed(2)}`,
    );
  }

  function render() {
    math($("#lOutput"), state.L.toFixed(2).replace(/\.00$/, ""));
    drawPanel($("#upperSvg"), boxes.upper, "upper");
    drawPanel($("#lowerSvg"), boxes.lower, "lower");
  }

  ["#upperSvg", "#lowerSvg"].forEach((selector) => drawGrid($(selector)));
  $("#lRange").addEventListener("input", (event) => {
    state.L = Number(event.target.value);
    render();
  });
  render();

  let lastReportedHeight = 0;
  const heightTarget = document.querySelector(".figure-shell");
  const reportHeight = () => {
    if (window.parent === window) return;
    const shellTop = heightTarget.getBoundingClientRect().top;
    const contentBottom = heightTarget.lastElementChild.getBoundingClientRect().bottom;
    const paddingBottom = Number.parseFloat(getComputedStyle(heightTarget).paddingBottom) || 0;
    const height = Math.ceil(contentBottom - shellTop + paddingBottom);
    if (height === lastReportedHeight) return;
    lastReportedHeight = height;
    window.parent.postMessage({ type: "interactive-figure-height", height }, window.location.origin);
  };
  window.addEventListener("load", reportHeight);
  window.addEventListener("resize", reportHeight);
  window.addEventListener("figure-math-rendered", reportHeight);
  if ("ResizeObserver" in window) new ResizeObserver(reportHeight).observe(heightTarget);
})();
