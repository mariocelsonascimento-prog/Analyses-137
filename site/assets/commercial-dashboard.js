(() => {
  const root = document.querySelector("[data-commercial-dashboard]");
  if (!root) return;

  const euro = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
  const integer = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });
  const decimal = new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const controls = {
    year: document.querySelector("#filter-year"),
    salesperson: document.querySelector("#filter-salesperson"),
    product: document.querySelector("#filter-product")
  };
  let rows = [];

  const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character]));
  const unique = (field) => [...new Set(rows.map((row) => row[field]))].sort((a, b) => String(a).localeCompare(String(b), "fr"));
  const sum = (items, field) => items.reduce((total, item) => total + Number(item[field] || 0), 0);
  const selected = () => ({ year: controls.year.value, salesperson: controls.salesperson.value, product: controls.product.value });
  const filtered = (ignoreSalesperson = false) => {
    const filters = selected();
    return rows.filter((row) => (!filters.year || String(row.year) === filters.year) && (!filters.product || row.product === filters.product) && (ignoreSalesperson || !filters.salesperson || row.salesperson === filters.salesperson));
  };
  const group = (items, key, value) => {
    const result = new Map();
    items.forEach((item) => result.set(item[key], (result.get(item[key]) || 0) + Number(item[value] || 0)));
    return [...result].map(([label, amount]) => ({ label, amount }));
  };
  const bars = (target, values, formatter, selectedLabel = "") => {
    const container = document.querySelector(target);
    if (!values.length || Math.max(...values.map((item) => item.amount)) <= 0) {
      container.innerHTML = '<p class="chart-empty">Aucune valeur pour cette sélection.</p>';
      return;
    }
    const maximum = Math.max(...values.map((item) => item.amount));
    container.innerHTML = `<div class="bar-list">${values.map((item) => {
      const width = Math.max(2, 100 * item.amount / maximum);
      const active = selectedLabel && item.label === selectedLabel ? " is-selected" : "";
      return `<div class="bar-row${active}" title="${escapeHtml(item.label)} : ${escapeHtml(formatter(item.amount))}"><div><span>${escapeHtml(item.label)}</span><strong>${escapeHtml(formatter(item.amount))}</strong></div><i style="--bar-width:${width.toFixed(2)}%" aria-hidden="true"></i></div>`;
    }).join("")}</div>`;
  };
  const render = () => {
    const data = filtered();
    const comparison = filtered(true);
    const revenue = sum(data, "revenue");
    const margin = sum(data, "margin");
    const quantity = sum(data, "quantity");
    const returned = sum(data, "returnedQuantity");
    const kpis = [
      ["Chiffre d'affaires", euro.format(revenue)], ["Marge", euro.format(margin)],
      ["Taux de marge", `${decimal.format(revenue ? 100 * margin / revenue : 0)} %`], ["Quantité vendue", integer.format(quantity)],
      ["Quantité retournée", integer.format(returned)], ["Taux de retour", `${decimal.format(quantity ? 100 * returned / quantity : 0)} %`]
    ];
    document.querySelector("#live-kpis").innerHTML = kpis.map(([label, value]) => `<article><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></article>`).join("");
    const filters = selected();
    const labels = [filters.year && `année ${filters.year}`, filters.salesperson, filters.product].filter(Boolean);
    document.querySelector("#dashboard-context").textContent = `${integer.format(data.length)} commandes analysées${labels.length ? ` · ${labels.join(" · ")}` : " · toutes les données"}`;

    bars("#chart-salespeople", group(comparison, "salesperson", "revenue").sort((a, b) => b.amount - a.amount), euro.format, filters.salesperson);
    bars("#chart-products", group(data, "product", "margin").sort((a, b) => b.amount - a.amount).slice(0, 5), euro.format);
    bars("#chart-clients", group(data, "client", "revenue").sort((a, b) => b.amount - a.amount).slice(0, 5), euro.format);

    const productReturns = new Map();
    data.forEach((row) => {
      const current = productReturns.get(row.product) || { quantity: 0, returned: 0 };
      current.quantity += Number(row.quantity || 0); current.returned += Number(row.returnedQuantity || 0);
      productReturns.set(row.product, current);
    });
    const rates = [...productReturns].map(([label, value]) => ({ label, amount: value.quantity ? 100 * value.returned / value.quantity : 0 })).filter((item) => item.amount > 0).sort((a, b) => b.amount - a.amount).slice(0, 5);
    bars("#chart-return-rate", rates, (value) => `${decimal.format(value)} %`);

    const reasons = new Map();
    data.forEach((row) => (row.returns || []).forEach((event) => reasons.set(event.reason, (reasons.get(event.reason) || 0) + Number(event.quantity || 0))));
    bars("#chart-reasons", [...reasons].map(([label, amount]) => ({ label, amount })).sort((a, b) => b.amount - a.amount), integer.format);
  };

  fetch("../content/commercial-data.json")
    .then((response) => { if (!response.ok) throw new Error("Données indisponibles"); return response.json(); })
    .then((payload) => {
      rows = payload.rows;
      unique("year").forEach((value) => controls.year.insertAdjacentHTML("beforeend", `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`));
      unique("salesperson").forEach((value) => controls.salesperson.insertAdjacentHTML("beforeend", `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`));
      unique("product").forEach((value) => controls.product.insertAdjacentHTML("beforeend", `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`));
      Object.values(controls).forEach((control) => control.addEventListener("change", render));
      document.querySelector("#reset-dashboard").addEventListener("click", () => { Object.values(controls).forEach((control) => { control.value = ""; }); render(); });
      render();
    })
    .catch(() => { document.querySelector("#dashboard-error").hidden = false; document.querySelector("#dashboard-context").hidden = true; });
})();
