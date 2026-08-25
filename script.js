(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");
  const hero = document.querySelector(".hero");
  const year = document.getElementById("year");

  if (year) year.textContent = String(new Date().getFullYear());

  requestAnimationFrame(() => {
    if (hero) hero.classList.add("is-ready");
  });

  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 20);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("is-open", !open);
    });
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
      });
    });
  }

  /* Glyph field for Zscaler */
  const glyphField = document.getElementById("glyph-field");
  if (glyphField) {
    const glyphs = [
      "IF(",
      "AND(",
      "CASE",
      "→",
      "SELECT",
      "WHERE",
      "JOIN",
      "dbt",
      "ref()",
      "TRUE",
      "NULL",
      "SUM(",
    ];
    for (let i = 0; i < 28; i += 1) {
      const el = document.createElement("span");
      el.textContent = glyphs[i % glyphs.length];
      el.style.left = `${(i * 17) % 92}%`;
      el.style.top = `${(i * 23) % 88}%`;
      el.style.opacity = "0.12";
      glyphField.appendChild(el);
    }
  }

  /* Vertical particle rain for Zoox */
  const canvas = document.querySelector('[data-particles="zoox"]');
  let particles = [];
  let raf = 0;

  const initParticles = () => {
    if (!(canvas instanceof HTMLCanvasElement)) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = Array.from({ length: Math.min(48, Math.floor(rect.width / 12)) }, () => ({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        s: 0.4 + Math.random() * 1.4,
        r: 1 + Math.random() * 1.8,
      }));
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });

    const draw = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      ctx.fillStyle = "rgba(11, 110, 114, 0.45)";
      particles.forEach((p) => {
        p.y += p.s;
        if (p.y > rect.height) {
          p.y = -4;
          p.x = Math.random() * rect.width;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };

    const chapter = canvas.closest(".chapter");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !reduceMotion) {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(draw);
          } else {
            cancelAnimationFrame(raf);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
          }
        });
      },
      { threshold: 0.15 }
    );
    if (chapter) io.observe(chapter);
  };

  initParticles();

  /* Chapter active state */
  document.querySelectorAll(".chapter").forEach((chapter) => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          chapter.classList.toggle("is-active", entry.isIntersecting);
        });
      },
      { threshold: 0.28 }
    );
    io.observe(chapter);
  });

  /* GSAP impact moments */
  const gsapReady = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";

  if (gsapReady && !reduceMotion) {
    window.gsap.registerPlugin(window.ScrollTrigger);

    document.querySelectorAll("[data-count]").forEach((el) => {
      const end = Number(el.getAttribute("data-count") || "0");
      const prefix = el.getAttribute("data-prefix") || "";
      const suffix = el.getAttribute("data-suffix") || "";
      const obj = { val: 0 };

      window.gsap.to(obj, {
        val: end,
        duration: 1.35,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once: true,
        },
        onUpdate: () => {
          el.textContent = `${prefix}${Math.round(obj.val)}${suffix}`;
        },
      });
    });

    document.querySelectorAll(".chapter-inner").forEach((inner) => {
      window.gsap.from(inner.children, {
        opacity: 0,
        y: 28,
        duration: 0.75,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: {
          trigger: inner,
          start: "top 80%",
          once: true,
        },
      });
    });

    window.gsap.from(".awards-inner > .eyebrow, .awards-inner > h2, .awards-inner > .awards-lede, .award-panel", {
      opacity: 0,
      y: 24,
      duration: 0.7,
      stagger: 0.08,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".awards",
        start: "top 75%",
        once: true,
      },
    });

    window.gsap.from(".proof-item", {
      opacity: 0,
      y: 20,
      duration: 0.55,
      stagger: 0.08,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".proof-stack",
        start: "top 80%",
        once: true,
      },
    });
  } else {
    // Ensure counts show final values without GSAP
    document.querySelectorAll("[data-count]").forEach((el) => {
      const end = el.getAttribute("data-count") || "0";
      const prefix = el.getAttribute("data-prefix") || "";
      const suffix = el.getAttribute("data-suffix") || "";
      el.textContent = `${prefix}${end}${suffix}`;
    });
  }
})();
