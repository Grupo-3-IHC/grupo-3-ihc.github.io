function openChat(page) {
    window.location.href = page;
}

function openGrupos(page) {
    window.location.href = page;
}

function openPage(page) {
    window.location.href = page;
}

function openContactos(page) {
    window.location.href = page;
}

function goBack() {
    history.back();
}


const clipBtn = document.getElementById("clipBtn");
const fileMenu = document.getElementById("fileMenu");

clipBtn.addEventListener("click", () => {
    fileMenu.style.display = 
        fileMenu.style.display === "flex" ? "none" : "flex";
});

document.addEventListener("click", (e) => {
    if (!clipBtn.contains(e.target) && !fileMenu.contains(e.target)) {
        fileMenu.style.display = "none";
    }
});

function sendImage() {
    const chat = document.querySelector(".chat-messages");

    const msg = document.createElement("div");
    msg.classList.add("message", "right");
    msg.innerHTML = `
        <div class="sent-file">
            <img src="https://via.placeholder.com/150" alt="imagen">
        </div>
        <div class="avatar"></div>
    `;

    chat.appendChild(msg);
    chat.scrollTop = chat.scrollHeight;
    fileMenu.style.display = "none";
}

// Enviar archivo simulado
function sendFile() {
    const chat = document.querySelector(".chat-messages");

    const msg = document.createElement("div");
    msg.classList.add("message", "right");
    msg.innerHTML = `
        <div class="sent-file">
            <div class="file-icon">📄</div>
            Documento.pdf
        </div>
        <div class="avatar"></div>
    `;

    chat.appendChild(msg);
    chat.scrollTop = chat.scrollHeight;
    fileMenu.style.display = "none";
}

// --- ENVIAR MENSAJE DE TEXTO ---
const sendBtn = document.querySelector(".send");
const messageInput = document.querySelector(".chat-input input");
const chatMessages = document.querySelector(".chat-messages");

function enviarMensajeTexto() {
    const texto = messageInput.value.trim();
    if (texto === "") return;

    const msg = document.createElement("div");
    msg.classList.add("message", "right");
    msg.innerHTML = `
        <div class="bubble">${texto}</div>
        <div class="avatar"></div>
    `;

    chatMessages.appendChild(msg);

    messageInput.value = "";

    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Enviar con botón
sendBtn.addEventListener("click", enviarMensajeTexto);

// Enviar con ENTER
messageInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") enviarMensajeTexto();
});

const textInput = document.getElementById("textInput");
const micBtn = document.getElementById("micHold");
const defaultIcons = document.getElementById("defaultIcons");

const chatBox = document.querySelector(".chat-messages");

let recording = false;
let timerInterval;
let seconds = 0;

// Formatea el contador 00:05 – 01:12...
function formatTime(sec) {
    let m = Math.floor(sec / 60);
    let s = sec % 60;
    return `${m.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}`;
}

// 🟥 INICIO DE GRABACIÓN (mousedown = mantener presionado)
micBtn.addEventListener("mousedown", () => {
    recording = true;
    seconds = 0;

    // Oculta iconos normales
    defaultIcons.classList.add("hidden");
    sendBtn.classList.add("hidden");

    // Cambia la caja de texto al modo grabación
    textInput.value = "";
    textInput.classList.add("recording-mode");
    textInput.placeholder = "";

    textInput.value = "🎤 Grabando...   00:00";

    // Contador
    timerInterval = setInterval(() => {
        seconds++;
        textInput.value = `🎤 Grabando...   ${formatTime(seconds)}`;
    }, 1000);
});

// 🟩 FIN DE GRABACIÓN → se envía el mensaje (mouseup = soltar)
document.addEventListener("mouseup", () => {
    if (!recording) return;
    recording = false;

    clearInterval(timerInterval);

    // Crear mensaje enviado tipo nota de voz
    const msg = document.createElement("div");
    msg.className = "message right";
    msg.innerHTML = `
        <div class="bubble">🎤 Nota de voz (${formatTime(seconds)})</div>
        <div class="avatar"></div>
    `;
    chatBox.appendChild(msg);

    chatBox.scrollTop = chatBox.scrollHeight;

    // Restaurar input a modo normal
    textInput.classList.remove("recording-mode");
    textInput.value = "";
    textInput.placeholder = "Mensaje...";

    defaultIcons.classList.remove("hidden");
    sendBtn.classList.remove("hidden");
});