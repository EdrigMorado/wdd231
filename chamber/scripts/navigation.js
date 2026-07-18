const menuButton = document.querySelector("#menuButton");
const primaryNav = document.querySelector("#primaryNav");

menuButton.addEventListener("click", () => {
  const isOpen = primaryNav.classList.toggle("open");

  menuButton.setAttribute("aria-expanded", isOpen);
  menuButton.setAttribute(
    "aria-label",
    isOpen ? "Close navigation menu" : "Open navigation menu"
  );
  menuButton.textContent = isOpen ? "✕" : "☰";
});

primaryNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    primaryNav.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation menu");
    menuButton.textContent = "☰";
  });
});
