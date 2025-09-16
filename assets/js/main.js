// Initialize AOS
AOS.init({
    duration: 1000,
    once: true
});

// Typing Effect
const typedTextSpan = document.querySelector(".typed-text");
const cursorSpan = document.querySelector(".cursor");

const textArray = ["Data Scientist", "ML Engineer", "AI Specialist"];
const typingDelay = 100;
const erasingDelay = 100;
const newTextDelay = 2000;
let textArrayIndex = 0;
let charIndex = 0;

function type() {
    if (charIndex < textArray[textArrayIndex].length) {
        if(!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
        typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, typingDelay);
    } 
    else {
        cursorSpan.classList.remove("typing");
        setTimeout(erase, newTextDelay);
    }
}

function erase() {
    if (charIndex > 0) {
        if(!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
        typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex-1);
        charIndex--;
        setTimeout(erase, erasingDelay);
    } 
    else {
        cursorSpan.classList.remove("typing");
        textArrayIndex++;
        if(textArrayIndex>=textArray.length) textArrayIndex=0;
        setTimeout(type, typingDelay + 1100);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    if(textArray.length) setTimeout(type, newTextDelay + 250);

    // Dynamic footer year
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // Mobile Menu Toggle with ARIA
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');
    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
            menuBtn.setAttribute('aria-expanded', String(!expanded));
            navLinks.classList.toggle('active');
            menuBtn.classList.toggle('active');
        });
    }

    // Theme toggle and persistence
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    const savedTheme = localStorage.getItem('theme');
    const body = document.body;

    function applyTheme(theme) {
        if (theme === 'dark') body.classList.add('theme-dark');
        else body.classList.remove('theme-dark');
    }

    const initialTheme = savedTheme || (prefersDark.matches ? 'dark' : 'light');
    applyTheme(initialTheme);

    const themeBtn = document.querySelector('.theme-toggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const isDark = document.body.classList.toggle('theme-dark');
            const theme = isDark ? 'dark' : 'light';
            localStorage.setItem('theme', theme);
            themeBtn.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
            themeBtn.setAttribute('title', isDark ? 'Switch to light mode' : 'Switch to dark mode');
        });
        const isDark = body.classList.contains('theme-dark');
        themeBtn.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        themeBtn.setAttribute('title', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    }

    // Style toggle (Glass vs Neumorphic vs Mixed)
    const styleBtn = document.querySelector('.style-toggle');
    const savedStyle = localStorage.getItem('style') || 'glass';

    function setStyleClass(style) {
        body.classList.remove('style-glass', 'style-neo', 'style-mixed');
        if (style === 'neo') body.classList.add('style-neo');
        else if (style === 'mixed') body.classList.add('style-mixed');
        else body.classList.add('style-glass');
        if (styleBtn) {
            const map = { glass: { icon: 'fa-magic', title: 'Switch to Neumorphism' }, neo: { icon: 'fa-layer-group', title: 'Switch to Mixed' }, mixed: { icon: 'fa-clone', title: 'Switch to Glass' } };
            const cfg = map[style];
            styleBtn.innerHTML = `<i class="fas ${cfg.icon}"></i>`;
            styleBtn.setAttribute('title', cfg.title);
        }
    }

    function nextStyle(current) {
        return current === 'glass' ? 'neo' : current === 'neo' ? 'mixed' : 'glass';
    }

    setStyleClass(savedStyle);

    if (styleBtn) {
        styleBtn.addEventListener('click', () => {
            const current = body.classList.contains('style-neo') ? 'neo' : body.classList.contains('style-mixed') ? 'mixed' : 'glass';
            const next = nextStyle(current);
            setStyleClass(next);
            localStorage.setItem('style', next);
        });
    }
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Active Navigation Highlighting
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - sectionHeight/3)) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});
