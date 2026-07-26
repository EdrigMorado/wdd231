const timestampField = document.querySelector("#timestamp");

const modalLinks = document.querySelectorAll(
  "[data-modal]"
);

const membershipDialogs = document.querySelectorAll(
  ".membership-modal"
);

const closeButtons = document.querySelectorAll(
  ".modal-close"
);

/* Store the date and time when the page loads. */
if (timestampField) {
  timestampField.value = new Date().toISOString();
}

/* Open the selected membership modal. */
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

/* Close a modal with its Close button. */
closeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const dialog = button.closest("dialog");

    if (dialog) {
      dialog.close();
    }
  });
});

/* Close a modal by clicking its backdrop. */
membershipDialogs.forEach((dialog) => {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });
});