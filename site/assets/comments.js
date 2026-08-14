const commentsApi = "https://api.github.com/repos/mariocelsonascimento-prog/Analyses-137/issues?state=open&labels=comment-approved&per_page=100";
let approvedComments = [];
let commentsLoaded = false;
let commentsFailed = false;

const commentEscape = (value) => String(value).replace(/[&<>'"]/g, (character) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", "'":"&#39;", '"':"&quot;" }[character]));
const commentDate = (value) => new Intl.DateTimeFormat("fr-FR", { day:"2-digit", month:"short", year:"numeric" }).format(new Date(value));
const field = (body, label) => {
  const match = body.match(new RegExp(`### ${label}\\s+([\\s\\S]*?)(?=\\n### |$)`, "i"));
  return match ? match[1].trim() : "";
};
const projectId = (value) => value.split(/[ —]/)[0].trim();

function renderProjectComments() {
  document.querySelectorAll("[data-project-comments]").forEach((slot) => {
    const project = slot.dataset.projectComments;
    const comments = approvedComments.filter((comment) => comment.project === project);
    const count = document.querySelector(`[data-comment-count="${project}"]`);
    if (count) count.textContent = `${comments.length} commentaire${comments.length > 1 ? "s" : ""}`;
    if (commentsFailed) {
      slot.innerHTML = '<p class="comments-empty">Les commentaires sont temporairement indisponibles.</p>';
    } else if (!commentsLoaded) {
      slot.innerHTML = '<p class="comments-loading">Chargement…</p>';
    } else if (!comments.length) {
      slot.innerHTML = '<p class="comments-empty">Soyez la première personne à commenter ce projet.</p>';
    } else {
      slot.innerHTML = comments.map((comment) => `<article class="public-comment"><header><strong>${commentEscape(comment.pseudonym)}</strong><time datetime="${commentEscape(comment.createdAt)}">${commentDate(comment.createdAt)}</time></header><p>${commentEscape(comment.text)}</p><a href="${commentEscape(comment.url)}" aria-label="Voir le commentaire de ${commentEscape(comment.pseudonym)} sur GitHub">Voir sur GitHub</a></article>`).join("");
    }
  });
}

document.addEventListener("tracker:rendered", renderProjectComments);

fetch(commentsApi, { headers: { Accept:"application/vnd.github+json" } })
  .then((response) => { if (!response.ok) throw new Error("Commentaires indisponibles"); return response.json(); })
  .then((issues) => {
    approvedComments = issues.filter((issue) => !issue.pull_request).map((issue) => ({ project:projectId(field(issue.body || "", "Projet")), pseudonym:field(issue.body || "", "Pseudonyme") || issue.user.login, text:field(issue.body || "", "Commentaire"), createdAt:issue.created_at, url:issue.html_url })).filter((comment) => comment.text);
    commentsLoaded = true;
    renderProjectComments();
  })
  .catch(() => { commentsFailed = true; renderProjectComments(); });

