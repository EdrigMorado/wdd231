const responseContainer = document.querySelector("#response-data");
const params = new URLSearchParams(window.location.search);

const fields = [
  ["Name", params.get("name")],
  ["Email", params.get("email")],
  ["Reason for contacting", params.get("reason")],
  ["Message", params.get("message")]
];

fields.forEach(([label, value]) => {
  const wrapper = document.createElement("div");
  const term = document.createElement("dt");
  const description = document.createElement("dd");

  term.textContent = label;
  description.textContent = value || "Not provided";

  wrapper.append(term, description);
  responseContainer.append(wrapper);
});
