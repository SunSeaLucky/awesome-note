(() => {
  const options = {
    delimiters: [
      { left: "$$", right: "$$", display: true },
      { left: "$", right: "$", display: false },
      { left: "\\(", right: "\\)", display: false },
      { left: "\\[", right: "\\]", display: true }
    ],
    throwOnError: false
  };

  const render = target => {
    if (typeof renderMathInElement !== "function") {
      return false;
    }
    renderMathInElement(target, options);
    return true;
  };

  const tryRender = target => {
    if (render(target)) return;
    setTimeout(() => render(target), 50);
  };

  const onLoad = () => tryRender(document.body);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", onLoad, { once: true });
  } else {
    onLoad();
  }

  document.addEventListener("pjax:complete", onLoad);
})();
