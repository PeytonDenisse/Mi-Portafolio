// js/router.js
const routes = {
  "/":          "pages/about.html",
  "/about":     "pages/about.html",
  "/skills":    "pages/skills.html",
  "/projects":  "pages/projects.html",
  "/education": "pages/about.html",  // si lo muestras en la misma página que about
  "/contact":   "pages/about.html"   // idem
};

const contentEl = document.getElementById("content");

// Resuelve siempre relativo al index (funciona en GitHub Pages)
function resolve(path) {
  return new URL(path, document.baseURI).toString();
}

function markActive(hash) {
  const links = document.querySelectorAll("aside nav a");
  links.forEach(a => {
    const route = (a.getAttribute("href") || "").replace("#", "");
    const isActive = route === hash || (hash === "/" && route === "/about");
    a.classList.toggle("active", isActive);
    a.classList.toggle("btn-primary", isActive);
  });
}

function scrollToSectionIfNeeded(hash) {
  const id = hash === "/education" ? "education"
          : hash === "/contact"    ? "contact"
          : (hash === "/" || hash === "/about") ? "about"
          : null;
  if (id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

async function navigate() {
  const hash = (location.hash || "#/").replace("#", "");
  const page = routes[hash] || "pages/404.html";

  try {
    const res = await fetch(resolve(page), { cache: "no-cache" });
    if (!res.ok) throw new Error("HTTP " + res.status + " for " + page);
    contentEl.innerHTML = await res.text();

    window.reinitBootstrap?.();   // tooltips/modales si lo usas
    markActive(hash);
    scrollToSectionIfNeeded(hash);
  } catch (err) {
    console.error("[Router] Error:", err);
    const r404 = await fetch(resolve("pages/404.html"));
    contentEl.innerHTML = await r404.text();
    markActive(null);
  }
}

window.addEventListener("hashchange", navigate);
window.addEventListener("DOMContentLoaded", navigate);
