(() => {
  const explorer = document.querySelector("#exploration");
  if (!explorer) return;

  const tabs = [...explorer.querySelectorAll("[data-story-target]")];
  const panels = [...document.querySelectorAll("[data-story-panel]")];
  const previous = document.querySelector("#story-previous");
  const next = document.querySelector("#story-next");
  const pager = document.querySelector(".story-pager");
  const progress = document.querySelector("#story-progress");
  const title = document.querySelector("#story-title");
  const keys = tabs.map((tab) => tab.dataset.storyTarget);
  let activeIndex = Math.max(0, keys.indexOf(location.hash.replace("#chapitre-", "")));

  document.documentElement.classList.add("story-is-ready");

  function show(index, moveFocus = false, scroll = false) {
    activeIndex = Math.min(Math.max(index, 0), panels.length - 1);
    const activeKey = keys[activeIndex];
    tabs.forEach((tab, tabIndex) => {
      const selected = tabIndex === activeIndex;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    panels.forEach((panel) => { panel.hidden = panel.dataset.storyPanel !== activeKey; });
    previous.disabled = activeIndex === 0;
    next.disabled = activeIndex === panels.length - 1;
    previous.textContent = activeIndex === 0 ? "← Précédent" : `← ${panels[activeIndex - 1].dataset.storyTitle}`;
    next.textContent = activeIndex === panels.length - 1 ? "Analyse terminée" : `${panels[activeIndex + 1].dataset.storyTitle} →`;
    progress.textContent = `Chapitre ${activeIndex + 1} sur ${panels.length}`;
    title.textContent = panels[activeIndex].dataset.storyTitle;
    panels[activeIndex].insertAdjacentElement("afterend", pager);
    history.replaceState(null, "", `#chapitre-${activeKey}`);
    if (moveFocus) tabs[activeIndex].focus();
    if (scroll) explorer.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => show(index, false, true));
    tab.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      if (event.key === "Home") show(0, true);
      else if (event.key === "End") show(tabs.length - 1, true);
      else show((index + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length, true);
    });
  });
  previous.addEventListener("click", () => show(activeIndex - 1, false, true));
  next.addEventListener("click", () => show(activeIndex + 1, false, true));
  show(activeIndex);
})();
