import {getFavorites, isFavorite, toggleFavorite} from "./storage.js";

const libraryView = document.querySelector("#library-view");
const readerView = document.querySelector("#reader-view");
const readerContent = document.querySelector("#reader-content");
const readerFavorite = document.querySelector("#reader-favorite");
const writeupGrid = document.querySelector("#writeup-grid");
const searchInput = document.querySelector("#writeup-search");
const categoryFilter = document.querySelector("#category-filter");
const difficultyFilter = document.querySelector("#difficulty-filter");
const favoritesOnly = document.querySelector("#favorites-only");
const resultCount = document.querySelector("#result-count");
const loadStatus = document.querySelector("#library-status");
const dialog = document.querySelector("#writeup-dialog");
const dialogContent = document.querySelector("#dialog-content");
const dialogClose = document.querySelector("#dialog-close");

let writeups = [];
let caseStudies = [];
let activeReaderId = null;

async function loadWriteups() {
  try {
    const [catalogResponse, caseStudyResponse] = await Promise.all([
      fetch("data/writeups.json"),
      fetch("data/case-studies.json")
    ]);

    if (!catalogResponse.ok || !caseStudyResponse.ok) {
      throw new Error(
        `Data request failed: ${catalogResponse.status}/${caseStudyResponse.status}`
      );
    }

    writeups = await catalogResponse.json();
    caseStudies = await caseStudyResponse.json();

    populateFilters(writeups);
    renderWriteups(writeups);

    if (loadStatus) {
      loadStatus.textContent = `${writeups.length} write-ups loaded.`;
    }

    openEntryFromQueryString();
  } catch (error) {
    console.error("Unable to load write-ups:", error);

    writeupGrid.innerHTML = `
      <p class="notice error-notice">
        The write-up library could not be loaded. Please refresh the page or try again later.
      </p>`;

    if (loadStatus) {
      loadStatus.textContent = "The write-up library could not be loaded.";
    }
  }
}

function populateFilters(data) {
  const categories = [...new Set(data.map((writeup) => writeup.category))].sort();
  const difficulties = [...new Set(data.map((writeup) => writeup.difficulty))].sort();

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.append(option);
  });

  difficulties.forEach((difficulty) => {
    const option = document.createElement("option");
    option.value = difficulty;
    option.textContent = difficulty;
    difficultyFilter.append(option);
  });
}

function applyFilters() {
  const query = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;
  const difficulty = difficultyFilter.value;
  const favoriteIds = getFavorites();

  const filtered = writeups.filter((writeup) => {
    const searchableText = [
      writeup.title,
      writeup.platform,
      writeup.category,
      writeup.summary,
      ...writeup.tools,
      ...writeup.skills
    ].join(" ").toLowerCase();

    return searchableText.includes(query)
      && (!category || writeup.category === category)
      && (!difficulty || writeup.difficulty === difficulty)
      && (!favoritesOnly.checked || favoriteIds.includes(writeup.id));
  });

  renderWriteups(filtered);
}

function renderWriteups(data) {
  resultCount.textContent = `${data.length} ${data.length === 1 ? "write-up" : "write-ups"}`;

  if (data.length === 0) {
    writeupGrid.innerHTML = `
      <p class="notice">No write-ups match the selected filters.</p>`;
    return;
  }

  writeupGrid.innerHTML = data.map((writeup) => {
    const favorite = isFavorite(writeup.id);

    return `
      <article class="writeup-card" id="writeup-${writeup.id}">
        <div class="card-topline">
          <span class="eyebrow">${writeup.platform}</span>
          <span class="difficulty-badge">${writeup.difficulty}</span>
        </div>

        <h2>${writeup.title}</h2>

        <dl class="writeup-meta">
          <div><dt>Category</dt><dd>${writeup.category}</dd></div>
          <div><dt>Language</dt><dd>${writeup.language}</dd></div>
          <div><dt>Status</dt><dd>${writeup.status}</dd></div>
          <div><dt>Primary tool</dt><dd>${writeup.tools[0]}</dd></div>
        </dl>

        <p>${writeup.summary}</p>

        <div class="tag-row">
          ${writeup.tools.map((tool) => `<span class="tag">${tool}</span>`).join("")}
        </div>

        <div class="card-actions">
          <a class="button" href="writeups.html?id=${encodeURIComponent(writeup.id)}">
            Read case study
          </a>
          <button
            class="button button-secondary"
            type="button"
            data-action="details"
            data-id="${writeup.id}"
          >
            Quick view
          </button>
          <button
            class="favorite-button"
            type="button"
            data-action="favorite"
            data-id="${writeup.id}"
            aria-pressed="${favorite}"
          >
            ${favorite ? "★ Saved" : "☆ Save"}
          </button>
        </div>
      </article>`;
  }).join("");
}

