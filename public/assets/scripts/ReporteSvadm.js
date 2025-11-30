document.addEventListener('DOMContentLoaded', () => {

    //Referencias a pantallas (Pantallas)
    const reportsScreen = document.getElementById('reports-screen');
    const publishScreen = document.getElementById('publish-screen');
    const reviewScreen = document.getElementById('review-screen');
    const successScreen = document.getElementById('success-screen');
    const reporteCarlosScreen = document.getElementById('reporte-carlos-screen');
    const validationReasonsScreen = document.getElementById('validation-reasons-screen'); 
    const invalidationReasonsScreen = document.getElementById('invalidation-reasons-screen');
    const historyScreen = document.getElementById('history-screen');
    const viewHistoryReportScreen = document.getElementById('view-history-report-screen');
    const reviewListScreen = document.getElementById('review-list-screen'); 
    const moderationAvisoSscreen = document.getElementById('moderation-aviso-screen'); 
    const validationAcceptedAvisoSscreen = document.getElementById('validation-accepted-aviso-screen'); 


    // 2. Referencias a los elementos de acción y navegación (Botones, Campos, Ítems)
    const goToPublishButton = document.getElementById('goToPublish');
    const confirmReportButton = document.querySelector('.btn-confirm');
    const returnToPublishButton = document.getElementById('returnToPublish');
    const closeSuccessButton = document.getElementById('closeSuccess');
    const verMasCarlosButton = document.getElementById('verMasCarlos');
    const goToValidationReasonsButton = document.getElementById('goToValidationReasons'); 
    const goToInvalidationReasonsButton = document.getElementById('goToInvalidationReasons'); // Botón No Válido
    const goToHistoryButton = document.getElementById('goToHistory'); // Botón Historial
    const viewHistoryReport1Button = document.getElementById('viewHistoryReport1'); // Botón 'Ver' del Historial
    const goToReviewButton = document.getElementById('goToReview'); // Botón Solicitar Revisión
    const goToModerationAvisoButton = document.getElementById('goToModerationAviso'); // Botón 'Revisar'
    const goToValidationAvisoButton = document.getElementById('goToValidationAviso'); // Botón 'Ok' del primer aviso
    const returnToReviewListButton = document.getElementById('returnToReviewList'); // Botón 'Ok' del aviso final
    const validationReasonButtons = document.querySelectorAll('.validation-reason-btn');
    const carlosSotoItem = document.getElementById('carlos-soto-item');

    const descriptionField = document.getElementById('description');
    const OFFENSIVE_TEXT = "PALABRA OFENSIVA";
    
    // Esta función maneja la visibilidad y registra la navegación en el historial
    function navigate(showScreen, hideScreen, addToHistory = true) {
        if (hideScreen) {
            hideScreen.classList.remove('active-screen');
            hideScreen.classList.add('hidden-screen');
        }
        if (showScreen) {
            showScreen.classList.remove('hidden-screen');
            showScreen.classList.add('active-screen');

            if (addToHistory) {
                window.history.pushState({ screen: showScreen.id }, '', `#${showScreen.id}`);
            }
        }
    }
    
    const globalBackButtons = document.querySelectorAll('.back-icon'); // Usaremos la clase .back-icon que ya tienes

    globalBackButtons.forEach(button => {
        button.addEventListener('click', () => {
            // mostrar pestaña anterior registrada
            window.history.back();
        });
    });
    
    window.addEventListener('popstate', (event) => 
    {
    // Definimos todas las pantallas
    const screens = {
        'reports-screen': reportsScreen,
        'publish-screen': publishScreen,
        'review-screen': reviewScreen,
        'success-screen': successScreen,
        'reporte-carlos-screen': reporteCarlosScreen,
        'validation-reasons-screen': validationReasonsScreen,
        'invalidation-reasons-screen': invalidationReasonsScreen, 
        'history-screen': historyScreen,
        'view-history-report-screen': viewHistoryReportScreen, 
        'review-list-screen': reviewListScreen,
        'moderation-aviso-screen': moderationAvisoSscreen,
        'validation-accepted-aviso-screen': validationAcceptedAvisoSscreen 
    };

    let targetScreenId = (event.state && event.state.screen) || window.location.hash.substring(1);

    if (!targetScreenId || !screens[targetScreenId]) {
        targetScreenId = 'reports-screen';
    }

    const targetScreen = screens[targetScreenId];

    Object.values(screens).forEach(screen => {
        if (screen) {
            if (screen.id === targetScreenId) {

                screen.classList.remove('hidden-screen');
                screen.classList.add('active-screen');
            } else {
                
                screen.classList.remove('active-screen');
                screen.classList.add('hidden-screen');
            }
        }
    });
});

if (reportsScreen) {
    window.history.replaceState({ screen: reportsScreen.id }, '', `#${reportsScreen.id}`);
}

    if (goToPublishButton) {
        goToPublishButton.addEventListener('click', () => {
            navigate(publishScreen, reportsScreen);
        });
    }

  
    if (verMasCarlosButton) {
        verMasCarlosButton.addEventListener('click', () => {
            navigate(reporteCarlosScreen, reportsScreen);
        });
    }


    if (goToValidationReasonsButton) {
        goToValidationReasonsButton.addEventListener('click', () => {
            navigate(validationReasonsScreen, reporteCarlosScreen); 
        });
    }

    if (goToHistoryButton) {
        goToHistoryButton.addEventListener('click', () => {
            navigate(historyScreen, reportsScreen);
        });
    }

    if (viewHistoryReport1Button) {
        viewHistoryReport1Button.addEventListener('click', () => {
            navigate(viewHistoryReportScreen, historyScreen);
        });
    }

    if (goToReviewButton) {
        goToReviewButton.addEventListener('click', () => {
            navigate(reviewListScreen, reportsScreen);
        });
    }  

    if (goToModerationAvisoButton) {
        goToModerationAvisoButton.addEventListener('click', () => {
            navigate(moderationAvisoSscreen, reviewListScreen);
        });
    }

    if (goToInvalidationReasonsButton) {
        goToInvalidationReasonsButton.addEventListener('click', () => {
            navigate(invalidationReasonsScreen, reporteCarlosScreen); 
        });
    }

    if (goToValidationAvisoButton) {
        goToValidationAvisoButton.addEventListener('click', () => {
            navigate(validationAcceptedAvisoSscreen, moderationAvisoSscreen, false);
        });
    }

    if (returnToReviewListButton) {
        returnToReviewListButton.addEventListener('click', () => {
            navigate(reviewListScreen, validationAcceptedAvisoSscreen, false);
        });
    }

   validationReasonButtons.forEach(button => {
        button.addEventListener('click', () => {
            
            const currentScreenToHide = button.closest('#validation-reasons-screen') || button.closest('#invalidation-reasons-screen');
            
            if (carlosSotoItem) {
                carlosSotoItem.classList.remove('destacado-item');
                carlosSotoItem.classList.remove('sospechoso-item');
                
                const allStatusLabels = carlosSotoItem.querySelectorAll('.destacado-label, .sospechoso-label');
                allStatusLabels.forEach(label => label.classList.add('hidden-label'));

                if (currentScreenToHide.id === 'validation-reasons-screen') {
                    // Marcar como DESTACADO
                    carlosSotoItem.classList.add('destacado-item');
                    const destacadoLabel = carlosSotoItem.querySelector('.destacado-label');
                    if (destacadoLabel) {
                        destacadoLabel.classList.remove('hidden-label');
                    }
                    
                } else if (currentScreenToHide.id === 'invalidation-reasons-screen') {
                    // Marcar como SOSPECHOSO
                    carlosSotoItem.classList.add('sospechoso-item');
                    const sospechosoLabel = carlosSotoItem.querySelector('.sospechoso-label');
                    if (sospechosoLabel) {
                        sospechosoLabel.classList.remove('hidden-label');
                    }
                }
            }
            
            // Navegar de regreso a la pantalla de Reportes. 
            navigate(reportsScreen, currentScreenToHide, false);
        });
    });

    if (confirmReportButton) {
        confirmReportButton.addEventListener('click', () => {
            if (descriptionField) {
                const reportContent = descriptionField.value.toUpperCase();
                
                if (reportContent.includes(OFFENSIVE_TEXT)) {
                    navigate(reviewScreen, publishScreen); 
                } else {
                    navigate(successScreen, publishScreen);
                    descriptionField.value = "";
                }
            }
        });
    }

    if (returnToPublishButton) {
        returnToPublishButton.addEventListener('click', () => {
            navigate(publishScreen, reviewScreen, false);
        });
    }
    
    if (closeSuccessButton) {
        closeSuccessButton.addEventListener('click', () => {
            navigate(reportsScreen, successScreen, false);
        });
    }
});