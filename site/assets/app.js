const grid = document.querySelector("#analysis-grid");
const filters = [...document.querySelectorAll(".filter")];
const menuButton = document.querySelector(".menu-button");
const navigation = document.querySelector("#navigation");
const booksGrid = document.querySelector("#books-grid");

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

if (grid) fetch("content/analyses.json")
  .then((response) => {
    if (!response.ok) throw new Error("Catalogue indisponible");
    return response.json();
  })
  .then((analyses) => {
    renderAnalyses(analyses);
    filters.forEach((button) => button.addEventListener("click", () => {
      filters.forEach((filter) => filter.classList.remove("is-active"));
      filters.forEach((filter) => filter.setAttribute("aria-pressed", "false"));
      button.classList.add("is-active");
      button.setAttribute("aria-pressed", "true");
      const selected = button.dataset.filter;
      renderAnalyses(selected === "all" ? analyses : analyses.filter((item) => item.category === selected));
    }));
  })
  .catch(() => { grid.innerHTML = '<p class="empty-state">Le catalogue ne peut pas être chargé.</p>'; });

function renderBooks(books) {
  booksGrid.innerHTML = books.map((book) => `
    <article class="book-card">
      <div class="book-cover" aria-hidden="true">
        <span>${escapeHtml(book.number)}</span>
        <strong>BI<br>PY</strong>
        <small>${escapeHtml(book.year)}</small>
      </div>
      <div class="book-content">
        <div class="book-kicker"><span>${escapeHtml(book.status)}</span><span>${escapeHtml(book.publisher)}</span></div>
        <h3>${escapeHtml(book.title)}</h3>
        <p class="book-subtitle">${escapeHtml(book.subtitle)}</p>
        <p class="book-author">de <strong>${escapeHtml(book.author)}</strong></p>
        <div class="book-projects">
          <p class="project-label">Projets associés</p>
          <ol>${book.projects.map((project) => `<li><span>${escapeHtml(project.title)}</span><small>${escapeHtml(project.status)}</small></li>`).join("")}</ol>
        </div>
        <div class="book-links">
          <a href="${escapeHtml(book.repoPath)}">Voir le dossier projet</a>
          <a href="${escapeHtml(book.sourceUrl)}">Référence du livre</a>
        </div>
      </div>
    </article>`).join("");
}

if (booksGrid) fetch("content/books.json")
  .then((response) => {
    if (!response.ok) throw new Error("Catalogue indisponible");
    return response.json();
  })
  .then(renderBooks)
  .catch(() => { booksGrid.innerHTML = '<p class="empty-state">Le catalogue des livres ne peut pas être chargé.</p>'; });

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

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navigation.classList.contains("is-open")) {
    menuButton.setAttribute("aria-expanded", "false");
    navigation.classList.remove("is-open");
    menuButton.focus();
  }
});

document.querySelector("#year").textContent = new Date().getFullYear();
