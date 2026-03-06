(() => {
  "use strict";

  const $ = (q, el = document) => el.querySelector(q);
  const $$ = (q, el = document) => Array.from(el.querySelectorAll(q));

  const LINKS = {
    wpp: "https://wa.me/5545998341000",
    fb: "https://www.facebook.com/grao1000",
    ig: "https://www.instagram.com/grao.1000/",
    painel: "https://grao1000.com.br/painel/",
    apresentacao: "assets/docs/apresentacao-grao1000.pdf",
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

  const initLinks = () => {
    bindHref(["#wppTop", "#wppTop_m"], LINKS.wpp, { target: "_blank", rel: "noopener" });
    bindHref(["#fbTop", "#fbTop_m", "#fbFooter", "#fbLink"], LINKS.fb, { target: "_blank", rel: "noopener" });
    bindHref(["#igTop", "#igTop_m", "#igFooter", "#igLink"], LINKS.ig, { target: "_blank", rel: "noopener" });
    bindHref(["#painelBtn", "#painelBtn_m", "#painelFooter"], LINKS.painel, { target: "_blank", rel: "noopener" });
    bindHref(["#grainitBtn", "#grainitBtn_m"], LINKS.apresentacao, { target: "_blank", rel: "noopener" });

    const vagas = $("#vagasFooter");
    if (vagas) vagas.style.display = "none";
  };

  document.addEventListener("DOMContentLoaded", () => {
    initActiveNav();
    initMobileNav();
    initLinks();
    initCounters();
  });
})();
