const menuButton = document.querySelector("#menuButton");
const navList = document.querySelector("#primaryNav ul");

menuButton.addEventListener("click", () => {
  navList.classList.toggle("open");

  const isOpen = navList.classList.contains("open");

  menuButton.textContent = isOpen ? "X" : "☰";
  menuButton.setAttribute("aria-expanded", isOpen);
});