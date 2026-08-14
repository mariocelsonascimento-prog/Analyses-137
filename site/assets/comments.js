const commentsList = document.querySelector("#comments-list");
const commentFilter = document.querySelector("#comment-project-filter");
const commentsApi = "https://api.github.com/repos/mariocelsonascimento-prog/Analyses-137/issues?state=open&labels=comment-approved&per_page=100";
let approvedComments = [];

const commentEscape = (value) => String(value).replace(/[&<>'"]/g, (character) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", "'":"&#39;", '"':"&quot;" }[character]));
const commentDate = (value) => new Intl.DateTimeFormat("fr-FR", { day:"2-digit", month:"long", year:"numeric" }).format(new Date(value));
const field = (body, label) => {
  const match = body.match(new RegExp(`### ${label}\\s+([\\s\\S]*?)(?=\\n### |$)`, "i"));
  return match ? match[1].trim() : "";
};
const projectId = (value) => value.split(/[ —]/)[0].trim();

function renderComments(project = "all") {
  const visible = project === "all" ? approvedComments : approvedComments.filter((comment) => comment.project === project);
  if (!visible.length) {
    commentsList.innerHTML = '<p class="comments-empty">Aucun commentaire approuvé pour le moment.</p>';
    return;
  }
  commentsList.innerHTML = visible.map((comment) => `<article class="public-comment"><header><div><span class="comment-project">${commentEscape(comment.project)}</span><strong>${commentEscape(comment.pseudonym)}</strong></div><time datetime="${commentEscape(comment.createdAt)}">${commentDate(comment.createdAt)}</time></header><p>${commentEscape(comment.text)}</p><a href="${commentEscape(comment.url)}" aria-label="Voir le commentaire de ${commentEscape(comment.pseudonym)} sur GitHub">Voir sur GitHub</a></article>`).join("");
}

fetch(commentsApi, { headers: { Accept:"application/vnd.github+json" } })
  .then((response) => { if (!response.ok) throw new Error("Commentaires indisponibles"); return response.json(); })
  .then((issues) => {
    approvedComments = issues.filter((issue) => !issue.pull_request).map((issue) => ({
      project: projectId(field(issue.body || "", "Projet")),
      pseudonym: field(issue.body || "", "Pseudonyme") || issue.user.login,
      text: field(issue.body || "", "Commentaire"),
      createdAt: issue.created_at,
      url: issue.html_url
    })).filter((comment) => comment.text);
    renderComments();
  })
  .catch(() => { commentsList.innerHTML = '<p class="comments-empty">Les commentaires ne peuvent pas être chargés actuellement. Ils restent consultables sur GitHub.</p>'; });

commentFilter.addEventListener("change", () => renderComments(commentFilter.value));

