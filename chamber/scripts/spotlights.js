const spotlightsContainer = document.querySelector("#spotlights");
const membersDataUrl = "data/members.json";

function getSpotlightMembership(level) {
  return level === 3 ? "Gold Member" : "Silver Member";
}

function shuffleMembers(members) {
  return [...members].sort(() => Math.random() - 0.5);
}

function displaySpotlights(members) {
  spotlightsContainer.innerHTML = "";

  members.forEach((member) => {
    const card = document.createElement("article");
    card.classList.add("spotlight-card", `level-${member.membershipLevel}`);

    const phoneLink = member.phone.replaceAll(" ", "");

    card.innerHTML = `
      <img
        src="images/${member.image}"
        alt="${member.name} company image"
        width="640"
        height="360"
        loading="lazy"
      >
      <div class="spotlight-content">
        <div class="spotlight-title-row">
          <h3>${member.name}</h3>
          <span class="membership-badge">
            ${getSpotlightMembership(member.membershipLevel)}
          </span>
        </div>
        <address>${member.address}</address>
        <p>
          <strong>Phone:</strong>
          <a href="tel:${phoneLink}">${member.phone}</a>
        </p>
        <p>
          <strong>Website:</strong>
          <a
            href="${member.website}"
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit website
          </a>
        </p>
      </div>`;

    spotlightsContainer.appendChild(card);
  });
}

async function getSpotlights() {
  try {
    const response = await fetch(membersDataUrl);

    if (!response.ok) {
      throw new Error("The member spotlight data could not be loaded.");
    }

    const data = await response.json();
    const eligibleMembers = data.members.filter(
      (member) => member.membershipLevel === 2 || member.membershipLevel === 3
    );

    const selectedMembers = shuffleMembers(eligibleMembers).slice(0, 3);
    displaySpotlights(selectedMembers);
  } catch (error) {
    spotlightsContainer.innerHTML = `
      <p class="error-message">
        Member spotlights are temporarily unavailable.
      </p>`;

    console.error(error);
  }
}

getSpotlights();
