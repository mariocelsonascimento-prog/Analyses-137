const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (character) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", "'":"&#39;", '"':"&quot;" }[character]));
const formatDate = (date) => new Intl.DateTimeFormat("fr-FR", { day:"2-digit", month:"short", year:"numeric" }).format(new Date(`${date}T12:00:00`));
const menuButton = document.querySelector(".menu-button");
const navigation = document.querySelector("#navigation");
const safeColor = (value) => /^#[0-9a-f]{6}$/i.test(value) ? value : "#d5ff45";
const ticketDialog = document.querySelector("#ticket-dialog");
let trackerData;

function renderTracker(data, projectFilter = "all") {
  const done = data.issues.filter((issue) => issue.status === "done").length;
  const progress = data.issues.length ? Math.round((done / data.issues.length) * 100) : 0;
  document.querySelector("#metric-progress").textContent = `${progress}%`;
  document.querySelector("#progress-bar").style.width = `${progress}%`;
  document.querySelector("#global-progress").setAttribute("aria-valuenow", String(progress));
  document.querySelector("#metric-open").textContent = data.issues.length - done;
  document.querySelector("#metric-projects").textContent = data.projects.filter((project) => project.status === "Actif").length;
  document.querySelector("#metric-incidents").textContent = data.incidents.filter((incident) => incident.status !== "Résolu").length;
  document.querySelector("#tracker-updated").textContent = `Dernière mise à jour · ${formatDate(data.updatedAt)}`;

  document.querySelector("#project-list").innerHTML = data.projects.map((project) => {
    const issues = data.issues.filter((issue) => issue.project === project.id);
    const complete = issues.filter((issue) => issue.status === "done").length;
    const rate = issues.length ? Math.round((complete / issues.length) * 100) : 0;
    return `<article class="project-row" style="--project-color:${safeColor(project.color)}"><div class="project-code"><i aria-hidden="true"></i>${escapeHtml(project.id)}</div><div><div class="project-title-line"><h3>${escapeHtml(project.name)}</h3><span>${escapeHtml(project.status)}</span></div><p>${escapeHtml(project.description)}</p></div><div class="project-progress"><strong>${rate}%</strong><span>${complete}/${issues.length} tickets</span><div class="progress-track"><i style="width:${rate}%"></i></div></div></article>`;
  }).join("");

  const visible = projectFilter === "all" ? data.issues : data.issues.filter((issue) => issue.project === projectFilter);
  document.querySelector("#kanban-board").innerHTML = data.workflow.map((column) => {
    const tickets = visible.filter((issue) => issue.status === column.id);
    return `<section class="kanban-column"><header><h3>${escapeHtml(column.label)}</h3><span>${tickets.length}</span></header><div class="ticket-list">${tickets.map((issue) => { const project = data.projects.find((item) => item.id === issue.project); return `<button class="ticket" type="button" data-issue-id="${escapeHtml(issue.id)}" style="--project-color:${safeColor(project?.color)}" aria-label="Voir le détail du ticket ${escapeHtml(issue.id)} : ${escapeHtml(issue.title)}"><span class="ticket-tags"><span class="ticket-project"><i aria-hidden="true"></i>${escapeHtml(issue.project)} · ${escapeHtml(issue.type)}</span><i class="priority priority-${escapeHtml(issue.priority.toLowerCase())}">${escapeHtml(issue.priority)}</i></span><span class="ticket-title">${escapeHtml(issue.title)}</span><span class="ticket-footer"><strong>${escapeHtml(issue.id)}</strong><time datetime="${escapeHtml(issue.updatedAt)}">${formatDate(issue.updatedAt)}</time></span></button>`; }).join("") || '<p class="empty-column">Aucun ticket</p>'}</div></section>`;
  }).join("");

  document.querySelector("#incident-list").innerHTML = data.incidents.map((incident) => `<tr><td><strong>${escapeHtml(incident.id)}</strong></td><td><span>${escapeHtml(incident.title)}</span><small>${escapeHtml(incident.resolution)}</small></td><td>${escapeHtml(incident.severity)}</td><td><span class="incident-status">${escapeHtml(incident.status)}</span></td><td>${formatDate(incident.openedAt)}</td></tr>`).join("");
}

fetch("content/project-management.json?v=20260814-kanban-limit", { cache: "no-store" }).then((response) => { if (!response.ok) throw new Error("Suivi indisponible"); return response.json(); }).then((data) => {
  trackerData = data;
  const select = document.querySelector("#project-filter");
  select.insertAdjacentHTML("beforeend", data.projects.map((project) => `<option value="${escapeHtml(project.id)}">${escapeHtml(project.id)} · ${escapeHtml(project.name)}</option>`).join(""));
  select.addEventListener("change", () => renderTracker(data, select.value));
  renderTracker(data);
}).catch(() => { document.querySelector("#kanban-board").innerHTML = '<p class="empty-state">Les données de suivi ne peuvent pas être chargées.</p>'; });

document.querySelector("#kanban-board").addEventListener("click", (event) => {
  const ticket = event.target.closest("[data-issue-id]");
  if (!ticket || !trackerData) return;
  const issue = trackerData.issues.find((item) => item.id === ticket.dataset.issueId);
  const project = trackerData.projects.find((item) => item.id === issue.project);
  const workflow = trackerData.workflow.find((item) => item.id === issue.status);
  document.querySelector("#dialog-key").textContent = issue.id;
  document.querySelector("#dialog-title").textContent = issue.title;
  document.querySelector("#dialog-project").innerHTML = `<i aria-hidden="true" style="--project-color:${safeColor(project.color)}"></i><span>${escapeHtml(project.name)}</span>`;
  document.querySelector("#dialog-meta").innerHTML = `<span><small>Statut</small><strong>${escapeHtml(workflow.label)}</strong></span><span><small>Priorité</small><strong>${escapeHtml(issue.priority)}</strong></span><span><small>Type</small><strong>${escapeHtml(issue.type)}</strong></span><span><small>Mise à jour</small><strong>${formatDate(issue.updatedAt)}</strong></span>`;
  document.querySelector("#dialog-description").textContent = issue.description;
  document.querySelector("#dialog-deliverables").innerHTML = issue.deliverables.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  ticketDialog.showModal();
});

document.querySelector("#dialog-close").addEventListener("click", () => ticketDialog.close());
ticketDialog.addEventListener("click", (event) => { if (event.target === ticketDialog) ticketDialog.close(); });

menuButton.addEventListener("click", () => { const open = menuButton.getAttribute("aria-expanded") === "true"; menuButton.setAttribute("aria-expanded", String(!open)); navigation.classList.toggle("is-open", !open); });
document.addEventListener("keydown", (event) => { if (event.key === "Escape" && navigation.classList.contains("is-open")) { menuButton.setAttribute("aria-expanded", "false"); navigation.classList.remove("is-open"); menuButton.focus(); } });
document.querySelector("#year").textContent = new Date().getFullYear();
