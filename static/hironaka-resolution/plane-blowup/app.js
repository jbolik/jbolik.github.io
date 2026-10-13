(() => {
  "use strict";

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const math = (element, tex) => {
    if (!element || (element.dataset.tex === tex && element.querySelector(".katex"))) return;
    delete element.dataset.richMath;
    window.FigureMath.render(element, tex);
  };
  const svgMath = (element, tex) => math(element.firstElementChild, tex);
  const richMath = (element, html) => {
    if (element.dataset.richMath === html) return;
    element.dataset.richMath = html;
    delete element.dataset.tex;
    element.innerHTML = html;
    window.FigureMath.renderAll(element);
  };
  const deg = Math.PI / 180;
  const state = {
    theta: 28,
    radius: 1.15,
    yaw: -0.7,
    pitch: 0.6,
    animation: null,
    draggingPlane: false,
    draggingAtlas: false,
    draggingCanvas: false,
    pointerX: 0,
    pointerY: 0,
    scrollX: 0,
    scrollY: 0,
    scrollFrame: null,
  };

  const directionRange = $("#directionRange");
  const radiusRange = $("#radiusRange");
  const planeSvg = $("#planeSvg");
  const atlasSvg = $("#atlasSvg");
  const canvas = $("#mobiusCanvas");
  const context = canvas.getContext("2d");

  const clean = (value, digits = 2) => {
    const rounded = Math.abs(value) < 0.5 * 10 ** -digits ? 0 : value;
    return rounded.toFixed(digits);
  };

  const data = () => {
    const theta = state.theta * deg;
    const cosine = Math.cos(theta);
    const sine = Math.sin(theta);
    return { theta, cosine, sine, x: state.radius * cosine, y: state.radius * sine };
  };

  function cancelAnimation() {
    if (state.animation !== null) cancelAnimationFrame(state.animation);
    state.animation = null;
  }

  function updatePlane(renderReadouts = true) {
    const { cosine, sine, x, y } = data();
    const cx = 260;
    const cy = 210;
    const scale = 90;
    const px = cx + x * scale;
    const py = cy - y * scale;
    const directionLine = $("#directionLine");
    directionLine.setAttribute("x1", cx - cosine * 250);
    directionLine.setAttribute("y1", cy + sine * 250);
    directionLine.setAttribute("x2", cx + cosine * 250);
    directionLine.setAttribute("y2", cy - sine * 250);

    const upperRay = $("#upperDirectionRay");
    upperRay.setAttribute("x1", cx);
    upperRay.setAttribute("y1", cy);
    upperRay.setAttribute("x2", cx + cosine * 172);
    upperRay.setAttribute("y2", cy - sine * 172);

    const arcRadius = 63;
    const endX = cx + cosine * arcRadius;
    const endY = cy - sine * arcRadius;
    $("#angleArc").setAttribute("d", state.theta < 0.2
      ? `M ${cx + arcRadius} ${cy}`
      : `M ${cx + arcRadius} ${cy} A ${arcRadius} ${arcRadius} 0 0 0 ${endX} ${endY}`);

    const labelTheta = Math.max(8, Math.min(172, state.theta / 2)) * deg;
    const angleLabel = $("#angleLabel");
    const angleX = cx + Math.cos(labelTheta) * 88;
    const angleY = cy - Math.sin(labelTheta) * 88 - 6;
    angleLabel.setAttribute("x", state.theta > 145 ? angleX - 150 : angleX);
    angleLabel.setAttribute("y", angleY - 18);
    angleLabel.classList.toggle("end", state.theta > 145);
    if (renderReadouts) svgMath(angleLabel, `\\theta=${state.theta.toFixed(1)}^{\\circ}`);

    const segment = $("#radiusSegment");
    segment.setAttribute("x1", cx);
    segment.setAttribute("y1", cy);
    segment.setAttribute("x2", px);
    segment.setAttribute("y2", py);
    segment.classList.toggle("hidden", Math.abs(state.radius) < 0.005);

    const radiusLabel = $("#radiusLabel");
    const radiusLabelLeft = cosine < -0.2;
    radiusLabel.setAttribute("x", radiusLabelLeft ? px - 122 : px + 16);
    radiusLabel.setAttribute("y", py + 8);
    radiusLabel.classList.toggle("end", radiusLabelLeft);
    if (renderReadouts) svgMath(radiusLabel, `\\rho=${clean(state.radius)}`);

    const point = $("#planePoint");
    point.setAttribute("cx", px);
    point.setAttribute("cy", py);
    $("#planePointLabel").setAttribute("x", px + 10);
    $("#planePointLabel").setAttribute("y", py - 29);
    $("#originHalo").classList.toggle("visible", Math.abs(state.radius) < 0.04);
  }

  function updateAtlas(renderReadouts = true) {
    const { cosine, sine, x: a, y: b } = data();
    const cx = 320;
    const cy = 285;
    const xValid = Math.abs(cosine) > 1e-8;
    const yValid = Math.abs(sine) > 1e-8;
    const place = (element, radius) => {
      element.setAttribute("cx", cx + radius * cosine);
      element.setAttribute("cy", cy - radius * sine);
    };
    const ray = $("#atlasDirectionRay");
    const hit = $("#atlasDirectionHit");
    for (const line of [ray, hit]) {
      line.setAttribute("x2", cx + 235 * cosine);
      line.setAttribute("y2", cy - 235 * sine);
    }
    place($("#atlasRepresentativePoint"), 135);
    place($("#uxAtlasPoint"), 220);
    place($("#uyAtlasPoint"), 180);
    $("#uxAtlasPoint").classList.toggle("invalid", !xValid);
    $("#uyAtlasPoint").classList.toggle("invalid", !yValid);
    $("#uxAtlasStatus").textContent = xValid ? "available" : "excluded here";
    $("#uyAtlasStatus").textContent = yValid ? "available" : "excluded here";
    if (renderReadouts) {
      if (xValid) math($("#uxAtlasCoordinate"), `(a,v)=(${clean(a)},${clean(sine / cosine)})`);
      else richMath($("#uxAtlasCoordinate"), '<span data-tex="(a,v)"></span> is undefined in this chart');
      if (yValid) math($("#uyAtlasCoordinate"), `(u,b)=(${clean(cosine / sine)},${clean(b)})`);
      else richMath($("#uyAtlasCoordinate"), '<span data-tex="(u,b)"></span> is undefined in this chart');
      if (!xValid) richMath($("#uxAtlasLocus"), '<span data-tex="[0:1]"></span> is not represented in <span data-tex="U_s"></span>');
      else if (Math.abs(state.radius) < 0.015) richMath($("#uxAtlasLocus"), 'this point lies on <span data-tex="a=0"></span>');
      else richMath($("#uxAtlasLocus"), 'exceptional locus: <span data-tex="a=0"></span>');
      if (!yValid) richMath($("#uyAtlasLocus"), '<span data-tex="[1:0]"></span> is not represented in <span data-tex="U_t"></span>');
      else if (Math.abs(state.radius) < 0.015) richMath($("#uyAtlasLocus"), 'this point lies on <span data-tex="b=0"></span>');
      else richMath($("#uyAtlasLocus"), 'exceptional locus: <span data-tex="b=0"></span>');
    }
    $("#uxAtlasStatusCard").classList.toggle("invalid", !xValid);
    $("#uyAtlasStatusCard").classList.toggle("invalid", !yValid);
  }

  function rotate(point) {
    const cy = Math.cos(state.yaw);
    const sy = Math.sin(state.yaw);
    const cp = Math.cos(state.pitch);
    const sp = Math.sin(state.pitch);
    const x = point.x * cy - point.y * sy;
    const y = point.x * sy + point.y * cy;
    return { x, y: y * cp - point.z * sp, z: y * sp + point.z * cp };
  }

  function mobius(phi, fiber) {
    const major = 1.58;
    return {
      x: (major + fiber * Math.cos(phi / 2)) * Math.cos(phi),
      y: (major + fiber * Math.cos(phi / 2)) * Math.sin(phi),
      z: fiber * Math.sin(phi / 2),
    };
  }

  function drawMobius() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(320, rect.width);
    const height = Math.max(260, rect.height);
    const pixelWidth = Math.round(width * dpr);
    const pixelHeight = Math.round(height * dpr);
    if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
      canvas.width = pixelWidth;
      canvas.height = pixelHeight;
    }
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.clearRect(0, 0, width, height);
    const scale = Math.min(width, height) * 0.225;
    const project = (point) => {
      const rotated = rotate(point);
      const perspective = 1 / (1 + rotated.z * 0.075);
      return { x: width / 2 + rotated.x * scale * perspective, y: height / 2 + rotated.y * scale * perspective, z: rotated.z };
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
        const points = [project(mobius(phi0, t0)), project(mobius(phi1, t0)), project(mobius(phi1, t1)), project(mobius(phi0, t1))];
        quads.push({ points, depth: points.reduce((sum, point) => sum + point.z, 0) / 4, band: j / 14, opacity });
      }
    }
    quads.sort((a, b) => a.depth - b.depth);
    for (const quad of quads) {
      context.beginPath();
      context.moveTo(quad.points[0].x, quad.points[0].y);
      for (let i = 1; i < quad.points.length; i += 1) context.lineTo(quad.points[i].x, quad.points[i].y);
      context.closePath();
      context.fillStyle = `hsla(177,46%,${43 + quad.band * 14 + quad.depth * 3}%,${0.88 * quad.opacity})`;
      context.fill();
      context.strokeStyle = `rgba(226,241,238,${0.075 * quad.opacity})`;
      context.lineWidth = 0.7;
      context.stroke();
    }
    const strokeCurve = (fiber, color, lineWidth) => {
      context.beginPath();
      for (let i = 0; i <= 180; i += 1) {
        const point = project(mobius((i / 180) * Math.PI * 2, fiber));
        if (i === 0) context.moveTo(point.x, point.y);
        else context.lineTo(point.x, point.y);
      }
      context.strokeStyle = color;
      context.lineWidth = lineWidth;
      context.stroke();
    };
    strokeCurve(0, "#f08a61", 3.5);
    const phi = 2 * state.theta * deg;
    context.beginPath();
    for (let i = 0; i <= 50; i += 1) {
      const fiber = compress(-extent + (i / 50) * 2 * extent);
      const point = project(mobius(phi, fiber));
      if (i === 0) context.moveTo(point.x, point.y);
      else context.lineTo(point.x, point.y);
    }
    context.strokeStyle = "rgba(244,215,123,.58)";
    context.lineWidth = 2;
    context.stroke();
    const selected = project(mobius(phi, compress(state.radius)));
    const center = project(mobius(phi, 0));
    context.beginPath();
    context.arc(selected.x, selected.y, 13, 0, Math.PI * 2);
    context.fillStyle = "rgba(232,184,91,.18)";
    context.fill();
    context.beginPath();
    context.arc(selected.x, selected.y, 6.5, 0, Math.PI * 2);
    context.fillStyle = "#e8b85b";
    context.fill();
    context.strokeStyle = "#fffdf8";
    context.lineWidth = 2.5;
    context.stroke();
    if (Math.abs(state.radius) < 0.015) {
      context.beginPath();
      context.arc(center.x, center.y, 17, 0, Math.PI * 2);
      context.strokeStyle = "rgba(240,138,97,.75)";
      context.lineWidth = 2;
      context.stroke();
    }
  }

  function updateAll(renderReadouts = true) {
    directionRange.value = state.theta;
    radiusRange.value = state.radius;
    if (renderReadouts) {
      math($("#directionOutput"), `${state.theta.toFixed(1)}^{\\circ}`);
      math($("#radiusOutput"), clean(state.radius));
    }
    updatePlane(renderReadouts);
    updateAtlas(renderReadouts);
    drawMobius();
  }

  function holdViewport() {
    if (!state.draggingPlane && !state.draggingAtlas) {
      state.scrollFrame = null;
      return;
    }
    if (window.scrollX !== state.scrollX || window.scrollY !== state.scrollY) window.scrollTo(state.scrollX, state.scrollY);
    state.scrollFrame = requestAnimationFrame(holdViewport);
  }

  function startViewportLock() {
    state.scrollX = window.scrollX;
    state.scrollY = window.scrollY;
    document.documentElement.classList.add("interactive-drag-active");
    if (state.scrollFrame !== null) cancelAnimationFrame(state.scrollFrame);
    state.scrollFrame = requestAnimationFrame(holdViewport);
  }

  function stopViewportLock() {
    if (state.draggingPlane || state.draggingAtlas) return;
    document.documentElement.classList.remove("interactive-drag-active");
    if (state.scrollFrame !== null) cancelAnimationFrame(state.scrollFrame);
    state.scrollFrame = null;
  }

  function setFromPlane(event) {
    const rect = planeSvg.getBoundingClientRect();
    const x = ((((event.clientX - rect.left) / rect.width) * 520) - 260) / 90;
    const y = (210 - ((event.clientY - rect.top) / rect.height) * 420) / 90;
    const norm = Math.hypot(x, y);
    if (norm < 0.09) state.radius = 0;
    else {
      let angle = Math.atan2(y, x) / deg;
      if (angle < 0) angle += 360;
      if (angle >= 180) {
        state.theta = angle - 180;
        state.radius = -Math.min(norm, 2);
      } else {
        state.theta = angle;
        state.radius = Math.min(norm, 2);
      }
    }
    updateAll();
  }

  function setFromAtlas(event) {
    const point = atlasSvg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const local = point.matrixTransform(atlasSvg.getScreenCTM().inverse());
    const dx = local.x - 320;
    const dy = 285 - local.y;
    if (Math.hypot(dx, dy) < 8) return;
    let angle = Math.atan2(dy, dx) / deg;
    if (angle < 0) angle += 180;
    for (const target of [0, 90, 180]) {
      if (Math.abs(angle - target) <= 4) {
        angle = target;
        break;
      }
    }
    state.theta = Math.max(0, Math.min(180, angle));
    updateAll();
  }

  directionRange.addEventListener("input", () => {
    cancelAnimation();
    state.theta = Number(directionRange.value);
    updateAll();
  });
  radiusRange.addEventListener("input", () => {
    cancelAnimation();
    state.radius = Number(radiusRange.value);
    updateAll();
  });

  planeSvg.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    cancelAnimation();
    state.draggingPlane = true;
    startViewportLock();
    planeSvg.setPointerCapture(event.pointerId);
    setFromPlane(event);
  }, { passive: false });
  planeSvg.addEventListener("pointermove", (event) => {
    if (!state.draggingPlane) return;
    event.preventDefault();
    setFromPlane(event);
  }, { passive: false });
  const stopPlane = () => { state.draggingPlane = false; stopViewportLock(); };
  planeSvg.addEventListener("pointerup", stopPlane);
  planeSvg.addEventListener("pointercancel", stopPlane);
  planeSvg.addEventListener("lostpointercapture", stopPlane);

  const startAtlas = (event) => {
    event.preventDefault();
    cancelAnimation();
    state.draggingAtlas = true;
    startViewportLock();
    atlasSvg.setPointerCapture(event.pointerId);
    setFromAtlas(event);
  };
  for (const handle of [$("#atlasDirectionHit"), $("#atlasRepresentativePoint"), $("#uxAtlasPoint"), $("#uyAtlasPoint")]) {
    handle.addEventListener("pointerdown", startAtlas, { passive: false });
  }
  atlasSvg.addEventListener("pointermove", (event) => {
    if (!state.draggingAtlas) return;
    event.preventDefault();
    setFromAtlas(event);
  }, { passive: false });
  const stopAtlas = () => { state.draggingAtlas = false; stopViewportLock(); };
  atlasSvg.addEventListener("pointerup", stopAtlas);
  atlasSvg.addEventListener("pointercancel", stopAtlas);
  atlasSvg.addEventListener("lostpointercapture", stopAtlas);

  canvas.addEventListener("pointerdown", (event) => {
    state.draggingCanvas = true;
    state.pointerX = event.clientX;
    state.pointerY = event.clientY;
    canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener("pointermove", (event) => {
    if (!state.draggingCanvas) return;
    state.yaw += (event.clientX - state.pointerX) * 0.009;
    state.pitch = Math.max(-1.2, Math.min(1.2, state.pitch + (event.clientY - state.pointerY) * 0.009));
    state.pointerX = event.clientX;
    state.pointerY = event.clientY;
    drawMobius();
  });
  canvas.addEventListener("pointerup", () => { state.draggingCanvas = false; });
  canvas.addEventListener("pointercancel", () => { state.draggingCanvas = false; });

  $("#approachButton").addEventListener("click", () => {
    cancelAnimation();
    const initial = Math.abs(state.radius) < 0.02 ? 1.55 : state.radius;
    let started = null;
    let nextReadout = 0;
    state.radius = initial;
    const step = (time) => {
      if (started === null) started = time;
      const progress = Math.max(0, Math.min(1, (time - started) / 1500));
      state.radius = initial * (1 - progress) ** 3;
      const renderReadouts = time >= nextReadout || progress === 1;
      updateAll(renderReadouts);
      if (renderReadouts) nextReadout = time + 80;
      if (progress < 1) state.animation = requestAnimationFrame(step);
      else {
        state.radius = 0;
        state.animation = null;
        updateAll();
      }
    };
    state.animation = requestAnimationFrame(step);
  });

  $("#resetButton").addEventListener("click", () => {
    cancelAnimation();
    Object.assign(state, { theta: 28, radius: 1.15, yaw: -0.7, pitch: 0.6 });
    updateAll();
  });

  $$('[data-theta]').forEach((button) => {
    button.addEventListener("click", () => {
      cancelAnimation();
      state.theta = Number(button.dataset.theta);
      state.radius = Number(button.dataset.radius);
      updateAll();
    });
  });

  updateAll();
  if ("ResizeObserver" in window) new ResizeObserver(drawMobius).observe(canvas);
  else window.addEventListener("resize", drawMobius);

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
