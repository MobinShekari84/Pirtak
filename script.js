// Slider
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
let curr = 0;

const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('open');
    });
}

function goTo(i) {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    curr = (i + slides.length) % slides.length;
    slides[curr].classList.add('active');
    dots[curr].classList.add('active');
}

document.querySelector('.slider-arrow.next').addEventListener('click', () => goTo(curr + 1));
document.querySelector('.slider-arrow.prev').addEventListener('click', () => goTo(curr - 1));
dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));
setInterval(() => goTo(curr + 1), 5500);

// KPI Counter Animation
const kpiNums = document.querySelectorAll('.kpi-number');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            kpiNums.forEach(num => {
                const target = +num.getAttribute('data-target');
                let start = null;
                function step(timestamp) {
                    if (!start) start = timestamp;
                    const progress = Math.min((timestamp - start) / 2000, 1);
                    num.textContent = Math.floor(progress * target);
                    if (progress < 1) requestAnimationFrame(step);
                }
                requestAnimationFrame(step);
            });
            observer.disconnect();
        }
    });
}, { threshold: 0.5 });

const kpiSection = document.querySelector('.kpi-section');
if (kpiSection) observer.observe(kpiSection);