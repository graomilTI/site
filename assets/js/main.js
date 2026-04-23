document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname.toLowerCase();

  document.querySelectorAll('.nav__link').forEach(link => {
    const href = (link.getAttribute('href') || '').toLowerCase();
    if ((path.endsWith(href) && href) || (href === 'index.html' && (path.endsWith('/') || path.endsWith('/index.html')))) {
      link.classList.add('active');
    }
  });

  const burger = document.getElementById('burger');
  const mobileNav = document.getElementById('mobileNav');
  if (burger && mobileNav) burger.addEventListener('click', () => mobileNav.classList.toggle('is-open'));

  const whatsapp = '5545998341000';
  const wppText = encodeURIComponent('Olá! Vim pelo site da Grão 1000 e gostaria de falar com a equipe.');
  const wppHref = `https://wa.me/${whatsapp}?text=${wppText}`;
  ['wppTop', 'wppTop_m', 'wppCta', 'wppProposta'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.href = wppHref;
      el.target = '_blank';
      el.rel = 'noopener';
    }
  });

  const fb = 'https://www.facebook.com/grao1000';
  const ig = 'https://www.instagram.com/grao.1000';
  ['fbLink', 'fbTop', 'fbTop_m'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.href = fb; el.target = '_blank'; el.rel = 'noopener'; }
  });
  ['igLink', 'igTop', 'igTop_m'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.href = ig; el.target = '_blank'; el.rel = 'noopener'; }
  });

  const revealTargets = document.querySelectorAll('[data-anim], .editorialNote, .flowVertical__item, .miniFlow__item, .aboutTimeline article');
  if ('IntersectionObserver' in window) {
    const revealIO = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });
    revealTargets.forEach((el, idx) => {
      el.style.transitionDelay = `${Math.min(idx % 6, 5) * 70}ms`;
      revealIO.observe(el);
    });
  } else {
    revealTargets.forEach(el => el.classList.add('is-visible'));
  }

  document.querySelectorAll('.count').forEach(el => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const target = Number(el.dataset.count || 0);
        const duration = 1200;
        const start = performance.now();
        const step = (t) => {
          const p = Math.min((t - start) / duration, 1);
          el.textContent = Math.floor(target * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        obs.unobserve(el);
      });
    }, { threshold: 0.6 });
    obs.observe(el);
  });

  document.querySelectorAll('.btn, .pillbtn, .iconbtn').forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      el.style.setProperty('--mx', `${x}px`);
      el.style.setProperty('--my', `${y}px`);
    });
  });

  const heroSection = document.querySelector('.hero, .pageHero');
  const heroInner = document.querySelector('.hero__copy, .pageHero .container');
  if (heroSection && heroInner) {
    window.addEventListener('scroll', () => {
      const rect = heroSection.getBoundingClientRect();
      const offset = Math.max(Math.min(rect.top * -0.05, 22), -6);
      heroInner.style.transform = `translateY(${offset}px)`;
    }, { passive: true });
  }

  const mapMount = document.getElementById('brMap');
  if (!mapMount) return;

  const data = window.RESPONSAVEIS_MAPA || {};
  const defaultContacts = [{ nome: 'Atendimento Grão 1000', sub: 'Atendimento nacional', fone: '(45) 99834-1000' }];
  const stateNames = { AC:'Acre', AL:'Alagoas', AP:'Amapá', AM:'Amazonas', BA:'Bahia', CE:'Ceará', DF:'Distrito Federal', ES:'Espírito Santo', GO:'Goiás', MA:'Maranhão', MT:'Mato Grosso', MS:'Mato Grosso do Sul', MG:'Minas Gerais', PA:'Pará', PB:'Paraíba', PR:'Paraná', PE:'Pernambuco', PI:'Piauí', RJ:'Rio de Janeiro', RN:'Rio Grande do Norte', RS:'Rio Grande do Sul', RO:'Rondônia', RR:'Roraima', SC:'Santa Catarina', SP:'São Paulo', SE:'Sergipe', TO:'Tocantins' };
  const title = document.getElementById('stateTitle');
  const hint = document.getElementById('stateHint');
  const list = document.getElementById('stateContacts');

  const toWhatsappHref = (phone) => {
    const digits = String(phone || '').replace(/\D/g, '');
    const normalized = digits.startsWith('55') ? digits : `55${digits}`;
    const msg = encodeURIComponent('Olá! Vim pelo mapa do site da Grão 1000 e gostaria de falar com o responsável da minha região.');
    return `https://wa.me/${normalized}?text=${msg}`;
  };

  const renderContacts = (uf) => {
    const items = data[uf] || defaultContacts;
    if (title) title.textContent = stateNames[uf] || uf || 'Atendimento nacional';
    if (hint) hint.textContent = items.length === 1 ? '1 contato disponível · clique em entrar em contato para abrir no WhatsApp.' : `${items.length} contatos disponíveis · clique em entrar em contato para abrir no WhatsApp.`;
    if (list) {
      list.innerHTML = items.map(item => {
        const name = String(item.nome || item.name || 'Responsável');
        const sub = String(item.sub || item.city || item.cidade || 'Região');
        const phone = String(item.fone || item.phone || '');
        const initials = name.split(/\s+/).filter(Boolean).slice(0,2).map(p => p.charAt(0)).join('').toUpperCase();
        return `<div class="contactItem"><div class="contactAvatar">${initials}</div><div class="contactBody"><div class="contactName">${name}</div><div class="contactCity">${sub}</div><a class="contactPhone" target="_blank" rel="noopener" href="${toWhatsappHref(phone)}">Entrar em contato</a></div></div>`;
      }).join('');
    }
  };

  const activateState = (states, current) => {
    states.forEach(el => { el.classList.remove('active'); el.style.fill = '#3c596b'; el.style.stroke = '#9fbcce'; });
    current.classList.add('active');
    current.style.fill = '#22c55e';
    current.style.stroke = '#ffffff';
    renderContacts(String(current.dataset.uf || '').toUpperCase());
  };

  const loadMap = async () => {
    const response = await fetch('assets/img/br-states.svg', { cache: 'no-store' });
    if (!response.ok) throw new Error(`Falha ao carregar SVG: ${response.status}`);
    mapMount.innerHTML = await response.text();
    const states = Array.from(mapMount.querySelectorAll('.uf, [data-uf]'));
    if (!states.length) throw new Error('Nenhum estado encontrado no SVG.');
    states.forEach(stateEl => {
      const uf = String(stateEl.dataset.uf || '').toUpperCase();
      stateEl.removeAttribute('tabindex');
      stateEl.removeAttribute('role');
      stateEl.setAttribute('aria-label', `Selecionar estado ${stateNames[uf] || uf}`);
      stateEl.addEventListener('mouseenter', () => {
        if (!stateEl.classList.contains('active')) { stateEl.style.fill = '#2f855a'; stateEl.style.stroke = '#eefef4'; }
      });
      stateEl.addEventListener('mouseleave', () => {
        if (!stateEl.classList.contains('active')) { stateEl.style.fill = '#3c596b'; stateEl.style.stroke = '#9fbcce'; }
      });
      stateEl.addEventListener('click', () => activateState(states, stateEl));
    });
    activateState(states, mapMount.querySelector('[data-uf="PR"]') || mapMount.querySelector('[data-uf="MT"]') || states[0]);
  };

  loadMap().catch((err) => {
    console.error('Erro ao carregar mapa:', err);
    mapMount.innerHTML = '<div class="muted">Não foi possível carregar o mapa agora.</div>';
  });
});
