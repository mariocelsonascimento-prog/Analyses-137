(() => {
  const root = document.querySelector("[data-return-matrix]");
  if (!root) return;

  const scrollArea = root.querySelector(".return-matrix-scroll");
  const status = root.querySelector(".return-matrix-status");
  const reset = root.querySelector(".return-matrix-reset");
  const error = root.querySelector(".return-matrix-error");
  const integer = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });
  let selectedTarget = null;
  let matrixTotal = 0;

  const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  }[character]));

  function clearHighlight() {
    selectedTarget = null;
    root.querySelectorAll(".is-selected-row,.is-selected-column,.is-related-row,.is-related-column,.is-selected-cell,.is-dimmed")
      .forEach((element) => element.classList.remove("is-selected-row", "is-selected-column", "is-related-row", "is-related-column", "is-selected-cell", "is-dimmed"));
    root.querySelectorAll("[data-matrix-cell],[data-matrix-axis]").forEach((button) => button.setAttribute("aria-pressed", "false"));
    reset.disabled = true;
    status.textContent = `Aucune sélection. La matrice présente ${integer.format(matrixTotal)} unités retournées au total.`;
  }

  function selectTarget(button) {
    const axis = button.dataset.matrixAxis || "cell";
    const row = axis === "row" ? button.dataset.matrixValue : button.dataset.matrixRow;
    const column = axis === "column" ? button.dataset.matrixValue : button.dataset.matrixColumn;
    const key = axis === "cell" ? `cell:${row}\u0000${column}` : `${axis}:${button.dataset.matrixValue}`;
    if (selectedTarget === key) {
      clearHighlight();
      return;
    }

    selectedTarget = key;
    const relatedRows = new Set();
    const relatedColumns = new Set();
    root.querySelectorAll("[data-matrix-cell]").forEach((cellButton) => {
      if (axis === "row" && cellButton.dataset.matrixRow === row && cellButton.dataset.matrixColumn !== "__total__") {
        relatedColumns.add(cellButton.dataset.matrixColumn);
      }
      if (axis === "column" && cellButton.dataset.matrixColumn === column && cellButton.dataset.matrixRow !== "__total__") {
        relatedRows.add(cellButton.dataset.matrixRow);
      }
    });

    root.querySelectorAll(".return-matrix-table th,.return-matrix-table td").forEach((element) => {
      const sameRow = Boolean(row) && element.dataset.matrixRow === row;
      const sameColumn = Boolean(column) && element.dataset.matrixColumn === column;
      const relatedRow = relatedRows.has(element.dataset.matrixRow);
      const relatedColumn = relatedColumns.has(element.dataset.matrixColumn);
      element.classList.toggle("is-selected-row", sameRow);
      element.classList.toggle("is-selected-column", sameColumn);
      element.classList.toggle("is-related-row", relatedRow);
      element.classList.toggle("is-related-column", relatedColumn);
      element.classList.toggle("is-selected-cell",
        (axis === "cell" && sameRow && sameColumn) ||
        (axis === "row" && sameRow && relatedColumn) ||
        (axis === "column" && sameColumn && relatedRow)
      );
      element.classList.toggle("is-dimmed", !sameRow && !sameColumn && !relatedRow && !relatedColumn);
    });
    root.querySelectorAll("[data-matrix-cell],[data-matrix-axis]").forEach((interactiveButton) => {
      interactiveButton.setAttribute("aria-pressed", String(interactiveButton === button));
    });
    reset.disabled = false;
    const value = Number(button.dataset.value);
    const units = `${integer.format(value)} unité${value > 1 ? "s" : ""} retournée${value > 1 ? "s" : ""}`;
    if (axis === "row") {
      const count = relatedColumns.size;
      status.textContent = `${button.dataset.label} : ${units} au total. Sa ligne et ${count} colonne${count > 1 ? "s" : ""} de motif${count > 1 ? "s" : ""} contenant une valeur sont surlignées.`;
    } else if (axis === "column") {
      const count = relatedRows.size;
      status.textContent = `${button.dataset.label} : ${units} au total. Sa colonne et ${count} ligne${count > 1 ? "s" : ""} de produit${count > 1 ? "s" : ""} contenant une valeur sont surlignées.`;
    }
    else status.textContent = `${button.dataset.rowLabel} × ${button.dataset.columnLabel} : ${units}. La ligne et la colonne correspondantes sont surlignées.`;
  }

  function cellButton(rowKey, rowLabel, columnKey, columnLabel, value) {
    if (!value) return '<span class="return-matrix-zero" aria-label="Aucun retour">—</span>';
    const label = `${integer.format(value)} unité${value > 1 ? "s" : ""} retournée${value > 1 ? "s" : ""} pour ${rowLabel}, motif ${columnLabel}`;
    return `<button type="button" data-matrix-cell data-matrix-row="${escapeHtml(rowKey)}" data-matrix-column="${escapeHtml(columnKey)}" data-row-label="${escapeHtml(rowLabel)}" data-column-label="${escapeHtml(columnLabel)}" data-value="${value}" aria-label="${escapeHtml(label)}" aria-pressed="false">${integer.format(value)}</button>`;
  }

  function axisButton(axis, key, label, value) {
    const direction = axis === "row" ? "la ligne" : "la colonne";
    const accessibleLabel = `Surligner ${direction} ${label}, ${integer.format(value)} unité${value > 1 ? "s" : ""} retournée${value > 1 ? "s" : ""}`;
    return `<button class="return-matrix-axis" type="button" data-matrix-axis="${axis}" data-matrix-value="${escapeHtml(key)}" data-label="${escapeHtml(label)}" data-value="${value}" aria-label="${escapeHtml(accessibleLabel)}" aria-pressed="false">${escapeHtml(label)}</button>`;
  }

  function render(rows) {
    const reasons = [...new Set(rows.flatMap((row) => (row.returns || []).map((event) => event.reason)))]
      .sort((a, b) => a.localeCompare(b, "fr"));
    const values = new Map();
    const productTotals = new Map();
    const reasonTotals = new Map(reasons.map((reason) => [reason, 0]));

    rows.forEach((row) => (row.returns || []).forEach((event) => {
      const quantity = Number(event.quantity || 0);
      if (!quantity) return;
      const key = `${row.product}\u0000${event.reason}`;
      values.set(key, (values.get(key) || 0) + quantity);
      productTotals.set(row.product, (productTotals.get(row.product) || 0) + quantity);
      reasonTotals.set(event.reason, (reasonTotals.get(event.reason) || 0) + quantity);
    }));

    const products = [...productTotals.keys()].sort((a, b) => a.localeCompare(b, "fr"));
    const grandTotal = [...productTotals.values()].reduce((sum, value) => sum + value, 0);
    matrixTotal = grandTotal;
    const head = reasons.map((reason) => `<th scope="col" data-matrix-column="${escapeHtml(reason)}">${axisButton("column", reason, reason, reasonTotals.get(reason))}</th>`).join("");
    const body = products.map((product) => {
      const cells = reasons.map((reason) => {
        const value = values.get(`${product}\u0000${reason}`) || 0;
        return `<td data-matrix-row="${escapeHtml(product)}" data-matrix-column="${escapeHtml(reason)}">${cellButton(product, product, reason, reason, value)}</td>`;
      }).join("");
      const total = productTotals.get(product);
      return `<tr><th scope="row" data-matrix-row="${escapeHtml(product)}">${axisButton("row", product, product, total)}</th>${cells}<td class="return-matrix-total" data-matrix-row="${escapeHtml(product)}" data-matrix-column="__total__">${cellButton(product, product, "__total__", "Total", total)}</td></tr>`;
    }).join("");
    const foot = reasons.map((reason) => `<td data-matrix-row="__total__" data-matrix-column="${escapeHtml(reason)}">${cellButton("__total__", "Total", reason, reason, reasonTotals.get(reason))}</td>`).join("");

    scrollArea.innerHTML = `<table class="return-matrix-table"><caption class="sr-only">Quantités retournées par produit et par motif, avec totaux</caption><thead><tr><th scope="col" class="return-matrix-corner">Produit</th>${head}<th scope="col" data-matrix-column="__total__">${axisButton("column", "__total__", "Total", grandTotal)}</th></tr></thead><tbody>${body}</tbody><tfoot><tr><th scope="row" data-matrix-row="__total__">${axisButton("row", "__total__", "Total", grandTotal)}</th>${foot}<td data-matrix-row="__total__" data-matrix-column="__total__">${cellButton("__total__", "Total", "__total__", "Total", grandTotal)}</td></tr></tfoot></table>`;
    root.querySelectorAll("[data-matrix-cell],[data-matrix-axis]").forEach((button) => button.addEventListener("click", () => selectTarget(button)));
    clearHighlight();
  }

  reset.addEventListener("click", clearHighlight);
  root.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && selectedTarget) {
      clearHighlight();
      reset.focus();
    }
  });

  fetch("../content/commercial-data.json")
    .then((response) => {
      if (!response.ok) throw new Error("Données indisponibles");
      return response.json();
    })
    .then((payload) => render(payload.rows))
    .catch(() => {
      error.hidden = false;
      status.hidden = true;
      scrollArea.hidden = true;
    });
})();
