document.addEventListener("DOMContentLoaded", () => {
  const path = (window.location.pathname || "").toLowerCase();

  document.querySelectorAll(".nav__link").forEach((link) => {
    const href = (link.getAttribute("href") || "").toLowerCase();
    const isHome = href === "index.html" && (path.endsWith("/") || path.endsWith("/index.html"));
    const isMatch = href && path.endsWith(href);
    if (isHome || isMatch) link.classList.add("active");
  });

  const burger = document.getElementById("burger");
  const mobileNav = document.getElementById("mobileNav");
  if (burger && mobileNav) {
    burger.addEventListener("click", () => mobileNav.classList.toggle("is-open"));
  }

  const whatsapp = "5545998341000";
  const siteMessage = encodeURIComponent("Olá! Vim pelo site da Grão 1000 e gostaria de falar com a equipe.");
  const whatsappHref = `https://wa.me/${whatsapp}?text=${siteMessage}`;
  ["wppTop", "wppTop_m", "wppCta", "wppProposta"].forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.href = whatsappHref;
    el.target = "_blank";
    el.rel = "noopener";
  });

  const socialLinks = {
    fb: "https://www.facebook.com/grao1000",
    ig: "https://www.instagram.com/grao.1000",
  };

  ["fbLink", "fbTop", "fbTop_m"].forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.href = socialLinks.fb;
    el.target = "_blank";
    el.rel = "noopener";
  });

  ["igLink", "igTop", "igTop_m"].forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.href = socialLinks.ig;
    el.target = "_blank";
    el.rel = "noopener";
  });

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        });
      },
      { threshold: 0.16 }
    );

    document.querySelectorAll("[data-anim]").forEach((el) => revealObserver.observe(el));

    document.querySelectorAll(".count").forEach((el) => {
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
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
        },
        { threshold: 0.6 }
      );

      obs.observe(el);
    });
  } else {
    document.querySelectorAll("[data-anim]").forEach((el) => el.classList.add("is-visible"));
  }

  initContactMap();
});

function initContactMap() {
  const mapMount = document.getElementById("brMap");
  if (!mapMount) return;

  const titleEl = document.getElementById("stateTitle");
  const hintEl = document.getElementById("stateHint");
  const listEl = document.getElementById("stateContacts");

  const normalizeData = (raw) => {
    const normalized = {};
    Object.entries(raw || {}).forEach(([uf, items]) => {
      normalized[String(uf).toUpperCase()] = (items || []).map((item) => ({
        name: item.name || item.nome || "Atendimento Grão 1000",
        city: item.city || item.sub || item.cidade || "Atendimento regional",
        phone: item.phone || item.fone || item.telefone || "(45) 99834-1000",
      }));
    });
    return normalized;
  };

  const contactsByState = normalizeData(window.RESPONSAVEIS_MAPA || {});
  const fallbackContacts = [
    { name: "Atendimento Grão 1000", city: "Atendimento nacional", phone: "(45) 99834-1000" },
  ];

  const formatStateName = (uf) => {
    const names = {
      AC: "Acre", AL: "Alagoas", AP: "Amapá", AM: "Amazonas", BA: "Bahia", CE: "Ceará", DF: "Distrito Federal",
      ES: "Espírito Santo", GO: "Goiás", MA: "Maranhão", MT: "Mato Grosso", MS: "Mato Grosso do Sul",
      MG: "Minas Gerais", PA: "Pará", PB: "Paraíba", PR: "Paraná", PE: "Pernambuco", PI: "Piauí",
      RJ: "Rio de Janeiro", RN: "Rio Grande do Norte", RS: "Rio Grande do Sul", RO: "Rondônia", RR: "Roraima",
      SC: "Santa Catarina", SP: "São Paulo", SE: "Sergipe", TO: "Tocantins",
    };
    return names[uf] || uf;
  };

  const buildWhatsappLink = (phone) => {
    const digits = String(phone || "").replace(/\D/g, "");
    const withCountryCode = digits.startsWith("55") ? digits : `55${digits}`;
    const msg = encodeURIComponent("Olá! Vim pelo mapa do site da Grão 1000.");
    return `https://wa.me/${withCountryCode}?text=${msg}`;
  };

  const renderContacts = (uf) => {
    const stateUf = String(uf || "").toUpperCase();
    const contacts = contactsByState[stateUf] || fallbackContacts;

    if (titleEl) titleEl.textContent = formatStateName(stateUf);
    if (hintEl) {
      const count = contacts.length;
      hintEl.textContent = `${count} contato${count > 1 ? "s disponíveis" : " disponível"} · clique em falar agora para abrir no WhatsApp.`;
    }

    if (!listEl) return;

    listEl.innerHTML = contacts
      .map((item) => {
        const initials = String(item.name)
          .split(" ")
          .filter(Boolean)
          .slice(0, 2)
          .map((part) => part[0])
          .join("")
          .toUpperCase();

        return `
          <article class="contactItem">
            <div class="contactAvatar" aria-hidden="true">${initials}</div>
            <div class="contactBody">
              <div class="contactName">${item.name}</div>
              <div class="contactCity">${item.city}</div>
              <div class="contactActions">
                <a class="contactPhone" target="_blank" rel="noopener" href="${buildWhatsappLink(item.phone)}">Falar agora</a>
                <a class="contactGhost" target="_blank" rel="noopener" href="tel:${String(item.phone).replace(/\D/g, "")}">${item.phone}</a>
              </div>
            </div>
          </article>
        `;
      })
      .join("");
  };

  fetch("assets/img/br-states.svg")
    .then((response) => {
      if (!response.ok) throw new Error("map-fetch-failed");
      return response.text();
    })
    .then((svg) => {
      mapMount.innerHTML = svg;
      const svgEl = mapMount.querySelector("svg");
      if (svgEl) svgEl.classList.add("brMapSvg");

      const states = [...mapMount.querySelectorAll(".uf, [data-uf]")];
      if (!states.length) throw new Error("map-states-not-found");

      const activateState = (uf) => {
        const targetUf = String(uf || "").toUpperCase();
        states.forEach((node) => {
          const nodeUf = String(node.dataset.uf || "").toUpperCase();
          node.classList.toggle("active", nodeUf === targetUf);
        });
        renderContacts(targetUf);
      };

      states.forEach((node) => {
        const uf = String(node.dataset.uf || "").toUpperCase();
        node.setAttribute("role", "button");
        node.setAttribute("tabindex", "0");
        node.setAttribute("aria-label", `Ver responsáveis de ${formatStateName(uf)}`);
        node.addEventListener("click", () => activateState(uf));
        node.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            activateState(uf);
          }
        });
      });

      activateState("PR");
    })
    .catch(() => {
      mapMount.innerHTML = '<div class="muted">Não foi possível carregar o mapa agora.</div>';
      renderContacts("PR");
    });
}
