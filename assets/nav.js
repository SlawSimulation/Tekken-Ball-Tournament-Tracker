// Injects nav.html into an element with id="navbar"
function loadNav() {
  const navContainer = document.getElementById("navbar");
  if (!navContainer) return;

  // Adjust path depending on current page depth
  let pathToNav = "../../assets/nav.html"; // default assumption

  if (location.pathname.includes("/pages/")) {
    pathToNav = "../../assets/nav.html";
  } else if (location.pathname.includes("/auth/")) {
    pathToNav = "../assets/nav.html";
  } else {
    pathToNav = "assets/nav.html";
  }

  fetch(pathToNav)
    .then(res => res.text())
    .then(data => {
      // Adjust internal links based on depth
      const depthFix = location.pathname.includes("/assets/pages/") ? "" : "assets/pages/";
      data = data.replace(/href="(.*?)"/g, (match, href) => {
        if (href.startsWith("http") || href.startsWith("#")) return match;
        return `href="${depthFix}${href}"`;
      });
      navContainer.innerHTML = data;
    });
}

document.addEventListener("DOMContentLoaded", loadNav);
