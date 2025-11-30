/* ============================================================
   HELPERS
============================================================ */
const $ = (id) => document.getElementById(id);
const exists = (id) => document.getElementById(id) !== null;

/* ============================================================
   OVERLAY INCIDENTES
============================================================ */
const overlayIncidentes = $("overlayIncidentes");

if(overlayIncidentes) {
    document.querySelectorAll(".bubble-trigger").forEach(b => {
      b.addEventListener("click", () => {
        overlayIncidentes.classList.remove("hidden");
      });
    });

    if($("closeOverlay")){
        $("closeOverlay").addEventListener("click", () => {
          overlayIncidentes.classList.add("hidden");
        });
    }
}

/* ============================================================
   MODO TRAYECTO — ACORDEÓN
============================================================ */
const trayToggle = $("trayectoToggle");
const trayContent = $("trayectoContent");

if(trayToggle && trayContent){
    trayToggle.onclick = () => {
      trayContent.style.maxHeight
        ? trayContent.style.maxHeight = null
        : trayContent.style.maxHeight = trayContent.scrollHeight + "px";
    };
}

/* ============================================================
   BUSCADOR Y DROPDOWN
============================================================ */
const searchInput = $("searchInput");
const searchDropdown = $("searchDropdown");

if(searchInput && searchDropdown){
    // Mostrar dropdown al enfocar busqueda
    searchInput.addEventListener("focus", () => {
      searchDropdown.classList.remove("hidden");
    });

    // Ocultar si se hace click afuera
    document.addEventListener("click", (e) => {
      if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
        searchDropdown.classList.add("hidden");
      }
    });
}

/* ============================================================
   DROPDOWNS — ACORDEÓN REAL (uno a la vez)
============================================================ */
document.querySelectorAll(".dropdown-group").forEach(group => {
  const header = group.querySelector(".filter-category-header");

  if(header){
      header.addEventListener("click", () => {
        // Cierra los otros
        document.querySelectorAll(".dropdown-group").forEach(g => {
          if (g !== group) g.classList.remove("open");
        });

        // Alternar el actual
        group.classList.toggle("open");
      });
  }
});

/* ============================================================
   TAGS EN PÍLDORAS
============================================================ */
const activeFiltersContainer = $("activeFilters");

function addPill(value) {
  if(!activeFiltersContainer) return;
  if (activeFiltersContainer.querySelector(`[data-pill="${value}"]`)) return;

  const pill = document.createElement("div");
  pill.classList.add("filter-pill");
  pill.dataset.pill = value;
  pill.innerHTML = `${value} <span class="remove">✕</span>`;

  pill.querySelector(".remove").onclick = () => {
    pill.remove();
    document.querySelector(`.filter-option[data-value="${value}"]`)
      ?.classList.remove("selected");
  };

  activeFiltersContainer.appendChild(pill);
}

document.querySelectorAll(".filter-option").forEach(option => {
  option.addEventListener("click", () => {
    const value = option.dataset.value;

    if (option.classList.contains("selected")) {
      option.classList.remove("selected");
      document.querySelector(`[data-pill="${value}"]`)?.remove();
    } else {
      option.classList.add("selected");
      addPill(value);
    }
  });
});

/* ============================================================
   PUBLICACIONES DE EJEMPLO
============================================================ */
const publicaciones = [
  {
    id: 1,
    titulo: "Asalto en micro",
    ubicacion: "Callao",
    fecha: "2025-06-13",
    fechaTexto: "13/junio/2025",
    intensidad: 5,
    sospechoso: false,
    imgs: [
      "assets/images/asalto1.png",
      "assets/images/asalto1.png"
    ]
  },
  {
    id: 2,
    titulo: "Robo a mano armada",
    ubicacion: "La Victoria",
    fecha: "2025-06-12",
    fechaTexto: "12/junio/2025",
    intensidad: 9,
    sospechoso: true,
    imgs: [
      "assets/images/Robo1.png",
      "assets/images/Robo1.png",
      "assets/images/Robo1.png"
    ]
  },
  {
    id: 3,
    titulo: "Robo en estacionamiento",
    ubicacion: "Miraflores",
    fecha: "2025-05-30",
    fechaTexto: "30/mayo/2025",
    intensidad: 2,
    sospechoso: false,
    imgs: [
      "assets/images/Robo3.png"
    ]
  }
];

const cardsContainer = $("cardsContainer");

/* ============================================================
   RENDERIZAR PUBLICACIONES
============================================================ */
function renderPublicaciones(lista) {
  if(!cardsContainer) return;
  cardsContainer.innerHTML = "";

  lista.forEach(pub => {
    const card = document.createElement("div");
    card.classList.add("incident-card");

    card.innerHTML = `
      <div class="incident-top">
        <h3>${pub.titulo}</h3>
        <button class="sospechoso-btn" data-id="${pub.id}">
          ${pub.sospechoso ? "Sospechoso" : "Marcar sospechoso"}
        </button>
      </div>

      <p><strong>Ubicación:</strong> ${pub.ubicacion}</p>
      <p><strong>Fecha:</strong> ${pub.fechaTexto}</p>

      <div class="card-slider" data-id="${pub.id}">
        <img src="${pub.imgs[0]}" class="slider-img">
        <button class="prev">‹</button>
        <button class="next">›</button>
      </div>

      <button class="ver-detalles-btn" data-id="${pub.id}">
        Ver detalles
      </button>
    `;

    cardsContainer.appendChild(card);
  });

  initSliders();
  initDetalles();
  initSospechoso();
}

