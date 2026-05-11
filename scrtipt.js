(function() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slider-dots .dot');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    const kpiSection = document.getElementById('kpiSection');
    const kpiNumbers = document.querySelectorAll('.kpi-number');
    const allNavLinks = document.querySelectorAll('.nav-links a');

    let currentSlide = 0;
    const totalSlides = slides.length;
    let slideInterval;
    let kpiAnimated = false;

    function toggleMenu() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('open');
        mobileOverlay.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    }

    function closeMenu() {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', toggleMenu);
    mobileOverlay.addEventListener('click', closeMenu);
    allNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('open')) closeMenu();
        });
    });

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    });

    function goToSlide(index) {
        slides.forEach(s => s.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));
        currentSlide = index;
        if (currentSlide < 0) currentSlide = totalSlides - 1;
        if (currentSlide >= totalSlides) currentSlide = 0;
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    function nextSlideFn() { goToSlide(currentSlide + 1); }
    function prevSlideFn() { goToSlide(currentSlide - 1); }

    function resetInterval() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlideFn, 5500);
    }

    nextBtn.addEventListener('click', () => { nextSlideFn(); resetInterval(); });
    prevBtn.addEventListener('click', () => { prevSlideFn(); resetInterval(); });
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.getAttribute('data-index'));
            goToSlide(index);
            resetInterval();
        });
    });

    const heroSlider = document.getElementById('heroSlider');
    heroSlider.addEventListener('mouseenter', () => clearInterval(slideInterval));
    heroSlider.addEventListener('mouseleave', () => resetInterval());

    let touchStartX = 0;
    heroSlider.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
    heroSlider.addEventListener('touchend', (e) => {
        const diff = touchStartX - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) nextSlideFn(); else prevSlideFn();
            resetInterval();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') { nextSlideFn(); resetInterval(); }
        else if (e.key === 'ArrowLeft') { prevSlideFn(); resetInterval(); }
    });

    slideInterval = setInterval(nextSlideFn, 5500);

    function animateKPI(element) {
        const target = parseFloat(element.getAttribute('data-target'));
        const decimals = parseInt(element.getAttribute('data-decimals')) || 0;
        const duration = 2000;
        const startTime = performance.now();
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            element.textContent = (0 + (target - 0) * eased).toFixed(decimals);
            if (progress < 1) requestAnimationFrame(update);
            else element.textContent = target.toFixed(decimals);
        }
        requestAnimationFrame(update);
    }

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !kpiAnimated) {
                    kpiAnimated = true;
                    kpiNumbers.forEach(num => animateKPI(num));
                    observer.unobserve(kpiSection);
                }
            });
        }, { threshold: 0.25 });
        observer.observe(kpiSection);
    } else {
        window.addEventListener('scroll', function checkKPI() {
            if (kpiAnimated) return;
            const rect = kpiSection.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.75 && rect.bottom > window.innerHeight * 0.25) {
                kpiAnimated = true;
                kpiNumbers.forEach(num => animateKPI(num));
            }
        });
        window.dispatchEvent(new Event('scroll'));
    }

    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        let scrollPos = window.scrollY + 120;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            if (scrollPos >= top && scrollPos < top + height) {
                const id = section.getAttribute('id');
                allNavLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) link.classList.add('active');
                });
            }
        });
    });

    allNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#') && href.length > 1) {
                e.preventDefault();
                const targetEl = document.querySelector(href);
                if (targetEl) {
                    const navHeight = navbar.offsetHeight;
                    window.scrollTo({ top: targetEl.offsetTop - navHeight - 10, behavior: 'smooth' });
                }
            }
        });
    });

    console.log('🏔️ Pirtak Minerals — Website ready.');
})();