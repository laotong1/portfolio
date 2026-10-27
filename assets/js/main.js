/* =========================================================
   佟子易 · 作品集（纵向版）
   ========================================================= */
(function () {
  "use strict";

  var S = window.SITE || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function esc(v) {
    return String(v == null ? "" : v)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function canAutoPlay() {
    if (reduceMotion) return false;
    var c = navigator.connection || navigator.mozConnection || {};
    if (c.saveData) return false;
    if (/^(slow-)?2g$/.test(c.effectiveType || "")) return false;
    if (typeof c.downlink === "number" && c.downlink > 0 && c.downlink < 0.8) return false;
    return true;
  }

  var toastTimer;
  function toast(msg) {
    var t = $("#toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("is-on"); }, 3000);
  }

  /* ---------------- hero ---------------- */
  function renderHero() {
    var role = $("#heroRole"), tag = $("#heroTagline"), meta = $("#heroMeta"), btn = $("#resumeBtn");
    if (role) role.textContent = S.role || "";
    if (tag) tag.innerHTML = S.tagline || "";
    if (meta && S.meta) meta.innerHTML = S.meta.map(function (m) { return "<span>" + esc(m) + "</span>"; }).join("");
    if (btn && S.resume) { btn.href = S.resume.director; btn.setAttribute("download", ""); }
  }

  /* ---------------- works ---------------- */
  var previewVideo = null;

  function previewHTML(p) {
    var v = p.video || {};
    return '<video muted playsinline webkit-playsinline loop preload="metadata" ' +
      'poster="' + esc(v.poster || "") + '" src="' + esc(v.mp4 || "") + '"></video>' +
      '<button class="preview-play" type="button">▶ 播放 · 有声</button>';
  }

  function showWork(i, autoplay) {
    var host = $("#previewMedia");
    if (!host || !S.projects) return;
    var p = S.projects[i];
    if (!p) return;

    $$(".row").forEach(function (r) { r.classList.toggle("is-on", Number(r.dataset.i) === i); });

    var v = p.video || {};
    if (v.mp4) {
      host.innerHTML = '<video muted playsinline webkit-playsinline loop preload="metadata" ' +
        'poster="' + esc(v.poster || "") + '" src="' + esc(v.mp4) + '"></video>' +
        '<button class="preview-play" type="button">▶ 播放 · 有声</button>';
      previewVideo = host.querySelector("video");
      if (autoplay && previewVideo && canAutoPlay()) {
        var pr = previewVideo.play();
        if (pr && pr.catch) pr.catch(function () {});
      }
    } else {
      host.innerHTML = '<div class="ph">视频整理中</div>';
      previewVideo = null;
    }
  }

  function renderWorks() {
    var host = $("#worksIndex");
    if (!host || !S.projects) return;
    host.innerHTML = S.projects.map(function (p, i) {
      var no = (i + 1 < 10 ? "0" : "") + (i + 1);
      /* 右侧只放数字，避免和副标题重复 */
      var play = "";
      var mm = /([0-9][0-9.,]*\s*(?:亿|万)[^·]*)/.exec(p.figures || "");
      if (mm) play = mm[1].replace("播放", "").trim();
      var meta = (p.figures || "").split("·").map(function (x) { return x.trim(); })
        .filter(function (x) { return x && !/[0-9][0-9.,]*\s*(?:亿|万)/.test(x); }).join(" · ");

      return '<li class="row" data-i="' + i + '" tabindex="0">' +
        '<span class="no">' + no + "</span>" +
        '<div><span class="t">' + esc(p.title) + '</span>' +
          '<span class="m">' + esc(meta) + "</span></div>" +
        '<span class="p">' + esc(play) + "</span>" +
        "</li>";
    }).join("");

    $$(".row").forEach(function (row) {
      var i = Number(row.dataset.i) || 0;
      row.addEventListener("mouseenter", function () { if (previewIndex !== i) { previewIndex = i; showWork(i, true); } });
      row.addEventListener("focus", function () { if (previewIndex !== i) { previewIndex = i; showWork(i, true); } });
      row.addEventListener("click", function () { previewIndex = i; showWork(i, true); });
    });

    showWork(0, false);
  }

  var previewIndex = 0;

  /* ---------------- action ---------------- */
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

  /* ---------------- tech ---------------- */
  function renderTech() {
    var P = S.pipeline, host = $("#pipeNodes");
    if (host && P) {
      host.innerHTML = P.steps.map(function (s) {
        return '<li class="pipe-node"><span class="pn-dot"></span><b>' + esc(s.k) + "</b><em>" + esc(s.s) + "</em></li>";
      }).join("");
    }
    var grid = $("#techRow");
    if (grid && S.tech) {
      grid.innerHTML = S.tech.map(function (t) {
        var pts = (t.points || []).map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("");
        return '<article class="tech-card">' +
          '<p class="mono-label">' + esc(t.label) + "</p>" +
          "<h3>" + esc(t.title) + "</h3>" +
          "<ul>" + pts + "</ul>" +
          "</article>";
      }).join("");
    }
  }

  /* ---------------- numbers ---------------- */
  function renderStats() {
    var host = $("#stats");
    if (host && S.stats) {
      host.innerHTML = S.stats.map(function (s) {
        return '<div class="stat">' +
          '<p class="stat-v">' +
            (s.prefix ? '<span class="stat-a">' + esc(s.prefix) + "</span>" : "") +
            '<span class="stat-n" data-n="' + s.n + '" data-dec="' + (s.decimals || 0) + '">0</span>' +
            (s.suffix ? '<span class="stat-a">' + esc(s.suffix) + "</span>" : "") +
          "</p>" +
          '<p class="stat-l">' + esc(s.label) + "</p>" +
          '<p class="stat-s">' + esc(s.sub || "") + "</p>" +
          "</div>";
      }).join("");
    }
    var note = $("#statsNote");
    if (note && S.statsNote) note.textContent = S.statsNote;
  }

  function countUp(el) {
    var target = parseFloat(el.dataset.n) || 0;
    var dec = parseInt(el.dataset.dec || "0", 10);
    var t0 = 0;
    function fmt(v) { return dec ? v.toFixed(dec) : Math.round(v).toLocaleString("en-US"); }
    function frame(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / 1300, 1);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(target * e);
      if (p < 1) requestAnimationFrame(frame);
      else el.textContent = fmt(target);
    }
    requestAnimationFrame(frame);
  }

  /* ---------------- contact ---------------- */
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

  /* ---------------- interactions ---------------- */
  function setupPreviewAudio() {
    document.addEventListener("click", function (e) {
      var btn = e.target.closest(".preview-play");
      if (!btn) return;
      var v = btn.parentElement.querySelector("video");
      if (!v) return;
      if (!v.src && v.dataset.src) v.src = v.dataset.src;
      if (v.muted) { v.muted = false; v.volume = 0.2; btn.textContent = "🔊 有声"; }
      else { v.muted = true; btn.textContent = "▶ 播放 · 有声"; }
      var p = v.play();
      if (p && p.catch) p.catch(function () {});
    });
  }

  function setupProgress() {
    var fill = $("#progressFill");
    if (!fill) return;
    var onScroll = function () {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      fill.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0).toFixed(2) + "%";
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function setupReveal() {
    var blocks = $$(".sec-head, .index, .preview, .steps, .lead, .pipe, .tech-grid, .stats, .note, .contact-title, .mail, .links");
    blocks.forEach(function (b) { b.classList.add("reveal"); });
    if (!("IntersectionObserver" in window)) {
      blocks.forEach(function (b) { b.classList.add("is-in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    blocks.forEach(function (b) { io.observe(b); });
  }

  function setupCounters() {
    var nums = $$(".stat-n");
    if (!nums.length) return;
    if (!("IntersectionObserver" in window) || reduceMotion) {
      nums.forEach(function (n) {
        var v = parseFloat(n.dataset.n) || 0;
        var d = parseInt(n.dataset.dec || "0", 10);
        n.textContent = d ? v.toFixed(d) : v.toLocaleString("en-US");
      });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        countUp(en.target);
        io.unobserve(en.target);
      });
    }, { threshold: 0.4 });
    nums.forEach(function (n) { io.observe(n); });
  }

  function setupNav() {
    var links = $$(".nav a");
    if (!links.length || !("IntersectionObserver" in window)) return;
    var map = {};
    links.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) { a.classList.remove("is-active"); });
        var a = map[en.target.id];
        if (a) a.classList.add("is-active");
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    $$("section[id]").forEach(function (s) { io.observe(s); });
  }

  /* 技术产线进度：按滚动位置点亮 */
  function setupPipe() {
    var pipe = $("#pipe");
    var nodes = $$(".pipe-node");
    if (!pipe || !nodes.length) return;
    var onScroll = function () {
      var r = pipe.getBoundingClientRect();
      var vh = window.innerHeight;
      var p = Math.max(0, Math.min(1, (vh * 0.75 - r.top) / (r.height + vh * 0.25)));
      pipe.style.setProperty("--p", p.toFixed(3));
      nodes.forEach(function (n, i) {
        n.classList.toggle("is-on", p >= i / (nodes.length - 1) - 0.02);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
  }

  function boot() {
    renderHero();
    renderWorks();
    renderAction();
    renderTech();
    renderStats();
    renderContact();
    setupPreviewAudio();
    setupProgress();
    setupReveal();
    setupCounters();
    setupNav();
    setupPipe();
    window.__SITE_READY = true;
    document.dispatchEvent(new CustomEvent("site:ready"));
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
