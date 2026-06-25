// Marca activa en quick-nav al hacer scroll
document.addEventListener("DOMContentLoaded", () => {
  const links = [...document.querySelectorAll(".quick-link")];
  const sections = links
    .map(a => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  const setActive = (id) => {
    links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === `#${id}`));
  };

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  }, { rootMargin: "-40% 0px -55% 0px", threshold: 0.01 });

  sections.forEach(sec => io.observe(sec));
});

// Activa tooltips de Bootstrap (espera a que Bootstrap esté cargado)
window.addEventListener("load", () => {
  const triggers = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  [...triggers].forEach(el => new bootstrap.Tooltip(el));
});

document.addEventListener('DOMContentLoaded', () => {
  const chips = document.querySelectorAll('.filter-chip');
  const items = document.querySelectorAll('.project-item');

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const filter = chip.dataset.filter;
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      items.forEach(it => {
        const techs = it.dataset.tech.toLowerCase();
        const show = (filter === 'all') || techs.includes(filter);
        it.style.display = show ? '' : 'none';
      });
    });
  });
});

// Inicializa animaciones de aparición al hacer scroll (Scroll Reveal)
window.initScrollReveal = () => {
  const revealElements = document.querySelectorAll(".reveal");
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal-active");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.05,
    rootMargin: "0px 0px -50px 0px"
  });

  revealElements.forEach(el => observer.observe(el));
};

// Ejecuta al cargar el DOM inicial
document.addEventListener("DOMContentLoaded", () => {
  window.initScrollReveal();
});


