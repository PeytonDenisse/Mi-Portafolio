// js/bootstrap-init.js
window.reinitBootstrap = function () {
  // Tooltips
  document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => {
    new bootstrap.Tooltip(el);
  });

  // Carruseles manuales (si los usas en parciales)
  document.querySelectorAll('.carousel').forEach(el => {
    // Evita duplicar instancias
    if (!bootstrap.Carousel.getInstance(el)) {
      new bootstrap.Carousel(el, { interval: false, ride: false });
    }
  });

  // Modales si se definen dentro de parciales
  document.querySelectorAll('.modal').forEach(el => {
    if (!bootstrap.Modal.getInstance(el)) {
      new bootstrap.Modal(el, { backdrop: 'static', keyboard: true });
    }
  });
};
