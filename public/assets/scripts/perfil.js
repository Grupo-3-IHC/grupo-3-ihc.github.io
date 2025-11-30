document.querySelector('.back-arrow').addEventListener('click', () => {
    history.back();
});

// Referencias al modal
const modal = document.getElementById("modalAjustes");
const abrir = document.getElementById("btnAbrirAjustes");
const cerrar = document.getElementById("cerrarAjustes");

// Abrir modal
abrir.onclick = () => {
    modal.style.display = "flex";
}

// Cerrar modal con botón
cerrar.onclick = () => {
    modal.style.display = "none";
}

// Cerrar tocando fuera del modal
window.onclick = (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
}
