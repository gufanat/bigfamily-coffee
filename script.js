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
    // 3. ПЛАВНА ЯКІРНА НАВІГАЦІЯ
    // ==========================================
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetSection.getBoundingClientRect().top + window.scrollY - headerHeight;

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
});