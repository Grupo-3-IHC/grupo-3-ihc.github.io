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

    // Reiniciamos la marca de notificación para el día
    localStorage.removeItem("riskNotifiedDate");

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

    const todayStr = getTodayString();
    const notifiedDate = localStorage.getItem("riskNotifiedDate");

    // Solo avisar una vez por día
    if (notifiedDate === todayStr) {
      return;
    }

    // Minutos que faltan para el inicio
    const diff = startMinutes - nowMinutes;

    // Si faltan entre 0 y 5 minutos para el inicio → alerta preventiva
    // (puedes cambiar 5 por 10 o el número que quieras)
    if (diff >= 0 && diff <= 5) {
      if (warningCard && warningText) {
        warningText.textContent =
          `Tu periodo de riesgo configurado está por iniciar (${start} - ${end}). ` +
          `Toma precauciones al abrir o cerrar tu negocio.`;
        warningCard.style.display = "block";
      }

      // Marcamos que ya notificamos hoy
      localStorage.setItem("riskNotifiedDate", todayStr);
    }
  }

  // Comprobamos al cargar el dashboard
  checkRiskSchedule();
  // Y luego cada minuto
  setInterval(checkRiskSchedule, 60 * 1000);
});


