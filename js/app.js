(function () {
  "use strict";

  // ---------------------------------------------------------------------
  // Tabs (WAI-ARIA Authoring Practices tab pattern, manual activation)
  // ---------------------------------------------------------------------

  const tabs = Array.from(document.querySelectorAll(".sidebar__tab"));
  const panels = Array.from(document.querySelectorAll(".tabpanel"));

  function activateTab(tab) {
    const globalHeader = document.getElementById("global-page-header");
    tabs.forEach((t) => {
      const selected = t === tab;
      t.setAttribute("aria-selected", String(selected));
      t.tabIndex = selected ? 0 : -1;
    });
    panels.forEach((panel) => {
      panel.hidden = panel.id !== tab.getAttribute("aria-controls");
    });
    if (globalHeader) globalHeader.hidden = tab.id !== "tab-readme";
    tab.focus();
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activateTab(tab));
    tab.addEventListener("keydown", (event) => {
      let newIndex = null;
      if (event.key === "ArrowDown") newIndex = (index + 1) % tabs.length;
      if (event.key === "ArrowUp") newIndex = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") newIndex = 0;
      if (event.key === "End") newIndex = tabs.length - 1;
      if (newIndex !== null) {
        event.preventDefault();
        activateTab(tabs[newIndex]);
      }
    });
  });

  // ---------------------------------------------------------------------
  // Shared helpers
  // ---------------------------------------------------------------------

  function statusTag(statusKey) {
    const status = APPROVAL_STATUSES[statusKey] || APPROVAL_STATUSES.unknown;
    const toneClass = {
      positive: "tag--positive",
      caution: "tag--caution",
      info: "tag--info",
      negative: "tag--negative",
      neutral: "tag--neutral",
      unknown: "tag--unknown",
    }[status.tone];
    return `<span class="tag ${toneClass}"><span aria-hidden="true">${status.icon}</span> ${status.label}</span>`;
  }

  function evidenceTag(evidenceKey) {
    const evidence = EVIDENCE_STATES[evidenceKey] || EVIDENCE_STATES.none;
    return `<span class="tag tag--neutral"><span aria-hidden="true">${evidence.icon}</span> ${evidence.label}</span>`;
  }

  function actionTag(action) {
    return `<span class="tag tag--info">${escapeHtml(action || "Investigate")}</span>`;
  }

  function workstreamTag(workstreamKey, options) {
    if (!workstreamKey) {
      return '<span class="tag tag--unknown">Workstream to confirm</span>';
    }
    const ws = WORKSTREAMS[workstreamKey];
    if (!ws) return '<span class="tag tag--unknown">Workstream to confirm</span>';
    const secondary = options && options.secondary;
    return `<span class="tag workstream-tag ${ws.colorClass}${secondary ? " workstream-tag--secondary" : ""}">${ws.label}${secondary ? " (also connected)" : ""}</span>`;
  }

  function workstreamTagsHtml(cap) {
    let html = workstreamTag(cap.connectedWorkstream);
    if (cap.secondaryWorkstream) {
      html += workstreamTag(cap.secondaryWorkstream, { secondary: true });
    }
    return `<span class="workstream-tags">${html}</span>`;
  }

  const CAPABILITIES_BY_ID = {};
  CAPABILITIES.forEach((c) => { CAPABILITIES_BY_ID[c.id] = c; });

  function maturityLabel(maturity) {
    const index = MATURITY_STAGES.indexOf(maturity);
    if (index === -1) return maturity || "Unknown";
    return `${maturity} (stage ${index + 1} of ${MATURITY_STAGES.length})`;
  }

  function escapeHtml(str) {
    return String(str || "").replace(/[&<>"']/g, (c) => (
      { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
    ));
  }

  // ---------------------------------------------------------------------
  // 00 - Read me: lifecycle definitions + legends
  // ---------------------------------------------------------------------

  function renderLifecycleDefinitions() {
    const dl = document.getElementById("lifecycle-definitions");
    dl.innerHTML = LIFECYCLE_COLUMNS.map((col) => `
      <dt>${col}</dt>
      <dd>${escapeHtml(LIFECYCLE_DEFINITIONS[col])}</dd>
    `).join("");
  }

  function renderLegends() {
    const container = document.getElementById("legends");
    const approvalItems = Object.keys(APPROVAL_STATUSES).map((k) => `<li>${statusTag(k)}</li>`).join("");
    const evidenceItems = Object.keys(EVIDENCE_STATES).map((k) => `<li>${evidenceTag(k)}</li>`).join("");
    const maturityItems = MATURITY_STAGES.map((m, i) => `<li><span class="tag tag--neutral">${i + 1}. ${m}</span></li>`).join("");
    container.innerHTML = `
      <div class="legend-block">
        <h4>Approval status</h4>
        <ul>${approvalItems}</ul>
      </div>
      <div class="legend-block">
        <h4>Maturity</h4>
        <ul>${maturityItems}</ul>
      </div>
      <div class="legend-block">
        <h4>Evidence state</h4>
        <ul>${evidenceItems}</ul>
      </div>
    `;
  }

  // ---------------------------------------------------------------------
  // 01 - Landscape map
  // ---------------------------------------------------------------------

  function capabilityCardHtml(cap, options) {
    const workstreamKeys = [cap.connectedWorkstream, cap.secondaryWorkstream].filter(Boolean);
    const registerCompact = options && options.registerCompact;
    const name = escapeHtml(cap.name.replace("EXAMPLE - ", ""));
    return `
      <button type="button" class="capability-card" data-cap-id="${cap.id}" data-workstreams="${workstreamKeys.join(",")}" aria-haspopup="dialog" aria-label="Open full details for ${escapeHtml(cap.name)}">
        <div class="capability-card__header">
          <p class="capability-card__name">
            ${name}
          </p>
        </div>
        ${registerCompact ? "" : `<p class="capability-card__desc">${escapeHtml(cap.description) || "<em>Description not yet defined</em>"}</p>`}
        ${registerCompact ? `<div class="capability-card__badges">${workstreamTagsHtml(cap)}</div>` : `
          <p class="capability-card__field"><strong>Primary user:</strong> ${escapeHtml(cap.role)}</p>
          <p class="capability-card__field"><strong>Owner:</strong> ${escapeHtml(cap.owner)}</p>
          <p class="capability-card__field"><strong>Maturity:</strong> ${maturityLabel(cap.maturity)}</p>
          <div class="capability-card__badges">
            ${workstreamTagsHtml(cap)}
            <span class="capability-card__status">${statusTag(cap.approvalStatus)}</span>
          </div>
        `}
      </button>
    `;
  }

  // -- Drawer: full capability detail, opened by clicking a card ----------

  function capabilityDrawerHtml(cap) {
    return `
      <header class="drawer-record-header">
        <p class="drawer-id">${escapeHtml(cap.id)}</p>
        <h3 id="drawer-title" class="drawer-title">${escapeHtml(cap.name.replace("EXAMPLE - ", ""))}</h3>
        <div class="drawer-badges">
          ${workstreamTagsHtml(cap)}
        </div>
        <p class="drawer-description">${escapeHtml(cap.description) || "Description not yet defined"}</p>
      </header>

      <section class="drawer-summary" aria-labelledby="drawer-summary-title">
        <div class="drawer-summary__header">
          <h4 id="drawer-summary-title">Portfolio summary</h4>
          <p>Current governance, maturity, and evidence state</p>
        </div>
        <dl class="drawer-summary__grid">
          <div><dt>Approval</dt><dd>${statusTag(cap.approvalStatus)}</dd></div>
          <div><dt>Maturity</dt><dd>${escapeHtml(maturityLabel(cap.maturity))}</dd></div>
          <div><dt>Evidence</dt><dd>${evidenceTag(cap.evidence)}</dd></div>
        </dl>
      </section>

      <section class="drawer-detail-section" aria-labelledby="drawer-need-title">
        <h4 id="drawer-need-title">Need and use</h4>
        <dl class="drawer-fields">
          <div><dt>Primary user</dt><dd>${escapeHtml(cap.role)}</dd></div>
          <div class="drawer-field--wide"><dt>Job to be done</dt><dd>${escapeHtml(cap.jobToBeDone) || "Not yet defined"}</dd></div>
        </dl>
      </section>

      <section class="drawer-detail-section" aria-labelledby="drawer-placement-title">
        <h4 id="drawer-placement-title">Portfolio placement</h4>
        <dl class="drawer-fields">
          <div><dt>Design workflow</dt><dd>${escapeHtml(cap.workflowStage) || "Not yet mapped"}</dd></div>
          <div><dt>Lifecycle stage</dt><dd>${escapeHtml(cap.lifecycleColumn) || "Not yet mapped"}</dd></div>
        </dl>
      </section>

      <section class="drawer-detail-section" aria-labelledby="drawer-governance-title">
        <h4 id="drawer-governance-title">Ownership and governance</h4>
        <dl class="drawer-fields">
          <div><dt>Owner</dt><dd>${escapeHtml(cap.owner)}</dd></div>
          <div><dt>Backpack connection</dt><dd>${escapeHtml(cap.backpackConnection)}</dd></div>
          <div class="drawer-field--wide"><dt>Principal risk</dt><dd>${escapeHtml(cap.principalRisk) || "Not yet assessed"}</dd></div>
          <div class="drawer-field--wide"><dt>Last reviewed</dt><dd>${escapeHtml(cap.lastReviewed)}</dd></div>
        </dl>
      </section>
    `;
  }

  function openCapabilityDrawer(capId) {
    const cap = CAPABILITIES_BY_ID[capId];
    const dialog = document.getElementById("capability-drawer");
    if (!cap || !dialog) return;
    document.getElementById("drawer-content").innerHTML = capabilityDrawerHtml(cap);
    dialog.showModal();
    window.requestAnimationFrame(() => dialog.classList.add("is-open"));
  }

  function closeCapabilityDrawer(dialog) {
    dialog.classList.remove("is-open");
    const closeDelay = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 240;
    window.setTimeout(() => {
      if (dialog.open) dialog.close();
    }, closeDelay);
  }

  function clickIsOutsideDialog(event, dialog) {
    if (event.target !== dialog) return false;
    const rect = dialog.getBoundingClientRect();
    return event.clientX < rect.left || event.clientX > rect.right ||
      event.clientY < rect.top || event.clientY > rect.bottom;
  }

  function initDrawer() {
    const dialog = document.getElementById("capability-drawer");
    if (!dialog) return;
    document.getElementById("drawer-close").addEventListener("click", () => closeCapabilityDrawer(dialog));
    dialog.addEventListener("cancel", (event) => {
      event.preventDefault();
      closeCapabilityDrawer(dialog);
    });
    dialog.addEventListener("close", () => dialog.classList.remove("is-open"));
    dialog.addEventListener("click", (event) => {
      if (clickIsOutsideDialog(event, dialog)) closeCapabilityDrawer(dialog);
    });
    document.getElementById("main-content").addEventListener("click", (event) => {
      const card = event.target.closest(".capability-card");
      if (card && card.dataset.capId) openCapabilityDrawer(card.dataset.capId);
    });
  }

  function renderLandscapeMatrix() {
    const table = document.getElementById("landscape-matrix");
    const thead = table.querySelector("thead tr");
    const corner = thead.querySelector(".matrix-table__corner");
    thead.innerHTML = "";
    thead.appendChild(corner);
    LIFECYCLE_COLUMNS.forEach((col) => {
      const th = document.createElement("th");
      th.scope = "col";
      th.textContent = col;
      th.title = LIFECYCLE_DEFINITIONS[col];
      thead.appendChild(th);
    });

    const tbody = table.querySelector("tbody");
    tbody.innerHTML = "";
    WORKFLOW_ROWS.forEach((row) => {
      const tr = document.createElement("tr");
      const rowHeader = document.createElement("th");
      rowHeader.scope = "row";
      rowHeader.textContent = row;
      tr.appendChild(rowHeader);

      LIFECYCLE_COLUMNS.forEach((col) => {
        const td = document.createElement("td");
        const matches = CAPABILITIES.filter(
          (c) => c.workflowStage === row && c.lifecycleColumn === col
        );
        if (matches.length > 0) {
          td.innerHTML = matches.map(capabilityCardHtml).join("");
        } else {
          td.innerHTML = `<div class="gap-cell">Capability gap</div>`;
        }
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
  }

  function renderCrossCutting() {
    const list = document.getElementById("cross-cutting-list");
    list.innerHTML = CROSS_CUTTING_LAYERS.map(
      (layer) => `<li><strong>${escapeHtml(layer.label)}</strong><span>${escapeHtml(layer.note)}</span></li>`
    ).join("");
  }

  // ---------------------------------------------------------------------
  // 02 - Capability register
  // ---------------------------------------------------------------------

  function registerRowHtml(cap) {
    const isUnresolved = cap.approvalStatus === "unknown" || cap.owner === "Owner to confirm" || cap.evidence === "none";
    return `
      <tr${isUnresolved ? ' data-unresolved="true"' : ""}>
        <td class="register-table__capability-cell">${capabilityCardHtml(cap, { registerCompact: true })}</td>
        <td>${escapeHtml(cap.jobToBeDone) || '<em>Job to be done not yet defined</em>'}</td>
        <td>${escapeHtml(cap.workflowStage) || '<em>Not yet mapped</em>'}</td>
        <td>${statusTag(cap.approvalStatus)}</td>
        <td>${maturityLabel(cap.maturity)}</td>
        <td>${escapeHtml(cap.owner)}</td>
        <td>${escapeHtml(cap.backpackConnection)}</td>
        <td>${evidenceTag(cap.evidence)}</td>
        <td>${escapeHtml(cap.principalRisk) || '<em>Not yet assessed</em>'}</td>
        <td>${actionTag(cap.recommendedAction)}</td>
        <td>${escapeHtml(cap.lastReviewed)}</td>
      </tr>
    `;
  }

  function renderRegisterTable(filters) {
    const tbody = document.getElementById("register-table-body");
    const filterInput = document.getElementById("capability-filter-input");
    const currentFilters = typeof filters === "object" && filters !== null
      ? filters
      : { query: filters };
    const filterQuery = currentFilters.query === undefined && filterInput ? filterInput.value : currentFilters.query;
    const normalizedQuery = (filterQuery || "").trim().toLowerCase();
    const hasCategoryFilter = Boolean(currentFilters.approval || currentFilters.maturity || currentFilters.evidence);
    const matchingCapabilities = CAPABILITIES.filter((cap) => {
      const matchesName = !normalizedQuery || cap.name.toLowerCase().includes(normalizedQuery);
      const matchesApproval = !currentFilters.approval || cap.approvalStatus === currentFilters.approval;
      const matchesMaturity = !currentFilters.maturity || cap.maturity === currentFilters.maturity;
      const matchesEvidence = !currentFilters.evidence || cap.evidence === currentFilters.evidence;
      return matchesName && matchesApproval && matchesMaturity && matchesEvidence;
    });
    const isFiltered = normalizedQuery || hasCategoryFilter;
    const rows = isFiltered
      ? matchingCapabilities
      : [...matchingCapabilities, EMPTY_CAPABILITY_TEMPLATE];
    tbody.innerHTML = rows.length
      ? rows.map(registerRowHtml).join("")
      : '<tr><td colspan="11"><em>No capabilities match this filter.</em></td></tr>';

    const status = document.getElementById("capability-filter-status");
    if (status) {
      status.textContent = isFiltered
        ? `${matchingCapabilities.length} capability ${matchingCapabilities.length === 1 ? "matches" : "match"} the filter.`
        : "";
    }
  }

  // ---------------------------------------------------------------------
  // 03 - Measurement dashboard
  // ---------------------------------------------------------------------

  function listHtml(items) {
    return `<ul class="strategy-linkage__list">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
  }

  function renderStrategyLinkage() {
    const outcome = document.getElementById("department-outcome");
    const table = document.getElementById("strategy-linkage-table");
    if (!outcome || !table) return;

    outcome.textContent = DEPARTMENT_OUTCOME;
    table.querySelector("tbody").innerHTML = STRATEGY_LINKAGES.map((link) => `
      <tr>
        <th scope="row">${escapeHtml(link.goal)}</th>
        <td>${escapeHtml(link.strategy)}</td>
        <td>${listHtml(link.conditions)}</td>
        <td>${listHtml(link.signals)}</td>
        <td>${listHtml(link.leadingMeasures)}</td>
        <td>${listHtml(link.outcomeMeasures)}</td>
        <td>${escapeHtml(link.attribution)}</td>
      </tr>
    `).join("");
  }

  function indicatorCardHtml(indicator) {
    return `
      <div class="indicator-card">
        <p class="indicator-card__title">${escapeHtml(indicator.outcome)}</p>
        <dl class="indicator-card__grid">
          <div><dt>Current state</dt><dd>${escapeHtml(indicator.current)}</dd></div>
          <div><dt>Target</dt><dd>${escapeHtml(indicator.target)}</dd></div>
          <div><dt>Trend</dt><dd>${escapeHtml(indicator.trend)}</dd></div>
          <div><dt>Confidence</dt><dd>${escapeHtml(indicator.confidence)}</dd></div>
          <div><dt>Evidence status</dt><dd>${escapeHtml(indicator.evidence)}</dd></div>
          <div><dt>Owner</dt><dd>${escapeHtml(indicator.owner)}</dd></div>
        </dl>
        ${indicator.commentary ? `<p class="capability-card__field"><strong>Commentary:</strong> ${escapeHtml(indicator.commentary)}</p>` : ""}
      </div>
    `;
  }

  function renderScorecard() {
    const container = document.getElementById("scorecard-groups");
    const strategyGroups = SCORECARD_GROUPS.reduce((groups, group) => {
      if (!groups[group.strategy]) groups[group.strategy] = [];
      groups[group.strategy].push(group);
      return groups;
    }, {});

    container.innerHTML = Object.entries(strategyGroups).map(([strategy, groups]) => `
      <section class="scorecard-strategy" aria-label="${escapeHtml(strategy)} scorecard measures">
        <h4>${escapeHtml(strategy)}</h4>
        ${groups.map((group) => `
          <section class="scorecard-group" aria-label="${escapeHtml(group.group)}">
            <h5>${escapeHtml(group.group)}</h5>
            ${group.indicators.map(indicatorCardHtml).join("")}
          </section>
        `).join("")}
      </section>
    `).join("");
  }

  function renderMeasurementChain() {
    const list = document.getElementById("measurement-chain");
    list.innerHTML = `
      <li><strong>Investment / capability:</strong> <span>${escapeHtml(MEASUREMENT_CHAIN_EXAMPLE.capability)}</span></li>
      ${MEASUREMENT_CHAIN_EXAMPLE.steps.map(
        (step) => `<li><strong>${escapeHtml(step.stage)}</strong><span>${escapeHtml(step.detail)}</span></li>`
      ).join("")}
    `;
  }

  // ---------------------------------------------------------------------
  // Add capability - inline launcher -> docked form drawer -> submit ->
  // register update + confirmation.
  // ---------------------------------------------------------------------

  function populateSelect(select, options, placeholder) {
    if (!select) return;
    select.innerHTML = "";
    if (placeholder) {
      const opt = document.createElement("option");
      opt.value = "";
      opt.textContent = placeholder;
      select.appendChild(opt);
    }
    options.forEach(({ value, label }) => {
      const opt = document.createElement("option");
      opt.value = value;
      opt.textContent = label;
      select.appendChild(opt);
    });
  }

  function generateNextRegisterId() {
    const nums = CAPABILITIES
      .map((c) => parseInt(String(c.id).replace("REG-", ""), 10))
      .filter((n) => !isNaN(n));
    const next = (nums.length ? Math.max(...nums) : 0) + 1;
    return `REG-${String(next).padStart(3, "0")}`;
  }

  function rerenderAfterDataChange() {
    renderLandscapeMatrix();
    renderRegisterTable();
  }

  function showAddConfirmation(message) {
    const banner = document.getElementById("add-confirmation");
    if (!banner) return;
    banner.textContent = message;
    banner.hidden = false;
    window.setTimeout(() => { banner.hidden = true; }, 6000);
  }

  function buildCapability(formData) {
    return {
      id: generateNextRegisterId(),
      isExample: false,
      name: (formData.get("name") || "").toString().trim(),
      description: (formData.get("description") || "").toString().trim(),
      role: (formData.get("role") || "").toString().trim() || "Owner to confirm",
      jobToBeDone: (formData.get("jobToBeDone") || "").toString().trim(),
      workflowStage: (formData.get("workflowStage") || "").toString(),
      lifecycleColumn: (formData.get("lifecycleColumn") || "").toString(),
      connectedWorkstream: (formData.get("connectedWorkstream") || "").toString() || null,
      secondaryWorkstream: null,
      approvalStatus: (formData.get("approvalStatus") || "unknown").toString(),
      maturity: (formData.get("maturity") || "Identified").toString(),
      owner: (formData.get("owner") || "").toString().trim() || "Owner to confirm",
      backpackConnection: (formData.get("backpackConnection") || "").toString().trim() || "Approval status unknown",
      evidence: (formData.get("evidence") || "none").toString(),
      principalRisk: (formData.get("principalRisk") || "").toString().trim(),
      recommendedAction: "investigate",
      lastReviewed: "No evidence collected",
    };
  }

  function addCapability(capability) {
    CAPABILITIES.push(capability);
    CAPABILITIES_BY_ID[capability.id] = capability;
    rerenderAfterDataChange();
    activateTab(document.getElementById("tab-register"));
    showAddConfirmation(`${capability.id} - "${capability.name}" added to the register.`);
  }

  function initAddCapabilityForm() {
    const dialog = document.getElementById("add-capability-dialog");
    const openButtons = Array.from(document.querySelectorAll("#sidebar-add-capability, #register-add-capability"));
    const closeBtn = document.getElementById("add-capability-close");
    const cancelBtn = document.getElementById("add-capability-cancel");
    const form = document.getElementById("add-capability-form");
    if (!dialog || openButtons.length === 0 || !form) return;

    populateSelect(document.getElementById("field-workflow"), WORKFLOW_ROWS.map((w) => ({ value: w, label: w })), "Not yet mapped");
    populateSelect(document.getElementById("field-lifecycle"), LIFECYCLE_COLUMNS.map((c) => ({ value: c, label: c })), "Not yet mapped");
    populateSelect(document.getElementById("field-workstream"), Object.keys(WORKSTREAMS).map((k) => ({ value: k, label: WORKSTREAMS[k].label })), "Workstream to confirm");
    populateSelect(document.getElementById("field-approval"), Object.keys(APPROVAL_STATUSES).map((k) => ({ value: k, label: APPROVAL_STATUSES[k].label })));
    populateSelect(document.getElementById("field-maturity"), MATURITY_STAGES.map((m) => ({ value: m, label: m })));
    populateSelect(document.getElementById("field-evidence"), Object.keys(EVIDENCE_STATES).map((k) => ({ value: k, label: EVIDENCE_STATES[k].label })));

    document.getElementById("field-approval").value = "unknown";
    document.getElementById("field-maturity").value = "Identified";
    document.getElementById("field-evidence").value = "none";

    const openDialog = (initialName) => {
      form.reset();
      document.getElementById("field-approval").value = "unknown";
      document.getElementById("field-maturity").value = "Identified";
      document.getElementById("field-evidence").value = "none";
      document.getElementById("field-name").value = initialName || "";
      dialog.showModal();
      window.requestAnimationFrame(() => dialog.classList.add("is-open"));
      document.getElementById("field-name").focus();
    };

    openButtons.forEach((button) => button.addEventListener("click", () => openDialog("")));
    document.addEventListener("open-add-capability", (event) => {
      openDialog(event.detail && event.detail.name ? event.detail.name : "");
    });

    closeBtn.addEventListener("click", () => closeCapabilityDrawer(dialog));
    cancelBtn.addEventListener("click", () => closeCapabilityDrawer(dialog));
    dialog.addEventListener("cancel", (event) => {
      event.preventDefault();
      closeCapabilityDrawer(dialog);
    });
    dialog.addEventListener("close", () => dialog.classList.remove("is-open"));
    dialog.addEventListener("click", (event) => {
      if (clickIsOutsideDialog(event, dialog)) closeCapabilityDrawer(dialog);
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const name = (data.get("name") || "").toString().trim();
      if (!name) {
        document.getElementById("field-name").focus();
        return;
      }

      const newCap = buildCapability(data);
      closeCapabilityDrawer(dialog);
      addCapability(newCap);
    });
  }

  function initCapabilityFilter() {
    const form = document.getElementById("capability-filter");
    const input = document.getElementById("capability-filter-input");
    if (!form || !input) return;

    const populateFilter = (id, options, label) => {
      const select = document.getElementById(id);
      options.forEach(({ value, label: optionLabel }) => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = optionLabel;
        select.appendChild(option);
      });
      select.setAttribute("aria-label", label);
      return select;
    };
    const approval = populateFilter("filter-approval", Object.entries(APPROVAL_STATUSES).map(([value, item]) => ({ value, label: item.label })), "Approval status");
    const maturity = populateFilter("filter-maturity", MATURITY_STAGES.map((value) => ({ value, label: value })), "Maturity");
    const evidence = populateFilter("filter-evidence", Object.entries(EVIDENCE_STATES).map(([value, item]) => ({ value, label: item.label })), "Evidence state");
    const applyFilters = () => renderRegisterTable({ query: input.value, approval: approval.value, maturity: maturity.value, evidence: evidence.value });

    form.addEventListener("submit", (event) => event.preventDefault());
    input.addEventListener("input", applyFilters);
    [approval, maturity, evidence].forEach((select) => select.addEventListener("change", applyFilters));
  }

  // ---------------------------------------------------------------------
  // Init
  // ---------------------------------------------------------------------

  renderLifecycleDefinitions();
  renderLegends();
  renderLandscapeMatrix();
  renderCrossCutting();
  renderRegisterTable();
  renderStrategyLinkage();
  renderScorecard();
  renderMeasurementChain();
  initDrawer();
  initAddCapabilityForm();
  initCapabilityFilter();
})();
