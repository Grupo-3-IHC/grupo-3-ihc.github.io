// Mostrar/Ocultar menú del dropdown
document.getElementById("dropdownToggle").onclick = () => {
  const menu = document.getElementById("trayectoMenu");
  menu.style.display = menu.style.display === "flex" ? "none" : "flex";
};

// Cambiar de Pantalla 1 → Pantalla 2
document.getElementById("delimitarBtn").onclick = () => {
  document.getElementById("pantalla1").classList.remove("active");
  document.getElementById("pantalla2").classList.add("active");
};

// Volver Pantalla 2 → Pantalla 1
document.getElementById("volverBtn").onclick = () => {
  document.getElementById("pantalla2").classList.remove("active");
  document.getElementById("pantalla1").classList.add("active");
};
