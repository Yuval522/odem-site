// Shared interactions (from the original landing page script, made page-agnostic).
document.addEventListener('DOMContentLoaded', () => {
    // 1. Sliding Doors Click Handler
    const doorsOverlay = document.getElementById('gallery-doors');
    if (doorsOverlay) {
        doorsOverlay.addEventListener('click', () => {
            doorsOverlay.classList.add('opened');
            const activeFilter = document.querySelector('.filter-btn.active');
            if (activeFilter) activeFilter.click();
        });
    }

    // 2. Dynamic Gallery Filters
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filterValue = btn.getAttribute('data-filter');
            galleryItems.forEach(item => {
                const categories = (item.getAttribute('data-category') || '').split(' ');
                if (filterValue === 'all' || categories.includes(filterValue)) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });
    const activeFilterOnLoad = document.querySelector('.filter-btn.active');
    if (activeFilterOnLoad) activeFilterOnLoad.click();

    // 3. Navbar scroll background effect (pages without a hero keep it solid)
    const navbar = document.querySelector('.navbar');
    const solid = document.body.classList.contains('solid-nav');
    const onScroll = () => {
        if (solid || window.scrollY > 50) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // 4. Mobile Menu Toggle
    const menuToggle = document.getElementById('menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navbar.classList.toggle('menu-open');
            menuToggle.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', navbar.classList.contains('menu-open'));
        });
    }
    document.querySelectorAll('.navbar nav a').forEach(link => {
        link.addEventListener('click', () => {
            navbar.classList.remove('menu-open');
            if (menuToggle) menuToggle.classList.remove('active');
        });
    });

    // 5. Gallery Lightbox Modal
    const lightbox = document.getElementById('image-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCloseBtn = document.getElementById('lightbox-close-btn');
    if (lightbox && lightboxImg) {
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                if (!img) return;
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt || '';
                lightbox.classList.add('active');
                lightbox.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
            });
        });
        const closeLightbox = () => {
            lightbox.classList.remove('active');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        };
        if (lightboxCloseBtn) {
            lightboxCloseBtn.addEventListener('click', (e) => { e.stopPropagation(); closeLightbox(); });
        }
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.classList.contains('lightbox-content')) closeLightbox();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox();
        });
    }

    // 6. Contact form: details go straight to our WhatsApp (no third-party form service)
    const form = document.querySelector('form[name="consultation"]');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!form.checkValidity()) { form.reportValidity(); return; }
            const d = new FormData(form);
            if (d.get('bot-field')) return;
            const v = (k) => (d.get(k) || '').toString().trim();
            const lines = [
                'פנייה חדשה מהאתר',
                'שם: ' + v('name'),
                'טלפון: ' + v('phone'),
                v('email') && 'אימייל: ' + v('email'),
                v('city') && 'יישוב: ' + v('city'),
                'פרויקט: ' + v('project_type'),
                v('message') && 'פרטים: ' + v('message'),
            ].filter(Boolean);
            window.location.href = 'https://wa.me/972507400143?text=' + encodeURIComponent(lines.join('\n'));
        });
    }
});
