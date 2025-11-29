(() => {
  const commonOptions = {
    throwOnError: false,
    macros: {
      "\\R": "\\mathbb{R}",
      "\\N": "\\mathbb{N}",
      "\\Z": "\\mathbb{Z}",
      "\\Q": "\\mathbb{Q}"
    }
  };

  // kramdown with mathjax engine outputs <script type="math/tex">...</script>
  // We replace those with KaTeX-rendered HTML so math: true pages render correctly.
  const renderScripts = target => {
    if (typeof katex === "undefined") return false;
    const scripts = target.querySelectorAll('script[type^="math/tex"]');

    scripts.forEach(node => {
      const tex = node.textContent || node.innerText;
      const displayMode = node.type.includes("display");
      const container = document.createElement(displayMode ? "div" : "span");

      try {
        katex.render(tex, container, { ...commonOptions, displayMode });
        node.replaceWith(container);
      } catch (err) {
        console.warn("KaTeX render failed:", err);
      }
    });

    return scripts.length > 0;
  };

  const renderInline = target => {
    if (typeof renderMathInElement !== "function") return false;
    renderMathInElement(target, {
      ...commonOptions,
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$", right: "$", display: false },
        { left: "\\(", right: "\\)", display: false },
        { left: "\\[", right: "\\]", display: true }
      ],
      ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code"]
    });
    return true;
  };

  const tryRender = target => {
    const root = target || document.body;
    const rendered = renderScripts(root);
    const inlineRendered = renderInline(root);
    if (!rendered && !inlineRendered) {
      setTimeout(() => tryRender(root), 50);
    }
  };

  const onLoad = () => tryRender(document.body);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", onLoad, { once: true });
  } else {
    onLoad();
  }

  document.addEventListener("pjax:complete", onLoad);
})();
