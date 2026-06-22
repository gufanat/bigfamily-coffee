document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. АНІМАЦІЯ ШАПКИ ПРИ СКРОЛІ
    // ==========================================
    const header = document.querySelector('header');
    const headerContainer = document.querySelector('.header-container');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            headerContainer.style.padding = '10px 0';
            header.style.backgroundColor = 'rgba(253, 251, 247, 0.98)';
            header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
        } else {
            headerContainer.style.padding = '20px 0';
            header.style.backgroundColor = 'rgba(253, 251, 247, 0.95)';
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
        }
    });

    // ==========================================
    // 2. МОБІЛЬНЕ МЕНЮ (БУРГЕР)
    // ==========================================
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinksList = document.querySelectorAll('.nav-link-item, .mobile-nav-btn');

    const toggleMenu = () => {
        mobileMenuBtn.classList.toggle('open');
        navMenu.classList.toggle('active');
        
        // Блокуємо скрол основного екрана, коли меню відкрите
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    };

    mobileMenuBtn.addEventListener('click', toggleMenu);

    // Закриваємо меню при кліку на будь-яке посилання в ньому
    navLinksList.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // ==========================================
    // 3. ФІЛЬТРАЦІЯ КАВОВОЇ КАРТИ (ТАБИ)
    // ==========================================
    const tabButtons = document.querySelectorAll('.tab-btn');
    const menuItems = document.querySelectorAll('.menu-item');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const targetCategory = button.getAttribute('data-target');

            menuItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                
                if (targetCategory === 'all' || itemCategory === targetCategory) {
                    item.style.display = 'flex';
                    setTimeout(() => { item.style.opacity = '1'; }, 10);
                } else {
                    item.style.display = 'none';
                    item.style.opacity = '0';
                }
            });
        });
    });

    // ==========================================
    // 4. ПЛАВНИЙ СКРОЛ ДО РОЗДІЛІВ З КОДУВАННЯМ ОФСЕТУ
    // ==========================================
    const links = document.querySelectorAll('.nav-link-item, .hero-btn');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = header.offsetHeight;
                const extraOffset = targetId === '#contacts' ? 45 : 20;
                const targetPosition = targetSection.getBoundingClientRect().top + window.scrollY - headerHeight - extraOffset;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==========================================
    // 5. ПЛАВНА ПОЯВА БЛОКІВ ПРИ СКРОЛІ (Fade-in)
    // ==========================================
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        if (index !== 0) { 
            section.classList.add('fade-in-section');
        }
    });

    const observerOptions = {
        root: null,
        threshold: 0.12
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedSections = document.querySelectorAll('.fade-in-section');
    animatedSections.forEach(section => observer.observe(section));

    // ==========================================
    // 6. ЛОГІКА МОДАЛЬНОГО ВІКНО ТА МАСКА ТЕЛЕФОНУ
    // ==========================================
    const modal = document.getElementById('booking-modal');
    const openModalBtns = document.querySelectorAll('.open-booking-btn');
    const closeModalBtn = document.querySelector('.close-modal');
    const bookingForm = document.getElementById('booking-form');
    const phoneInput = document.getElementById('booking-phone');
    const phoneGroup = phoneInput.parentElement;

    openModalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('show');
            document.body.style.overflow = 'hidden'; 
        });
    });

    const closeModal = () => {
        modal.classList.remove('show');
        // Повертаємо скрол тільки якщо мобільний бургер теж закритий
        if (!navMenu.classList.contains('active')) {
            document.body.style.overflow = '';
        }
        bookingForm.reset();
        phoneGroup.classList.remove('invalid');
    };

    closeModalBtn.addEventListener('click', closeModal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Строга маска для введення телефону: +38 (0XX) XXX-XX-XX
    phoneInput.addEventListener('input', function (e) {
        let matrix = "+38 (0__) ___-__-__",
            i = 0,
            def = matrix.replace(/\D/g, ""),
            val = this.value.replace(/\D/g, "");
        
        if (def.length >= val.length) val = def;
        
        this.value = matrix.replace(/./g, function(a) {
            return /[_\d]/.test(a) && i < val.length ? val.charAt(i++) : i >= val.length ? "" : a;
        });
    });

    phoneInput.addEventListener('focus', function () {
        if (this.value === "") {
            this.value = "+38 (0";
        }
    });

    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (phoneInput.value.length < 19) {
            phoneGroup.classList.add('invalid');
            phoneInput.focus();
        } else {
            phoneGroup.classList.remove('invalid');
            alert(`Дякуємо, ${document.getElementById('booking-name').value}! Ваш столик успішно заброньовано. Очікуйте на дзвінок.`);
            closeModal();
        }
    });
});