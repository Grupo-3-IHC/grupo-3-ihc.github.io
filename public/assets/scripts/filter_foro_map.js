const overlayIncidentes = document.getElementById("overlay-incidentes");
const overlayFiltros = document.getElementById("overlay-filtros");
const searchInput = document.getElementById("searchInput");

document.getElementById("closeIncidentes").onclick = () =>
  overlayIncidentes.classList.add("hidden");

document.getElementById("closeFiltros").onclick = () =>
  overlayFiltros.classList.add("hidden");

// Cuando el usuario cliquea en la barra de búsqueda → abrir filtros
searchInput.onclick = () => {
  overlayFiltros.classList.remove("hidden");
};

// Abrir overlay principal desde el mapa
// (puedes enganchar este evento a un botón si lo necesitas)
setTimeout(() => {
  overlayIncidentes.classList.remove("hidden");
}, 300);
