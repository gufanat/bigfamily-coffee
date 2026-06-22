document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.site-header');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link-item');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const menuItems = document.querySelectorAll('.menu-item');
    const modal = document.getElementById('booking-modal');
    const openModalBtns = document.querySelectorAll('.open-booking-btn');
    const closeModalBtn = document.querySelector('.close-modal');
    const bookingForm = document.getElementById('booking-form');
    const phoneInput = document.getElementById('booking-phone');
    const dateInput = document.getElementById('booking-date');

    const setBodyLock = (locked) => {
        document.body.classList.toggle('locked', locked);
    };

    const closeMenu = () => {
        if (!mobileMenuBtn || !navMenu) return;
        mobileMenuBtn.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('active');
        if (!modal?.classList.contains('show')) setBodyLock(false);
    };

    const toggleMenu = () => {
        if (!mobileMenuBtn || !navMenu) return;
        const isOpen = !navMenu.classList.contains('active');
        mobileMenuBtn.classList.toggle('open', isOpen);
        mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
        navMenu.classList.toggle('active', isOpen);
        setBodyLock(isOpen || modal?.classList.contains('show'));
    };

    const updateHeader = () => {
        header?.classList.toggle('scrolled', window.scrollY > 50);
    };

    const scrollToSection = (targetId) => {
        const target = document.querySelector(targetId);
        if (!target || !header) return;

        const headerHeight = header.offsetHeight;
        const extraOffset = targetId === '#contacts' ? 45 : 20;
        const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - extraOffset;

        window.scrollTo({ top, behavior: 'smooth' });
    };

    const openModal = () => {
        if (!modal) return;
        closeMenu();
        modal.classList.add('show');
        modal.setAttribute('aria-hidden', 'false');
        setBodyLock(true);
        document.getElementById('booking-name')?.focus();
    };

    const closeModal = () => {
        if (!modal || !bookingForm) return;
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
        bookingForm.reset();
        phoneInput?.parentElement?.classList.remove('invalid');
        setBodyLock(navMenu?.classList.contains('active') || false);
    };

    const formatPhone = (value) => {
        let digits = value.replace(/\D/g, '');

        if (digits.startsWith('38')) digits = digits.slice(2);
        if (digits.startsWith('0')) digits = digits.slice(1);

        digits = digits.slice(0, 9);

        const code = digits.slice(0, 2);
        const first = digits.slice(2, 5);
        const second = digits.slice(5, 7);
        const third = digits.slice(7, 9);

        let result = '+38 (0' + code;
        if (digits.length > 2) result += ') ' + first;
        if (digits.length > 5) result += '-' + second;
        if (digits.length > 7) result += '-' + third;

        return result;
    };

    const isValidPhone = (value) => /^\+38 \(0\d{2}\) \d{3}-\d{2}-\d{2}$/.test(value);

    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
    mobileMenuBtn?.addEventListener('click', toggleMenu);

    navLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            const targetId = link.getAttribute('href');
            if (!targetId || !targetId.startsWith('#') || targetId === '#') return;

            event.preventDefault();
            closeMenu();
            scrollToSection(targetId);
        });
    });

    document.querySelector('.hero-btn')?.addEventListener('click', (event) => {
        event.preventDefault();
        scrollToSection('#coffee');
    });

    tabButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const targetCategory = button.dataset.target;

            tabButtons.forEach((btn) => btn.classList.remove('active'));
            button.classList.add('active');

            menuItems.forEach((item) => {
                const shouldShow = targetCategory === 'all' || item.dataset.category === targetCategory;
                item.classList.toggle('hidden', !shouldShow);
            });
        });
    });

    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        if (index > 0) section.classList.add('fade-in-section');
    });

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, currentObserver) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                currentObserver.unobserve(entry.target);
            });
        }, { threshold: 0.12 });

        document.querySelectorAll('.fade-in-section').forEach((section) => observer.observe(section));
    } else {
        document.querySelectorAll('.fade-in-section').forEach((section) => section.classList.add('is-visible'));
    }

    openModalBtns.forEach((button) => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            openModal();
        });
    });

    closeModalBtn?.addEventListener('click', closeModal);

    modal?.addEventListener('click', (event) => {
        if (event.target === modal) closeModal();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal?.classList.contains('show')) closeModal();
    });

    if (dateInput) {
        dateInput.min = new Date().toISOString().split('T')[0];
    }

    phoneInput?.addEventListener('focus', () => {
        if (!phoneInput.value) phoneInput.value = '+38 (0';
    });

    phoneInput?.addEventListener('input', () => {
        phoneInput.value = formatPhone(phoneInput.value);
        phoneInput.parentElement?.classList.toggle('invalid', phoneInput.value.length > 0 && !isValidPhone(phoneInput.value));
    });

    bookingForm?.addEventListener('submit', (event) => {
        event.preventDefault();

        if (!bookingForm.reportValidity()) return;

        const phoneGroup = phoneInput?.parentElement;
        if (!phoneInput || !isValidPhone(phoneInput.value)) {
            phoneGroup?.classList.add('invalid');
            phoneInput?.focus();
            return;
        }

        phoneGroup?.classList.remove('invalid');
        const name = document.getElementById('booking-name')?.value.trim() || 'гостю';
        alert(`Дякуємо, ${name}! Ваш столик успішно заброньовано. Очікуйте на дзвінок.`);
        closeModal();
    });
});
