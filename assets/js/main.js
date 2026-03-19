
(function(){
  const WPP_URL = 'https://wa.me/5545998341000';
  const FB_URL = 'https://www.facebook.com/grao1000';
  const IG_URL = 'https://www.instagram.com/grao.1000';

  function setActiveNav(){
    const links = document.querySelectorAll('.nav__link');
    let path = location.pathname.split('/').pop().toLowerCase();
    if(!path) path = 'index.html';
    links.forEach(link => {
      const href = (link.getAttribute('href') || '').toLowerCase();
      if(href === path) link.classList.add('active');
      else link.classList.remove('active');
    });
  }

  function initMobileMenu(){
    const burger = document.getElementById('burger');
    const mobile = document.getElementById('mobileNav');
    if(!burger || !mobile) return;
    burger.addEventListener('click', () => {
      mobile.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', mobile.classList.contains('is-open') ? 'true' : 'false');
    });
  }

  function wireLinks(){
    ['wppTop','wppTop_m','wppCta','wppProposta'].forEach(id => {
      const el = document.getElementById(id);
      if(el) el.href = WPP_URL;
    });
    ['fbLink'].forEach(id => {
      const el = document.getElementById(id);
      if(el) { el.href = FB_URL; el.target = '_blank'; el.rel = 'noopener'; }
    });
    ['igLink'].forEach(id => {
      const el = document.getElementById(id);
      if(el) { el.href = IG_URL; el.target = '_blank'; el.rel = 'noopener'; }
    });
  }

  function animateCounts(){
    const items = document.querySelectorAll('.count');
    if(!items.length) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if(!entry.isIntersecting) return;
        const el = entry.target;
        const end = Number(el.dataset.count || 0);
        const duration = 1200;
        const start = performance.now();
        const step = (now) => {
          const p = Math.min((now - start) / duration, 1);
          el.textContent = Math.round(end * (1 - Math.pow(1-p, 3)));
          if(p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        io.unobserve(el);
      });
    }, {threshold:.45});
    items.forEach(el => io.observe(el));
  }

  async function initMap(){
    const host = document.getElementById('brMap');
    if(!host) return;
    try{
      const resp = await fetch('assets/img/br-states.svg');
      const svgText = await resp.text();
      host.innerHTML = svgText;
      const svg = host.querySelector('svg');
      if(!svg) throw new Error('SVG não encontrado');
      const title = document.getElementById('stateTitle');
      const hint = document.getElementById('stateHint');
      const list = document.getElementById('stateContacts');
      const data = window.RESPONSAVEIS_MAPA || {};

      function telHref(fone){
        return 'https://wa.me/55' + String(fone || '').replace(/\D/g,'');
      }
      function renderUF(uf){
        const people = data[uf] || [];
        title.textContent = uf + ' • responsáveis';
        hint.textContent = people.length ? 'Clique no telefone para abrir no WhatsApp.' : 'Ainda sem responsável cadastrado para este estado.';
        list.innerHTML = people.length ? people.map(p => `\n          <article class="contactCard">\n            <strong>${p.nome}</strong>\n            <span class="muted">${p.sub || ''}</span>\n            <a href="${telHref(p.fone)}" target="_blank" rel="noopener">${p.fone}</a>\n          </article>\n        `).join('') : '<article class="contactCard"><strong>Sem cadastro</strong><span class="muted">Chame no WhatsApp e direcionamos o atendimento.</span><a href="'+WPP_URL+'" target="_blank" rel="noopener">(45) 99834-1000</a></article>';
      }

      const states = svg.querySelectorAll('[data-uf]');
      states.forEach(node => {
        node.addEventListener('mouseenter', () => node.classList.add('is-hover'));
        node.addEventListener('mouseleave', () => node.classList.remove('is-hover'));
        node.addEventListener('click', () => {
          states.forEach(n => n.classList.remove('active'));
          node.classList.add('active');
          renderUF(node.dataset.uf);
        });
      });
      renderUF('PR');
      const pr = svg.querySelector('[data-uf="PR"]');
      if(pr) pr.classList.add('active');
    }catch(err){
      host.innerHTML = '<div class="muted">Não foi possível carregar o mapa agora.</div>';
      console.error(err);
    }
  }

  document.addEventListener('DOMContentLoaded', function(){
    setActiveNav();
    initMobileMenu();
    wireLinks();
    animateCounts();
    initMap();
  });
})();
