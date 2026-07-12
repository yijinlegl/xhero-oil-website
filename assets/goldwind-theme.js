(() => {
  document.documentElement.classList.add("gw-motion");

  const reveals = [...document.querySelectorAll(".gw-reveal, .reveal")];

  function showReveal(element) {
    element.classList.add("is-visible", "visible");
  }

  function revealIsVisible(element) {
    return element.classList.contains("is-visible") || element.classList.contains("visible");
  }

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        showReveal(entry.target);
        revealObserver.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -10%", threshold: 0.08 },
  );

  reveals.forEach((element) => revealObserver.observe(element));

  function revealPassedElements() {
    const revealLine = window.innerHeight * 0.94;
    reveals.forEach((element) => {
      if (revealIsVisible(element)) return;
      if (element.getBoundingClientRect().top > revealLine) return;
      showReveal(element);
      revealObserver.unobserve(element);
    });
  }

  const header = document.querySelector(".site-header");
  const heroCopy = document.querySelector(".gw-hero__copy");
  let previousScrollY = window.scrollY;
  let framePending = false;

  function updateScrollState() {
    const scrollY = window.scrollY;

    revealPassedElements();

    if (heroCopy) {
      const fadeDistance = Math.max(window.innerHeight * 0.18, 120);
      const fadeProgress = Math.min(Math.max(scrollY / fadeDistance, 0), 1);
      heroCopy.style.setProperty("--gw-hero-copy-opacity", (1 - fadeProgress).toFixed(3));
      heroCopy.style.setProperty("--gw-hero-copy-shift", `${Math.round(fadeProgress * -28)}px`);
      heroCopy.setAttribute("aria-hidden", fadeProgress >= 1 ? "true" : "false");
    }

    if (header && !document.body.classList.contains("nav-open")) {
      const movingDown = scrollY > previousScrollY + 4;
      const movingUp = scrollY < previousScrollY - 4;
      if (movingDown && scrollY > window.innerHeight * 0.85) header.classList.add("is-hidden");
      if (movingUp || scrollY < 120) header.classList.remove("is-hidden");
    }

    previousScrollY = scrollY;
    framePending = false;
  }

  function requestScrollUpdate() {
    if (framePending) return;
    framePending = true;
    requestAnimationFrame(updateScrollState);
  }

  window.addEventListener("scroll", requestScrollUpdate, { passive: true });
  window.addEventListener("resize", requestScrollUpdate);
  updateScrollState();

  document.querySelector(".menu-toggle")?.addEventListener("click", () => {
    header?.classList.remove("is-hidden");
  });
})();
