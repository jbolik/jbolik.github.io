(() => {
  "use strict";

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => document.querySelectorAll(selector);
  const math = (element, tex) => window.FigureMath.render(element, tex);
  const multiplicityColor = {
    1: "#3b82c4",
    2: "#d2a11d",
    3: "#e56b1f",
    6: "#cf3545",
  };
  const range = $("#cuspRange");
  const output = $("#cuspOutput");
  const orderPowerToggle = $("#orderPowerToggle");
  const uniqueLiftStatus = $("#uniqueLiftStatus");
  const centerFiberStatus = $("#centerFiberStatus");
  const SNAP_RADIUS = 0.06;
  const clean = (value, digits = 2) => {
    const rounded = Math.abs(value) < 0.5 * 10 ** -digits ? 0 : value;
    return rounded.toFixed(digits);
  };
  const displayedOrder = (baseOrder) => baseOrder * (orderPowerToggle.checked ? 2 : 1);
  const pathFrom = (points) => points.map((point, index) => `${index ? "L" : "M"}${point[0].toFixed(2)},${point[1].toFixed(2)}`).join(" ");
  const originalMap = (x, y) => [72 + x * 245, 190 - y * 80];
  const liftMap = (a, v) => [72 + a * 245, 190 - v * 105];
  const secondMap = (u, b) => [260 + u * 145, 190 - b * 112];
  const thirdCanvas = $("#cuspMobiusCanvas");
  const thirdContext = thirdCanvas.getContext("2d");
  const thirdView = {
    yaw: -0.56,
    pitch: 0.62,
    dragging: false,
    pointerX: 0,
    pointerY: 0,
    t: Number(range.value),
    atCenter: false,
    showExceptional: true,
  };

  function rotateThird(point) {
    const cy = Math.cos(thirdView.yaw);
    const sy = Math.sin(thirdView.yaw);
    const cp = Math.cos(thirdView.pitch);
    const sp = Math.sin(thirdView.pitch);
    const x = point.x * cy - point.y * sy;
    const y = point.x * sy + point.y * cy;
    return { x, y: y * cp - point.z * sp, z: y * sp + point.z * cp };
  }

  function thirdMobius(phi, fiber) {
    const major = 1.58;
    return {
      x: (major + fiber * Math.cos(phi / 2)) * Math.cos(phi),
      y: (major + fiber * Math.cos(phi / 2)) * Math.sin(phi),
      z: fiber * Math.sin(phi / 2),
    };
  }

  function drawThirdBlowup() {
    const rect = thirdCanvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(320, rect.width);
    const height = Math.max(260, rect.height);
    const pixelWidth = Math.round(width * dpr);
    const pixelHeight = Math.round(height * dpr);
    if (thirdCanvas.width !== pixelWidth || thirdCanvas.height !== pixelHeight) {
      thirdCanvas.width = pixelWidth;
      thirdCanvas.height = pixelHeight;
    }
    thirdContext.setTransform(dpr, 0, 0, dpr, 0, 0);
    thirdContext.clearRect(0, 0, width, height);
    const scale = Math.min(width, height) * 0.225;
    const project = (point) => {
      const rotated = rotateThird(point);
      const perspective = 1 / (1 + rotated.z * 0.075);
      return {
        x: width / 2 + rotated.x * scale * perspective,
        y: height / 2 + rotated.y * scale * perspective,
        z: rotated.z,
      };
    };
    const halfWidth = 0.67;
    const extent = 3.3;
    const compress = (fiber) => halfWidth * Math.tanh(fiber);
    const quads = [];
    for (let i = 0; i < 84; i += 1) {
      const phi0 = (i / 84) * Math.PI * 2;
      const phi1 = ((i + 1) / 84) * Math.PI * 2;
      for (let j = 0; j < 14; j += 1) {
        const f0 = -extent + (j / 14) * 2 * extent;
        const f1 = -extent + ((j + 1) / 14) * 2 * extent;
        const t0 = compress(f0);
        const t1 = compress(f1);
        const midpoint = Math.abs((t0 + t1) / (2 * halfWidth));
        const opacity = Math.max(0.05, 1 - midpoint ** 8);
        const points = [
          project(thirdMobius(phi0, t0)),
          project(thirdMobius(phi1, t0)),
          project(thirdMobius(phi1, t1)),
          project(thirdMobius(phi0, t1)),
        ];
        quads.push({
          points,
          depth: points.reduce((sum, point) => sum + point.z, 0) / 4,
          band: j / 14,
          opacity,
        });
      }
    }
    quads.sort((a, b) => a.depth - b.depth);
    for (const quad of quads) {
      thirdContext.beginPath();
      thirdContext.moveTo(quad.points[0].x, quad.points[0].y);
      for (let i = 1; i < quad.points.length; i += 1) thirdContext.lineTo(quad.points[i].x, quad.points[i].y);
      thirdContext.closePath();
      const surfaceLightness = 78 + quad.band * 9 + quad.depth * 2.2;
      thirdContext.fillStyle = `hsla(210,8%,${surfaceLightness}%,${0.92 * quad.opacity})`;
      thirdContext.fill();
      thirdContext.strokeStyle = `rgba(255,255,255,${0.11 * quad.opacity})`;
      thirdContext.lineWidth = 0.7;
      thirdContext.stroke();
    }

    const strokeCircle = (fiber, color, lineWidth, glow = false) => {
      thirdContext.save();
      if (glow) {
        thirdContext.shadowColor = color;
        thirdContext.shadowBlur = 10;
      }
      thirdContext.beginPath();
      for (let i = 0; i <= 180; i += 1) {
        const point = project(thirdMobius((i / 180) * Math.PI * 2, fiber));
        if (i === 0) thirdContext.moveTo(point.x, point.y);
        else thirdContext.lineTo(point.x, point.y);
      }
      thirdContext.strokeStyle = color;
      thirdContext.lineWidth = lineWidth;
      thirdContext.stroke();
      thirdContext.restore();
    };

    const strokeFiber = (phi, color, lineWidth, dashed = false) => {
      thirdContext.save();
      thirdContext.setLineDash(dashed ? [9, 7] : []);
      thirdContext.beginPath();
      for (let i = 0; i <= 54; i += 1) {
        const fiber = compress(-extent + (i / 54) * 2 * extent);
        const point = project(thirdMobius(phi, fiber));
        if (i === 0) thirdContext.moveTo(point.x, point.y);
        else thirdContext.lineTo(point.x, point.y);
      }
      thirdContext.strokeStyle = color;
      thirdContext.lineWidth = lineWidth;
      thirdContext.stroke();
      thirdContext.restore();
      return project(thirdMobius(phi, 0));
    };

    if (thirdView.showExceptional) {
      strokeCircle(0, multiplicityColor[6], thirdView.atCenter ? 6.5 : 3.8, thirdView.atCenter);
    }

    const branches = [
      { phi: 0, multiplicity: 3, exceptional: true },
      { phi: Math.PI / 2, multiplicity: 1, exceptional: false, labelDx: -35, labelDy: -17 },
      { phi: Math.PI, multiplicity: 2, exceptional: true },
    ];
    thirdContext.font = "800 22px ui-monospace, SFMono-Regular, Menlo, monospace";
    thirdContext.textBaseline = "bottom";
    for (const branch of branches) {
      if (branch.exceptional && !thirdView.showExceptional) continue;
      const color = multiplicityColor[branch.multiplicity];
      const center = strokeFiber(branch.phi, color, branch.exceptional ? 3.2 : 4.2, !branch.exceptional);
      thirdContext.beginPath();
      thirdContext.arc(center.x, center.y, 5.5, 0, Math.PI * 2);
      thirdContext.fillStyle = color;
      thirdContext.fill();
      thirdContext.strokeStyle = "#fffdf8";
      thirdContext.lineWidth = 1.8;
      thirdContext.stroke();
      const label = String(displayedOrder(branch.multiplicity));
      const labelX = center.x + (branch.labelDx ?? 9);
      const labelY = center.y + (branch.labelDy ?? -7);
      thirdContext.strokeStyle = "rgba(15,32,37,.92)";
      thirdContext.lineWidth = 5;
      thirdContext.lineJoin = "round";
      thirdContext.strokeText(label, labelX, labelY);
      thirdContext.fillStyle = color;
      thirdContext.fillText(label, labelX, labelY);
    }

    if (thirdView.showExceptional) {
      const e3Label = project(thirdMobius(Math.PI * 1.36, 0));
      thirdContext.fillStyle = multiplicityColor[6];
      thirdContext.font = "800 22px ui-monospace, SFMono-Regular, Menlo, monospace";
      thirdContext.strokeStyle = "rgba(15,32,37,.92)";
      thirdContext.lineWidth = 5;
      thirdContext.strokeText(String(displayedOrder(6)), e3Label.x + 9, e3Label.y - 8);
      thirdContext.fillText(String(displayedOrder(6)), e3Label.x + 9, e3Label.y - 8);
    }

    const cuspPhi = Math.PI / 2;
    const selected = project(thirdMobius(cuspPhi, compress(thirdView.t * 1.45)));
    thirdContext.beginPath();
    thirdContext.arc(selected.x, selected.y, thirdView.atCenter ? 15 : 12, 0, Math.PI * 2);
    thirdContext.fillStyle = "rgba(255,255,255,.25)";
    thirdContext.fill();
    thirdContext.beginPath();
    thirdContext.arc(selected.x, selected.y, 7, 0, Math.PI * 2);
    thirdContext.fillStyle = multiplicityColor[1];
    thirdContext.fill();
    thirdContext.strokeStyle = "#fffdf8";
    thirdContext.lineWidth = thirdView.atCenter ? 4 : 2.5;
    thirdContext.stroke();
    thirdContext.fillStyle = "#fffdf8";
    thirdContext.font = "800 12px ui-monospace, SFMono-Regular, Menlo, monospace";
    thirdContext.fillText(thirdView.atCenter ? "curve lift" : "lift", selected.x + 11, selected.y - 10);
  }

  function initializePaths() {
    const original = [];
    const lifted = [];
    const second = [];
    for (let i = 0; i <= 200; i += 1) {
      const t = -1.25 + (i / 200) * 2.5;
      original.push(originalMap(t * t, t * t * t));
      lifted.push(liftMap(t * t, t));
      second.push(secondMap(t, t));
    }
    $("#cuspOriginalPath").setAttribute("d", pathFrom(original));
    $("#cuspLiftPath").setAttribute("d", pathFrom(lifted));
    $("#cuspSecondPath").setAttribute("d", pathFrom(second));
  }

  function update() {
    const rawT = Number(range.value);
    const t = Math.abs(rawT) <= SNAP_RADIUS ? 0 : rawT;
    const atCenter = t === 0;
    if (atCenter && rawT !== 0) range.value = "0";
    const x = t * t;
    const y = x * t;
    const original = originalMap(x, y);
    const lifted = liftMap(x, t);
    const second = secondMap(t, t);
    math(output, atCenter ? "0" : clean(t));
    range.setAttribute("aria-valuetext", atCenter ? "0, center; exceptional fibers highlighted" : clean(t));
    document.body.classList.toggle("at-center", atCenter);
    uniqueLiftStatus.hidden = atCenter;
    centerFiberStatus.hidden = !atCenter;
    $("#cuspOriginalPoint").setAttribute("cx", original[0]);
    $("#cuspOriginalPoint").setAttribute("cy", original[1]);
    $("#cuspOriginalLabel").setAttribute("x", original[0] + 10);
    $("#cuspOriginalLabel").setAttribute("y", original[1] - 29);
    $("#cuspLiftPoint").setAttribute("cx", lifted[0]);
    $("#cuspLiftPoint").setAttribute("cy", lifted[1]);
    $("#cuspLiftLabel").setAttribute("x", lifted[0] + 13);
    $("#cuspLiftLabel").setAttribute("y", lifted[1] - 12);
    $("#cuspSecondPoint").setAttribute("cx", second[0]);
    $("#cuspSecondPoint").setAttribute("cy", second[1]);
    $("#cuspSecondLabel").setAttribute("x", second[0] + 13);
    $("#cuspSecondLabel").setAttribute("y", second[1] + 25);
    [$("#cuspLiftLabel"), $("#cuspSecondLabel")].forEach((label) => {
      label.textContent = atCenter ? "curve lift" : "lift";
    });
    math($("#cuspOriginalReadout"), `(x,y)=(${clean(x)},${clean(y)})`);
    math($("#cuspLiftReadout"), `(a,v)=(${clean(x)},${clean(t)})`);
    math($("#cuspSecondReadout"), `(u,b)=(${clean(t)},${clean(t)})`);
    math($("#cuspThirdReadout"), `(\\rho,[u:b])=(${clean(t)},[1:1])`);
    thirdView.t = t;
    thirdView.atCenter = atCenter;
    drawThirdBlowup();
  }

  function updateOrderDisplay() {
    const squared = orderPowerToggle.checked;
    const factor = squared ? 2 : 1;
    $$('[data-base-order]').forEach((element) => {
      element.textContent = String(Number(element.dataset.baseOrder) * factor);
    });
    $("#orderLegendTitle").textContent = squared ? "Vanishing order of F²" : "Vanishing order of F";
    math($("#captionOrderFunction"), squared ? "F^2" : "F");
    thirdCanvas.setAttribute(
      "aria-label",
      `Light-gray Möbius-band neighborhood with the strict transform dashed blue and exceptional components colored and numbered by the vanishing order of ${squared ? "F squared" : "F"}`,
    );
    drawThirdBlowup();
  }

  range.addEventListener("input", update);
  orderPowerToggle.addEventListener("click", updateOrderDisplay);
  $("#totalTransformToggle").addEventListener("change", (event) => {
    const hidden = !event.target.checked;
    $$(".exceptional-axis").forEach((element) => element.classList.toggle("hidden", hidden));
    $$(".exceptional-annotation").forEach((element) => {
      element.style.opacity = hidden ? "0.2" : "1";
    });
    thirdView.showExceptional = !hidden;
    drawThirdBlowup();
  });

  thirdCanvas.addEventListener("pointerdown", (event) => {
    thirdView.dragging = true;
    thirdView.pointerX = event.clientX;
    thirdView.pointerY = event.clientY;
    thirdCanvas.setPointerCapture(event.pointerId);
  });
  thirdCanvas.addEventListener("pointermove", (event) => {
    if (!thirdView.dragging) return;
    thirdView.yaw += (event.clientX - thirdView.pointerX) * 0.008;
    thirdView.pitch = Math.max(-1.15, Math.min(1.15, thirdView.pitch + (event.clientY - thirdView.pointerY) * 0.008));
    thirdView.pointerX = event.clientX;
    thirdView.pointerY = event.clientY;
    drawThirdBlowup();
  });
  const stopThirdDrag = () => { thirdView.dragging = false; };
  thirdCanvas.addEventListener("pointerup", stopThirdDrag);
  thirdCanvas.addEventListener("pointercancel", stopThirdDrag);
  thirdCanvas.addEventListener("lostpointercapture", stopThirdDrag);
  if ("ResizeObserver" in window) new ResizeObserver(drawThirdBlowup).observe(thirdCanvas);

  initializePaths();
  update();
  updateOrderDisplay();

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
