// =====================================================
// LA ESQUINA — Espacio Creativo
// Vanilla JS: menú móvil, scroll suave, header al scrollear,
// aparición de elementos, detalle de sala, y formulario simulado.
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
    setupMobileMenu();
    setupSmoothScroll();
    setupHeaderScrollState();
    setupScrollReveal();
    setupRoomToggles();
    setupReservationForm();
});

// ---- Menú móvil ----
function setupMobileMenu() {
    const header = document.getElementById('siteHeader');
    const toggle = document.getElementById('menuToggle');
    if (!header || !toggle) return;

    toggle.addEventListener('click', () => {
        const isOpen = header.classList.toggle('menu-open');
        toggle.classList.toggle('open', isOpen);
        toggle.setAttribute('aria-expanded', String(isOpen));
        toggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
    });

    header.querySelectorAll('.main-nav .nav-link').forEach(link => {
        link.addEventListener('click', () => closeMobileMenu(header, toggle));
    });
}

function closeMobileMenu(header, toggle) {
    header.classList.remove('menu-open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menú');
}

// ---- Scroll suave para links internos ----
function setupSmoothScroll() {
    const header = document.getElementById('siteHeader');
    const headerOffset = () => (header ? header.offsetHeight : 0) + 12;

    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const id = link.getAttribute('href').slice(1);
            const target = id ? document.getElementById(id) : null;
            if (!target) return;

            e.preventDefault();
            const top = target.getBoundingClientRect().top + window.scrollY - headerOffset();
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });
}

// ---- Header con sombra al desplazarse ----
function setupHeaderScrollState() {
    const header = document.getElementById('siteHeader');
    if (!header) return;

    const updateState = () => header.classList.toggle('scrolled', window.scrollY > 12);
    updateState();
    window.addEventListener('scroll', updateState, { passive: true });
}

// ---- Aparición de elementos al hacer scroll ----
function setupScrollReveal() {
    const items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    if (!('IntersectionObserver' in window)) {
        items.forEach(el => el.classList.add('in-view'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    items.forEach(el => observer.observe(el));
}

// ---- "Ver Sala 1" / "Ver Sala 2": muestra/oculta el detalle sin salir de la página ----
function setupRoomToggles() {
    document.querySelectorAll('[data-toggle-room]').forEach(btn => {
        const detail = document.getElementById('roomDetail' + btn.dataset.toggleRoom);
        if (!detail) return;

        btn.addEventListener('click', () => {
            const nowHidden = !detail.hidden;
            detail.hidden = nowHidden;
            btn.textContent = nowHidden
                ? 'Ver Sala ' + btn.dataset.toggleRoom
                : 'Ocultar detalle';
            if (!nowHidden) {
                detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    });
}

// ---- Formulario de reservas (simulado, sin backend) ----
function setupReservationForm() {
    const form = document.getElementById('reservationForm');
    const message = document.getElementById('formMessage');
    if (!form || !message) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        message.textContent = 'Solicitud enviada correctamente — demostración.';
        message.hidden = false;
        form.reset();

        clearTimeout(setupReservationForm._hideTimer);
        setupReservationForm._hideTimer = setTimeout(() => { message.hidden = true; }, 6000);
    });
}
