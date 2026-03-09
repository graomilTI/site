(() => {
  "use strict";

  const $ = (q, el = document) => el.querySelector(q);
  const $$ = (q, el = document) => Array.from(el.querySelectorAll(q));

  const LINKS = {
    wpp: "https://wa.me/5545998341000",
    fb: "https://www.facebook.com/grao1000",
    ig: "https://www.instagram.com/grao.1000/",
    painel: "https://grao1000.com.br/painel/",
  };

  const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  const navKey = {
    "index.html": "home",
    "solucoes.html": "solucoes",
    "qualidade.html": "qualidade",
    "sobre.html": "sobre",
    "contato.html": "contato",
  }[path] || "home";

  const bindHref = (selectors, href, extra = {}) => {
    selectors.forEach((selector) => {
      const el = $(selector);
      if (!el) return;
      el.href = href;
      Object.entries(extra).forEach(([k, v]) => el.setAttribute(k, v));
    });
  };

  const initActiveNav = () => {
    $$(".nav__link").forEach((a) => {
      if ((a.getAttribute("data-nav") || "") === navKey) a.classList.add("is-active");
    });
  };

  const initMobileNav = () => {
    const burger = $("#burger");
    const mobileNav = $("#mobileNav");
    if (!burger || !mobileNav) return;

    burger.addEventListener("click", () => {
      const open = mobileNav.classList.toggle("is-open");
      mobileNav.setAttribute("aria-hidden", open ? "false" : "true");
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 980) {
        mobileNav.classList.remove("is-open");
        mobileNav.setAttribute("aria-hidden", "true");
      }
    });
  };

  const fmtInt = (n) => {
    try {
      return Number(n).toLocaleString("pt-BR");
    } catch {
      return String(n);
    }
  };

  const animateCount = (el) => {
    const targetRaw = el.getAttribute("data-count");
    if (!targetRaw) return;

    const target = Number(targetRaw);
    if (!Number.isFinite(target)) return;

    const hadPlus = (el.textContent || "").includes("+");
    const duration = 900;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(target * eased);
      el.textContent = fmtInt(value) + (hadPlus ? "+" : "");
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const initCounters = () => {
    const countEls = $$('[data-count]');
    if (!countEls.length || typeof IntersectionObserver === "undefined") {
      countEls.forEach(animateCount);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animateCount(entry.target);
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.35 }
    );

    countEls.forEach((el) => io.observe(el));
  };



  const initReveal = () => {
    const items = $$('[data-anim]');
    if (!items.length) return;

    if (typeof IntersectionObserver === 'undefined') {
      items.forEach((el) => el.classList.add('is-in'));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -40px 0px' });

    items.forEach((el, idx) => {
      el.style.transitionDelay = `${Math.min(idx * 50, 220)}ms`;
      io.observe(el);
    });
  };

  const initMaps = async () => {
    const mapConfigs = [
      { canvasId: "brMap", titleId: "stateTitle", hintId: "stateHint", contactsId: "stateContacts" }
    ].filter((cfg) => document.getElementById(cfg.canvasId));

    if (!mapConfigs.length || !window.RESPONSAVEIS_MAPA) return;

    let svgMarkup = "";
    try {
      const resp = await fetch("assets/img/br-states.svg");
      if (!resp.ok) throw new Error("map svg");
      svgMarkup = await resp.text();
    } catch (err) {
      console.error("Mapa indisponível", err);
      return;
    }

    const ufLabels = {AC:"Acre",AL:"Alagoas",AM:"Amazonas",AP:"Amapá",BA:"Bahia",CE:"Ceará",DF:"Distrito Federal",ES:"Espírito Santo",GO:"Goiás",MA:"Maranhão",MG:"Minas Gerais",MS:"Mato Grosso do Sul",MT:"Mato Grosso",PA:"Pará",PB:"Paraíba",PE:"Pernambuco",PI:"Piauí",PR:"Paraná",RJ:"Rio de Janeiro",RN:"Rio Grande do Norte",RO:"Rondônia",RR:"Roraima",RS:"Rio Grande do Sul",SC:"Santa Catarina",SE:"Sergipe",SP:"São Paulo",TO:"Tocantins"};

    const renderContacts = (cfg, uf) => {
      const title = document.getElementById(cfg.titleId);
      const hint = document.getElementById(cfg.hintId);
      const contacts = document.getElementById(cfg.contactsId);
      const rows = window.RESPONSAVEIS_MAPA[uf] || [];
      if (!title || !hint || !contacts) return;

      title.textContent = ufLabels[uf] || uf;
      hint.textContent = rows.length
        ? `${rows.length} responsável(is) disponível(is) para esta região.`
        : "Ainda sem responsável cadastrado nesta região. Chame no WhatsApp para direcionarmos o atendimento.";

      const toWaLink = (phone) => {
        const digits = String(phone || "").replace(/\D+/g, "");
        const normalized = digits.startsWith("55") ? digits : `55${digits}`;
        return `https://wa.me/${normalized}`;
      };

      contacts.innerHTML = rows.length
        ? rows.map((row) => `
            <article class="contactCard">
              <div class="contactCard__name">${row.nome || "Equipe Grão 1000"}</div>
              <div class="contactCard__hint">${row.sub || "Atendimento regional"}</div>
              <a class="contactCard__fone" href="${toWaLink(row.fone || '(45) 99834-1000')}" target="_blank" rel="noopener">${row.fone || "(45) 99834-1000"}</a>
            </article>
          `).join("")
        : `<article class="contactCard"><div class="contactCard__name">Atendimento Grão 1000</div><div class="contactCard__hint">Direcionamento rápido para sua região.</div><a class="contactCard__fone" href="${LINKS.wpp}" target="_blank" rel="noopener">(45) 99834-1000</a></article>`;
    };

    mapConfigs.forEach((cfg) => {
      const canvas = document.getElementById(cfg.canvasId);
      if (!canvas) return;
      canvas.innerHTML = svgMarkup;
      const ufs = Array.from(canvas.querySelectorAll('[data-uf]'));
      ufs.forEach((el) => el.classList.add('uf'));
      if (!ufs.length) return;

      const activate = (uf) => {
        ufs.forEach((el) => el.classList.toggle('active', (el.getAttribute('data-uf') || '') === uf));
        renderContacts(cfg, uf);
      };

      ufs.forEach((el) => {
        const uf = el.getAttribute('data-uf');
        if (!uf) return;
        el.setAttribute('tabindex', '0');
        el.setAttribute('role', 'button');
        el.setAttribute('aria-label', `Selecionar estado ${ufLabels[uf] || uf}`);
        el.setAttribute('title', ufLabels[uf] || uf);
        el.addEventListener('click', () => activate(uf));
        el.addEventListener('keydown', (ev) => {
          if (ev.key === 'Enter' || ev.key === ' ') {
            ev.preventDefault();
            activate(uf);
          }
        });
      });

      const firstUF = window.RESPONSAVEIS_MAPA.PR ? 'PR' : (Object.keys(window.RESPONSAVEIS_MAPA)[0] || 'PR');
      activate(firstUF);
    });
  };

  const initLinks = () => {
    bindHref(["#wppTop", "#wppTop_m"], LINKS.wpp, { target: "_blank", rel: "noopener" });
    bindHref(["#fbTop", "#fbTop_m", "#fbFooter", "#fbLink"], LINKS.fb, { target: "_blank", rel: "noopener" });
    bindHref(["#igTop", "#igTop_m", "#igFooter", "#igLink"], LINKS.ig, { target: "_blank", rel: "noopener" });
    bindHref(["#painelBtn", "#painelBtn_m", "#painelFooter"], LINKS.painel, { target: "_blank", rel: "noopener" });

    const vagas = $("#vagasFooter");
    if (vagas) vagas.style.display = "none";
  };

  document.addEventListener("DOMContentLoaded", () => {
    initActiveNav();
    initMobileNav();
    initLinks();
    initCounters();
    initReveal();
    initMaps();
  });
})();
