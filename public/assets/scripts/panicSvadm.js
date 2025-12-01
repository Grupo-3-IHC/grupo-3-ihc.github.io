document.addEventListener('DOMContentLoaded', () => {

    const panicButton = document.getElementById('activatePanic');
    const cancelButton = document.getElementById('cancelPanic');
    const goBackButton = document.getElementById('goBack');
    const panicStatus = document.getElementById('panicStatus');
    const panicHeaderText = document.getElementById('panicHeaderText');

    const panicMainScreen = document.getElementById('panic-main-screen'); 
    const panicSentScreen = document.getElementById('panic-sent-screen'); 
    const panicDetailsScreen = document.getElementById('panic-details-screen'); 
    const privacyAvisoSscreen = document.getElementById('privacy-aviso-screen'); 
    const verMasPanicDetailsButton = document.getElementById('verMasPanicDetails'); 
    const deactivatePanicButton = document.getElementById('deactivatePanicButton'); 
    const goToPrivacyAvisoButton = document.getElementById('goToPrivacyAviso'); 
    const confirmShareButton = document.getElementById('confirmShare'); 
    const denyShareButton = document.getElementById('denyShare'); 

    const toggleInterAvisoButton = document.getElementById('toggleInterAviso'); 
    const interAvisoBox = document.getElementById('interAvisoBox');

    // Si en tu HTML tienes un botón "Retirar alerta" lateral, se engancha aquí
    const retirarAlertaButton = document.getElementById('retirarAlertaButton');

    let isPanicActive = false;
    let confirmationTimeout;
    const COUNTDOWN_SECONDS = 5;

    // --- Control de uso del botón de pánico ---
    let alertCount = 0;
    const MAX_ALERTS = 3;
    const ALERT_COOLDOWN_MS = 10 * 1000; // 60 segundos de bloqueo
    let lastAlertTimestamp = 0;

    // Guardar/leer estado para que se mantenga aunque el usuario salga y vuelva
    const STORAGE_KEY = 'panicAlertControl_v1';

    function saveAlertState() {
        try {
            const data = {
                alertCount,
                lastAlertTimestamp
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.error('Error guardando estado de alerta:', e);
        }
    }

    function loadAlertState() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return;

            const data = JSON.parse(raw);
            if (typeof data.alertCount === 'number') {
                alertCount = data.alertCount;
            }
            if (typeof data.lastAlertTimestamp === 'number') {
                lastAlertTimestamp = data.lastAlertTimestamp;
            }
        } catch (e) {
            console.error('Error cargando estado de alerta:', e);
        }
    }

    // Cargar estado al entrar a la pantalla (por ejemplo, desde la barra inferior)
    loadAlertState();

    function navigatePanic(showScreen, hideScreen) {
        if (hideScreen) {
            hideScreen.classList.remove('active-screen');
            hideScreen.classList.add('hidden-screen');
        }
        if (showScreen) {
            showScreen.classList.remove('hidden-screen');
            showScreen.classList.add('active-screen');
        }
    }

    function resetPanicState() {
        if (confirmationTimeout) {
            clearTimeout(confirmationTimeout);
        }
        isPanicActive = false;
    
        if (panicButton) {
            panicButton.classList.remove('confirming');
            panicButton.disabled = false;
        }
        if (cancelButton) {
            cancelButton.classList.add('hidden');
        }
        if (panicHeaderText) {
            panicHeaderText.textContent = "PULSAR PARA ACTIVAR:"; 
        }
        if (panicStatus) {
            panicStatus.textContent = 'Presiona el botón para enviar una alerta inmediata.';
            panicStatus.style.color = '#777';
        }
    }

    function sendFinalAlert() {
        if (isPanicActive) { 
            clearTimeout(confirmationTimeout);
            isPanicActive = false; 

            // Registrar envío de alerta
            alertCount++;
            lastAlertTimestamp = Date.now();
            saveAlertState(); // 💾 se guarda para futuras visitas desde la barra inferior

            console.log("ALERTA DE PÁNICO ENVIADA DEFINITIVAMENTE.");
            if (panicMainScreen && panicSentScreen) {
                navigatePanic(panicSentScreen, panicMainScreen);
            } else {
                console.error("ERROR: No se pudo encontrar una de las pantallas de pánico (panicMainScreen o panicSentScreen).");
            }
        }
    }

    function startConfirmation() {
        isPanicActive = true;
        
        if (panicButton) {
            panicButton.classList.add('confirming');
        }
        if (cancelButton) {
            cancelButton.classList.remove('hidden');
        }
        if (panicStatus) {
            panicStatus.style.color = '#333';
            panicStatus.textContent = 'Puedes cancelar la alerta antes de que se envíe.';
        }

        let timeLeft = COUNTDOWN_SECONDS;
        if (panicHeaderText) {
            panicHeaderText.innerHTML = `En <span id="countdown">${timeLeft}</span> segundos se notificará a las autoridades y contactos de confianza...`;
        }
        
        function countdown() {
            timeLeft--;
            const countdownSpan = document.getElementById('countdown');
            if (countdownSpan) {
                countdownSpan.textContent = timeLeft;
            }

            if (timeLeft <= 0) {
                sendFinalAlert();
            } else {
                confirmationTimeout = setTimeout(countdown, 1000);
            }
        }

        confirmationTimeout = setTimeout(countdown, 1000);
    }

    // -------- BOTÓN DE PÁNICO PRINCIPAL --------
    if (panicButton) {
        panicButton.addEventListener('click', () => {
            if (panicButton.disabled) return;

            // 1) Verificar conexión a internet
            if (!navigator.onLine) {
                alert('no hay acceso a internet alerta pendiente');

                if (panicStatus) {
                    panicStatus.textContent = 'no hay acceso a internet alerta pendiente';
                    panicStatus.style.color = '#E03957';
                }
                return;
            }

            // 2) Bloqueo temporal + máximo de envíos (se mantiene aunque vuelva desde la barra)
            const now = Date.now();
            const inCooldown = lastAlertTimestamp && (now - lastAlertTimestamp) < ALERT_COOLDOWN_MS;
            const reachedMax = alertCount >= MAX_ALERTS;

            if (inCooldown || reachedMax) {
                alert('ya se envio una alerta reciente, bloqueo temporal');

                if (panicStatus) {
                    panicStatus.textContent = 'ya se envio una alerta reciente, bloqueo temporal';
                    panicStatus.style.color = '#E03957';
                }
                return;
            }

            // 3) Flujo normal
            if (!isPanicActive) {
                startConfirmation();
            } else {
                sendFinalAlert();
            }
        });
    }

    // Cancelar durante la cuenta regresiva
    if (cancelButton) {
        cancelButton.addEventListener('click', () => {
            resetPanicState();
        });
    }

    // Flecha de regresar (mantiene tu comportamiento)
    if (goBackButton) {
        goBackButton.addEventListener('click', () => {
            if (isPanicActive) {
                resetPanicState();
            }
            window.history.back(); 
        });
    }

    // Pantalla "Alerta enviada" → "Ver detalles"
    if (verMasPanicDetailsButton) {
        verMasPanicDetailsButton.addEventListener('click', () => {
            navigatePanic(panicDetailsScreen, panicSentScreen); 
        });
    }

    // Botón "Desactivar botón de pánico" en detalles
    if (deactivatePanicButton) {
        deactivatePanicButton.addEventListener('click', () => {
            console.log("Botón de pánico desactivado."); 
            navigatePanic(panicMainScreen, panicDetailsScreen);
            resetPanicState(); 
        });
    }

    // Ir al aviso de privacidad
    if (goToPrivacyAvisoButton) {
        goToPrivacyAvisoButton.addEventListener('click', () => {
            navigatePanic(privacyAvisoSscreen, panicDetailsScreen);
        });
    }

    // Aceptar compartir datos
    if (confirmShareButton) {
        confirmShareButton.addEventListener('click', () => {
            navigatePanic(panicDetailsScreen, privacyAvisoSscreen);
        });
    }

    // No aceptar y regresar
    if (denyShareButton) {
        denyShareButton.addEventListener('click', () => {
            navigatePanic(panicMainScreen, privacyAvisoSscreen);
            resetPanicState();
        });
    }

    // Mostrar / ocultar aviso intermedio
    if (toggleInterAvisoButton && interAvisoBox) {
        toggleInterAvisoButton.addEventListener('click', () => {
            if (interAvisoBox.classList.contains('hidden')) {
                interAvisoBox.classList.remove('hidden');
            } else {
                interAvisoBox.classList.add('hidden');
            }
        });
    }

    // Botón lateral "Retirar alerta" (si existe en tu layout)
    if (retirarAlertaButton) {
        retirarAlertaButton.addEventListener('click', () => {
            console.log("Botón de pánico desactivado.");
            navigatePanic(panicMainScreen, panicDetailsScreen);
            resetPanicState(); 
        });
    }

});

