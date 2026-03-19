
document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname.toLowerCase();
  document.querySelectorAll(".nav__link").forEach(link => {
    const href = (link.getAttribute("href") || "").toLowerCase();
    if ((path.endsWith(href) && href) || (href === "index.html" && (path.endsWith("/") || path.endsWith("/index.html")))) {
      link.classList.add("active");
    }
  });

  const burger = document.getElementById("burger");
  const mobileNav = document.getElementById("mobileNav");
  if (burger && mobileNav) {
    burger.addEventListener("click", () => {
      mobileNav.classList.toggle("is-open");
      burger.classList.toggle("is-open");
    });
  }

  const whatsapp = "5545998341000";
  const wppText = encodeURIComponent("Olá! Vim pelo site da Grão 1000 e gostaria de falar com a equipe.");
  const wppHref = `https://wa.me/${whatsapp}?text=${wppText}`;
  ["wppTop","wppTop_m","wppCta","wppProposta"].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.href = wppHref;
      el.target = "_blank";
      el.rel = "noopener";
    }
  });

  const fb = "https://www.facebook.com/grao1000";
  const ig = "https://www.instagram.com/grao.1000";
  ["fbLink","fbTop","fbTop_m"].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.href = fb; el.target = "_blank"; el.rel = "noopener"; }
  });
  ["igLink","igTop","igTop_m"].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.href = ig; el.target = "_blank"; el.rel = "noopener"; }
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
    });
  }, { threshold: 0.16 });
  document.querySelectorAll("[data-anim]").forEach(el => io.observe(el));

  const counts = document.querySelectorAll(".count");
  if (counts.length) {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = Number(el.dataset.count || 0);
        const duration = 1200;
        const start = performance.now();
        const step = (t) => {
          const p = Math.min((t - start) / duration, 1);
          el.textContent = Math.floor(target * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        countObserver.unobserve(el);
      });
    }, { threshold: 0.6 });
    counts.forEach(el => countObserver.observe(el));
  }

  const mapMount = document.getElementById("brMap");
  if (mapMount) {
    fetch("assets/img/br-states.svg")
      .then(r => r.text())
      .then(svg => {
        mapMount.innerHTML = svg;
        const data = {
          PR: [
            { name: "Marcos Mota", city: "Cascavel", phone: "(44) 99711-9843" },
            { name: "Michael Gonçalves", city: "Londrina", phone: "(43) 99182-6733" },
            { name: "Michael Ribas", city: "Ponta Grossa", phone: "(42) 99834-4303" },
            { name: "José Boa Ventura", city: "Maringá", phone: "(44) 99836-1000" }
          ]
        };
        const defaultContacts = [
          { name: "Atendimento Grão 1000", city: "Atendimento nacional", phone: "(45) 99834-1000" }
        ];
        const title = document.getElementById("stateTitle");
        const hint = document.getElementById("stateHint");
        const list = document.getElementById("stateContacts");

        const render = (uf) => {
          const items = data[uf] || defaultContacts;
          if (title) title.textContent = `${uf} • responsáveis`;
          if (hint) hint.textContent = "Clique no telefone para abrir no WhatsApp.";
          if (list) {
            list.innerHTML = items.map(item => {
              const phoneDigits = item.phone.replace(/\D/g, "");
              return `
                <div class="contactItem">
                  <div class="contactName">${item.name}</div>
                  <div class="contactCity">${item.city}</div>
                  <a class="contactPhone" target="_blank" rel="noopener" href="https://wa.me/55${phoneDigits}?text=${encodeURIComponent("Olá! Vim pelo mapa do site da Grão 1000.")}">${item.phone}</a>
                </div>
              `;
            }).join("");
          }
        };

        mapMount.querySelectorAll(".uf").forEach(path => {
          path.addEventListener("click", () => {
            mapMount.querySelectorAll(".uf.active").forEach(el => el.classList.remove("active"));
            path.classList.add("active");
            render((path.dataset.uf || "").toUpperCase());
          });
        });

        const defaultUf = mapMount.querySelector('[data-uf="PR"]');
        if (defaultUf) {
          defaultUf.classList.add("active");
          render("PR");
        }
      })
      .catch(() => {
        mapMount.innerHTML = '<div class="muted">Não foi possível carregar o mapa agora.</div>';
      });
  }
});
