(() => {
  "use strict";

  const renderOptions = {
    throwOnError: false,
    strict: false,
    trust: false,
    macros: {
      "\\E": "\\mathbb{E}",
      "\\Var": "\\mathrm{Var}",
      "\\Cov": "\\mathrm{Cov}",
      "\\P": "\\mathbb{P}",
      "\\1": "\\mathbb{1}",
      "\\R": "\\mathbb{R}",
      "\\N": "\\mathbb{N}",
      "\\dd": "\\mathrm{d}",
      "\\argmin": "\\mathop{\\mathrm{arg\\,min}}\\limits",
      "\\argmax": "\\mathop{\\mathrm{arg\\,max}}\\limits",
    },
  };

  const autoRenderOptions = {
    ...renderOptions,
    delimiters: [
      { left: "$$", right: "$$", display: true },
      { left: "\\[", right: "\\]", display: true },
      { left: "\\(", right: "\\)", display: false },
      { left: "$", right: "$", display: false },
    ],
    ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code", "option"],
    ignoredClasses: ["katex"],
  };

  function render(element, tex, options = {}) {
    if (!element || !window.katex) return;
    element.dataset.tex = tex;
    window.katex.render(tex, element, { ...renderOptions, ...options });
  }

  function renderAll(root = document.body) {
    if (!root || !window.katex) return;
    root.querySelectorAll("[data-tex]").forEach((element) => {
      render(element, element.dataset.tex, { displayMode: element.hasAttribute("data-display-math") });
    });
    if (window.renderMathInElement) window.renderMathInElement(root, autoRenderOptions);
    window.dispatchEvent(new CustomEvent("figure-math-rendered"));
  }

  window.FigureMath = Object.freeze({ render, renderAll });

  const start = () => renderAll(document.body);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();
