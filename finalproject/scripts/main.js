import { siteConfig } from "./site-config.js";

const menuButton = document.querySelector("#menu-button");
const navigation = document.querySelector("#primary-nav");
const yearElements = document.querySelectorAll("[data-current-year]");
const videoLinks = document.querySelectorAll("[data-video-link]");

if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menuButton.setAttribute("aria-label", !isOpen ? "Close navigation menu" : "Open navigation menu");
    navigation.classList.toggle("nav-open", !isOpen);
  });

  navigation.addEventListener("click", (event) => {
    if (event.target.matches("a")) {
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation menu");
      navigation.classList.remove("nav-open");
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation menu");
      navigation.classList.remove("nav-open");
      menuButton.focus();
    }
  });
}

yearElements.forEach((element) => {
  element.textContent = new Date().getFullYear();
});

videoLinks.forEach((link) => {
  if (siteConfig.projectVideoUrl) {
    link.href = siteConfig.projectVideoUrl;
    link.target = "_blank";
    link.rel = "noopener";
  } else {
    link.href = "#";
    link.textContent = "Project Video";
    link.setAttribute("aria-disabled", "true");
    link.addEventListener("click", (event) => event.preventDefault());
  }
});
