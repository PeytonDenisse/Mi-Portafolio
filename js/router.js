// js/router.js
const routes = {
  '/':          'pages/about.html',
  '/about':     'pages/about.html',
  '/education': 'pages/about.html',
  '/contact':   'pages/about.html',
  '/projects':  'pages/projects.html'
};
// ...
const res404 = await fetch('pages/404.html');

const contentEl = document.getElementById('content');

async function navigate() {
  const hash = location.hash.replace('#', '') || '/';
  const path = routes[hash] || '/pages/404.html';

  try {
    const res = await fetch(path, { cache: 'no-cache' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const html = await res.text();
    contentEl.innerHTML = html;

    // Reinicializa tooltips/modales/carousels de Bootstrap tras inyectar HTML
    if (window.reinitBootstrap) window.reinitBootstrap();

    // Marca activa la opción de la sidebar
    markActive(hash);

    // Scroll al top del contenedor
    contentEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (e) {
    const res404 = await fetch('/pages/404.html');
    contentEl.innerHTML = await res404.text();
    if (window.reinitBootstrap) window.reinitBootstrap();
    markActive(null);
  }
}

function markActive(hash) {
  const links = document.querySelectorAll('aside nav a');
  links.forEach(a => {
    const href = a.getAttribute('href');       // p.ej. "#/about"
    const route = href ? href.replace('#','') : '';
    a.classList.toggle('btn-primary', route === hash);
    a.classList.toggle('btn-light', route !== hash);
  });
}

window.addEventListener('hashchange', navigate);
window.addEventListener('DOMContentLoaded', navigate);
