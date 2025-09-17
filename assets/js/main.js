// Minimal portfolio script (chat assistant removed)
// Initialize AOS animations
AOS.init({ duration: 1000, once: true });

document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    const revealOffset = 320;
    const maybeToggle = () => {
      if (window.scrollY > revealOffset) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    };
    window.addEventListener('scroll', maybeToggle, { passive: true });
    maybeToggle();
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});

// Smooth internal anchor scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const targetId = anchor.getAttribute('href');
    if (!targetId) return;
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
  });
});

// Active navigation highlighting
window.addEventListener('scroll', () => {
  let current = '';
  document.querySelectorAll('main section').forEach(section => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= window.innerHeight * 0.33 && rect.bottom > window.innerHeight * 0.33) {
      current = section.getAttribute('id');
    }
  });
  document.querySelectorAll('.nav-vertical a').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href').slice(1) === current) {
      link.classList.add('active');
    }
  });
});
