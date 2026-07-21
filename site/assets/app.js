const grid = document.querySelector("#analysis-grid");
const filters = [...document.querySelectorAll(".filter")];
const menuButton = document.querySelector(".menu-button");
const navigation = document.querySelector("#navigation");

const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
}[character]));

function renderAnalyses(items) {
  if (!items.length) {
    grid.innerHTML = '<p class="empty-state">Aucune analyse dans cette catégorie pour le moment.</p>';
    return;
  }

  grid.innerHTML = items.map((item) => {
    const title = escapeHtml(item.title);
    const content = `
      <div class="card-top"><span>${escapeHtml(item.number)}</span><span class="status">${escapeHtml(item.status)}</span></div>
      <p class="card-category">${escapeHtml(item.categoryLabel)}</p>
      <h3>${title}</h3>
      <p class="card-summary">${escapeHtml(item.summary)}</p>
      <div class="card-meta"><span>${escapeHtml(item.tool)}</span><span>${item.updatedAt ? escapeHtml(item.updatedAt) : "—"}</span></div>`;
    return item.href
      ? `<a class="analysis-card" href="${escapeHtml(item.href)}" aria-label="Ouvrir ${title}">${content}</a>`
      : `<article class="analysis-card is-disabled">${content}</article>`;
  }).join("");
}

fetch("content/analyses.json")
  .then((response) => {
    if (!response.ok) throw new Error("Catalogue indisponible");
    return response.json();
  })
  .then((analyses) => {
    renderAnalyses(analyses);
    filters.forEach((button) => button.addEventListener("click", () => {
      filters.forEach((filter) => filter.classList.remove("is-active"));
      button.classList.add("is-active");
      const selected = button.dataset.filter;
      renderAnalyses(selected === "all" ? analyses : analyses.filter((item) => item.category === selected));
    }));
  })
  .catch(() => { grid.innerHTML = '<p class="empty-state">Le catalogue ne peut pas être chargé.</p>'; });

menuButton.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!open));
  navigation.classList.toggle("is-open", !open);
});

navigation.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    menuButton.setAttribute("aria-expanded", "false");
    navigation.classList.remove("is-open");
  }
});

document.querySelector("#year").textContent = new Date().getFullYear();

