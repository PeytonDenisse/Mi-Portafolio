document.addEventListener('DOMContentLoaded', function() {
    const habilidadesButton = document.querySelector('[data-bs-target="#habilidades"]');
    const iconoHabilidades = document.getElementById('icono-habilidades');

    habilidadesButton.addEventListener('click', () => {
        // Cambia el ícono dependiendo del estado
        if (habilidadesButton.getAttribute('aria-expanded') === 'true') {
            iconoHabilidades.classList.remove('bi-dash');
            iconoHabilidades.classList.add('bi-plus');
        } else {
            iconoHabilidades.classList.remove('bi-plus');
            iconoHabilidades.classList.add('bi-dash');
        }
    });
});