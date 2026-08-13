const featuredContainer = document.querySelector("#featured-writeups");
const statsContainer = document.querySelector("#portfolio-stats");
const statusMessage = document.querySelector("#home-data-status");

async function loadHomeData() {
  try {
    const response = await fetch("data/writeups.json");

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const writeups = await response.json();
    renderStats(writeups);
    renderFeatured(writeups.filter((writeup) => writeup.featured).slice(0, 3));

    if (statusMessage) {
      statusMessage.textContent = `${writeups.length} portfolio entries loaded successfully.`;
    }
  } catch (error) {
    console.error("Unable to load portfolio data:", error);

    if (featuredContainer) {
      featuredContainer.innerHTML = `
        <p class="notice error-notice">
          The write-up library could not be loaded right now. Please try again later.
        </p>`;
    }

    if (statusMessage) {
      statusMessage.textContent = "Portfolio data could not be loaded.";
    }
  }
}

function renderStats(writeups) {
  if (!statsContainer) return;

  const stats = writeups.reduce(
    (result, writeup) => {
      result.total += 1;
      result.platforms.add(writeup.platform);
      writeup.skills.forEach((skill) => result.skills.add(skill));
      if (writeup.featured) result.featured += 1;
      return result;
    },
    {
      total: 0,
      platforms: new Set(),
      skills: new Set(),
      featured: 0
    }
  );

  const cards = [
    [stats.total, "Published write-ups"],
    [stats.platforms.size, "Lab platforms"],
    [stats.skills.size, "Documented skills"],
    [stats.featured, "Featured cases"]
  ];

  statsContainer.innerHTML = cards
    .map(
      ([value, label]) => `
        <div class="stat-card">
          <strong>${value}</strong>
          <span>${label}</span>
        </div>`
    )
    .join("");
}

function renderFeatured(writeups) {
  if (!featuredContainer) return;

  featuredContainer.innerHTML = writeups
    .map(
      (writeup) => `
        <article class="writeup-card featured-card">
          <div class="card-topline">
            <span class="eyebrow">${writeup.platform}</span>
            <span class="difficulty-badge">${writeup.difficulty}</span>
          </div>
          <h3>${writeup.title}</h3>
          <p>${writeup.summary}</p>
          <div class="tag-row">
            ${writeup.tools.slice(0, 3).map((tool) => `<span class="tag">${tool}</span>`).join("")}
          </div>
          <a class="text-link" href="writeups.html?entry=${encodeURIComponent(writeup.id)}">
            View in Writeup Vault
          </a>
        </article>`
    )
    .join("");
}

loadHomeData();
