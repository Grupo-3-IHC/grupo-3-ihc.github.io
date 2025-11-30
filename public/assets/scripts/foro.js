/* ============================================================
   VOTE BUTTONS (UPVOTE / DOWNVOTE)
============================================================ */
document.querySelectorAll(".vote-up, .vote-down").forEach(btn => {
  btn.addEventListener("click", () => {
    btn.classList.toggle("active");
  });
});

/* ============================================================
   MARCAR COMO SOSPECHOSO → POPUP (DELEGACIÓN)
   Funciona tanto en la vista normal como en el full view
============================================================ */
let reportTimeoutId = null;

document.addEventListener("click", (e) => {
  // Botón "Marcar como sospechoso"
  const suspiciousBtn = e.target.closest(".mark-suspicious");
  if (suspiciousBtn) {
    const popup = document.getElementById("reportPopup");
    if (popup) {
      popup.style.display = "block";

      if (reportTimeoutId) clearTimeout(reportTimeoutId);
      reportTimeoutId = setTimeout(() => {
        popup.style.display = "none";
      }, 2000);
    }
  }

  // Botón "Eliminar comentario 🗑"
  const deleteBtn = e.target.closest(".comment-delete");
  if (deleteBtn) {
    const commentItem = deleteBtn.closest(".comment-item");
    if (commentItem) {
      commentItem.remove();
    }
  }
});

/* ============================================================
   COMMENT SYSTEM — AÑADIR COMENTARIOS
============================================================ */
function sendComment(e, inputElement) {
  if (e.key !== "Enter") return;
  if (inputElement.value.trim() === "") return;

  const text = inputElement.value.trim();

  const card = inputElement.closest(".post-comments-card");
  const thread = card.querySelector(".comment-thread");

  const newComment = document.createElement("div");
  newComment.classList.add("comment-item");

  newComment.innerHTML = `
    <div class="comment-header">
      <div class="avatar-circle">T</div>
      <span class="comment-header-name">Tú</span>
      <span class="comment-report">
        <span class="comment-report-icon">⚠</span>
        Reportar usuario
      </span>
    </div>
    <div class="comment-bubble">
      ${text}
    </div>
  `;

  thread.appendChild(newComment);
  inputElement.value = "";
}

/* ============================================================
   TOGGLE DE RESPUESTAS (VER / OCULTAR)
============================================================ */
function toggleReplies(el) {
  const repliesBlock = el.nextElementSibling;
  const hidden = repliesBlock.style.display === "none";

  repliesBlock.style.display = hidden ? "block" : "none";
  el.textContent = hidden ? "Ocultar respuestas ▲" : "Ver 2 respuestas ▼";
}

/* ============================================================
   FULL POST VIEW (PANTALLA COMPLETA)
============================================================ */
function openFullPost(imgElement) {
  const overlay = document.getElementById("fullView");
  const contentContainer = document.getElementById("fullViewContent");

  const postSection = imgElement.closest(".post-container");
  const clone = postSection.cloneNode(true);

  // En el clon solo quitamos el onclick de la imagen para no abrir otro full view dentro
  clone.querySelectorAll("img.main-img").forEach(img => {
    img.removeAttribute("onclick");
  });

  contentContainer.innerHTML = "";
  contentContainer.appendChild(clone);

  overlay.style.display = "flex";
}

function closeFullView() {
  document.getElementById("fullView").style.display = "none";
}


// =========================
// MODO ADMINISTRADOR
// =========================
let isAdmin = false;

const adminToggleBtn = document.getElementById('adminToggle');
const adminPopup = document.getElementById('adminPopup');

if (adminToggleBtn) {
  adminToggleBtn.addEventListener('click', () => {
    isAdmin = !isAdmin;

    // Cambia estilos y texto del botón
    adminToggleBtn.classList.toggle('on', isAdmin);
    adminToggleBtn.textContent = isAdmin
      ? 'Administrador: ACTIVO'
      : 'Administrador: INACTIVO';

    // Mensaje pequeño opcional al activar / desactivar
    if (adminPopup) {
      adminPopup.classList.remove('error');
      adminPopup.textContent = isAdmin
        ? 'Modo administrador activado. Ahora puedes ver información sensible.'
        : 'Modo administrador desactivado.';
      adminPopup.style.display = 'block';
      setTimeout(() => {
        adminPopup.style.display = 'none';
      }, 2500);
    }
  });
}

/**
 * Muestra información sensible del usuario SOLO si el modo administrador está activo.
 * Se usa en el nombre "Edgar Montañez".
 */
function showSensitiveInfo(element) {
  if (!adminPopup) return;

  // Si NO es admin -> mensaje de error
  if (!isAdmin) {
    adminPopup.classList.add('error');
    adminPopup.textContent =
      'No tienes permisos para ver información sensible. Activa el modo Administrador.';
    adminPopup.style.display = 'block';
    setTimeout(() => {
      adminPopup.style.display = 'none';
    }, 3000);
    return;
  }

  // Si es admin -> mostrar datos sensibles del usuario
  const userName = element.dataset.user || 'Usuario';

  adminPopup.classList.remove('error');
  adminPopup.innerHTML = `
    <strong>${userName}</strong><br>
    Cuenta creada: 15/03/2023<br>
    Último inicio de sesión: 12/06/2025 21:34<br>
    Correo: edgar.montanez@example.com<br>
    Teléfono verificado: +51 987 654 321
  `;
  adminPopup.style.display = 'block';

  setTimeout(() => {
    adminPopup.style.display = 'none';
  }, 5000);
}
