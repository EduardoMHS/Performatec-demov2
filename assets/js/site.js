// Menu mobile
const nav = document.querySelector(".nav");
const toggle = document.querySelector(".nav-toggle");
if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  nav.querySelectorAll(".nav-links a").forEach((link) =>
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    })
  );
}

// Sombra no cabeçalho ao rolar
const header = document.querySelector(".site-header");
const onScroll = () => header && header.classList.toggle("scrolled", window.scrollY > 8);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Vídeos: carrega o player do YouTube só ao clicar (miniatura leve).
// Aberto direto do computador (file://), o YouTube recusa o player (erro 153),
// então nesse caso o vídeo abre no próprio YouTube.
document.querySelectorAll("a.yt[data-yt]").forEach((link) => {
  link.addEventListener("click", (event) => {
    if (location.protocol === "file:") return;
    event.preventDefault();
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube.com/embed/${link.dataset.yt}?autoplay=1&rel=0`;
    iframe.title = link.getAttribute("aria-label") || "Vídeo";
    iframe.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen";
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    iframe.allowFullscreen = true;
    link.replaceWith(iframe);
  });
});

// Animação discreta de entrada
const reveals = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  reveals.forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add("in"));
}

// Destaque do item de menu conforme a seção visível (Home)
const spyLinks = document.querySelectorAll('.nav-links a[data-spy]');
if (spyLinks.length && "IntersectionObserver" in window) {
  const map = {};
  spyLinks.forEach((a) => (map[a.dataset.spy] = a));
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const link = map[entry.target.id];
        if (!link) return;
        spyLinks.forEach((a) => a.removeAttribute("aria-current"));
        link.setAttribute("aria-current", "page");
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  Object.keys(map).forEach((id) => {
    const el = document.getElementById(id);
    if (el) spy.observe(el);
  });
}

// Trajetória: trilho de progresso conforme a rolagem
const track = document.querySelector(".journey-track");
if (track) {
  const steps = track.querySelectorAll(".j-step");
  let ticking = false;
  const update = () => {
    ticking = false;
    const r = track.getBoundingClientRect();
    const mark = window.innerHeight * 0.6;
    const p = Math.min(1, Math.max(0, (mark - r.top - 28) / (r.height - 56)));
    track.style.setProperty("--p", p.toFixed(3));
    steps.forEach((s) => {
      const node = s.querySelector(".j-node").getBoundingClientRect();
      s.classList.toggle("on", node.top + node.height / 2 <= mark);
    });
  };
  const req = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };
  window.addEventListener("scroll", req, { passive: true });
  window.addEventListener("resize", req);
  update();
}
