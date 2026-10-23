/* =========================================================
   作品集 · 横屏舞台
   横向推进（滚轮/方向键/圆点），作品、动作戏、技术、数据、联系
   ========================================================= */
(function () {
  "use strict";

  var S = window.SITE || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var STAMPS = ["00:03", "00:08", "00:13", "00:18", "00:23", "00:27"];

  function esc(v) {
    return String(v == null ? "" : v)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  var toastTimer;
  function toast(msg) {
    var t = $("#toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("is-on"); }, 3200);
  }

  /* ------------------------------ hero ------------------------------ */
  function renderHero() {
    var tag = $("#heroTagline");
    if (tag) tag.innerHTML = S.tagline || "";
    var role = $("#heroRole");
    if (role && S.role) role.textContent = S.role;
    var meta = $("#heroMeta");
    if (meta && S.meta) meta.innerHTML = S.meta.map(function (m) { return "<span>" + esc(m) + "</span>"; }).join("");
    var btn = $("#resumeBtn");
    if (btn && S.resume) { btn.href = S.resume.director; btn.setAttribute("download", ""); }
    var name = $("#heroName");
    if (name && S.name) name.textContent = S.name;
  }

  /* ------------------------------ works ------------------------------ */
  function workPanel(p, i) {
    var v = p.video || {};
    var poster = v.poster ? ' poster="' + esc(v.poster) + '"' : "";
    var no = (i + 1 < 10 ? "0" : "") + (i + 1);

    var strip = STAMPS.map(function (tc, n) {
      var src = "assets/img/f-" + p.id + "-" + (n + 1) + ".jpg";
      return '<figure class="work-frame" tabindex="0" role="button" data-full="' + esc(src) + '" data-cap="' + esc(p.title) + " · " + tc + '">' +
        '<img src="' + esc(src) + '" alt="' + esc(p.title) + " 第 " + (n + 1) + ' 帧" loading="lazy" decoding="async">' +
        '<figcaption class="work-tc">' + tc + "</figcaption>" +
        "</figure>";
    }).join("");

    return '<section class="panel panel--work' + (i % 2 ? " is-flip" : "") + '" id="work-' + esc(p.id) +
      '" data-panel data-label="作品 ' + no + '">' +
      '<div class="work-grid">' +
        '<div class="work-media" data-video data-bilibili="' + esc(v.bilibili || "") + '" data-mp4="' + esc(v.mp4 || "") + '">' +
          '<video muted playsinline loop preload="none"' + poster + ' data-src="' + esc(v.mp4 || "") + '"></video>' +
          '<button class="play" type="button" aria-label="播放 ' + esc(p.title) + '，带声音"><span class="play-ring"></span></button>' +
        "</div>" +
        '<div class="work-copy">' +
          '<p class="work-no">' + no + "</p>" +
          '<h3 class="work-title">' + esc(p.title) + "</h3>" +
          '<p class="work-fig">' + esc(p.figures || "") + "</p>" +
          '<p class="work-line">' + esc(p.line || "") + "</p>" +
          '<div class="work-strip">' + strip + "</div>" +
        "</div>" +
      "</div>" +
      "</section>";
  }

  function renderWorks() {
    var track = $("#track");
    var anchor = $("#action");
    if (!track || !S.projects || !anchor) return;
    var html = S.projects.map(workPanel).join("");
    anchor.insertAdjacentHTML("beforebegin", html);
  }

  /* ------------------------------ action ------------------------------ */
  function renderAction() {
    var host = $("#actionSteps");
    if (host && S.action) {
      host.innerHTML = S.action.steps.map(function (s) {
        return '<div class="step">' +
          '<span class="step-k">' + esc(s.k) + "</span>" +
          '<span class="step-en">' + esc(s.en) + "</span>" +
          '<p class="step-text">' + esc(s.text) + "</p>" +
          '<p class="step-detail">' + esc(s.detail) + "</p>" +
          "</div>";
      }).join("");
    }
    var intro = $("#actionIntro");
    if (intro && S.action) intro.textContent = S.action.intro || "";
  }

  /* ------------------------------ tech ------------------------------ */
  function renderTech() {
    var P = S.pipeline, host = $("#pipeNodes");
    if (host && P) {
      host.innerHTML = P.steps.map(function (s) {
        return '<li class="pipe-node"><span class="pn-dot"></span><b>' + esc(s.k) + "</b><em>" + esc(s.s) + "</em></li>";
      }).join("");
    }

    var row = $("#techRow");
    if (row && S.tech) {
      row.innerHTML = S.tech.map(function (t) {
        return '<article class="tech-card">' +
          '<p class="mono-label">' + esc(t.label) + "</p>" +
          "<h3>" + esc(t.title) + "</h3>" +
          "<p>" + esc((t.points || [])[0] || "") + "</p>" +
          "</article>";
      }).join("");
    }
  }

  /* ------------------------------ stats ------------------------------ */
  function renderStats() {
    var host = $("#stats");
    if (!host || !S.stats) return;
    host.innerHTML = S.stats.map(function (s, i) {
      return '<div class="stat">' +
        '<p class="stat-v">' +
          (s.prefix ? '<span class="stat-a">' + esc(s.prefix) + "</span>" : "") +
          '<span class="stat-n" data-target="' + s.n + '" data-decimals="' + (s.decimals || 0) + '" data-index="' + i + '">0</span>' +
          (s.suffix ? '<span class="stat-a">' + esc(s.suffix) + "</span>" : "") +
        "</p>" +
        '<p class="stat-l">' + esc(s.label) + "</p>" +
        '<p class="stat-s">' + esc(s.sub || "") + "</p>" +
        "</div>";
    }).join("");
    var note = $("#statsNote");
    if (note && S.statsNote) note.textContent = S.statsNote;
  }

  function animateNumber(node) {
    var target = parseFloat(node.dataset.target) || 0;
    var dec = parseInt(node.dataset.decimals || "0", 10);
    var start = null, dur = 1400;
    var token = String(Date.now()) + Math.random();
    node.dataset.token = token;
    if (reduceMotion) {
      node.textContent = dec ? target.toFixed(dec) : target.toLocaleString("en-US");
      return;
    }
    function frame(ts) {
      if (node.dataset.token !== token) return;
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var e = 1 - Math.pow(1 - p, 3);
      var v = target * e;
      node.textContent = dec ? v.toFixed(dec) : Math.round(v).toLocaleString("en-US");
      if (p < 1) requestAnimationFrame(frame);
      else node.textContent = dec ? target.toFixed(dec) : target.toLocaleString("en-US");
    }
    requestAnimationFrame(frame);
  }

  function setupCounters() {
    var nums = $$(".stat-n");
    if (!nums.length) return;
    if (!("IntersectionObserver" in window) || reduceMotion) {
      nums.forEach(function (n) {
        var v = parseFloat(n.dataset.target) || 0;
        var d = parseInt(n.dataset.decimals || "0", 10);
        n.textContent = d ? v.toFixed(d) : v.toLocaleString("en-US");
      });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) animateNumber(en.target);
        else { en.target.dataset.token = ""; en.target.textContent = "0"; }
      });
    }, { threshold: 0.6 });
    nums.forEach(function (n) { io.observe(n); });
  }

  /* ------------------------------ contact ------------------------------ */
  function renderContact() {
    var mail = $("#mailLink");
    if (mail && S.email) { mail.href = "mailto:" + S.email; mail.textContent = S.email; }

    var host = $("#contactLinks");
    if (!host) return;
    var items = (S.contact || []).filter(function (c) { return c.label !== "邮箱"; });
    host.innerHTML = items.map(function (c) {
      if (c.label === "简历") {
        return '<a href="' + esc(S.resume.director) + '" download>执行导演版 PDF</a>' +
          '<a href="' + esc(S.resume.tech) + '" download>AIGC 技术版 PDF</a>';
      }
      return '<a href="' + esc(c.href) + '"' + (/^https?:/.test(c.href) ? ' target="_blank" rel="noopener"' : "") + ">" +
        esc(c.value) + "</a>";
    }).join("");
  }

  /* ------------------------------ stage ------------------------------ */
  var nextFrame = window.requestAnimationFrame;
  var panels = [], dots = [], x = 0, target = 0, maxX = 0, vw = 0, locked = false;
  var pipeEl = null, pipeNodes = [];

  /* 产线进度：横屏时按横向位置，竖屏时按视口位置 */
  function techProgress() {
    var t = document.getElementById("tech");
    if (!t) return -1;
    var r = t.getBoundingClientRect();
    if (isStage()) {
      var c = r.left + r.width / 2;
      return Math.max(0, Math.min(1, 1 - Math.abs(c - window.innerWidth / 2) / (window.innerWidth * 0.9)));
    }
    var vh = window.innerHeight;
    return Math.max(0, Math.min(1, (vh * 0.62 - r.top) / (r.height + vh * 0.15)));
  }

  function paintPipe() {
    if (!pipeEl) return;
    var p = techProgress();
    if (p < 0) return;
    pipeEl.style.setProperty("--p", p.toFixed(3));
    for (var i = 0; i < pipeNodes.length; i++) {
      pipeNodes[i].classList.toggle("is-on", p >= i / (pipeNodes.length - 1) - 0.03);
    }
  }

  function isStage() { return window.matchMedia("(min-width: 981px)").matches; }

  function measure() {
    vw = window.innerWidth;
    maxX = Math.max(0, $(".track").scrollWidth - vw);
    target = Math.min(Math.max(target, 0), maxX);
  }

  function apply() {
    var track = $("#track");
    if (track) track.style.transform = "translate3d(" + (-x).toFixed(2) + "px,0,0)";
  }

  function currentIndex() {
    if (isStage()) return Math.round(x / vw);
    var best = 0, bd = Infinity;
    panels.forEach(function (p, i) {
      var r = p.getBoundingClientRect();
      var d = Math.abs(r.top);
      if (d < bd) { bd = d; best = i; }
    });
    return best;
  }

  function hud() {
    var idx = currentIndex() + 1;
    idx = Math.max(1, Math.min(panels.length, idx));
    var now = $("#panelNow"), total = $("#panelTotal"), label = $("#panelLabel"), fill = $("#hudFill");
    if (now) now.textContent = (idx < 10 ? "0" : "") + idx;
    if (total) total.textContent = panels.length;
    if (label) label.textContent = panels[idx - 1].dataset.label || "";
    if (fill) fill.style.transform = "scaleX(" + (maxX > 0 ? x / maxX : 0).toFixed(4) + ")";

    $$(".dots button").forEach(function (b, i) { b.classList.toggle("is-on", i === idx - 1); });

    var currentId = panels[idx - 1].id;
    $$(".hud-nav a").forEach(function (a) {
      var j = a.dataset.jump;
      var on = currentId === j || (j === "works" && currentId.indexOf("work-") === 0);
      a.classList.toggle("is-active", on);
    });
  }

  function loop() {
    x += (target - x) * 0.115;
    if (Math.abs(target - x) < 0.4) x = target;
    apply();
    hud();
    paintPipe();
    nextFrame(loop);
  }

  function goTo(i) {
    i = Math.max(0, Math.min(panels.length - 1, i));
    target = i * vw;
  }

  function setupStage() {
    panels = $$(".panel");
    measure();

    var dotsHost = $("#dots");
    if (dotsHost) {
      dotsHost.innerHTML = panels.map(function (p, i) {
        return '<button type="button" aria-label="' + esc(p.dataset.label || ("第 " + (i + 1) + " 屏")) + '"></button>';
      }).join("");
      dots = $$("button", dotsHost);
      dots.forEach(function (b, i) {
        b.addEventListener("click", function () { goTo(i); });
      });
    }

    if (isStage() && !locked) {
      locked = true;
      document.body.classList.add("is-stage");
      window.addEventListener("wheel", function (e) {
        if (!isStage()) return;
        e.preventDefault();
        target += (e.deltaY + e.deltaX) * 1.15;
        target = Math.min(Math.max(target, 0), maxX);
      }, { passive: false });

      window.addEventListener("keydown", function (e) {
        if (!isStage()) return;
        if (e.key === "ArrowRight" || e.key === "PageDown") { e.preventDefault(); goTo(Math.round(x / vw) + 1); }
        if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); goTo(Math.round(x / vw) - 1); }
        if (e.key === "Home") { e.preventDefault(); goTo(0); }
        if (e.key === "End") { e.preventDefault(); goTo(panels.length - 1); }
      });
    }

    $$("[data-jump]").forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        var key = a.dataset.jump;
        var idx = panels.findIndex(function (p) {
          return p.id === key || (key === "works" && p.id.indexOf("work-") === 0);
        });
        if (idx < 0) return;
        if (isStage()) goTo(idx);
        else panels[idx].scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      });
    });

    window.addEventListener("resize", function () {
      measure();
      if (!isStage()) { x = 0; target = 0; apply(); }
    });
  }

  /* ------------------------------ reveal ------------------------------ */
  function setupReveal() {
    var items = $$(".panel");
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (n) { n.classList.add("is-in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) en.target.classList.add("is-in");
      });
    }, { threshold: 0.12 });
    items.forEach(function (n) { io.observe(n); });
  }

  /* ------------------------------ video ------------------------------ */
  function setupVideo() {
    var vids = $$("video[data-src]");
    if (!vids.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var v = en.target;
        if (en.intersectionRatio > 0.5 && !reduceMotion) {
          if (!v.src) v.src = v.dataset.src;
          var p = v.play();
          if (p && p.catch) p.catch(function () {});
        } else if (en.intersectionRatio < 0.1 && !v.paused) {
          v.pause();
        }
      });
    }, { threshold: [0, 0.1, 0.5] });
    vids.forEach(function (v) { io.observe(v); });
  }

  document.addEventListener("click", function (e) {
    var play = e.target.closest(".play");
    if (!play) return;
    var media = play.closest("[data-video]");
    if (!media) return;
    var v = media.querySelector("video");
    if (!v) return;
    if (!v.src) v.src = media.dataset.mp4;
    v.muted = false;
    v.volume = 0.2;
    v.loop = false;
    v.controls = true;
    var p = v.play();
    if (p && p.catch) p.catch(function () { v.muted = true; });
    play.remove();
  });

  /* ------------------------------ lightbox ------------------------------ */
  function setupLightbox() {
    var lb = $("#lightbox"), img = $("#lbImg"), cap = $("#lbCap");
    if (!lb) return;
    var lastFocus = null;

    function open(el) {
      lastFocus = document.activeElement;
      img.src = el.dataset.full;
      img.alt = el.dataset.cap || "";
      cap.textContent = el.dataset.cap || "";
      lb.hidden = false;
      $("#lbClose").focus();
    }
    function close() {
      lb.hidden = true;
      img.removeAttribute("src");
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    document.addEventListener("click", function (e) {
      var f = e.target.closest(".work-frame");
      if (f) { open(f); return; }
      if (e.target === lb || e.target.id === "lbClose") close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !lb.hidden) close();
      if (e.key !== "Enter" && e.key !== " ") return;
      var f = e.target.closest && e.target.closest(".work-frame");
      if (f) { e.preventDefault(); open(f); }
    });
  }

  /* ------------------------------ boot ------------------------------ */
  function boot() {
    renderHero();
    renderWorks();
    renderAction();
    renderTech();
    renderStats();
    renderContact();

    setupStage();
    setupReveal();
    setupVideo();
    setupLightbox();
    setupCounters();
    pipeEl = document.getElementById("pipe");
    pipeNodes = $$(".pipe-node");
    nextFrame(loop);

    window.__SITE_READY = true;
    document.dispatchEvent(new CustomEvent("site:ready"));
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
