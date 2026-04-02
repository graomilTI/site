
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
    burger.addEventListener("click", () => mobileNav.classList.toggle("is-open"));
  }

  const whatsapp = "5545998341000";
  const wppText = encodeURIComponent("Olá! Vim pelo site da Grão 1000 e gostaria de falar com a equipe.");
  const wppHref = `https://wa.me/${whatsapp}?text=${wppText}`;
  ["wppTop","wppTop_m","wppCta","wppProposta"].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.href = wppHref; el.target = "_blank"; el.rel = "noopener"; }
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

  document.querySelectorAll(".count").forEach(el => {
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

  const mapMount = document.getElementById("brMap");
  if (mapMount) {
    fetch("assets/img/br-states.svg")
      .then(r => r.text())
      .then(svg => {
        mapMount.innerHTML = svg;

        const stateNames = {
          AC:"Acre", AL:"Alagoas", AP:"Amapá", AM:"Amazonas", BA:"Bahia", CE:"Ceará", DF:"Distrito Federal",
          ES:"Espírito Santo", GO:"Goiás", MA:"Maranhão", MT:"Mato Grosso", MS:"Mato Grosso do Sul", MG:"Minas Gerais",
          PA:"Pará", PB:"Paraíba", PR:"Paraná", PE:"Pernambuco", PI:"Piauí", RJ:"Rio de Janeiro", RN:"Rio Grande do Norte",
          RS:"Rio Grande do Sul", RO:"Rondônia", RR:"Roraima", SC:"Santa Catarina", SP:"São Paulo", SE:"Sergipe", TO:"Tocantins"
        };

        const source = window.RESPONSAVEIS_MAPA || {};
        const data = Object.fromEntries(
          Object.entries(source).map(([uf, items]) => [
            uf,
            (items || []).map(item => ({
              name: item.nome || item.name || "Responsável",
              city: item.sub || item.city || stateNames[uf] || uf,
              phone: item.fone || item.phone || "(45) 99834-1000"
            }))
          ])
        );

        const defaultContacts = [{ name: "Atendimento Grão 1000", city: "Atendimento nacional", phone: "(45) 99834-1000" }];
        const title = document.getElementById("stateTitle");
        const hint = document.getElementById("stateHint");
        const list = document.getElementById("stateContacts");

        const initials = (name) => (name || "RG").split(/\s+/).filter(Boolean).slice(0,2).map(s => s[0]).join("").toUpperCase();

        const render = (uf) => {
          const items = data[uf] || defaultContacts;
          const stateLabel = stateNames[uf] || "Atendimento nacional";
          if (title) title.textContent = `${stateLabel}`;
          if (hint) {
            hint.textContent = `${items.length} contato${items.length > 1 ? "s disponíveis" : " disponível"} · clique em falar agora para abrir no WhatsApp.`;
          }
          if (list) {
            list.innerHTML = items.map(item => {
              const phoneDigits = item.phone.replace(/\D/g, "");
              const message = encodeURIComponent(`Olá! Vim pelo mapa do site da Grão 1000 e gostaria de atendimento para ${stateLabel}.`);
              return `
                <article class="contactItem">
                  <div class="contactTop">
                    <div class="contactAvatar">${initials(item.name)}</div>
                    <div class="contactMeta">
                      <div class="contactName">${item.name}</div>
                      <div class="contactCity">${item.city}</div>
                      <div class="contactTags">
                        <span class="contactTag">${uf}</span>
                        <span class="contactTag">Atendimento regional</span>
                      </div>
                    </div>
                  </div>
                  <div class="contactActions">
                    <a class="contactPhone" target="_blank" rel="noopener" href="https://wa.me/55${phoneDigits}?text=${message}">Falar agora</a>
                    <a class="contactSecondaryBtn" href="tel:${phoneDigits}">${item.phone}</a>
                  </div>
                </article>
              `;
            }).join("");
          }
        };

        const states = mapMount.querySelectorAll(".uf, [data-uf]");
        states.forEach(path => {
          path.style.cursor = "pointer";
          path.addEventListener("click", () => {
            states.forEach(el => el.classList.remove("active"));
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

          path.addEventListener("mouseleave", () => {
            if (!path.classList.contains("active")) {
              path.style.fill = "#3c596b";
              path.style.stroke = "#9fbcce";
            }
          });

          path.addEventListener("click", () => {
            states.forEach(el => {
              el.classList.remove("active");
              el.style.fill = "#3c596b";
              el.style.stroke = "#9fbcce";
            });
            path.classList.add("active");
            path.style.fill = "#22c55e";
            path.style.stroke = "#ffffff";
            render((path.dataset.uf || "").toUpperCase());
          });
        });

        const defaultUf = mapMount.querySelector('[data-uf="PR"]');
        if (defaultUf) {
          defaultUf.classList.add("active");
          defaultUf.style.fill = "#22c55e";
          defaultUf.style.stroke = "#ffffff";
          render("PR");
        }
      })
      .catch(() => {
        mapMount.innerHTML = '<div class="muted">Não foi possível carregar o mapa agora.</div>';
      });
  }
});
