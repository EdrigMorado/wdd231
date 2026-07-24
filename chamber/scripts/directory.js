const membersContainer = document.querySelector("#members");
const gridButton = document.querySelector("#gridButton");
const listButton = document.querySelector("#listButton");
const membersUrl = "data/members.json";

async function getMembers() {
  try {
    const response = await fetch(membersUrl);

    if (!response.ok) {
      throw new Error("The member data file could not be loaded.");
    }

    const data = await response.json();
    displayMembers(data.members);
  } catch (error) {
    membersContainer.innerHTML = `
      <p class="error-message">
        An error occurred while loading the directory. Check the console and make sure you are using Live Server.
      </p>`;
    console.error(error);
  }
}

function getMembershipName(level) {
  if (level === 3) {
    return "Gold Member";
  }

  if (level === 2) {
    return "Silver Member";
  }

  return "Member";
}

function displayMembers(members) {
  membersContainer.innerHTML = "";

  members.forEach((member) => {
    const card = document.createElement("article");
    card.classList.add("member-card", `level-${member.membershipLevel}`);

    const phoneLink = member.phone.replaceAll(" ", "");

    card.innerHTML = `
      <img src="images/${member.image}" alt="Representative image for ${member.name}" width="640" height="360" loading="lazy">
      <div class="member-content">
        <div class="member-heading">
          <p class="member-category">${member.category}</p>
          <h3>${member.name}</h3>
          <span class="membership-badge">${getMembershipName(member.membershipLevel)}</span>
        </div>
        <p class="member-description">${member.description}</p>
        <address>${member.address}</address>
        <p><strong>Phone:</strong> <a href="tel:${phoneLink}">${member.phone}</a></p>
        <p><strong>Website:</strong> <a href="${member.website}" target="_blank" rel="noopener">Visit website</a></p>
      </div>`;

    membersContainer.appendChild(card);
  });
}

function changeView(view) {
  const isGrid = view === "grid";

  membersContainer.classList.toggle("grid", isGrid);
  membersContainer.classList.toggle("list", !isGrid);
  gridButton.classList.toggle("active", isGrid);
  listButton.classList.toggle("active", !isGrid);
  gridButton.setAttribute("aria-pressed", isGrid);
  listButton.setAttribute("aria-pressed", !isGrid);
}

gridButton.addEventListener("click", () => changeView("grid"));
listButton.addEventListener("click", () => changeView("list"));

getMembers();