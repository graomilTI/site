(function(){
  const WHATSAPP_NUMBER = '5545998341000';
  const WHATSAPP_TEXT = encodeURIComponent('Olá! Vim pelo site da Grão 1000 e gostaria de falar com um especialista.');
  const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_TEXT}`;
  const FB_LINK = 'https://www.facebook.com/grao1000';
  const IG_LINK = 'https://www.instagram.com/grao.1000';

  function setLinks(){
    ['wppTop','wppTop_m','wppCta','wppProposta'].forEach(id=>{
      const el = document.getElementById(id);
      if(el) { el.href = WHATSAPP_LINK; el.target = '_blank'; el.rel = 'noopener'; }
    });
    ['fbLink','fbTop','fbTop_m'].forEach(id=>{ const el=document.getElementById(id); if(el){ el.href=FB_LINK; el.target='_blank'; el.rel='noopener'; }});
    ['igLink','igTop','igTop_m'].forEach(id=>{ const el=document.getElementById(id); if(el){ el.href=IG_LINK; el.target='_blank'; el.rel='noopener'; }});
  }

  function setActiveNav(){
    const path = (window.location.pathname.toLowerCase().split('/').pop() || 'index.html');
    document.querySelectorAll('.nav__link').forEach(link=>{
      const href = (link.getAttribute('href') || '').toLowerCase();
      link.classList.toggle('active', href === path || (path === '' && href === 'index.html'));
    });
  }

  function mobileMenu(){
    const burger = document.getElementById('burger');
    const mobileNav = document.getElementById('mobileNav');
    if(!burger || !mobileNav) return;
    burger.addEventListener('click', ()=>{
      const open = mobileNav.classList.toggle('is-open');
      mobileNav.setAttribute('aria-hidden', open ? 'false' : 'true');
    });
    mobileNav.querySelectorAll('a').forEach(a=>a.addEventListener('click', ()=> mobileNav.classList.remove('is-open')));
  }

  function animateCounts(){
    const els = document.querySelectorAll('.count[data-count]');
    if(!els.length) return;
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(!entry.isIntersecting) return;
        const el = entry.target;
        const end = Number(el.dataset.count || 0);
        const duration = 1100;
        const start = performance.now();
        function frame(now){
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = String(Math.round(end * eased));
          if(progress < 1) requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
        io.unobserve(el);
      });
    }, {threshold: .45});
    els.forEach(el=>io.observe(el));
  }

  async function loadMap(){
    const mapHost = document.getElementById('brMap');
    if(!mapHost) return;
    try {
      const resp = await fetch('assets/img/br-states.svg');
      const svgText = await resp.text();
      mapHost.innerHTML = svgText;
      const svg = mapHost.querySelector('svg');
      if(!svg) return;
      svg.setAttribute('id', 'mapa-brasil');
      const titleEl = document.getElementById('stateTitle');
      const hintEl = document.getElementById('stateHint');
      const contactsEl = document.getElementById('stateContacts');
      const data = window.RESPONSAVEIS_MAPA || {};

      function normalizePhone(phone){
        return '55' + String(phone).replace(/\D+/g, '');
      }
      function renderState(uf){
        const list = data[uf] || [];
        if(titleEl) titleEl.textContent = list.length ? `${uf} • responsáveis` : `${uf} • sem responsável cadastrado`;
        if(hintEl) hintEl.textContent = list.length ? 'Clique no telefone para abrir no WhatsApp.' : 'Chame no WhatsApp e direcionamos o atendimento.';
        if(!contactsEl) return;
        contactsEl.innerHTML = '';
        if(!list.length) return;
        list.forEach(item=>{
          const wrap = document.createElement('article');
          wrap.className = 'contactItem';
          wrap.innerHTML = `
            <div class="contactItem__name">${item.nome}</div>
            <div class="contactItem__sub">${item.sub}</div>
            <a class="contactItem__phone" href="https://wa.me/${normalizePhone(item.fone)}" target="_blank" rel="noopener">${item.fone}</a>
          `;
          contactsEl.appendChild(wrap);
        });
      }

      const states = svg.querySelectorAll('[data-uf]');
      states.forEach(path=>{
        path.addEventListener('click', ()=>{
          states.forEach(p=>p.classList.remove('active'));
          path.classList.add('active');
          renderState(path.getAttribute('data-uf'));
        });
      });
      const defaultUf = 'PR';
      const def = svg.querySelector(`[data-uf="${defaultUf}"]`);
      if(def){ def.classList.add('active'); renderState(defaultUf); }
    } catch (err) {
      mapHost.innerHTML = '<div class="muted">Não foi possível carregar o mapa agora.</div>';
    }
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    setLinks();
    setActiveNav();
    mobileMenu();
    animateCounts();
    loadMap();
  });
})();
