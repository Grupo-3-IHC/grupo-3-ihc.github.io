/* ============================================================
   VOTE BUTTONS (UPVOTE / DOWNVOTE)
============================================================ */
document.querySelectorAll(".vote-up, .vote-down").forEach(btn => {
  btn.addEventListener("click", () => {
    btn.classList.toggle("active");
  });
});

/* ============================================================
   GLOBAL EVENT LISTENER (DELEGATION)
   Handles: Suspicious, Delete Comment, Report User
============================================================ */
let reportTimeoutId = null;
const reportModal = document.getElementById('reportModal');

document.addEventListener("click", (e) => {
  // 1. Botón "Marcar como sospechoso"
  const suspiciousBtn = e.target.closest(".mark-suspicious");
  if (suspiciousBtn) {
    const popup = document.getElementById("reportPopup");
    if (popup) {
      popup.style.display = "block";
      // Clear prev timeout to ensure it stays if clicked rapidly
      if (reportTimeoutId) clearTimeout(reportTimeoutId);
      reportTimeoutId = setTimeout(() => {
        popup.style.display = "none";
      }, 2000);
    }
  }

  // 2. Botón "Eliminar comentario 🗑"
  const deleteBtn = e.target.closest(".comment-delete");
  if (deleteBtn) {
    if(confirm("¿Estás seguro de que quieres eliminar este comentario?")) {
        const commentItem = deleteBtn.closest(".comment-item");
        if (commentItem) {
            commentItem.remove();
        }
    }
  }

  // 3. Botón "Reportar usuario" (Opens Modal)
  const reportBtn = e.target.closest(".comment-report");
  if (reportBtn) {
    if (reportModal) reportModal.classList.add("active");
  }

  // 4. Modal Actions
  if (e.target.id === "cancelReport") {
    reportModal.classList.remove("active");
  }
  if (e.target.id === "confirmReport") {
    reportModal.classList.remove("active");
    alert("Usuario reportado. Gracias por tu colaboración.");
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
      <div class="avatar-circle" style="background-color:#A1E3DC; color:#004040;">T</div>
      <span class="comment-header-name">Tú</span>
      <span class="comment-report">
        <span class="comment-report-icon">⚠</span>
        Reportar usuario
      </span>
      <span class="comment-delete" style="color:#ff4444; cursor:pointer;">Eliminar comentario 🗑</span>
    </div>
    <div class="comment-bubble">
      ${text}
    </div>
  `;

  // Insertar al principio del hilo
  thread.prepend(newComment);
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

  // En el clon quitamos el onclick para evitar recursión
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


/* ============================================================
   MODO ADMINISTRADOR & INFO SENSIBLE
============================================================ */
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

    // Mensaje pequeño opcional
    if (adminPopup) {
      adminPopup.classList.remove('error');
      adminPopup.textContent = isAdmin
        ? 'Modo administrador activado.'
        : 'Modo administrador desactivado.';
      adminPopup.style.display = 'block';
      setTimeout(() => {
        adminPopup.style.display = 'none';
      }, 2500);
    }
  });
}

function showSensitiveInfo(element) {
  if (!adminPopup) return;

  if (!isAdmin) {
    adminPopup.classList.add('error');
    adminPopup.textContent = 'No tienes permisos. Activa el modo Administrador.';
    adminPopup.style.display = 'block';
    setTimeout(() => {
      adminPopup.style.display = 'none';
    }, 3000);
    return;
  }

  const userName = element.dataset.user || 'Usuario';

  adminPopup.classList.remove('error');
  adminPopup.innerHTML = `
    <strong>${userName}</strong><br>
    Cuenta creada: 15/03/2023<br>
    Último inicio de sesión: 12/06/2025 21:34<br>
    Correo: email@example.com
  `;
  adminPopup.style.display = 'block';

  setTimeout(() => {
    adminPopup.style.display = 'none';
  }, 5000);
}
