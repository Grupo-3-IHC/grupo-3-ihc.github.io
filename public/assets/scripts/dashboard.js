document.addEventListener("DOMContentLoaded", () => {
  console.log("Dashboard cargado correctamente.");

  // -------- Elementos de configuración de horario --------
  const startInput = document.getElementById("risk-start");
  const endInput = document.getElementById("risk-end");
  const saveBtn = document.getElementById("save-risk-time");
  const messageEl = document.getElementById("risk-message");

  // -------- Elementos de alerta preventiva --------
  const warningCard = document.getElementById("risk-warning");
  const warningText = document.getElementById("risk-warning-text");

  // Si por alguna razón no existe la sección, salimos
  if (!startInput || !endInput || !saveBtn) {
    return;
  }

  // ---- Cargar valores guardados al abrir el dashboard ----
  const saved = localStorage.getItem("riskSchedule");
  if (saved) {
    try {
      const schedule = JSON.parse(saved);
      if (schedule.start) startInput.value = schedule.start;
      if (schedule.end) endInput.value = schedule.end;
    } catch (e) {
      console.error("Error leyendo riskSchedule", e);
    }
  }

  function showMessage(text, type) {
    if (!messageEl) return;
    messageEl.textContent = text;
    messageEl.style.color = type === "error" ? "red" : "green";
  }

  // -------- Guardar horario (Escenario 1 y 3) --------
  saveBtn.addEventListener("click", () => {
    // Escenario 3: sin conexión a internet
    if (!navigator.onLine) {
      showMessage(
        "Se requiere conexión a internet para guardar los cambios.",
        "error"
      );
      return;
    }

    const start = startInput.value;
    const end = endInput.value;

    if (!start || !end) {
      showMessage(
        "Debes seleccionar una hora de inicio y de fin.",
        "error"
      );
      return;
    }

    if (start === end) {
      showMessage(
        "La hora de inicio y fin no pueden ser iguales.",
        "error"
      );
      return;
    }

    const schedule = { start, end };
    localStorage.setItem("riskSchedule", JSON.stringify(schedule));

    // Reiniciamos las marcas de notificación para el día
    localStorage.removeItem("riskNotifiedStartDate");
    localStorage.removeItem("riskNotifiedEndDate");

    showMessage("Horario de riesgo guardado correctamente.", "success");
  });

  // -------- Lógica de notificación preventiva (Escenario 2) --------
  function getTodayString() {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }

  function parseTimeToMinutes(timeStr) {
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
  }

  function checkRiskSchedule() {
    const riskData = localStorage.getItem("riskSchedule");
    if (!riskData) return;

    let schedule;
    try {
      schedule = JSON.parse(riskData);
    } catch (e) {
      console.error("Error parseando riskSchedule:", e);
      return;
    }

    const { start, end } = schedule;
    if (!start || !end) return;

    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    const startMinutes = parseTimeToMinutes(start);
    const endMinutes = parseTimeToMinutes(end);

    const todayStr = getTodayString();
    const notifiedStartDate = localStorage.getItem("riskNotifiedStartDate");
    const notifiedEndDate = localStorage.getItem("riskNotifiedEndDate");

    // Minutos que faltan para inicio y fin
    const diffToStart = startMinutes - nowMinutes;
    const diffToEnd = endMinutes - nowMinutes;

    // Rango deseado: entre 20 y 15 minutos antes
    const MIN_BEFORE = 15;
    const MAX_BEFORE = 20;

    // ---- Aviso antes de INICIO ----
    if (
      diffToStart <= MAX_BEFORE &&
      diffToStart >= MIN_BEFORE &&
      notifiedStartDate !== todayStr
    ) {
      if (warningCard && warningText) {
        warningText.textContent =
          `Tu periodo de riesgo configurado está por iniciar (${start} - ${end}). ` +
          `Faltan aproximadamente ${diffToStart} minutos. Toma precauciones al abrir tu negocio.`;
        warningCard.style.display = "block";
      }

      localStorage.setItem("riskNotifiedStartDate", todayStr);
    }

    // ---- Aviso antes de FIN ----
    if (
      diffToEnd <= MAX_BEFORE &&
      diffToEnd >= MIN_BEFORE &&
      notifiedEndDate !== todayStr
    ) {
      if (warningCard && warningText) {
        warningText.textContent =
          `Tu periodo de riesgo configurado está por terminar (${start} - ${end}). ` +
          `Faltan aproximadamente ${diffToEnd} minutos. Toma precauciones al cerrar tu negocio.`;
        warningCard.style.display = "block";
      }

      localStorage.setItem("riskNotifiedEndDate", todayStr);
    }
  }

  // Comprobamos al cargar el dashboard
  checkRiskSchedule();
  // Y luego cada minuto
  setInterval(checkRiskSchedule, 60 * 1000);
});
