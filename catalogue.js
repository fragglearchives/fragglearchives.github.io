function initCatalogue(config) {
  const legacy = document.getElementById(config.legacyId);
  const browser = document.getElementById(config.browserId);
  const results = document.getElementById(config.resultsId);
  const filters = document.getElementById(config.filtersId);
  const status = document.getElementById(config.statusId);

  if (!legacy || !browser || !results || !filters) {
    return;
  }

  const originalItems = Array.from(
    legacy.querySelectorAll(".catalogue-item")
  );

  if (!originalItems.length) {
    return;
  }

  const items = originalItems.map(item => item.cloneNode(true));

  let currentMode = "collection";
  let currentFilter = "all";

  const labels = config.labels || {};

  function prettyName(value) {
    if (labels[value]) {
      return labels[value];
    }

    return value
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  function getValues(mode) {
    return [...new Set(
      items
        .map(item => item.dataset[mode])
        .filter(Boolean)
    )];
  }

  function buildFilters() {
    filters.innerHTML = "";

    const values = getValues(currentMode);

    const allButton = document.createElement("button");
    allButton.type = "button";
    allButton.className = "catalogue-filter active";
    allButton.dataset.filter = "all";
    allButton.textContent = "All";
    filters.appendChild(allButton);

    values.forEach(value => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "catalogue-filter";
      button.dataset.filter = value;
      button.textContent = prettyName(value);
      filters.appendChild(button);
    });

    currentFilter = "all";
  }

  function renderCatalogue() {
    results.innerHTML = "";

    let visibleItems = items;

    if (currentFilter !== "all") {
      visibleItems = items.filter(
        item => item.dataset[currentMode] === currentFilter
      );
    }

    if (currentFilter === "all") {
      const groups = getValues(currentMode);

      groups.forEach(group => {
        const groupSection = document.createElement("section");
        groupSection.className = "catalogue-group";

        const heading = document.createElement("h2");
        heading.className = "catalogue-group-title";
        heading.textContent = prettyName(group);

        const groupBox = document.createElement("div");
        groupBox.className = "giftshop-card catalogue-group-box";

        const groupItems = visibleItems.filter(
          item => item.dataset[currentMode] === group
        );

        groupItems.forEach((item, index) => {
          groupBox.appendChild(item.cloneNode(true));

          if (index < groupItems.length - 1) {
            groupBox.appendChild(document.createElement("hr"));
          }
        });

        groupSection.appendChild(heading);
        groupSection.appendChild(groupBox);
        results.appendChild(groupSection);
      });
    } else {
      const groupSection = document.createElement("section");
      groupSection.className = "catalogue-group";

      const heading = document.createElement("h2");
      heading.className = "catalogue-group-title";
      heading.textContent = prettyName(currentFilter);

      const groupBox = document.createElement("div");
      groupBox.className = "giftshop-card catalogue-group-box";

      visibleItems.forEach((item, index) => {
        groupBox.appendChild(item.cloneNode(true));

        if (index < visibleItems.length - 1) {
          groupBox.appendChild(document.createElement("hr"));
        }
      });

      groupSection.appendChild(heading);
      groupSection.appendChild(groupBox);
      results.appendChild(groupSection);
    }

    if (status) {
      status.textContent =
        visibleItems.length +
        (visibleItems.length === 1 ? " item" : " items");
    }
  }

  browser.addEventListener("click", event => {
    const modeButton = event.target.closest(".catalogue-mode");

    if (modeButton) {
      currentMode = modeButton.dataset.mode;
      currentFilter = "all";

      browser.querySelectorAll(".catalogue-mode").forEach(button => {
        const active = button === modeButton;

        button.classList.toggle("active", active);
        button.setAttribute("aria-pressed", active);
      });

      buildFilters();
      renderCatalogue();
      return;
    }

    const filterButton = event.target.closest(".catalogue-filter");

    if (filterButton) {
      currentFilter = filterButton.dataset.filter;

      filters.querySelectorAll(".catalogue-filter").forEach(button => {
        button.classList.toggle("active", button === filterButton);
      });

      renderCatalogue();
    }
  });

  buildFilters();
  renderCatalogue();

  browser.hidden = false;
  legacy.hidden = true;
}
