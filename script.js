(() => {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");
  const year = document.getElementById("year");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
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

  const revealEls = document.querySelectorAll(".reveal");
  const sceneItems = document.querySelectorAll(".work-item[data-scene]");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    revealEls.forEach((el) => revealObserver.observe(el));

    const sceneObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-playing");
            if (!reduceMotion) {
              // Replay drive/enter animations when scrolling back into view
              entry.target.classList.remove("is-playing");
              // Force reflow so CSS animations restart
              void entry.target.offsetWidth;
              entry.target.classList.add("is-playing");
            }
          } else if (!reduceMotion) {
            entry.target.classList.remove("is-playing");
          }
        });
      },
      { threshold: 0.35 }
    );
    sceneItems.forEach((el) => sceneObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
    sceneItems.forEach((el) => el.classList.add("is-playing"));
  }
})();
