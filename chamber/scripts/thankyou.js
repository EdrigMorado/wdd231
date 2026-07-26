const submissionDetails = document.querySelector(
  "#submissionDetails"
);

const parameters = new URLSearchParams(
  window.location.search
);

function getParameter(name) {
  return parameters.get(name) || "Not provided";
}

function formatTimestamp(timestamp) {
  if (!timestamp || timestamp === "Not provided") {
    return "Not provided";
  }

  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return timestamp;
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeStyle: "short"
  }).format(date);
}

function addSubmissionDetail(label, value) {
  const detailGroup = document.createElement("div");
  detailGroup.classList.add("submission-detail");

  const term = document.createElement("dt");
  term.textContent = label;

  const description = document.createElement("dd");
  description.textContent = value;

  detailGroup.appendChild(term);
  detailGroup.appendChild(description);
  submissionDetails.appendChild(detailGroup);
}

if (submissionDetails) {
  addSubmissionDetail(
    "First Name",
    getParameter("firstName")
  );

  addSubmissionDetail(
    "Last Name",
    getParameter("lastName")
  );

  addSubmissionDetail(
    "Email Address",
    getParameter("email")
  );

  addSubmissionDetail(
    "Mobile Phone",
    getParameter("phone")
  );

  addSubmissionDetail(
    "Business or Organization",
    getParameter("organization")
  );

  addSubmissionDetail(
    "Application Date",
    formatTimestamp(getParameter("timestamp"))
  );
}