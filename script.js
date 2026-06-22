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
    // 2. ФІЛЬТРАЦІЯ КАВОВОЇ КАРТИ (ТАБИ)
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
    // 3. ПЛАВНИЙ СКРОЛ ДО РОЗДІЛІВ (Оновлено відступи)
    // ==========================================
    const links = document.querySelectorAll('.nav-links a, .hero-btn');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = header.offsetHeight;
                // Для контактів (футера) робимо більший додатковий відступ (45px), щоб секцію було повністю видно
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
    // 4. ПЛАВНА ПОЯВА БЛОКІВ ПРИ СКРОЛІ (Fade-in)
    // ==========================================
    const sections = document.querySelectorAll('section');
    
    sections.forEach((section, index) => {
        if (index !== 0) { // Перший екран показуємо одразу
            section.classList.add('fade-in-section');
        }
    });

    const observerOptions = {
        root: null,
        threshold: 0.15
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
    // 5. ЛОГІКА МОДАЛЬНОГО ВІКНА ТА МАСКА ТЕЛЕФОНУ
    // ==========================================
    const modal = document.getElementById('booking-modal');
    const openModalBtns = document.querySelectorAll('.open-booking-btn');
    const closeModalBtn = document.querySelector('.close-modal');
    const bookingForm = document.getElementById('booking-form');
    const phoneInput = document.getElementById('booking-phone');
    const phoneGroup = phoneInput.parentElement;

    // Відкриття вікна
    openModalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('show');
            document.body.style.overflow = 'hidden'; // Блокуємо скрол фону сторінки
        });
    });

    // Функція закриття вікна
    const closeModal = () => {
        modal.classList.remove('show');
        document.body.style.overflow = ''; // Повертаємо скрол сторінки
        bookingForm.reset();
        phoneGroup.classList.remove('invalid');
    };

    closeModalBtn.addEventListener('click', closeModal);
    
    // Закриття при кліку поза межами форми (на темний фон)
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Строга інтелектуальна маска для введення телефону: +38 (0XX) XXX-XX-XX
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

    // Автоматична підказка-префікс при фокусі на поле
    phoneInput.addEventListener('focus', function () {
        if (this.value === "") {
            this.value = "+38 (0";
        }
    });

    // Валідація форми перед відправкою
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Повна довжина рядка з маскою має становити рівно 19 символів
        if (phoneInput.value.length < 19) {
            phoneGroup.classList.add('invalid');
            phoneInput.focus();
        } else {
            phoneGroup.classList.remove('invalid');
            
            alert(`Дякуємо, ${document.getElementById('booking-name').value}! Ваш столик успішно заброньовано. Очікуйте на дзвінок-підтвердження.`);
            closeModal();
        }
    });
});