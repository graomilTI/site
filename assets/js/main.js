
document.addEventListener("DOMContentLoaded", function () {
  const links = document.querySelectorAll("nav a");

  // normalize path
  let path = window.location.pathname.toLowerCase();

  // remove trailing slash
  if (path.endsWith("/")) path = path.slice(0, -1);

  // if root, treat as index
  if (path === "" || path === "/") path = "/index.html";

  links.forEach(link => {
    link.classList.remove("active");

    let href = link.getAttribute("href");
    if (!href) return;

    href = href.toLowerCase();

    // normalize
    if (href === "" || href === "/") href = "/index.html";

    // match exact or partial (for safety)
    if (path.endsWith(href) || path.includes(href)) {
      link.classList.add("active");
    }
  });
});
