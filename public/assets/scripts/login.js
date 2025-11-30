// --- STATE MANAGEMENT ---
function showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
    // Show target screen
    document.getElementById(screenId).classList.add('active');
    
    // Clear errors
    document.querySelectorAll('.error-msg').forEach(el => {
        el.style.display = 'none';
        el.innerText = '';
    });
}

// --- EVENT LISTENERS ---
document.addEventListener('DOMContentLoaded', () => {

    // --- NAVIGATION ---
    
    // Go to Forgot Password
    document.getElementById('btn-forgot-password').addEventListener('click', (e) => {
        e.preventDefault();
        showScreen('screen-forgot-email');
    });

    // Go to Register (From Login)
    document.getElementById('btn-create-account').addEventListener('click', (e) => {
        e.preventDefault();
        showScreen('screen-register');
    });

    // --- RECOVERY FLOW ---

    // 1. Verify Email
    document.getElementById('btn-send-code').addEventListener('click', () => {
        const email = document.getElementById('recovery-email').value;
        const errorSpan = document.getElementById('error-email');
        // Simple mock validation
        if (email.includes('@')) {
            showScreen('screen-enter-code');
        } else {
            errorSpan.innerText = "Correo inválido o no registrado.";
            errorSpan.style.display = 'block';
        }
    });

    // 2. Verify Code
    document.getElementById('btn-verify-code').addEventListener('click', () => {
        const code = document.getElementById('verify-code').value;
        const errorSpan = document.getElementById('error-code');
        if (code === "123456") {
            showScreen('screen-new-password');
        } else {
            errorSpan.innerText = "Código incorrecto.";
            errorSpan.style.display = 'block';
        }
    });

    // 3. Change Password
    document.getElementById('btn-change-pass').addEventListener('click', () => {
        const p1 = document.getElementById('new-pass').value;
        const p2 = document.getElementById('confirm-pass').value;
        const errorSpan = document.getElementById('error-password');

        if (p1.length < 6) {
            errorSpan.innerText = "La contraseña es muy corta.";
            errorSpan.style.display = 'block';
        } else if (p1 !== p2) {
            errorSpan.innerText = "Las contraseñas no coinciden.";
            errorSpan.style.display = 'block';
        } else {
            showScreen('screen-success');
        }
    });

    // --- REGISTER FLOW (NEW) ---

    document.getElementById('btn-register-confirm').addEventListener('click', () => {
        const email = document.getElementById('reg-email').value;
        const user = document.getElementById('reg-user').value;
        const pass = document.getElementById('reg-pass').value;
        const confirm = document.getElementById('reg-confirm-pass').value;
        const errorSpan = document.getElementById('error-register');

        // Basic Validation
        if (!email || !user || !pass || !confirm) {
            errorSpan.innerText = "Todos los campos son obligatorios.";
            errorSpan.style.display = 'block';
            return;
        }

        if (pass !== confirm) {
            errorSpan.innerText = "Las contraseñas no coinciden.";
            errorSpan.style.display = 'block';
            return;
        }

        // Simulate success registration
        // We reuse the success screen but you could make a specific one
        alert("Cuenta creada con éxito. Ahora puedes iniciar sesión.");
        showScreen('screen-login');
    });

    // --- LOGIN MOCK ---
    document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const emailInput = document.getElementById('login-email').value;
    const passwordInput = document.getElementById('login-password').value; // Aunque no se usa, es buena práctica recuperarlo.

    // 1. Verificación de Administrador
    if (emailInput === "admin@gmail.com") {
        // Muestra la ventana emergente de confirmación
        const isConfirmed = confirm("Inicio de Sesión Especial:\n\n¿Desea ingresar como Administrador?");

        if (isConfirmed) {
            alert("¡Bienvenido, Administrador! Redirigiendo a panel de administración.");
            // Redirige al panel de administración (puedes cambiar esta ruta)
            window.location.href = "dashboard.html"; 
        } else {
            alert("Ingresando como usuario normal.");
            // Continúa a la página de usuario normal
            window.location.href = "dashboard.html"; 
        }
    } else {
        // 2. Comportamiento de Login Normal (mock en este caso)
        alert("Iniciando sesión como usuario normal.");
        window.location.href = "dashboard.html"; // Simular redirección a dashboard normal
    }
});
});
