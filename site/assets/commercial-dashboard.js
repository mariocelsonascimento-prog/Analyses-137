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
  const visualFilters = { client: "", returnReason: "" };

  const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character]));
  const unique = (field) => [...new Set(rows.map((row) => row[field]))].sort((a, b) => String(a).localeCompare(String(b), "fr"));
  const sum = (items, field) => items.reduce((total, item) => total + Number(item[field] || 0), 0);
  const selected = () => ({ year: controls.year.value, salesperson: controls.salesperson.value, product: controls.product.value, ...visualFilters });
  const filtered = (ignored = "") => {
    const filters = selected();
    return rows.filter((row) =>
      (!filters.year || String(row.year) === filters.year) &&
      (ignored === "product" || !filters.product || row.product === filters.product) &&
      (ignored === "salesperson" || !filters.salesperson || row.salesperson === filters.salesperson) &&
      (ignored === "client" || !filters.client || row.client === filters.client) &&
      (ignored === "returnReason" || !filters.returnReason || (row.returns || []).some((event) => event.reason === filters.returnReason))
    );
  };
  const group = (items, key, value) => {
    const result = new Map();
    items.forEach((item) => result.set(item[key], (result.get(item[key]) || 0) + Number(item[value] || 0)));
    return [...result].map(([label, amount]) => ({ label, amount }));
  };
  const bars = (target, values, formatter, selectedLabel = "", onSelect = null) => {
    const container = document.querySelector(target);
    if (!values.length || Math.max(...values.map((item) => item.amount)) <= 0) {
      container.innerHTML = '<p class="chart-empty">Aucune valeur pour cette sélection.</p>';
      return;
    }
    const maximum = Math.max(...values.map((item) => item.amount));
    container.innerHTML = `<div class="bar-list">${values.map((item) => {
      const width = Math.max(2, 100 * item.amount / maximum);
      const active = selectedLabel && item.label === selectedLabel ? " is-selected" : "";
      const content = `<div><span>${escapeHtml(item.label)}</span><strong>${escapeHtml(formatter(item.amount))}</strong></div><i style="--bar-width:${width.toFixed(2)}%" aria-hidden="true"></i>`;
      return onSelect
        ? `<button class="bar-row${active}" type="button" data-bar-value="${escapeHtml(item.label)}" aria-pressed="${active ? "true" : "false"}" title="Filtrer sur ${escapeHtml(item.label)}">${content}</button>`
        : `<div class="bar-row${active}">${content}</div>`;
    }).join("")}</div>`;
    if (onSelect) container.querySelectorAll("[data-bar-value]").forEach((button) => button.addEventListener("click", () => onSelect(button.dataset.barValue)));
  };
  const toggleSelect = (field, value) => {
    if (field === "product" || field === "salesperson") controls[field].value = controls[field].value === value ? "" : value;
    else visualFilters[field] = visualFilters[field] === value ? "" : value;
    render();
  };
  const render = () => {
    const data = filtered();
    const salespersonComparison = filtered("salesperson");
    const productComparison = filtered("product");
    const clientComparison = filtered("client");
    const reasonComparison = filtered("returnReason");
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
    const labels = [filters.year && `année ${filters.year}`, filters.salesperson, filters.product, filters.client, filters.returnReason && `motif : ${filters.returnReason}`].filter(Boolean);
    document.querySelector("#dashboard-context").textContent = `${integer.format(data.length)} commandes analysées${labels.length ? ` · ${labels.join(" · ")}` : " · toutes les données"}`;

    bars("#chart-salespeople", group(salespersonComparison, "salesperson", "revenue").sort((a, b) => b.amount - a.amount), euro.format, filters.salesperson, (value) => toggleSelect("salesperson", value));
    bars("#chart-products", group(productComparison, "product", "margin").sort((a, b) => b.amount - a.amount).slice(0, 5), euro.format, filters.product, (value) => toggleSelect("product", value));
    bars("#chart-clients", group(clientComparison, "client", "revenue").sort((a, b) => b.amount - a.amount).slice(0, 5), euro.format, filters.client, (value) => toggleSelect("client", value));

    const productReturns = new Map();
    productComparison.forEach((row) => {
      const current = productReturns.get(row.product) || { quantity: 0, returned: 0 };
      current.quantity += Number(row.quantity || 0); current.returned += Number(row.returnedQuantity || 0);
      productReturns.set(row.product, current);
    });
    const rates = [...productReturns].map(([label, value]) => ({ label, amount: value.quantity ? 100 * value.returned / value.quantity : 0 })).filter((item) => item.amount > 0).sort((a, b) => b.amount - a.amount).slice(0, 5);
    bars("#chart-return-rate", rates, (value) => `${decimal.format(value)} %`, filters.product, (value) => toggleSelect("product", value));

    const reasons = new Map();
    reasonComparison.forEach((row) => (row.returns || []).forEach((event) => reasons.set(event.reason, (reasons.get(event.reason) || 0) + Number(event.quantity || 0))));
    bars("#chart-reasons", [...reasons].map(([label, amount]) => ({ label, amount })).sort((a, b) => b.amount - a.amount), integer.format, filters.returnReason, (value) => toggleSelect("returnReason", value));
  };

  fetch("../content/commercial-data.json")
    .then((response) => { if (!response.ok) throw new Error("Données indisponibles"); return response.json(); })
    .then((payload) => {
      rows = payload.rows;
      unique("year").forEach((value) => controls.year.insertAdjacentHTML("beforeend", `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`));
      unique("salesperson").forEach((value) => controls.salesperson.insertAdjacentHTML("beforeend", `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`));
      unique("product").forEach((value) => controls.product.insertAdjacentHTML("beforeend", `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`));
      Object.values(controls).forEach((control) => control.addEventListener("change", () => { visualFilters.client = ""; visualFilters.returnReason = ""; render(); }));
      document.querySelector("#reset-dashboard").addEventListener("click", () => { Object.values(controls).forEach((control) => { control.value = ""; }); visualFilters.client = ""; visualFilters.returnReason = ""; render(); });
      render();
    })
    .catch(() => { document.querySelector("#dashboard-error").hidden = false; document.querySelector("#dashboard-context").hidden = true; });
})();
