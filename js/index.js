const SECTION_IDS = [
  "sobre-mi",
  "tecnologias",
  "proyectos",
  "experiencia",
  "certificaciones"
];

const LEGACY_HASHES = {
  "#/": "#sobre-mi",
  "#/about": "#sobre-mi",
  "#/skills": "#tecnologias",
  "#/projects": "#proyectos",
  "#/education": "#sobre-mi",
  "#/contact": "#sobre-mi"
};

const escapeHtml = (value) => String(value ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

const mediaToAttribute = (gallery = []) => gallery.filter(Boolean).join("|");

const getMainScroller = () => document.querySelector(".portfolio-main");

const usesMainScroller = () => window.matchMedia("(min-width: 992px)").matches;

const getObserverRoot = () => usesMainScroller() ? getMainScroller() : null;

function scrollSectionIntoView(target) {
  target.scrollIntoView({ behavior: "smooth", block: "start" });
}

function setActiveSection(id) {
  document.querySelectorAll(".section-nav a").forEach((link) => {
    const isActive = link.getAttribute("href") === `#${id}`;
    link.classList.toggle("active", isActive);
    link.classList.toggle("btn-primary", isActive);
    link.classList.toggle("btn-light", !isActive);

    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function normalizeLegacyHash() {
  const current = window.location.hash;
  const normalized = LEGACY_HASHES[current];

  if (!normalized) return false;

  history.replaceState(null, "", normalized);
  return true;
}

function scrollToHashTarget() {
  const id = window.location.hash.replace("#", "");
  if (!id || !SECTION_IDS.includes(id)) return;

  const target = document.getElementById(id);
  if (!target) return;

  scrollSectionIntoView(target);
  setActiveSection(id);
}

function createProjectCard(project, index) {
  const media = mediaToAttribute(project.galeria);
  const techBadges = project.tecnologias
    .map((tech) => `<span class="badge bg-secondary">${escapeHtml(tech)}</span>`)
    .join("");

  const repoLink = project.repositorio ? `
    <a class="btn btn-sm btn-outline-secondary" href="${escapeHtml(project.repositorio)}" target="_blank" rel="noopener">
      <i class="bi bi-github me-1"></i> C&oacute;digo
    </a>
  ` : "";

  const demoLink = project.demostracion ? `
    <a class="btn btn-sm btn-outline-primary" href="${escapeHtml(project.demostracion)}" target="_blank" rel="noopener">
      <i class="bi bi-globe me-1"></i> Sitio Web
    </a>
  ` : "";

  const docsLink = project.documentacion ? `
    <a class="btn btn-sm btn-outline-info" href="${escapeHtml(project.documentacion)}" target="_blank" rel="noopener">
      <i class="bi bi-file-earmark-code me-1"></i> API
    </a>
  ` : "";

  const galleryButton = media ? `
    <button type="button" class="btn btn-sm btn-outline-primary"
            data-bs-toggle="modal" data-bs-target="#galleryModal"
            data-title="${escapeHtml(project.nombre)}"
            data-media="${escapeHtml(media)}">
      <i class="bi bi-images me-1"></i> Galer&iacute;a
    </button>
  ` : "";

  return `
    <div class="col-12 col-md-6 col-xl-4 reveal reveal-delay-${(index % 4) + 1}">
      <article class="project-grid-card">
        <div class="project-img-wrapper">
          <img src="${escapeHtml(project.imagenPrincipal)}" alt="${escapeHtml(project.nombre)}">
        </div>
        <div class="project-card-body">
          <div class="d-flex align-items-start justify-content-between gap-2">
            <div>
              <h4 class="project-card-title">${escapeHtml(project.nombre)}</h4>
              <p class="project-card-subtitle">${escapeHtml(project.descripcionCorta)}</p>
            </div>
            ${project.estado ? `<span class="badge rounded-pill text-bg-light border">${escapeHtml(project.estado)}</span>` : ""}
          </div>
          <p class="project-card-desc">${escapeHtml(project.descripcionCompleta)}</p>
          <div class="d-flex flex-wrap gap-1 mb-2">${techBadges}</div>
          <div class="project-card-footer">
            ${repoLink}
            ${demoLink}
            ${docsLink}
            ${galleryButton}
          </div>
        </div>
      </article>
    </div>
  `;
}

function renderProjects() {
  const projects = [...(window.PORTFOLIO_PROJECTS || [])]
    .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));

  const featuredContainer = document.getElementById("featured-projects");
  const otherContainer = document.getElementById("other-projects");
  if (!featuredContainer || !otherContainer) return;

  const featured = projects.filter((project) => project.destacado);
  const others = projects.filter((project) => !project.destacado);

  featuredContainer.innerHTML = featured.map(createProjectCard).join("");
  otherContainer.innerHTML = others.map(createProjectCard).join("");
}

function renderTechnologies() {
  const container = document.getElementById("technologies-grid");
  if (!container) return;

  const groups = window.PORTFOLIO_TECHNOLOGIES || [];
  container.innerHTML = groups.map((group) => `
    <section class="tech-category mb-4" aria-label="${escapeHtml(group.title)}">
      <h3 class="fw-semibold h6 mb-2">${escapeHtml(group.title)}</h3>
      <div class="d-flex flex-wrap gap-2">
        ${(group.items || []).map((item) => `
          <span class="pill pill-icon">
            <i class="${escapeHtml(item.icon)}" aria-hidden="true"></i>
            <span class="label">${escapeHtml(item.name)}</span>
          </span>
        `).join("")}
      </div>
    </section>
  `).join("");
}

function createExperienceCard(experience, index) {
  const contributions = (experience.contributions || [])
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");
  const skills = (experience.skills || [])
    .map((skill) => `<span class="pill">${escapeHtml(skill)}</span>`)
    .join("");

  return `
    <div class="col-12 col-xl-6 reveal reveal-delay-${(index % 4) + 1}">
      <article class="mini-card experience-card h-100">
        <p class="text-muted small mb-1">${escapeHtml(experience.type)}</p>
        <h3 class="h6 mb-2">${escapeHtml(experience.title)}</h3>
        <p class="text-muted small mb-3">${escapeHtml(experience.description)}</p>
        ${contributions ? `<ul class="experience-list small mb-3">${contributions}</ul>` : ""}
        ${skills ? `<div class="d-flex flex-wrap gap-2 pills-solid">${skills}</div>` : ""}
      </article>
    </div>
  `;
}

function renderExperiences() {
  const container = document.getElementById("experiences-list");
  if (!container) return;

  container.innerHTML = (window.PORTFOLIO_EXPERIENCES || [])
    .map(createExperienceCard)
    .join("");
}

function createCertificationCard(item, index) {
  const meta = [item.issuer, item.date].filter(Boolean).join(" - ");
  const action = item.modalTarget ? `
    <button class="btn btn-sm btn-outline-primary" data-bs-toggle="modal" data-bs-target="${escapeHtml(item.modalTarget)}">
      Ver certificado
    </button>
  ` : "";

  return `
    <div class="col-12 col-md-6 reveal reveal-delay-${(index % 4) + 1}">
      <article class="border rounded p-3 h-100 certification-card">
        <h3 class="h6 mb-1">${escapeHtml(item.title)}</h3>
        ${meta ? `<p class="text-muted small mb-1">${escapeHtml(meta)}</p>` : ""}
        <p class="text-muted small mb-2">${escapeHtml(item.description)}</p>
        ${action}
      </article>
    </div>
  `;
}

function renderCertifications() {
  const certificationsContainer = document.getElementById("certifications-list");
  const recognitionsContainer = document.getElementById("recognitions-list");
  if (!certificationsContainer || !recognitionsContainer) return;

  const items = window.PORTFOLIO_CERTIFICATIONS || [];
  certificationsContainer.innerHTML = items
    .filter((item) => item.group === "certification")
    .map(createCertificationCard)
    .join("");
  recognitionsContainer.innerHTML = items
    .filter((item) => item.group === "recognition")
    .map(createCertificationCard)
    .join("");
}

function initSmoothNavigation() {
  document.querySelectorAll(".section-nav a[href^='#']").forEach((link) => {
    link.addEventListener("click", (event) => {
      const id = link.getAttribute("href").slice(1);
      const target = document.getElementById(id);
      if (!target) return;

      event.preventDefault();
      history.pushState(null, "", `#${id}`);
      scrollSectionIntoView(target);
      setActiveSection(id);
    });
  });

  window.addEventListener("hashchange", () => {
    if (normalizeLegacyHash()) {
      scrollToHashTarget();
      return;
    }
    scrollToHashTarget();
  });
}

function initScrollSpy() {
  const sections = SECTION_IDS
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  const scrollRoot = getObserverRoot();

  if (!("IntersectionObserver" in window)) {
    setActiveSection(SECTION_IDS[0]);
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    const visibleEntries = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

    if (visibleEntries[0]) {
      setActiveSection(visibleEntries[0].target.id);
    }
  }, {
    root: scrollRoot,
    threshold: [0.15, 0.3, 0.55],
    rootMargin: "-20% 0px -55% 0px"
  });

  sections.forEach((section) => observer.observe(section));

  const scrollTarget = scrollRoot || window;
  scrollTarget.addEventListener("scroll", () => {
    const nearBottom = scrollRoot
      ? scrollRoot.scrollTop + scrollRoot.clientHeight >= scrollRoot.scrollHeight - 8
      : window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8;

    if (nearBottom) setActiveSection(SECTION_IDS[SECTION_IDS.length - 1]);
  }, { passive: true });
}

window.initScrollReveal = () => {
  const revealElements = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("reveal-active"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal-active");
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: getObserverRoot(),
    threshold: 0.05,
    rootMargin: "0px 0px -50px 0px"
  });

  revealElements.forEach((element) => observer.observe(element));
};

function initBootstrapTooltips() {
  document.querySelectorAll("[data-bs-toggle='tooltip']").forEach((element) => {
    bootstrap.Tooltip.getOrCreateInstance(element);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderProjects();
  renderTechnologies();
  renderExperiences();
  renderCertifications();
  normalizeLegacyHash();
  initSmoothNavigation();
  initScrollSpy();
  initScrollReveal();
  initBootstrapTooltips();
  scrollToHashTarget();
});
