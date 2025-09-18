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

// Content loading (non-destructive to layout)
document.addEventListener('DOMContentLoaded', () => {
  fetch('assets/data/content.json')
    .then(r => r.ok ? r.json() : null)
    .then(data => {
      if (!data) return;
      const setText = (sel, txt) => { const el = document.querySelector(sel); if (el && typeof txt === 'string') el.textContent = txt; };
      const setHTML = (sel, html) => { const el = document.querySelector(sel); if (el && typeof html === 'string') el.innerHTML = html; };
      const setAttr = (sel, attr, val) => { const el = document.querySelector(sel); if (el && val) el.setAttribute(attr, val); };

      setText('.profile-name', data.profile?.name);
      setText('.static-title', data.profile?.title);
      setText('.passion-line', data.profile?.passion);
      setAttr('.profile-photo', 'src', data.profile?.photo);
      setAttr('.resume-fab', 'href', data.profile?.resume);

      setHTML('.about .about-professional p', data.about?.professional);
      setText('.about .about-personal p', data.about?.personal);
      setHTML('.about .education-condensed p', data.about?.education);

      const expContainer = document.querySelector('.experience .experience-timeline');
      if (expContainer && Array.isArray(data.experience)) {
        expContainer.innerHTML = '';
        data.experience.forEach((exp, i) => {
          const item = document.createElement('div');
          item.className = 'exp-item';
          item.setAttribute('data-aos', i % 2 === 0 ? 'fade-right' : 'fade-left');
          const content = document.createElement('div');
          content.className = 'exp-content';
          content.innerHTML = `
            <h3>${exp.role ?? ''}</h3>
            <p class="company">${exp.company ?? ''}</p>
            <p class="period">${exp.period ?? ''}</p>
          `;
          const ul = document.createElement('ul');
          ul.className = 'achievements';
          (exp.bullets || []).forEach(b => { const li = document.createElement('li'); li.innerHTML = b; ul.appendChild(li); });
          const tags = document.createElement('p');
          tags.className = 'role-tags';
          if (exp.tags) tags.textContent = exp.tags;
          content.appendChild(ul);
          content.appendChild(tags);
          item.appendChild(content);
          expContainer.appendChild(item);
        });
      }

      const coreLine = document.querySelector('.core-stack .core-line');
      if (coreLine && data.skills?.core) coreLine.textContent = data.skills.core;
      const tagWrap = document.querySelector('#extendedSkills .skill-tags');
      if (tagWrap && Array.isArray(data.skills?.tags)) tagWrap.innerHTML = data.skills.tags.map(t => `<span>${t}</span>`).join('');

      const projGrid = document.querySelector('.projects .projects-grid');
      if (projGrid && Array.isArray(data.projects)) {
        projGrid.innerHTML = '';
        data.projects.forEach(p => {
          const card = document.createElement('div'); card.className = 'project-card'; card.setAttribute('data-aos','flip-left');
          const content = document.createElement('div'); content.className = 'project-content';
          const tech = (p.stack||[]).map(s=>`<span>${s}</span>`).join('');
          content.innerHTML = `
            <h3>${p.name ?? ''}</h3>
            <p>${p.description ?? ''}</p>
            <div class="tech-stack">${tech}</div>
            ${p.url ? `<a href="${p.url}" class="btn primary" target="_blank" rel="noopener">View Project <i class=\"fas fa-arrow-right\"></i></a>` : ''}
          `;
          card.appendChild(content); projGrid.appendChild(card);
        });
      }

      if (window.AOS && typeof AOS.refreshHard === 'function') setTimeout(() => AOS.refreshHard(), 50);
    })
    .catch(() => {});
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
