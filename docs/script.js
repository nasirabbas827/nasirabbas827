'use strict';
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const motionButton = document.querySelector('#motion-toggle');
let motionPaused = reducedMotion.matches;
function setMotion(paused) {
  motionPaused = paused;
  document.body.classList.toggle('motion-paused', paused);
  motionButton.textContent = paused ? 'Enable motion' : 'Pause motion';
  motionButton.setAttribute('aria-pressed', String(paused));
}
setMotion(motionPaused);
motionButton.addEventListener('click', () => setMotion(!motionPaused));
reducedMotion.addEventListener('change', event => setMotion(event.matches));
if (!reducedMotion.matches && 'IntersectionObserver' in window) {
  document.body.classList.add('js-motion');
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    }
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}
const menu = document.querySelector('.header nav');
const menuToggle = document.querySelector('.menu-toggle');
function closeMenu(){menu.classList.remove('open'); menuToggle.setAttribute('aria-expanded','false'); menuToggle.setAttribute('aria-label','Open navigation');}
menuToggle.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => {if(e.key === 'Escape'){closeMenu();}});
const filters = document.querySelectorAll('.filter');
filters.forEach(button => button.addEventListener('click', () => {
  filters.forEach(b => {b.classList.remove('active'); b.setAttribute('aria-pressed', 'false');});
  button.classList.add('active'); button.setAttribute('aria-pressed', 'true');
  let count = 0;
  document.querySelectorAll('.project').forEach(project => {
    const show = button.dataset.filter === 'all' || project.dataset.category.split(' ').includes(button.dataset.filter);
    project.hidden = !show;
    if(show) {count++;project.classList.add('visible');}
  });
  document.querySelector('#filter-status').textContent = `${count} projects shown.`;
}));
const copyButton = document.querySelector('#copy-email');
copyButton.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText('nasiryt.827@gmail.com');
    copyButton.textContent = 'Email copied ✓';
    document.querySelector('#copy-status').textContent = 'Email address copied to clipboard.';
  } catch (_) {
    document.querySelector('#copy-status').textContent = 'Copy unavailable. Email: nasiryt.827@gmail.com';
    copyButton.textContent = 'Select email below';
  }
});
document.querySelector('#year').textContent = new Date().getFullYear();
let scrollTick = false;
window.addEventListener('scroll', () => {
  if(scrollTick) return;
  scrollTick = true;
  requestAnimationFrame(() => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    document.querySelector('.scroll-progress').style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
    scrollTick = false;
  });
}, {passive:true});
const loadButton = document.querySelector('#load-repos');
loadButton.addEventListener('click', async () => {
  const status = document.querySelector('#repo-status');
  const container = document.querySelector('#live-repos');
  loadButton.disabled = true; status.textContent = 'Loading public projects from GitHub…';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch('https://api.github.com/users/nasirabbas827/repos?sort=updated&per_page=30&type=owner', {signal:controller.signal});
    if(!response.ok) throw new Error('GitHub unavailable');
    const data = await response.json();
    if(!Array.isArray(data)) throw new Error('Unexpected GitHub response');
    const repos = data.filter(repo => !repo.fork && !repo.archived && repo.size > 0 && repo.name !== 'nasirabbas827' && repo.name !== 'nasirabbas827.github.io').slice(0,6);
    container.replaceChildren();
    repos.forEach(repo => {
      const card = document.createElement('a');card.className = 'repo-card';
      card.href = `https://github.com/nasirabbas827/${encodeURIComponent(repo.name)}`;card.target='_blank';card.rel='noopener noreferrer';
      const title=document.createElement('h4');title.textContent=repo.name.replace(/[-_]+/g,' ')+' ↗';
      const desc=document.createElement('p');desc.textContent=repo.description || 'Explore the source code and project details on GitHub.';
      const meta=document.createElement('small');meta.textContent=`${repo.language || 'Repository'} · Updated ${new Date(repo.updated_at).toLocaleDateString(undefined,{month:'short',year:'numeric'})}`;
      card.append(title,desc,meta);container.append(card);
    });
    status.textContent = repos.length ? 'Latest public repositories, loaded from GitHub.' : 'No matching repositories found. Browse all projects on GitHub above.';
    loadButton.textContent = 'Refresh projects ↻';
  } catch (_) {
    status.textContent = 'GitHub is temporarily unavailable or its request limit was reached. Use “Browse all on GitHub” above, or try again.';
    loadButton.textContent='Try again ↻';
  } finally {clearTimeout(timeout);loadButton.disabled=false;}
});
