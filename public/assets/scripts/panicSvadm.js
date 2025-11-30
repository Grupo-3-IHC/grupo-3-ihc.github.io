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
    const retirarAlertaButton = document.getElementById('retirarAlertaButton');

    let isPanicActive = false;
    let confirmationTimeout;
    const COUNTDOWN_SECONDS = 5;

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
        
        panicButton.classList.remove('confirming');
        cancelButton.classList.add('hidden');
        panicHeaderText.textContent = "PULSAR PARA ACTIVAR:";
        panicStatus.textContent = 'Presiona el botón para enviar una alerta inmediata.';
        panicStatus.style.color = '#777';
        panicButton.disabled = false;
    }

    function resetPanicState() {
        if (confirmationTimeout) {
            clearTimeout(confirmationTimeout);
        }
        isPanicActive = false;
    
        panicButton.classList.remove('confirming');
        cancelButton.classList.add('hidden');
        panicHeaderText.textContent = "PULSAR PARA ACTIVAR:"; 
        panicStatus.textContent = 'Presiona el botón para enviar una alerta inmediata.';
        panicStatus.style.color = '#777';
        panicButton.disabled = false;
    }

    function sendFinalAlert() {
        if (isPanicActive) { 
            clearTimeout(confirmationTimeout);
            isPanicActive = false; 

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
        
        panicButton.classList.add('confirming');
        cancelButton.classList.remove('hidden');
        panicStatus.style.color = '#333';

        let timeLeft = COUNTDOWN_SECONDS;
        panicHeaderText.innerHTML = `En <span id="countdown">${timeLeft}</span> segundos se notificará a las autoridades y contactos de confianza...`;
        
        function countdown() {
            timeLeft--;
            const countdownSpan = document.getElementById('countdown');
            if (countdownSpan) countdownSpan.textContent = timeLeft;

            if (timeLeft <= 0) {
                sendFinalAlert();
            } else {
                confirmationTimeout = setTimeout(countdown, 1000);
            }
        }
        
        confirmationTimeout = setTimeout(countdown, 1000);
    }
    
    if (panicButton) {
        panicButton.addEventListener('click', () => {
            if (panicButton.disabled) return;
            
            if (!isPanicActive) {
                startConfirmation();
            } else {
                sendFinalAlert();
            }
        });
    }

    if (cancelButton) {
        cancelButton.addEventListener('click', () => {
            resetPanicState();
        });
    }


    if (goBackButton) {
        goBackButton.addEventListener('click', () => {
            if (isPanicActive) {
                 resetPanicState();
            }
            window.history.back(); 
        });
    }


    if (verMasPanicDetailsButton) {
        verMasPanicDetailsButton.addEventListener('click', () => {
            navigatePanic(panicDetailsScreen, panicSentScreen); 
        });
    }

    if (deactivatePanicButton) {
        deactivatePanicButton.addEventListener('click', () => {
            
    
            console.log("Botón de pánico desactivado."); 
            navigatePanic(panicMainScreen, panicDetailsScreen);
            resetPanicState(); 
        });
    }

    if (goToPrivacyAvisoButton) {
        goToPrivacyAvisoButton.addEventListener('click', () => {
            navigatePanic(privacyAvisoSscreen, panicDetailsScreen);
        });
    }

    if (confirmShareButton) {
        confirmShareButton.addEventListener('click', () => {
            navigatePanic(panicDetailsScreen, privacyAvisoSscreen);
        });
    }

    if (denyShareButton) {
        denyShareButton.addEventListener('click', () => {
            navigatePanic(panicMainScreen, privacyAvisoSscreen);
            resetPanicState();
        });
    }

    if (toggleInterAvisoButton) {
        toggleInterAvisoButton.addEventListener('click', () => {
            if (interAvisoBox.classList.contains('hidden')) {
                interAvisoBox.classList.remove('hidden');
            } else {
                interAvisoBox.classList.add('hidden');
            }
        });
    }

    if (retirarAlertaButton) {
        retirarAlertaButton.addEventListener('click', () => {
            console.log("Botón de pánico desactivado.");
            navigatePanic(panicMainScreen, panicDetailsScreen);
            resetPanicState(); 
        });
    }

});