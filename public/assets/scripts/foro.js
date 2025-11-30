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
