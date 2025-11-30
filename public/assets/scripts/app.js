document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card-option');
    const salida = document.getElementById('servicio-elegido');

    cards.forEach(card => {
        card.addEventListener('click', () => {
            // Quitar selección de todas
            cards.forEach(c => c.classList.remove('seleccionado'));

            // Marcar la que se clickeó
            card.classList.add('seleccionado');

            // Actualizar texto
            const nombreServicio = card.dataset.servicio;
            salida.textContent = nombreServicio;
        });
    });
});

function goBack() {
    history.back();
}

document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('select-toggle');
    const menu = document.getElementById('select-menu');
    const options = document.querySelectorAll('.select-option');
    const hiddenInput = document.getElementById('servicio-hidden');

    // Abrir / cerrar menú al hacer click en el botón
    toggle.addEventListener('click', () => {
        const isOpen = menu.style.display === 'block';
        menu.style.display = isOpen ? 'none' : 'block';
    });

    // Clic en una opción
    options.forEach(option => {
        option.addEventListener('click', () => {
            // Quitar selección anterior
            options.forEach(o => o.classList.remove('selected'));

            // Marcar esta como seleccionada
            option.classList.add('selected');

            // Cambiar texto del botón
            toggle.textContent = option.textContent;

            // Guardar valor en el hidden (útil si hay formulario)
            hiddenInput.value = option.dataset.value;

            // Cerrar menú
            menu.style.display = 'none';

            // (opcional) ver en consola qué se seleccionó
            console.log('Seleccionaste:', option.dataset.value);
        });
    });

    // Cerrar el menú si se hace click fuera
    document.addEventListener('click', (e) => {
        if (!document.getElementById('select-servicio').contains(e.target)) {
            menu.style.display = 'none';
        }
    });
});


document.addEventListener('DOMContentLoaded', () => {
    // ...lo que ya tengas aquí...

    const btnGuardar = document.getElementById('guardar-config');
    const mensaje = document.getElementById('mensaje-config');

    if (btnGuardar && mensaje) {
        btnGuardar.addEventListener('click', () => {
            const agitacion = document.getElementById('modo-agitacion').checked;
            const voz = document.getElementById('modo-voz').checked;
            const atajo = document.getElementById('atajo-select').value;

            // Aquí en el futuro podrías enviar esto a un backend.
            console.log({
                agitacion,
                voz,
                atajo
            });

            mensaje.textContent = "Configuración guardada correctamente.";
            setTimeout(() => mensaje.textContent = "", 3000);
        });
    }
});


document.addEventListener('DOMContentLoaded', () => {
    // ...si ya tienes otras cosas aquí, déjalas...

    const btnAbrir = document.getElementById('btn-abrir-config');
    const panel = document.getElementById('config-panel');
    const btnGuardar = document.getElementById('guardar-config');
    const mensaje = document.getElementById('mensaje-config');

    const chkAgitacion = document.getElementById('modo-agitacion');
    const chkVoz = document.getElementById('modo-voz');
    const selectAtajo = document.getElementById('atajo-select');

    const resModos = document.getElementById('res-modos');
    const resAtajos = document.getElementById('res-atajos');

    if (btnAbrir && panel && btnGuardar) {

        // Abrir configuración
        btnAbrir.addEventListener('click', () => {
            panel.classList.remove('hidden');
            // opcional: hacer scroll hacia el panel
            panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });

        // Guardar configuración
        btnGuardar.addEventListener('click', () => {
            const modosActivos = [];
            if (chkAgitacion.checked) modosActivos.push('Agitación');
            if (chkVoz.checked) modosActivos.push('Comando de voz');

            const atajoValor = selectAtajo.value;
            let atajoTexto = 'Ninguno';
            if (atajoValor === 'toques') atajoTexto = 'Toques';
            if (atajoValor === 'giro') atajoTexto = 'Giro de muñeca';

            // Actualizar resumen
            resModos.textContent = modosActivos.length ? modosActivos.join(', ') : 'Ninguno';
            resAtajos.textContent = atajoTexto;

            // Mensaje de guardado
            mensaje.textContent = 'Configuración guardada correctamente.';

            // Ocultar panel después de un momento
            setTimeout(() => {
                mensaje.textContent = '';
                panel.classList.add('hidden');
            }, 800); // 0.8s, ajusta si quieres

            // Aquí podrías enviar la info a un backend en el futuro
            console.log({
                modosActivos,
                atajo: atajoTexto
            });
        });
    }
});