function openDialog(id) {
  const writeup = writeups.find((item) => item.id === id);
  const caseStudy = caseStudies.find((item) => item.id === id);

  if (!writeup || !caseStudy || !dialog || !dialogContent) {
    return;
  }

  dialogContent.innerHTML = `
    <p class="eyebrow">${writeup.platform} · ${writeup.difficulty}</p>
    <h2 id="dialog-title">${writeup.title}</h2>
    <p>${caseStudy.overview}</p>
    <h3>What this case demonstrates</h3>
    <ul class="skill-list">
      ${writeup.skills.map((skill) => `<li>${skill}</li>`).join("")}
    </ul>
    <a class="button" href="writeups.html?id=${encodeURIComponent(writeup.id)}">
      Read case study
    </a>`;

  dialog.setAttribute("aria-labelledby", "dialog-title");
  dialog.showModal();
}

function renderReader(id) {
  const metadata = writeups.find((item) => item.id === id);
  const caseStudy = caseStudies.find((item) => item.id === id);

  if (!metadata || !caseStudy) {
    return false;
  }

  activeReaderId = id;
  libraryView.hidden = true;
  readerView.hidden = false;
  document.title = `${metadata.title} Case Study | Writeup Vault`;

  readerContent.innerHTML = `
    <header class="reader-header">
      <p class="eyebrow">${metadata.platform} · ${metadata.difficulty}</p>
      <h1>${metadata.title}</h1>
      <p class="reader-lead">${caseStudy.overview}</p>

      <div class="reader-meta-grid">
        <div><span>Category</span><strong>${metadata.category}</strong></div>
        <div><span>Language</span><strong>${metadata.language}</strong></div>
        <div><span>Status</span><strong>${metadata.status}</strong></div>
        <div><span>Tools</span><strong>${caseStudy.tools.join(", ")}</strong></div>
      </div>
    </header>

    <aside class="reader-note">
      <strong>Authorized practice environment.</strong>
      This case study summarizes work completed in a deliberately vulnerable cybersecurity lab and focuses on methodology, learning, and documentation.
    </aside>

    <section class="reader-section">
      <h2>My approach</h2>
      <p>${caseStudy.approach}</p>
    </section>

    <section class="reader-section">
      <h2>Key techniques</h2>
      <ul>
        ${caseStudy.keyTechniques.map((technique) => `<li>${technique}</li>`).join("")}
      </ul>
    </section>

    <section class="reader-section">
      <h2>What I learned</h2>
      <p>${caseStudy.lesson}</p>
    </section>

    <section class="reader-section">
      <h2>Skills demonstrated</h2>
      <ul>
        ${caseStudy.demonstrates.map((skill) => `<li>${skill}</li>`).join("")}
      </ul>
    </section>

    <section class="reader-conclusion">
      <p>
        This entry is intentionally presented as a concise professional case study rather than a full walkthrough. The goal is to show how I approach and document penetration-testing problems without turning the portfolio into a step-by-step solution repository.
      </p>
    </section>`;

  updateReaderFavorite();
  window.scrollTo({ top: 0, behavior: "auto" });
  return true;
}

function updateReaderFavorite() {
  if (!activeReaderId || !readerFavorite) {
    return;
  }

  const favorite = isFavorite(activeReaderId);
  readerFavorite.setAttribute("aria-pressed", String(favorite));
  readerFavorite.textContent = favorite ? "★ Saved" : "☆ Save";
}

function openEntryFromQueryString() {
  const requestedId = new URLSearchParams(window.location.search).get("id");

  if (requestedId) {
    const opened = renderReader(requestedId);

    if (!opened) {
      history.replaceState({}, "", "writeups.html");
    }
  }
}

[searchInput, categoryFilter, difficultyFilter, favoritesOnly].forEach((control) => {
  const eventName = control === searchInput ? "input" : "change";
  control.addEventListener(eventName, applyFilters);
});

writeupGrid.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");

  if (!button) {
    return;
  }

  const { action, id } = button.dataset;

  if (action === "details") {
    openDialog(id);
  }

  if (action === "favorite") {
    toggleFavorite(id);
    applyFilters();

    if (loadStatus) {
      loadStatus.textContent = isFavorite(id)
        ? `${id} saved to favorites.`
        : `${id} removed from favorites.`;
    }
  }
});

readerFavorite.addEventListener("click", () => {
  if (!activeReaderId) {
    return;
  }

  toggleFavorite(activeReaderId);
  updateReaderFavorite();
});

dialogClose.addEventListener("click", () => dialog.close());

dialog.addEventListener("click", (event) => {
  if (event.target === dialog) {
    dialog.close();
  }
});

loadWriteups();
