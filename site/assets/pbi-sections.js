(() => {
  const explorer = document.querySelector("#pbi-exploration");
  if (!explorer) return;

  const tabs = [...explorer.querySelectorAll("[data-pbi-target]")];
  const panels = [...document.querySelectorAll("[data-pbi-panel]")];
  const previous = document.querySelector("#pbi-previous");
  const next = document.querySelector("#pbi-next");
  const pager = document.querySelector(".pbi-section-pager");
  const progress = document.querySelector("#pbi-progress");
  const currentTitle = document.querySelector("#pbi-current-title");
  const keys = tabs.map((tab) => tab.dataset.pbiTarget);

  function keyFromHash() {
    return location.hash.replace("#chapitre-", "");
  }

  let activeIndex = Math.max(0, keys.indexOf(keyFromHash()));
  document.documentElement.classList.add("pbi-nav-is-ready");

  function show(index, options = {}) {
    const { moveFocus = false, scroll = false, updateHash = true } = options;
    activeIndex = Math.min(Math.max(index, 0), panels.length - 1);
    const activeKey = keys[activeIndex];

    tabs.forEach((tab, tabIndex) => {
      const selected = tabIndex === activeIndex;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });

    panels.forEach((panel) => {
      panel.hidden = panel.dataset.pbiPanel !== activeKey;
    });

    previous.disabled = activeIndex === 0;
    next.disabled = activeIndex === panels.length - 1;
    previous.textContent = activeIndex === 0
      ? "← Précédent"
      : `← ${panels[activeIndex - 1].dataset.pbiTitle}`;
    next.textContent = activeIndex === panels.length - 1
      ? "Projet terminé"
      : `${panels[activeIndex + 1].dataset.pbiTitle} →`;
    progress.textContent = `Chapitre ${activeIndex + 1} sur ${panels.length}`;
    currentTitle.textContent = panels[activeIndex].dataset.pbiTitle;
    panels[activeIndex].insertAdjacentElement("afterend", pager);

    const activeTab = tabs[activeIndex];
    const tabList = activeTab.parentElement;
    tabList.scrollTo({
      left: activeTab.offsetLeft - ((tabList.clientWidth - activeTab.offsetWidth) / 2),
      behavior: scroll ? "smooth" : "auto"
    });

    if (updateHash) history.replaceState(null, "", `#chapitre-${activeKey}`);
    if (moveFocus) tabs[activeIndex].focus();
    if (scroll) explorer.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => show(index, { scroll: true }));
    tab.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      if (event.key === "Home") show(0, { moveFocus: true });
      else if (event.key === "End") show(tabs.length - 1, { moveFocus: true });
      else {
        const direction = event.key === "ArrowRight" ? 1 : -1;
        show((index + direction + tabs.length) % tabs.length, { moveFocus: true });
      }
    });
  });

  previous.addEventListener("click", () => show(activeIndex - 1, { scroll: true }));
  next.addEventListener("click", () => show(activeIndex + 1, { scroll: true }));
  window.addEventListener("hashchange", () => {
    const hashIndex = keys.indexOf(keyFromHash());
    if (hashIndex >= 0 && hashIndex !== activeIndex) {
      show(hashIndex, { scroll: true, updateHash: false });
    }
  });

  show(activeIndex);
})();
