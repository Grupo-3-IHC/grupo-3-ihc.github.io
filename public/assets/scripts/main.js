/* Smooth scroll for internal links (progressive enhancement) */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (!href || href === '#') return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // close mobile nav if open
    if (window.innerWidth <= 900) toggleNav(false);
  });
});

/* NAV TOGGLE for mobile */
const navToggle = document.getElementById('navToggle');
const navMenu = document.querySelector('.nav-menu');
navToggle && navToggle.addEventListener('click', () => {
  const isOpen = navMenu.style.display === 'flex';
  toggleNav(!isOpen);
});
function toggleNav(show) {
  if (!navMenu) return;
  navMenu.style.display = show ? 'flex' : 'none';
}

/* IntersectionObserver para animaciones al hacer scroll */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.animate-up, .animate-left').forEach(el => observer.observe(el));

/* FORM: validación simple + feedback */
const contactForm = document.getElementById('contactForm');
const formMsg = document.getElementById('formMsg');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Validación básica HTML ya está, aquí hacemos un pequeño manejo
    const formData = new FormData(contactForm);
    if (!formData.get('nombres') || !formData.get('apellidos') || !formData.get('email') || !formData.get('telefono') || !formData.get('consent')) {
      formMsg.style.color = '#b00000';
      formMsg.textContent = 'Por favor completa los campos obligatorios y acepta el tratamiento de datos.';
      return;
    }
    // Simular envío (en producción aquí harías fetch a tu API)
    formMsg.style.color = '#0b6b31';
    formMsg.textContent = 'Gracias — tu mensaje ha sido enviado correctamente. Nos contactaremos pronto.';
    contactForm.reset();
    // opcional: guardar en localStorage un registro rápido
    const stored = JSON.parse(localStorage.getItem('instalert_contacts') || '[]');
    stored.push({ nombres: formData.get('nombres'), apellidos: formData.get('apellidos'), email: formData.get('email'), telefono: formData.get('telefono'), fecha: new Date().toISOString() });
    localStorage.setItem('instalert_contacts', JSON.stringify(stored));
  });
}

/* SELECCIÓN DE PLANES */
document.querySelectorAll('.select-plan').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const plan = e.currentTarget.dataset.plan;
    // Guardar plan en localStorage y confirmación
    localStorage.setItem('instalert_selected_plan', plan);
    alert(`Has seleccionado el plan: ${plan}. En un sistema real procederías al pago o registro.`);
  });
});

/* Cerrar menu al redimensionar */
window.addEventListener('resize', () => {
  if (window.innerWidth > 900) navMenu.style.display = 'flex';
  else navMenu.style.display = 'none';
});
