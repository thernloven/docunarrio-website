// Scroll reveal
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const delay = el.dataset.delay || 0;
            setTimeout(() => el.classList.add('revealed'), delay);
            revealObserver.unobserve(el);
        }
    });
}, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

function assignStaggerDelays() {
    const grids = document.querySelectorAll('.features-grid, .stats-grid, .values-grid, .differentiators');
    grids.forEach(grid => {
        grid.querySelectorAll('.reveal').forEach((child, i) => {
            child.dataset.delay = i * 80;
        });
    });
    document.querySelectorAll('.steps-horizontal .reveal').forEach((step, i) => {
        step.dataset.delay = i * 120;
    });
}

function initReveal() {
    assignStaggerDelays();
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}

// Nav scroll
const nav = document.getElementById('nav');
function handleNavScroll() {
    nav.classList.toggle('nav-scrolled', window.scrollY > 20);
}

// Mobile nav
function initMobileNav() {
    const toggle = document.getElementById('nav-toggle');
    const links = document.getElementById('nav-links');
    if (!toggle || !links) return;
    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        links.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            links.classList.remove('open');
        });
    });
}

// Smooth scroll
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const href = anchor.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const top = target.getBoundingClientRect().top + window.scrollY - nav.offsetHeight - 20;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });
}

// Stat counter animation
function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.target);
                const duration = 2000;
                const start = performance.now();

                function update(now) {
                    const elapsed = now - start;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    el.textContent = Math.round(eased * target);
                    if (progress < 1) requestAnimationFrame(update);
                }

                requestAnimationFrame(update);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObserver.observe(c));
}

// Parallax hero device
function initHeroParallax() {
    const device = document.querySelector('.hero-device');
    if (!device) return;
    window.addEventListener('scroll', () => {
        if (window.scrollY < window.innerHeight) {
            device.style.transform = `translateY(${window.scrollY * 0.06}px)`;
        }
    }, { passive: true });
}

// Init
window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll();
initReveal();
initMobileNav();
initSmoothScroll();
initCounters();
initHeroParallax();