renderPublicaciones(publicaciones);

/* ============================================================
   SLIDERS
============================================================ */
function initSliders() {
  document.querySelectorAll(".card-slider").forEach(slider => {
    let index = 0;
    const id = slider.dataset.id;
    const pub = publicaciones.find(p => p.id == id);
    const img = slider.querySelector(".slider-img");

    slider.querySelector(".prev").onclick = () => {
      index = (index - 1 + pub.imgs.length) % pub.imgs.length;
      img.src = pub.imgs[index];
    };

    slider.querySelector(".next").onclick = () => {
      index = (index + 1) % pub.imgs.length;
      img.src = pub.imgs[index];
    };
  });
}

/* ============================================================
   VER DETALLES
============================================================ */
const overlayDetalles = $("overlayDetalles");
const detalleContenido = $("detalleContenido");

if($("closeDetalles") && overlayDetalles) {
    $("closeDetalles").onclick = () =>
      overlayDetalles.classList.add("hidden");
}

function initDetalles() {
  document.querySelectorAll(".ver-detalles-btn").forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.id;
      const pub = publicaciones.find(p => p.id == id);

      detalleContenido.innerHTML = `
        <h2>${pub.titulo}</h2>
        <p><strong>Ubicación:</strong> ${pub.ubicacion}</p>
        <p><strong>Fecha:</strong> ${pub.fechaTexto}</p>
        <img class="detalle-img" src="${pub.imgs[0]}">
        <p><strong>Intensidad:</strong> ${pub.intensidad}</p>
      `;

      overlayDetalles.classList.remove("hidden");
    };
  });
}

/* ============================================================
   SOSPECHOSO — BOTÓN + TOAST
============================================================ */
function initSospechoso() {
  document.querySelectorAll(".sospechoso-btn").forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.id;
      const pub = publicaciones.find(p => p.id == id);

      showToast("Reporte enviado como sospechoso");

      pub.sospechoso = true;
      btn.innerText = "Sospechoso";
      btn.style.background = "#ffeaea";
      btn.style.color = "#b40000";
    };
  });
}

function showToast(msg) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.classList.add("toast");
    document.body.appendChild(toast);
  }

  toast.innerText = msg;
  toast.classList.add("show");

  setTimeout(() => toast.classList.remove("show"), 2500);
}

/* ============================================================
   ORDENAR PUBLICACIONES
============================================================ */
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const tipo = btn.dataset.sort;
    let lista = [...publicaciones];

    if (tipo === "recientes")
      lista.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    if (tipo === "intensidad")
      lista.sort((a, b) => b.intensidad - a.intensidad);

    if (tipo === "orden")
      lista.sort((a, b) => a.titulo.localeCompare(b.titulo));

    renderPublicaciones(lista);
  });
});

/* ============================================================
   ZOOM INTELIGENTE
============================================================ */
const zoomWrapper = $("mapZoomWrapper");

if(zoomWrapper) {
    let scale = 1;
    const maxScale = 3;
    const minScale = 0.8;

    zoomWrapper.addEventListener("wheel", (e) => {
      e.preventDefault();
      const delta = e.deltaY * -0.001;
      scale = Math.min(maxScale, Math.max(minScale, scale + delta));
      zoomWrapper.style.transform = `scale(${scale})`;
    });

    if($("zoomIn")){
        $("zoomIn").onclick = () => {
          scale = Math.min(maxScale, scale + 0.2);
          zoomWrapper.style.transform = `scale(${scale})`;
        };
    }

    if($("zoomOut")){
        $("zoomOut").onclick = () => {
          scale = Math.max(minScale, scale - 0.2);
          zoomWrapper.style.transform = `scale(${scale})`;
        };
    }
}

/* ============================================================
   VALIDACIÓN MODO TRAYECTO (NUEVO)
============================================================ */
const btnActivarTrayecto = $("activarTrayectoBtn");
const inputDestino = $("destinoInput");

if (btnActivarTrayecto && inputDestino) {
  btnActivarTrayecto.addEventListener("click", () => {
    if (inputDestino.value.trim() === "") {
      // Mostrar alerta
      alert("Por favor, ingresa un destino obligatorio para activar el modo trayecto.");
      
      // Enfocar y marcar el borde rojo
      inputDestino.focus();
      inputDestino.style.border = "2px solid #ff4444";
      
      // Limpiar el borde cuando el usuario empiece a escribir
      inputDestino.addEventListener("input", () => {
        inputDestino.style.border = "";
      }, { once: true });
    } else {
      // Si es válido, redirigir
      window.location.href = "modo_trayecto_activado.html";
    }
  });
}