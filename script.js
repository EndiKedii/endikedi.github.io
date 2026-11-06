
document.addEventListener("DOMContentLoaded", () => {

  // ==========================================
  // SETTINGS
  // ==========================================

  const FEATURED_VIDEO_ID = "";
  // Buraya YouTube video ID'sini yazabilirsin.
  // Örnek: https://youtube.com/watch?v=ABC123
  // ID: ABC123

  const CHANNEL_URL = "https://youtube.com/@endikedi";

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // ==========================================
  // THEME SYSTEM
  // DARK / LIGHT / SYSTEM
  // ==========================================

  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");
  const root = document.documentElement;

  const themes = ["dark", "light", "system"];

  let currentTheme = localStorage.getItem("endi-theme") || "dark";

  function applyTheme(theme) {
    currentTheme = theme;

    const systemDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    const actualTheme =
      theme === "system"
        ? (systemDark ? "dark" : "light")
        : theme;

    root.setAttribute("data-theme", actualTheme);

    const themeColors = {
      dark: "#090a0d",
      light: "#f1f0ec"
    };

    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", themeColors[actualTheme]);

    const icons = {
      dark: "◐",
      light: "☀",
      system: "⌘"
    };

    themeIcon.textContent = icons[theme];

    themeToggle.setAttribute(
      "title",
      `Tema: ${theme === "system" ? "Sistem" : theme === "dark" ? "Koyu" : "Açık"}`
    );

    localStorage.setItem("endi-theme", theme);
  }

  applyTheme(currentTheme);

  themeToggle.addEventListener("click", () => {
    const currentIndex = themes.indexOf(currentTheme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];

    applyTheme(nextTheme);
  });

  // Sistem teması değişirse system modunda güncelle.
  window.matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", () => {
      if (currentTheme === "system") {
        applyTheme("system");
      }
    });

  // ==========================================
  // MOBILE MENU
  // ==========================================

  const mobileMenu = document.getElementById("mobileMenu");
  const navigation = document.querySelector(".navigation");

  mobileMenu.addEventListener("click", () => {
    const opened = navigation.classList.toggle("open");

    mobileMenu.setAttribute(
      "aria-expanded",
      String(opened)
    );
  });

  document.querySelectorAll(".navigation a").forEach(link => {
    link.addEventListener("click", () => {
      navigation.classList.remove("open");
      mobileMenu.setAttribute("aria-expanded", "false");
    });
  });

  // ==========================================
  // YOUTUBE FEATURED VIDEO
  // ==========================================

  const youtubePreview = document.getElementById("youtubePreview");

  if (FEATURED_VIDEO_ID.trim()) {
    const thumbnail = document.createElement("img");

    thumbnail.src =
      `https://img.youtube.com/vi/${FEATURED_VIDEO_ID}/maxresdefault.jpg`;

    thumbnail.alt = "Öne çıkan YouTube videosu";

    const play = document.createElement("span");
    play.className = "play-icon";
    play.textContent = "▶";

    youtubePreview.innerHTML = "";
    youtubePreview.append(thumbnail, play);
    youtubePreview.style.cursor = "pointer";

    youtubePreview.addEventListener("click", () => {
      window.open(
        `https://www.youtube.com/watch?v=${FEATURED_VIDEO_ID}`,
        "_blank",
        "noopener,noreferrer"
      );
    });
  } else {
    youtubePreview.style.cursor = "pointer";

    youtubePreview.addEventListener("click", () => {
      window.open(
        CHANNEL_URL,
        "_blank",
        "noopener,noreferrer"
      );
    });
  }

  // ==========================================
  // CURSOR GLOW
  // ==========================================

  const glow = document.querySelector(".cursor-glow");

  if (glow && !reducedMotion) {
    window.addEventListener("pointermove", event => {
      if (event.pointerType !== "mouse") return;

      glow.style.left = `${event.clientX}px`;
      glow.style.top = `${event.clientY}px`;
    }, { passive: true });
  }

  // ==========================================
  // GSAP ANIMATIONS
  // ==========================================

  if (
    reducedMotion ||
    typeof gsap === "undefined" ||
    typeof ScrollTrigger === "undefined"
  ) {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Hero entrance

  const introTimeline = gsap.timeline({
    defaults: {
      ease: "power3.out"
    }
  });

  introTimeline
    .from(".hero-topline", {
      opacity: 0,
      y: 15,
      duration: .8
    })
    .from(".hero-label", {
      opacity: 0,
      y: 20,
      duration: .7
    }, "-=.4")
    .from(".hero h1", {
      opacity: 0,
      y: 45,
      duration: 1
    }, "-=.35")
    .from(".hero-description", {
      opacity: 0,
      y: 20,
      duration: .8
    }, "-=.55")
    .from(".hero-buttons", {
      opacity: 0,
      y: 15,
      duration: .7
    }, "-=.5")
    .from(".hero-visual", {
      opacity: 0,
      scale: .85,
      duration: 1.2,
      ease: "power2.out"
    }, "-=1");

  // Orbit animation

  gsap.to(".orbit-a", {
    rotation: 360,
    duration: 35,
    repeat: -1,
    ease: "none"
  });

  gsap.to(".orbit-b", {
    rotation: -360,
    duration: 55,
    repeat: -1,
    ease: "none"
  });

  gsap.to(".visual-core", {
    y: -9,
    duration: 3,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });

  gsap.to(".card-top", {
    y: -10,
    duration: 3.5,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });

  // Scroll reveal

  const revealElements = [
    ".section-index",
    ".intro-content h2",
    ".intro-bottom",
    ".note-inner",
    ".youtube-heading",
    ".youtube-card",
    ".currently-content",
    ".contact-card"
  ];

  revealElements.forEach(selector => {
    document.querySelectorAll(selector).forEach(element => {
      gsap.from(element, {
        opacity: 0,
        y: 45,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,
          start: "top 88%",
          once: true
        }
      });
    });
  });

  // Currently list stagger

  gsap.from(".currently-item", {
    opacity: 0,
    x: 35,
    stagger: .15,
    duration: .8,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".currently-list",
      start: "top 85%",
      once: true
    }
  });

  // Note text animation

  gsap.from(".note-inner h2", {
    opacity: 0,
    y: 35,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".note-section",
      start: "top 75%",
      once: true
    }
  });

  // Refresh measurements after fonts load.

  document.fonts.ready.then(() => {
    ScrollTrigger.refresh();
  });

  // ==========================================
  // LENIS SMOOTH SCROLL
  // ==========================================

  if (typeof Lenis !== "undefined") {
    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1,
      infinite: false
    });

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add(time => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Anchor navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener("click", event => {
        const target = document.querySelector(
          anchor.getAttribute("href")
        );

        if (!target) return;

        event.preventDefault();

        lenis.scrollTo(target, {
          offset: -20,
          duration: 1.2
        });
      });
    });
  }

});
