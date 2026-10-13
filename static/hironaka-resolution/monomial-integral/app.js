(() => {
  "use strict";

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const SVG_NS = "http://www.w3.org/2000/svg";
  const XHTML_NS = "http://www.w3.org/1999/xhtml";
  const math = (element, tex) => window.FigureMath.render(element, tex);
  const svgMath = (element, tex) => math(element.firstElementChild, tex);
  const richMath = (element, html) => {
    element.innerHTML = html;
    window.FigureMath.renderAll(element);
  };
  const state = { logN: 4, ku: 1, kv: 1, ju: 0, jv: 0, curve: null, draggingRate: false };
  const gcd = (a, b) => b === 0 ? Math.abs(a) : gcd(b, a % b);
  const fraction = (numerator, denominator) => {
    const divisor = gcd(numerator, denominator);
    return `${numerator / divisor}/${denominator / divisor}`;
  };
  const fractionTex = (value) => {
    const [numerator, denominator] = String(value).split("/");
    return denominator ? `\\frac{${numerator}}{${denominator}}` : numerator;
  };
  const scientificTex = (value) => {
    const [mantissa, exponent] = value.toExponential(3).split("e");
    return `${mantissa}\\times10^{${Number(exponent)}}`;
  };
  const coordinateData = () => [
    { key: "u", k: state.ku, J: state.ju, axis: "t_u" },
    { key: "v", k: state.kv, J: state.jv, axis: "t_v" },
  ];
  const activeCoordinates = () => coordinateData()
    .filter((coordinate) => coordinate.k > 0)
    .map((coordinate) => {
      const a = 2 * coordinate.k;
      const b = coordinate.J + 1;
      return { ...coordinate, a, b, ratio: b / a, ratioText: fraction(b, a) };
    });
  const rateData = () => {
    const active = activeCoordinates();
    const lambda = Math.min(...active.map((coordinate) => coordinate.ratio));
    const tiedCoordinates = active.filter((coordinate) => Math.abs(coordinate.ratio - lambda) < 1e-10);
    const byKey = Object.fromEntries(active.map((coordinate) => [coordinate.key, coordinate]));
    const ru = byKey.u ? byKey.u.ratio : Infinity;
    const rv = byKey.v ? byKey.v.ratio : Infinity;
    return {
      active, ru, rv,
      tied: tiedCoordinates.length > 1,
      lambda,
      multiplicity: tiedCoordinates.length,
      lambdaText: tiedCoordinates[0].ratioText,
      ruText: byKey.u ? byKey.u.ratioText : "flat",
      rvText: byKey.v ? byKey.v.ratioText : "flat",
      dominant: tiedCoordinates[0],
    };
  };

  function rateTex() {
    const { lambdaText, multiplicity } = rateData();
    return `n^{-${fractionTex(lambdaText)}}${multiplicity > 1 ? "\\log n" : ""}`;
  }

  function monomialFactorTex(variable, exponent) {
    if (exponent === 0) return "";
    return `\\lvert ${variable}\\rvert^{${exponent}}`;
  }

  function updateIntegralFormula() {
    const lossFactors = monomialFactorTex("u", 2 * state.ku) + monomialFactorTex("v", 2 * state.kv);
    const weightFactors = monomialFactorTex("u", state.ju) + monomialFactorTex("v", state.jv);
    const density = weightFactors ? `${weightFactors}\\,` : "";
    const exponential = `\\exp\\!\\left(-n${lossFactors || "1"}\\right)`;
    math(
      $("#integralFormula"),
      `I_n:=\\int_{[-1,1]^2}${exponential}${density}du\\,dv`,
    );
    math(
      $("#integralFormulaCompact"),
      `\\begin{aligned} I_n&:=\\int_{[-1,1]^2}${exponential}\\\\ &\\qquad{}${density}du\\,dv \\end{aligned}`,
    );
  }

  function updateReadouts() {
    const nExponent = Number(state.logN.toFixed(2));
    const { lambdaText, multiplicity } = rateData();
    const modelFactors = [];
    const flatCoordinates = [];
    coordinateData().forEach((coordinate) => {
      if (coordinate.k > 0) modelFactors.push(`${coordinate.key}^{${2 * coordinate.k}}`);
      else flatCoordinates.push(coordinate.key);
    });
    math($("#nOutput"), `10^{${nExponent}}`);
    math($("#modelFormula"), `K(u,v):=${modelFactors.join("") || "1"}`);
    const weightFactors = [];
    if (state.ju > 0) weightFactors.push(`\\lvert u\\rvert^{${state.ju}}`);
    if (state.jv > 0) weightFactors.push(`\\lvert v\\rvert^{${state.jv}}`);
    math($("#weightFormula"), `${weightFactors.join("")}\\,du\\,dv`);
    if ($("#geometryCaption")) {
      if (weightFactors.length === 0) {
        richMath($("#geometryCaption"), 'Teal shows the sublevel set whose weighted area is <span data-tex="V(1/n)"></span>; the shading is uniform because the Jacobian factor is <span data-tex="1"></span>.');
      } else if (state.ju > 0 && state.jv === 0) {
        richMath($("#geometryCaption"), `Teal shows the sublevel set weighted by Jacobian density <span data-tex="${weightFactors.join("")}"></span>; cells fade near <span data-tex="u=0"></span> and darken as <span data-tex="\\lvert u\\rvert"></span> grows.`);
      } else {
        richMath($("#geometryCaption"), `Teal shows the sublevel set weighted by Jacobian density <span data-tex="${weightFactors.join("")}"></span>; darker cells contribute more to <span data-tex="V(1/n)"></span>.`);
      }
    }
    math($("#rateFormula"), rateTex());
    math($("#predictionOutput"), `C\\,${rateTex()}`);
    math($("#lambdaFormula"), `\\lambda=${fractionTex(lambdaText)},\\quad m=${multiplicity}`);
    $("#flatNote").textContent = flatCoordinates.length ? `; ${flatCoordinates.join(", ")} flat` : "";
    updateIntegralFormula();
  }

  function drawGeometry() {
    const canvas = $("#geometryCanvas");
    const context = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    const cx = width / 2;
    const cy = 265;
    const radius = 224;
    const n = 10 ** state.logN;
    const a = 2 * state.ku;
    const b = 2 * state.kv;
    const threshold = 1 / n;
    context.clearRect(0, 0, width, height);
    context.fillStyle = "#fbfaf6";
    context.fillRect(0, 0, width, height);

    const cells = 176;
    const cellSize = (2 * radius) / cells;
    for (let row = 0; row < cells; row += 1) {
      const v = 1 - (row + 0.5) * 2 / cells;
      for (let column = 0; column < cells; column += 1) {
        const u = -1 + (column + 0.5) * 2 / cells;
        const K = (a > 0 ? Math.abs(u) ** a : 1) * (b > 0 ? Math.abs(v) ** b : 1);
        if (K > threshold) continue;
        const jacobianWeight = Math.abs(u) ** state.ju * Math.abs(v) ** state.jv;
        const hasJacobianWeight = state.ju > 0 || state.jv > 0;
        const alpha = hasJacobianWeight ? 0.04 + 0.86 * jacobianWeight ** 0.55 : 0.48;
        context.fillStyle = `rgba(40,125,123,${alpha})`;
        context.fillRect(cx - radius + column * cellSize, cy - radius + row * cellSize, cellSize + 0.7, cellSize + 0.7);
      }
    }

    context.strokeStyle = "#aebdbb";
    context.lineWidth = 1.5;
    context.beginPath();
    context.moveTo(cx - radius - 20, cy);
    context.lineTo(cx + radius + 20, cy);
    context.moveTo(cx, cy - radius - 20);
    context.lineTo(cx, cy + radius + 20);
    context.stroke();

    context.strokeStyle = "#d9613f";
    context.lineWidth = 4;
    if (a > 0 && b > 0) {
      const uMinimum = threshold ** (1 / a);
      for (const signU of [-1, 1]) {
        for (const signV of [-1, 1]) {
          context.beginPath();
          const samples = 260;
          for (let index = 0; index <= samples; index += 1) {
            const uAbs = uMinimum + (1 - uMinimum) * index / samples;
            const vAbs = Math.min(1, (threshold / (uAbs ** a)) ** (1 / b));
            const x = cx + signU * uAbs * radius;
            const y = cy - signV * vAbs * radius;
            if (index === 0) context.moveTo(x, y);
            else context.lineTo(x, y);
          }
          context.stroke();
        }
      }
    } else if (a > 0) {
      const uBoundary = Math.min(1, threshold ** (1 / a));
      for (const signU of [-1, 1]) {
        const x = cx + signU * uBoundary * radius;
        context.beginPath();
        context.moveTo(x, cy - radius);
        context.lineTo(x, cy + radius);
        context.stroke();
      }
    } else if (b > 0) {
      const vBoundary = Math.min(1, threshold ** (1 / b));
      for (const signV of [-1, 1]) {
        const y = cy - signV * vBoundary * radius;
        context.beginPath();
        context.moveTo(cx - radius, y);
        context.lineTo(cx + radius, y);
        context.stroke();
      }
    }

    context.fillStyle = "#52666a";
    context.font = "16px system-ui, sans-serif";
    context.textAlign = "center";
    for (const tick of [-1, -0.5, 0.5, 1]) {
      const x = cx + tick * radius;
      context.fillText(String(tick), x, cy + 24);
      context.beginPath();
      context.moveTo(x, cy - 5);
      context.lineTo(x, cy + 5);
      context.strokeStyle = "#aebdbb";
      context.lineWidth = 1;
      context.stroke();
    }
    context.textAlign = "right";
    for (const tick of [-1, -0.5, 0.5, 1]) {
      const y = cy - tick * radius;
      context.fillText(String(tick), cx - 11, y + 5);
    }
  }

  function svgElement(name, attributes = {}, text = "") {
    const element = document.createElementNS(SVG_NS, name);
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
    if (text) element.textContent = text;
    return element;
  }

  function svgHtmlLabel(attributes, html, className = "") {
    const foreignObject = svgElement("foreignObject", { ...attributes, class: `svg-html-label ${className}`.trim() });
    const content = document.createElementNS(XHTML_NS, "div");
    content.innerHTML = html;
    foreignObject.append(content);
    window.FigureMath.renderAll(content);
    return foreignObject;
  }

  function lineRectangleIntersections(A, B, C, maximum) {
    const points = [];
    const add = (x, y) => {
      if (x < -1e-8 || y < -1e-8 || x > maximum + 1e-8 || y > maximum + 1e-8) return;
      if (!points.some((point) => Math.hypot(point[0] - x, point[1] - y) < 1e-7)) points.push([Math.max(0, Math.min(maximum, x)), Math.max(0, Math.min(maximum, y))]);
    };
    if (B !== 0) { add(0, C / B); add(maximum, (C - A * maximum) / B); }
    if (A !== 0) { add(C / A, 0); add((C - B * maximum) / A, maximum); }
    return points.slice(0, 2);
  }

  function clipHalfPlane(polygon, A, B, C) {
    const output = [];
    for (let index = 0; index < polygon.length; index += 1) {
      const current = polygon[index];
      const previous = polygon[(index + polygon.length - 1) % polygon.length];
      const currentValue = A * current[0] + B * current[1] - C;
      const previousValue = A * previous[0] + B * previous[1] - C;
      const currentInside = currentValue >= -1e-10;
      const previousInside = previousValue >= -1e-10;
      if (currentInside !== previousInside) {
        const ratio = previousValue / (previousValue - currentValue);
        output.push([previous[0] + ratio * (current[0] - previous[0]), previous[1] + ratio * (current[1] - previous[1])]);
      }
      if (currentInside) output.push(current);
    }
    return output;
  }

  function drawLogGeometry() {
    const left = 82;
    const right = 672;
    const top = 42;
    const bottom = 490;
    const width = right - left;
    const height = bottom - top;
    const logN = state.logN * Math.LN10;
    const A = 2 * state.ku;
    const B = 2 * state.kv;
    const rates = rateData();
    const costU = state.ku > 0 ? state.ju + 1 : 0;
    const costV = state.kv > 0 ? state.jv + 1 : 0;
    const activeIntercepts = [];
    if (A > 0) activeIntercepts.push(logN / A);
    if (B > 0) activeIntercepts.push(logN / B);
    const maximum = Math.max(4, 1.32 * Math.max(...activeIntercepts) + 1.2);
    const map = ([tU, tV]) => [left + width * tU / maximum, bottom - height * tV / maximum];

    const grid = $("#logGrid");
    grid.replaceChildren();
    const step = maximum <= 7 ? 1 : maximum <= 14 ? 2 : 4;
    for (let value = 0; value <= maximum + 1e-8; value += step) {
      const [x] = map([value, 0]);
      const [, y] = map([0, value]);
      grid.append(svgElement("line", { x1: x, y1: top, x2: x, y2: bottom, class: "grid-line" }));
      grid.append(svgElement("line", { x1: left, y1: y, x2: right, y2: y, class: "grid-line" }));
      if (value > 0) {
        grid.append(svgElement("text", { x, y: bottom + 18, "text-anchor": "middle", class: "grid-label" }, String(value)));
        grid.append(svgElement("text", { x: left - 9, y: y + 4, "text-anchor": "end", class: "grid-label" }, String(value)));
      }
    }

    const polygon = clipHalfPlane([[0, 0], [maximum, 0], [maximum, maximum], [0, maximum]], A, B, logN);
    $("#allowedRegion").setAttribute("points", polygon.map((point) => map(point).join(",")).join(" "));
    const constraintPoints = lineRectangleIntersections(A, B, logN, maximum);
    const constraint = $("#constraintLine");
    if (constraintPoints.length === 2) {
      const first = map(constraintPoints[0]);
      const second = map(constraintPoints[1]);
      constraint.setAttribute("x1", first[0]); constraint.setAttribute("y1", first[1]);
      constraint.setAttribute("x2", second[0]); constraint.setAttribute("y2", second[1]);
    }

    const costConstant = rates.lambda * logN;
    const costPoints = lineRectangleIntersections(costU, costV, costConstant, maximum);
    const costLine = $("#costLine");
    if (costPoints.length === 2) {
      const first = map(costPoints[0]);
      const second = map(costPoints[1]);
      costLine.setAttribute("x1", first[0]); costLine.setAttribute("y1", first[1]);
      costLine.setAttribute("x2", second[0]); costLine.setAttribute("y2", second[1]);
    }
    $("#constraintLabel").setAttribute("x", left + 15);
    $("#constraintLabel").setAttribute("y", top + 6);
    const activeTerms = [];
    if (A > 0) activeTerms.push(`${A}t_u`);
    if (B > 0) activeTerms.push(`${B}t_v`);
    svgMath($("#constraintLabel"), `A(t)=${activeTerms.join("+")}\\ge\\log n`);
    $("#costLabel").setAttribute("x", right - 243);
    $("#costLabel").setAttribute("y", top + 6);
    svgMath($("#costLabel"), `\\min B(t)=${fractionTex(rates.lambdaText)}\\log n`);

    const mark = $("#dominantMark");
    mark.replaceChildren();
    if (rates.active.length === 1) {
      const only = rates.active[0];
      const dominant = only.key === "u" ? [logN / A, 0] : [0, logN / B];
      const point = map(dominant);
      mark.append(svgElement("circle", { cx: point[0], cy: point[1], r: 9, class: "dominant-point" }));
      mark.append(svgHtmlLabel({ x: point[0] + 14, y: point[1] - 31, width: 165, height: 30 }, `only active: <span data-tex="${only.key}"></span>`));
      richMath($("#logCaption"), `Only <span data-tex="${only.key}"></span> enters <span data-tex="K"></span>. The other coordinate is bounded flat thickness, integrated out before the active log calculation.`);
    } else if (rates.tied) {
      const first = map([logN / A, 0]);
      const second = map([0, logN / B]);
      mark.append(svgElement("line", { x1: first[0], y1: first[1], x2: second[0], y2: second[1], class: "dominant-segment" }));
      mark.append(svgHtmlLabel({ x: (first[0] + second[0]) / 2 + 12, y: (first[1] + second[1]) / 2 - 31, width: 185, height: 30 }, "equally efficient family"));
      richMath($("#logCaption"), 'The gold segment minimizes <span data-tex="B(t)"></span> subject to <span data-tex="A(t)=\\log n"></span>; its growing length creates the logarithm.');
    } else {
      const dominant = rates.ru < rates.rv ? [logN / A, 0] : [0, logN / B];
      const point = map(dominant);
      mark.append(svgElement("circle", { cx: point[0], cy: point[1], r: 9, class: "dominant-point" }));
      const coordinate = rates.ru < rates.rv ? "u" : "v";
      mark.append(svgHtmlLabel({ x: point[0] + 14, y: point[1] - 31, width: 190, height: 30 }, `cheapest: shrink <span data-tex="${coordinate}"></span>`));
      richMath($("#logCaption"), `The gold point minimizes <span data-tex="B(t)"></span> subject to <span data-tex="A(t)=\\log n"></span>; shrinking <span data-tex="${coordinate}"></span> loses the least weighted volume.`);
    }
  }

  function integrateAt(log10N) {
    const naturalLogN = log10N * Math.LN10;
    const active = activeCoordinates();
    if (active.length === 1) {
      const only = active[0];
      const flat = coordinateData().find((coordinate) => coordinate.k === 0);
      const flatPositiveMass = flat ? 1 / (flat.J + 1) : 1;
      const maximum = naturalLogN / only.a + 10 / only.b + 3;
      const count = 180;
      const step = maximum / count;
      let total = 0;
      for (let index = 0; index < count; index += 1) {
        const t = (index + 0.5) * step;
        const logNK = naturalLogN - only.a * t;
        const likelihood = logNK > 7 ? 0 : logNK < -25 ? 1 : Math.exp(-Math.exp(logNK));
        total += likelihood * Math.exp(-only.b * t);
      }
      return 4 * flatPositiveMass * total * step;
    }

    const A = 2 * state.ku;
    const B = 2 * state.kv;
    const costU = state.ju + 1;
    const costV = state.jv + 1;
    const maximumU = naturalLogN / A + 10 / costU + 3;
    const maximumV = naturalLogN / B + 10 / costV + 3;
    const count = 92;
    const stepU = maximumU / count;
    const stepV = maximumV / count;
    let total = 0;
    for (let row = 0; row < count; row += 1) {
      const tV = (row + 0.5) * stepV;
      const vWeight = Math.exp(-costV * tV);
      for (let column = 0; column < count; column += 1) {
        const tU = (column + 0.5) * stepU;
        const logNK = naturalLogN - A * tU - B * tV;
        const likelihood = logNK > 7 ? 0 : logNK < -25 ? 1 : Math.exp(-Math.exp(logNK));
        total += likelihood * Math.exp(-costU * tU) * vWeight;
      }
    }
    return 4 * total * stepU * stepV;
  }

  function computeCurve() {
    const points = [];
    const count = 36;
    for (let index = 0; index < count; index += 1) {
      const logN = 1 + 7 * index / (count - 1);
      points.push({ logN, value: integrateAt(logN) });
    }
    const rates = rateData();
    const rawPrediction = (logN) => {
      const naturalLogN = logN * Math.LN10;
      return Math.exp(-rates.lambda * naturalLogN) * naturalLogN ** (rates.multiplicity - 1);
    };
    const normalization = points[points.length - 1].value / rawPrediction(points[points.length - 1].logN);
    points.forEach((point) => { point.prediction = normalization * rawPrediction(point.logN); });
    state.curve = points;
  }

  function interpolatedIntegral(logN) {
    const points = state.curve;
    if (logN <= points[0].logN) return points[0].value;
    if (logN >= points[points.length - 1].logN) return points[points.length - 1].value;
    const scaled = (logN - 1) / 7 * (points.length - 1);
    const index = Math.floor(scaled);
    const fractionAlong = scaled - index;
    const first = Math.log(points[index].value);
    const second = Math.log(points[index + 1].value);
    return Math.exp(first + fractionAlong * (second - first));
  }

  function drawRatePlot() {
    if (!state.curve) computeCurve();
    const left = 78;
    const right = 775;
    const top = 42;
    const bottom = 342;
    const width = right - left;
    const height = bottom - top;
    const values = state.curve.flatMap((point) => [Math.log10(point.value), Math.log10(point.prediction)]);
    const yMaximum = Math.max(...values) + 0.18;
    const yMinimum = Math.min(...values) - 0.18;
    const mapX = (logN) => left + width * (logN - 1) / 7;
    const mapY = (value) => bottom - height * (Math.log10(value) - yMinimum) / (yMaximum - yMinimum);
    const path = (key) => state.curve.map((point, index) => `${index === 0 ? "M" : "L"} ${mapX(point.logN).toFixed(2)} ${mapY(point[key]).toFixed(2)}`).join(" ");
    $("#numericPath").setAttribute("d", path("value"));
    $("#predictionPath").setAttribute("d", path("prediction"));

    const grid = $("#rateGrid");
    grid.replaceChildren();
    for (let xTick = 1; xTick <= 8; xTick += 1) {
      const x = mapX(xTick);
      grid.append(svgElement("line", { x1: x, y1: top, x2: x, y2: bottom, class: "grid-line" }));
      grid.append(svgElement("text", { x, y: bottom + 19, "text-anchor": "middle", class: "grid-label" }, String(xTick)));
    }
    const yStep = (yMaximum - yMinimum) / 5;
    for (let index = 0; index <= 5; index += 1) {
      const yValue = yMinimum + index * yStep;
      const y = bottom - height * index / 5;
      grid.append(svgElement("line", { x1: left, y1: y, x2: right, y2: y, class: "grid-line" }));
      grid.append(svgElement("text", { x: left - 9, y: y + 4, "text-anchor": "end", class: "grid-label" }, yValue.toFixed(1)));
    }

    const currentValue = interpolatedIntegral(state.logN);
    const currentX = mapX(state.logN);
    const currentY = mapY(currentValue);
    const currentLine = $("#currentNLine");
    currentLine.setAttribute("x1", currentX); currentLine.setAttribute("x2", currentX);
    currentLine.setAttribute("y1", top); currentLine.setAttribute("y2", bottom);
    const currentHit = $("#currentNHit");
    currentHit.setAttribute("x1", currentX); currentHit.setAttribute("x2", currentX);
    currentHit.setAttribute("y1", top); currentHit.setAttribute("y2", bottom);
    $("#currentNPoint").setAttribute("cx", currentX);
    $("#currentNPoint").setAttribute("cy", currentY);
    const currentLabel = $("#currentNLabel");
    currentLabel.setAttribute("x", state.logN > 7.25 ? currentX - 144 : currentX + 9);
    currentLabel.setAttribute("y", top + 1);
    currentLabel.classList.toggle("end", state.logN > 7.25);
    const labelExponent = Number(state.logN.toFixed(1));
    svgMath(currentLabel, `n=10^{${labelExponent}}`);
    math($("#integralOutput"), `I_n\\approx${scientificTex(currentValue)}`);

    const rates = rateData();
    if (rates.active.length === 1) {
      const only = rates.active[0];
      const flat = coordinateData().find((coordinate) => coordinate.k === 0);
      richMath($("#costExplanation"), `Only <span data-tex="${only.key}"></span> changes <span data-tex="K"></span>. The <span data-tex="${flat.key}"></span>-coordinate is flat here: it contributes bounded thickness and constants, while <span data-tex="${only.key}"></span> determines <span data-tex="\\lambda=${fractionTex(only.ratioText)}"></span>.`);
    } else if (rates.tied) {
      richMath($("#costExplanation"), `Both coordinates have <span data-tex="\\Delta B/\\Delta A=${fractionTex(rates.ruText)}"></span>. The gold segment therefore has the same weighted volume <span data-tex="e^{-B}"></span> all along it, producing <span data-tex="\\log n"></span>.`);
    } else {
      const cheaper = rates.ru < rates.rv ? "u" : "v";
      const cheapRate = rates.ru < rates.rv ? rates.ruText : rates.rvText;
      const expensiveRate = rates.ru < rates.rv ? rates.rvText : rates.ruText;
      richMath($("#costExplanation"), `For <span data-tex="${cheaper}"></span>, <span data-tex="\\Delta B/\\Delta A=${fractionTex(cheapRate)}"></span>, versus <span data-tex="${fractionTex(expensiveRate)}"></span> for the other coordinate. It loses the least weighted volume <span data-tex="e^{-B}"></span> and therefore determines <span data-tex="\\lambda"></span>.`);
    }
  }

  function render(recomputeCurve = false) {
    updateReadouts();
    drawGeometry();
    drawLogGeometry();
    if (recomputeCurve) computeCurve();
    drawRatePlot();
  }

  $("#logNRange").addEventListener("input", (event) => {
    state.logN = Number(event.target.value);
    render(false);
  });

  $$(".preset-row button[data-ku]").forEach((button) => {
    button.addEventListener("click", () => {
      state.ku = Number(button.dataset.ku);
      state.kv = Number(button.dataset.kv);
      state.ju = Number(button.dataset.ju);
      state.jv = Number(button.dataset.jv);
      $$(".preset-row button[data-ku]").forEach((candidate) => {
        const selected = candidate === button;
        candidate.classList.toggle("active", selected);
        candidate.setAttribute("aria-pressed", String(selected));
      });
      render(true);
    });
  });

  const rateSvg = $("#rateSvg");
  const updateRateFromPointer = (event) => {
    const rectangle = rateSvg.getBoundingClientRect();
    const viewX = (event.clientX - rectangle.left) * 820 / rectangle.width;
    const logN = 1 + 7 * (viewX - 78) / (775 - 78);
    const clippedLogN = Math.max(1, Math.min(8, logN));
    state.logN = Math.round(clippedLogN / 0.05) * 0.05;
    $("#logNRange").value = state.logN;
    render(false);
  };
  const startRateDrag = (event) => {
    state.draggingRate = true;
    rateSvg.classList.add("dragging");
    document.documentElement.classList.add("interactive-drag-active");
    rateSvg.setPointerCapture(event.pointerId);
    updateRateFromPointer(event);
    event.preventDefault();
  };
  const stopRateDrag = () => {
    state.draggingRate = false;
    rateSvg.classList.remove("dragging");
    document.documentElement.classList.remove("interactive-drag-active");
  };
  $("#currentNHit").addEventListener("pointerdown", startRateDrag);
  $("#currentNPoint").addEventListener("pointerdown", startRateDrag);
  rateSvg.addEventListener("pointermove", (event) => {
    if (!state.draggingRate) return;
    updateRateFromPointer(event);
    event.preventDefault();
  });
  rateSvg.addEventListener("pointerup", stopRateDrag);
  rateSvg.addEventListener("pointercancel", stopRateDrag);
  rateSvg.addEventListener("lostpointercapture", stopRateDrag);

  render(true);

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
  if ("ResizeObserver" in window) new ResizeObserver(reportHeight).observe(heightTarget);
})();
