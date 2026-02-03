// ./js/gallery.js
(function () {
  const toYouTubeEmbed = (url) => {
    try {
      const u = new URL(url);
      if (u.hostname.includes("youtu.be")) {
        const id = u.pathname.replace("/", "");
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }
      if (u.hostname.includes("youtube.com")) {
        const id = u.searchParams.get("v");
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }
      return null;
    } catch {
      return null;
    }
  };

  const createSlide = (html, isActive) => {
    const div = document.createElement("div");
    div.className = `carousel-item${isActive ? " active" : ""}`;
    div.innerHTML = html;
    return div;
  };

  const createImageHTML = (src) => `
    <img src="${src}" class="d-block w-100 rounded"
         alt="Captura del proyecto"
         style="max-height: 520px; object-fit: contain; background: rgba(0,0,0,.04);">
  `;

  const createYouTubeHTML = (url) => {
    const embed = toYouTubeEmbed(url);
    if (!embed) {
      return `<div class="p-4 text-center text-muted">Video de YouTube no válido.</div>`;
    }
    return `
      <div class="ratio ratio-16x9 rounded overflow-hidden" style="background: rgba(0,0,0,.04);">
        <iframe src="${embed}" title="Video demo"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen></iframe>
      </div>
    `;
  };

  const createMP4HTML = (src) => `
    <video class="w-100 rounded" controls preload="metadata"
           style="max-height: 520px; background: rgba(0,0,0,.04);">
      <source src="${src}" type="video/mp4">
      Tu navegador no soporta video HTML5.
    </video>
  `;

  const stopAllMedia = (modalEl) => {
    modalEl.querySelectorAll("video").forEach(v => {
      try { v.pause(); v.currentTime = 0; } catch {}
    });
    modalEl.querySelectorAll("iframe").forEach(frame => {
      const src = frame.getAttribute("src");
      frame.setAttribute("src", src);
    });
  };

  // ✅ Esta función se puede llamar cuando el modal ya exista
  const initForModal = (modalEl) => {
    if (modalEl.__galleryInitialized) return; // evita duplicar eventos
    modalEl.__galleryInitialized = true;

    const titleEl = modalEl.querySelector("#galleryModalTitle");
    const innerEl = modalEl.querySelector("#galleryCarouselInner");
    const carouselEl = modalEl.querySelector("#galleryCarousel");

    modalEl.addEventListener("hidden.bs.modal", () => {
      stopAllMedia(modalEl);
      innerEl.innerHTML = "";
    });

    carouselEl.addEventListener("slide.bs.carousel", () => {
      stopAllMedia(modalEl);
    });

    modalEl.addEventListener("show.bs.modal", (event) => {
      const btn = event.relatedTarget;
      if (!btn) return;

      const title = btn.getAttribute("data-title") || "Galería";
      const mediaStr = (btn.getAttribute("data-media") || "").trim();

      titleEl.textContent = title;
      innerEl.innerHTML = "";

      if (!mediaStr) {
        innerEl.appendChild(createSlide(`<div class="p-4 text-center text-muted">No hay elementos configurados.</div>`, true));
        return;
      }

      // ✅ Permite que pongas SOLO rutas y detecta por extensión
      const rawItems = mediaStr.split("|").map(s => s.trim()).filter(Boolean);

      const items = rawItems.map(item => {
        // 1. Limpiamos cualquier espacio rebelde de nuevo
        const cleanItem = item.trim(); 
        
        if (cleanItem.includes(":")) return cleanItem;

        const lower = cleanItem.toLowerCase();
        // 2. Usamos regex más flexible para las extensiones
        if (lower.endsWith(".mp4")) return `mp4:${cleanItem}`;
        if (/\.(png|jpg|jpeg|webp|gif)$/i.test(lower)) return `img:${cleanItem}`;
        
        return cleanItem;
      });

      items.forEach((item, idx) => {
        const isActive = idx === 0;

        const parts = item.split(":");
        const type = parts[0];
        const value = parts.slice(1).join(":"); // por si URL tiene ":"

        let html = "";
        if (type === "img") html = createImageHTML(value);
        else if (type === "mp4") html = createMP4HTML(value);
        else if (type === "yt") html = createYouTubeHTML(value);
        else html = `<div class="p-4 text-center text-muted">Tipo no soportado: ${item}</div>`;

        innerEl.appendChild(createSlide(html, isActive));
      });

      const instance = bootstrap.Carousel.getOrCreateInstance(carouselEl, { interval: false, ride: false });
      instance.to(0);
    });
  };

  // ✅ Observa el DOM hasta que aparezca el modal (porque tu router lo inyecta)
  const observer = new MutationObserver(() => {
    const modalEl = document.getElementById("galleryModal");
    if (modalEl) {
      initForModal(modalEl);
      observer.disconnect();
    }
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });

  // Por si ya existe desde el inicio:
  const existing = document.getElementById("galleryModal");
  if (existing) initForModal(existing);
})();
