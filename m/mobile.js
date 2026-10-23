/* =========================================================
   手机版：一屏一部片，视频自动静音播放，点一下有声
   ========================================================= */
(function () {
  "use strict";

  var S = window.SITE || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* 站点根目录下的资源，在 /m/ 里要加 ../ */
  function asset(p) {
    if (!p) return "";
    if (p.charAt(0) === "/" || /^https?:/i.test(p)) return p;
    return "../" + p;
  }

  function esc(v) {
    return String(v == null ? "" : v)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function renderHero() {
    var name = $("#heroName"), role = $("#heroRole"), tag = $("#heroTag"), stat = $("#heroStat");
    if (name && S.name) name.textContent = S.name;
    if (role) role.textContent = S.role || "";
    if (tag) tag.innerHTML = S.tagline || "";
    if (stat) {
      var n = S.stats && S.stats[0];
      stat.textContent = n ? (n.label + " " + n.n + (n.suffix || "")) : "";
    }
  }

  function workSlide(p, i) {
    var v = p.video || {};
    var no = (i + 1 < 10 ? "0" : "") + (i + 1);
    return '<section class="slide slide--work" id="work-' + esc(p.id) + '" data-work>' +
      '<video muted playsinline webkit-playsinline loop preload="none" poster="' + esc(asset(v.poster)) + '" data-src="' + esc(asset(v.mp4)) + '"></video>' +
      '<div class="scrim"></div>' +
      '<div class="work-top">' +
        '<span class="work-no">' + no + "</span>" +
        '<button class="sound" type="button" aria-label="开启声音">🔇 静音</button>' +
      "</div>" +
      '<div class="work-copy">' +
        '<h2 class="work-title">' + esc(p.title) + "</h2>" +
        '<p class="work-fig">' + esc(p.figures || "") + "</p>" +
        '<p class="work-line">' + esc(p.line || "") + "</p>" +
        '<span class="work-play"><i></i>点一下 · 有声播放</span>' +
      "</div>" +
      "</section>";
  }

  function renderWorks() {
    var anchor = $("#numbers");
    if (!anchor || !S.projects) return;
    anchor.insertAdjacentHTML("beforebegin", S.projects.map(workSlide).join(""));
  }

  function renderStats() {
    var host = $("#stats");
    if (!host || !S.stats) return;
    host.innerHTML = S.stats.map(function (s) {
      return '<div class="stat">' +
        '<p class="stat-v">' +
          (s.prefix ? '<span class="stat-a">' + esc(s.prefix) + "</span>" : "") +
          '<span class="stat-n" data-target="' + s.n + '" data-decimals="' + (s.decimals || 0) + '">0</span>' +
          (s.suffix ? '<span class="stat-a">' + esc(s.suffix) + "</span>" : "") +
        "</p>" +
        '<p class="stat-l">' + esc(s.label) + "</p>" +
        "</div>";
    }).join("");
    var note = $("#statsNote");
    if (note) note.textContent = S.statsNote || "";
  }

  function countUp(el) {
    var target = parseFloat(el.dataset.target) || 0;
    var dec = parseInt(el.dataset.decimals || "0", 10);
    var t0 = 0;
    function frame(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / 1100, 1);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = dec ? (target * e).toFixed(dec) : Math.round(target * e).toLocaleString("en-US");
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function renderContact() {
    var mail = $("#mailLink");
    if (mail && S.email) { mail.href = "mailto:" + S.email; mail.textContent = S.email; }

    var host = $("#contactLinks");
    if (!host) return;
    var items = (S.contact || []).filter(function (c) { return c.label !== "邮箱"; });
    host.innerHTML = items.map(function (c) {
      if (c.label === "简历") {
        return '<a href="' + esc(asset(S.resume.director)) + '" download>执行导演版 PDF</a>' +
          '<a href="' + esc(asset(S.resume.tech)) + '" download>AIGC 技术版 PDF</a>';
      }
      return '<a href="' + esc(c.href) + '"' + (/^https?:/.test(c.href) ? ' target="_blank" rel="noopener"' : "") + ">" +
        esc(c.value) + "</a>";
    }).join("");
  }

  /* 视频：进入视口自动静音播放，离开暂停 */
  function setupVideos() {
    var vids = $$("video[data-src]");
    if (!vids.length || !("IntersectionObserver" in window)) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var v = en.target;
        if (en.intersectionRatio > 0.55) {
          if (!v.src) v.src = v.dataset.src;
          if (!reduce) {
            var p = v.play();
            if (p && p.catch) p.catch(function () {});
          }
        } else if (en.intersectionRatio < 0.15 && !v.paused) {
          v.pause();
        }
      });
    }, { threshold: [0, 0.15, 0.55] });

    vids.forEach(function (v) { io.observe(v); });
  }

  /* 点视频 / 点按钮：切换声音 */
  document.addEventListener("click", function (e) {
    var slide = e.target.closest("[data-work]");
    if (!slide) return;
    var v = slide.querySelector("video");
    var btn = slide.querySelector(".sound");
    if (!v) return;

    v.muted = !v.muted;
    if (!v.muted) {
      v.volume = 0.7;
      var p = v.play();
      if (p && p.catch) p.catch(function () {});
    }
    if (btn) {
      btn.textContent = v.muted ? "🔇 静音" : "🔊 有声";
      btn.setAttribute("aria-label", v.muted ? "开启声音" : "关闭声音");
    }
  });

  /* 顶部进度 */
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

  /* 数字滚入 */
  function setupCounters() {
    var nums = $$(".stat-n");
    if (!nums.length || !("IntersectionObserver" in window) || reduce) {
      nums.forEach(function (n) {
        var v = parseFloat(n.dataset.target) || 0;
        var d = parseInt(n.dataset.decimals || "0", 10);
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
    }, { threshold: 0.6 });
    nums.forEach(function (n) { io.observe(n); });
  }

  function boot() {
    renderHero();
    renderWorks();
    renderStats();
    renderContact();
    setupVideos();
    setupProgress();
    setupCounters();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
