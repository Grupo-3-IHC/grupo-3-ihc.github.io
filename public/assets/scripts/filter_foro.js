document.addEventListener("DOMContentLoaded", () => {
  console.log("Sistema de filtros Multi-Select Total cargado.");

  // ==========================================================
  // 1. DATOS
  // ==========================================================
  const dataSources = {
    filterTipo: [
      "Robo", "Hurto", "Asalto", "Extorsión", 
      "Estafa", "Fraude", "Receptación", "Corrupción",
      "Secuestro", "AcosoSexual", "ViolenciaSexual"
    ],
    filterFechaData: {
      years: ["2021", "2022", "2023", "2024", "2025", "2026"],
      monthsCol1: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio"],
      monthsCol2: ["Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
    },
    filterUbicacion: [
      "Miraflores", "Callao", "Comas", "Lince",
      "San Juan de Lurigancho", "Magdalena", "Surco", "San Borja",
      "Los Olivos", "San Miguel", "Jesús María"
    ],
    filterUsuario: [
      "Edgar Montañez", "Álvaro Fernandez", "Jesús Cataño", 
      "María Lopez", "Juan Pérez", "Anonimo"
    ],
    filterOtros: [
      "MapeoDeRiesgo", "PuntosCríticos", 
      "ExperienciasPersonales", "MejorasEnSeguridad", 
      "PropuestasCiudadanas", "ConVideo", "ConFotos"
    ]
  };

  // ==========================================================
  // 2. RENDERIZADO DE DROPDOWNS
  // ==========================================================
  const targetIds = ["filterTipo", "filterFechaWrapper", "filterUbicacion", "filterUsuario", "filterOtros"];

  targetIds.forEach(id => {
    let originalElement = document.getElementById(id);
    if (!originalElement) return;

    // Crear Estructura Wrapper
    const wrapper = document.createElement("div");
    wrapper.className = "custom-dropdown";
    wrapper.id = `wrapper-${id}`;

    // Trigger (Input visual)
    const trigger = document.createElement("div");
    trigger.className = "dropdown-trigger";
    trigger.innerHTML = `<span>.....</span>`; 

    // Panel Desplegable
    const panel = document.createElement("div");
    panel.className = "dropdown-panel";

    // Header del Panel
    const header = document.createElement("div");
    header.className = "panel-header";
    header.innerHTML = `<span>Selecciona opciones</span><span class="close-panel-btn">▲</span>`;

    const contentContainer = document.createElement("div");

    // === LÓGICA ESPECIAL PARA FECHA (AHORA MULTI-SELECT) ===
    if (id === "filterFechaWrapper") {
      contentContainer.className = "fecha-layout";

      // Función para crear columnas de fecha
      const createCol = (items, type) => {
        const colDiv = document.createElement("div");
        colDiv.className = "fecha-col-group";
        
        items.forEach(val => {
          const item = createOptionItem(val);
          item.dataset.type = type; // 'year' o 'month'
          
          item.addEventListener("click", (e) => {
            e.stopPropagation();
            
            // TOGGLE (Multi-selección habilitada)
            if (item.classList.contains("selected")) {
              item.classList.remove("selected");
            } else {
              item.classList.add("selected");
            }

            // Recopilar selecciones para actualizar el texto
            // Buscamos en todo el contenedor de fecha, no solo en esta columna
            const allSelectedItems = contentContainer.querySelectorAll(".option-item.selected");
            const selectedYears = [];
            const selectedMonths = [];

            allSelectedItems.forEach(el => {
              if (el.dataset.type === "year") selectedYears.push(el.innerText);
              if (el.dataset.type === "month") selectedMonths.push(el.innerText);
            });

            // Construir texto del Trigger
            let displayText = ".....";
            if (selectedYears.length > 0 || selectedMonths.length > 0) {
              const yearsText = selectedYears.join(", ");
              const monthsText = selectedMonths.join(", ");
              
              if (selectedYears.length > 0 && selectedMonths.length > 0) {
                displayText = `${yearsText} | ${monthsText}`;
              } else if (selectedYears.length > 0) {
                displayText = yearsText;
              } else {
                displayText = monthsText;
              }
              
              // Truncar si es muy largo
              if (displayText.length > 30) {
                 displayText = `${selectedYears.length + selectedMonths.length} filtros de fecha`;
              }
              
              trigger.innerHTML = `<span>${displayText}</span>`;
              trigger.style.color = "#004040";
              trigger.style.fontWeight = "bold";
            } else {
              trigger.innerHTML = `<span>.....</span>`;
              trigger.style.color = "#666";
              trigger.style.fontWeight = "normal";
            }
          });
          colDiv.appendChild(item);
        });
        return colDiv;
      };

      // Crear las 3 columnas (Años, Meses 1, Meses 2)
      contentContainer.appendChild(createCol(dataSources.filterFechaData.years, "year"));
      contentContainer.appendChild(createCol(dataSources.filterFechaData.monthsCol1, "month"));
      contentContainer.appendChild(createCol(dataSources.filterFechaData.monthsCol2, "month"));

    } else {
      // === LÓGICA ESTÁNDAR PARA EL RESTO (MULTI-SELECT) ===
      contentContainer.className = "options-grid";
      originalElement.classList.add("hidden-native-select");

      const optionsList = dataSources[id] || [];
      optionsList.forEach(optText => {
        // Formatear visualmente con #
        const displayText = (!optText.startsWith("#") && id !== "filterUsuario") ? `#${optText}` : optText;
        const item = createOptionItem(displayText);
        
        item.addEventListener("click", (e) => {
          e.stopPropagation();
          
          // TOGGLE
          if (item.classList.contains("selected")) {
            item.classList.remove("selected");
          } else {
            item.classList.add("selected");
          }

          // Actualizar Trigger
          const allSelected = Array.from(contentContainer.querySelectorAll(".selected"));
          
          if (allSelected.length > 0) {
            const texts = allSelected.map(el => el.innerText).join(", ");
            // Truncar texto largo
            if (texts.length > 28) {
               trigger.innerHTML = `<span>${allSelected.length} seleccionados</span>`;
            } else {
               trigger.innerHTML = `<span>${texts}</span>`;
            }
            trigger.style.color = "#004040";
            trigger.style.fontWeight = "bold";
          } else {
            trigger.innerHTML = `<span>.....</span>`;
            trigger.style.color = "#666";
            trigger.style.fontWeight = "normal";
          }
        });
        contentContainer.appendChild(item);
      });
    }

    // Armar DOM
    panel.appendChild(header);
    panel.appendChild(contentContainer);
    wrapper.appendChild(trigger);
    wrapper.appendChild(panel);

    originalElement.parentNode.insertBefore(wrapper, originalElement.nextSibling);
    
    if (id === "filterFechaWrapper") originalElement.style.display = "none";

    // Eventos Abrir/Cerrar (Acordeón)
    trigger.addEventListener("click", () => {
      const isActive = wrapper.classList.contains("active");
      // Cierra los otros
      document.querySelectorAll(".custom-dropdown").forEach(d => d.classList.remove("active"));
      // Abre este
      if (!isActive) wrapper.classList.add("active");
    });

    // Cerrar con flecha
    header.querySelector(".close-panel-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      wrapper.classList.remove("active");
    });
  });

  // Helper para crear items visuales
  function createOptionItem(text) {
    const div = document.createElement("div");
    div.className = "option-item";
    div.innerText = text;
    return div;
  }

  // Cerrar al hacer clic fuera
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".custom-dropdown")) {
      document.querySelectorAll(".custom-dropdown").forEach(d => d.classList.remove("active"));
    }
  });

  // ==========================================================
  // 3. TAGS INFERIORES (Multi-Select)
  // ==========================================================
  const tagsGrid = document.getElementById("tagsGrid");
  const selectedTagsContainer = document.getElementById("selectedTags");

  if (tagsGrid && selectedTagsContainer) {
    
    function addTagChip(tagValue) {
      const safeValue = tagValue.trim();
      if (selectedTagsContainer.querySelector(`[data-tag="${safeValue}"]`)) return;

      const chip = document.createElement("div");
      chip.className = "tag-chip";
      chip.setAttribute("data-tag", safeValue);
      chip.innerHTML = `${safeValue} <span class="remove">✕</span>`;

      chip.querySelector(".remove").addEventListener("click", () => {
        chip.remove();
        // Sincronizar deselección con la grilla
        const originalBtn = Array.from(tagsGrid.querySelectorAll("span")).find(
          (span) => span.innerText.trim() === safeValue
        );
        if (originalBtn) originalBtn.classList.remove("selected");
      });
      selectedTagsContainer.appendChild(chip);
    }

    const tagSpans = tagsGrid.querySelectorAll("span");
    tagSpans.forEach((span) => {
      span.classList.add("option-item"); // Hereda estilo redondo
      
      span.addEventListener("click", () => {
        const tagText = span.innerText.trim();

        if (span.classList.contains("selected")) {
          span.classList.remove("selected");
          // Remover chip
          const chip = selectedTagsContainer.querySelector(`[data-tag="${tagText}"]`);
          if (chip) chip.remove();
        } else {
          span.classList.add("selected");
          // Añadir chip
          addTagChip(tagText);
        }
      });
    });
  }
});