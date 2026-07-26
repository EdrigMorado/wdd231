const timestampField = document.querySelector("#timestamp");
const modalLinks = document.querySelectorAll("[data-modal]");
const membershipDialogs = document.querySelectorAll(
  ".membership-modal"
);

if (timestampField) {
  timestampField.value = new Date().toISOString();
}

modalLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();

    const modalId = link.dataset.modal;
    const selectedDialog = document.querySelector(
      `#${modalId}`
    );

    if (selectedDialog) {
      selectedDialog.showModal();
    }
  });
});

membershipDialogs.forEach((dialog) => {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });
});