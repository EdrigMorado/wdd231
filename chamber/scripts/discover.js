import { places } from "../data/discover.mjs";

const discoverGrid = document.querySelector("#discoverGrid");
const visitMessage = document.querySelector("#visitMessage");

const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;
const LAST_VISIT_KEY = "chamberDiscoverLastVisit";


function displayPlaces() {
  places.forEach((place) => {
    const card = document.createElement("article");

    card.classList.add(
      "discover-card",
      `${place.id}-card`
    );

    card.innerHTML = `
      <h2>${place.name}</h2>

      <figure>
        <img
          src="images/${place.image}"
          alt="${place.name}"
          width="300"
          height="200"
          loading="lazy"
        >
      </figure>

      <address>
        ${place.address}
      </address>

      <p>
        ${place.description}
      </p>

      <button
        class="learn-more-button"
        type="button"
        data-url="${place.website}"
        aria-label="Learn more about ${place.name}"
      >
        Learn More
      </button>
    `;

    discoverGrid.appendChild(card);
  });
}


function setupLearnMoreButtons() {
  const buttons = document.querySelectorAll(
    ".learn-more-button"
  );

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const website = button.dataset.url;

      if (website) {
        window.open(
          website,
          "_blank",
          "noopener,noreferrer"
        );
      }
    });
  });
}


function displayVisitMessage() {
  const currentVisit = Date.now();

  const previousVisit = localStorage.getItem(
    LAST_VISIT_KEY
  );

  if (!previousVisit) {
    visitMessage.textContent =
      "Welcome! Let us know if you have any questions.";
  } else {
    const timeDifference =
      currentVisit - Number(previousVisit);

    const daysDifference = Math.floor(
      timeDifference / MILLISECONDS_PER_DAY
    );

    if (daysDifference < 1) {
      visitMessage.textContent =
        "Back so soon! Awesome!";
    } else if (daysDifference === 1) {
      visitMessage.textContent =
        "You last visited 1 day ago.";
    } else {
      visitMessage.textContent =
        `You last visited ${daysDifference} days ago.`;
    }
  }

  localStorage.setItem(
    LAST_VISIT_KEY,
    currentVisit
  );
}

displayPlaces();
setupLearnMoreButtons();
displayVisitMessage();