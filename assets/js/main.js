/* =========================================================
   作品集 · 渲染与交互
   纯原生 JS，无依赖，无外部请求。
   ========================================================= */
(function () {
  "use strict";

  var S = window.SITE || {};
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------ helpers ------------------------------ */
  function esc(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function slotMarkup(label, variant) {
    return '<div class="slot' + (variant ? " slot--" + variant : "") + '" aria-hidden="true"><i></i><i></i><i></i><i></i><span>' +
      esc(label || "待插入") + "</span></div>";
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

  /* 双向重播：元素进入视口时播，完全离开后复位，
     下次再进来（无论从上还是从下）继续播。
     方向由进入时的位置决定：从下面上来 → 上浮；从上面下来 → 下落。 */
  function revealObserve() {
    var items = $$("[data-reveal]");
    if (!items.length) return;

    if (!("IntersectionObserver" in window) || reduceMotion) {
      items.forEach(function (n) { n.classList.add("is-in"); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var el = e.target;

        // clip 元素被自身 clip-path 裁成 0 面积，观察器读不到；
        // 交给 motion.js 按滚动位置处理。
        if (el.getAttribute("data-reveal") === "clip") return;

        if (e.isIntersecting) {
          if (el.classList.contains("is-in")) return;

          // 方向：进入瞬间 top < 0，说明它的上沿还在视口外，
          // 是从上沿"落"下来的；否则是从下沿"升"上来的。
          var r = el.getBoundingClientRect();
          var dir = r.top < 0 ? "down" : "up";
          el.setAttribute("data-dir", dir);
          // 强制一次样式重算：不这么做，起始位移和 is-in 会合并成一次样式变更，
          // 过渡会从旧位置开始，"从上方下来"就失效了。
          void el.offsetWidth;

          el.classList.add("is-in");
        } else if (el.classList.contains("is-in")) {
          // 完全离开视口才复位，避免边缘抖动
          el.classList.remove("is-in");
        }
      });
    }, { rootMargin: "0px", threshold: 0 });

    items.forEach(function (n) { io.observe(n); });
  }

  /* ------------------------------ hero ------------------------------ */
  function splitName() {
    var el = $(".hero-name");
    if (!el || !document.documentElement.classList.contains("motion")) return;
    var txt = (el.textContent || "").trim();
    if (!txt) return;
    el.setAttribute("aria-label", txt);
    el.innerHTML = txt.split("").map(function (c, i) {
      return '<span class="ch" aria-hidden="true" style="transition-delay:' + (110 + i * 70) + 'ms">' + esc(c) + "</span>";
    }).join("");
  }

  function renderHero() {
    var tag = $("#heroTagline");
    if (tag) tag.innerHTML = S.tagline || "";

    var role = $("#heroRole");
    if (role && S.role) role.textContent = S.role;

    var meta = $("#heroMeta");
    if (meta && S.meta) {
      meta.innerHTML = S.meta.map(function (m) { return "<span>" + esc(m) + "</span>"; }).join("");
    }

    var strip = $("#stripTrack");
    if (strip && S.keywords) {
      var one = S.keywords.map(function (k) { return "<span>" + esc(k) + "</span>"; }).join("");
      strip.innerHTML = one + one; // 复制一份用于无缝滚动
    }

    var btn = $("#resumeBtn");
    if (btn && S.resume) {
      btn.href = S.resume.director;
      btn.setAttribute("download", "");
    }

    var flow = $("#flowLink");
    if (flow && S.flowUrl) flow.href = S.flowUrl;
  }

  /* ------------------------------ works ------------------------------ */
  function videoMarkup(p, idx) {
    var v = p.video || {};
    var hasBili = !!v.bilibili;
    var hasMp4 = !!v.mp4;
    var portrait = v.orientation === "portrait";
    var poster = v.poster
      ? '<img src="' + esc(v.poster) + '" alt="' + esc(p.title) + ' 封面" loading="lazy">'
      : slotMarkup(hasBili || hasMp4 ? "视频封面待插入" : "在此嵌入 30 秒成片", "media");

    var hint = "";

    return '<div class="media' + (portrait ? " media--portrait" : "") + '" data-video data-bilibili="' + esc(v.bilibili || "") + '" data-mp4="' + esc(v.mp4 || "") + '" data-poster="' + esc(v.poster || "") + '">' +
      poster +
      (v.tag ? '<span class="media-tag">' + esc(v.tag) + "</span>" : "") +
      '<button class="play" type="button" aria-label="播放 ' + esc(p.title) + '"><span class="play-ring"></span></button>' +
      hint +
      "</div>";
  }

  function stillsMarkup(p) {
    if (!p.stills || !p.stills.length) return "";
    var portrait = p.video && p.video.orientation === "portrait";
    return '<div class="still-row' + (portrait ? " still-row--portrait" : "") + '">' + p.stills.map(function (s) {
      var img = s.image
        ? '<img src="' + esc(s.image) + '" alt="' + esc(s.label) + '" loading="lazy">'
        : slotMarkup("待插入");
      return '<figure class="still' + (s.image ? " is-clickable" : "") + '"' +
        (s.image ? ' tabindex="0" role="button"' : "") +
        ' data-caption="' + esc(stripTags(s.caption)) + '">' +
        '<div class="still-frame">' + img + '<figcaption class="still-label">' + esc(s.label) + "</figcaption></div>" +
        '<p class="still-cap">' + (s.caption || "") + "</p>" +
        "</figure>";
    }).join("") + "</div>";
  }

  function stripTags(html) {
    return String(html || "").replace(/<[^>]*>/g, "");
  }

  function biliHref(val) {
    if (!val) return "";
    if (/^https?:/i.test(val)) return val;
    return "https://www.bilibili.com/video/" + extractBvid(val) + "/";
  }

  /* 作品：大屏预览 + 接触印样（6 帧 / 时间码） */
  function renderWorks() {
    var host = $("#worksList");
    if (!host || !S.projects) return;

    var STAMPS = ["00:03", "00:08", "00:13", "00:18", "00:23", "00:27"];

    host.innerHTML = S.projects.map(function (p, i) {
      var v = p.video || {};
      var poster = v.poster ? ' poster="' + esc(v.poster) + '"' : "";

      var strip = STAMPS.map(function (tc, n) {
        var src = "assets/img/f-" + p.id + "-" + (n + 1) + ".jpg";
        return '<figure class="film-frame">' +
          '<img src="' + esc(src) + '" alt="' + esc(p.title) + " 第 " + (n + 1) + ' 帧" loading="lazy" decoding="async">' +
          '<figcaption class="film-tc">' + tc + "</figcaption>" +
          "</figure>";
      }).join("");

      return '<article class="film' + (i % 2 ? " film--flip" : "") + '" id="work-' + esc(p.id) + '" data-reveal>' +
        '<div class="film-media" data-video data-bilibili="' + esc(v.bilibili || "") + '" data-mp4="' + esc(v.mp4 || "") + '">' +
          '<video muted playsinline loop preload="none"' + poster + ' data-src="' + esc(v.mp4 || "") + '"></video>' +
          '<button class="play" type="button" aria-label="播放 ' + esc(p.title) + '，带声音"><span class="play-ring"></span></button>' +
        "</div>" +
        '<div class="film-body">' +
          '<p class="film-no">' + (i + 1 < 10 ? "0" : "") + (i + 1) + "</p>" +
          '<h3 class="film-title">' + esc(p.title) + "</h3>" +
          '<p class="film-fig">' + esc(p.figures || "") + "</p>" +
          '<p class="film-line">' + esc(p.line || "") + "</p>" +
          '<div class="film-strip">' + strip + "</div>" +
          ((p.video && p.video.bilibili)
            ? '<a class="film-link" href="' + esc(biliHref(p.video.bilibili)) + '" target="_blank" rel="noopener">B 站观看 ↗</a>'
            : "") +
        "</div>" +
        "</article>";
    }).join("");
  }

  /* ------------------------------ action ------------------------------ */
  function renderAction() {
    var intro = $("#actionIntro");
    if (intro && S.action) intro.textContent = S.action.intro || "";

    var host = $("#actionSteps");
    if (host && S.action) {
      host.innerHTML = S.action.steps.map(function (s) {
        return '<div class="step" data-reveal>' +
          '<span class="step-k">' + esc(s.k) + "</span>" +
          '<span class="step-en">' + esc(s.en) + "</span>" +
          '<p class="step-text">' + esc(s.text) + "</p>" +
          '<p class="step-detail">' + esc(s.detail) + "</p>" +
          "</div>";
      }).join("");
    }
  }

  /* ------------------------------ tech ------------------------------ */
  function renderTech() {
    var host = $("#techGrid");
    if (host && S.tech) {
      host.innerHTML = S.tech.map(function (t) {
        return '<article class="tcard" data-reveal>' +
          '<p class="mono-label">' + esc(t.label) + "</p>" +
          "<h3>" + esc(t.title) + "</h3>" +
          '<p class="tcard-sub">' + esc(t.en) + "</p>" +
          "<ul>" + (t.points || []).map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") + "</ul>" +
          "</article>";
      }).join("");
    }

    if (S.sop) {
      var head = $("#sopHead");
      if (head) head.innerHTML = S.sop.head.map(function (h) { return "<th>" + esc(h) + "</th>"; }).join("");
      var body = $("#sopBody");
      if (body) {
        var heads = S.sop.head || [];
        body.innerHTML = S.sop.rows.map(function (r) {
          return "<tr>" + r.map(function (c, i) {
            return "<td" + (i > 0 ? ' data-label="' + esc(heads[i] || "") + '"' : "") + ">" + esc(c) + "</td>";
          }).join("") + "</tr>";
        }).join("");
      }
    }
  }

  /* ------------------------------ pipeline ------------------------------ */
  function renderPipeline() {
    var P = S.pipeline;
    var host = $("#pipeNodes");
    if (!host || !P) return;

    var lbl = $("#pipeLabel"), title = $("#pipeTitle"), desc = $("#pipeDesc");
    if (lbl) lbl.textContent = P.label;
    if (title) title.textContent = P.title;
    if (desc) desc.textContent = P.desc;

    host.innerHTML = P.steps.map(function (s, i) {
      return '<li class="pipe-node" data-i="' + i + '">' +
        '<span class="pn-dot" aria-hidden="true"></span>' +
        "<b>" + esc(s.k) + "</b>" +
        "<em>" + esc(s.s) + "</em>" +
        "</li>";
    }).join("");
  }

  /* ------------------------------ stats ------------------------------ */
  var counters = [];

  function renderStats() {
    var host = $("#stats");
    if (!host || !S.stats) return;

    host.innerHTML = S.stats.map(function (s, i) {
      return '<div class="stat" data-reveal>' +
        '<p class="stat-v">' +
          (s.prefix ? '<span class="stat-a">' + esc(s.prefix) + "</span>" : "") +
          '<span class="stat-n" data-target="' + s.n + '" data-decimals="' + (s.decimals || 0) + '" data-index="' + i + '">0</span>' +
          (s.suffix ? '<span class="stat-a">' + esc(s.suffix) + "</span>" : "") +
        "</p>" +
        '<p class="stat-l">' + esc(s.label) + "</p>" +
        '<p class="stat-s">' + esc(s.sub || "") + "</p>" +
        (s.bar ? '<span class="stat-bar"><i style="--v:' + s.bar + '%"></i></span>' : "") +
        "</div>";
    }).join("");

    var note = $("#statsNote");
    if (note && S.statsNote) note.textContent = S.statsNote;
  }

  function runCounters() {
    var nums = $$(".stat-n");
    if (!nums.length) return;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      nums.forEach(function (n) {
        n.textContent = (parseFloat(n.dataset.target) || 0).toLocaleString("en-US");
      });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var n = e.target;
        if (e.isIntersecting) {
          animateNumber(n);
        } else {
          // 复位：回到 0，下次进来重新数
          n.dataset.token = "";
          n.dataset.busy = "0";
          n.textContent = "0";
        }
      });
    }, { rootMargin: "0px", threshold: 0.5 });

    nums.forEach(function (n) { io.observe(n); });
  }

  function animateNumber(node) {
    var target = parseFloat(node.dataset.target) || 0;
    var dec = parseInt(node.dataset.decimals || "0", 10);
    var token = String(Date.now()) + Math.random();
    var start = null;
    var dur = 1300;

    function fmt(v) {
      return dec ? v.toFixed(dec) : Math.round(v).toLocaleString("en-US");
    }

    node.dataset.token = token;
    node.dataset.busy = "1";

    function frame(ts) {
      if (node.dataset.token !== token) return; // 滚出去了，取消
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      node.textContent = fmt(target * eased);
      if (p < 1) requestAnimationFrame(frame);
      else node.textContent = fmt(target);
    }
    requestAnimationFrame(frame);
  }

  /* ------------------------------ video ------------------------------ */
  function extractBvid(val) {
    if (!val) return "";
    var m = String(val).match(/BV[0-9A-Za-z]+/);
    return m ? m[0] : String(val).trim();
  }

  function addSoundToggle(media, video) {
    if (media.querySelector(".sound-toggle")) return;
    var sound = document.createElement("button");
    sound.type = "button";
    sound.className = "sound-toggle";

    function paint() {
      sound.innerHTML = video.muted
        ? '<span aria-hidden="true">🔇</span>静音'
        : '<span aria-hidden="true">🔊</span>' + Math.round(video.volume * 100) + "%";
      sound.setAttribute("aria-label", video.muted ? "取消静音" : "静音");
    }
    paint();

    sound.addEventListener("click", function (e) {
      e.stopPropagation();
      video.muted = !video.muted;
      if (!video.muted && video.volume === 0) video.volume = 0.2;
      paint();
    });
    media.appendChild(sound);
  }

  /* 点播放：从静音预览切到带声音、带控制的完整播放 */
  function playFull(media) {
    var bili = extractBvid(media.dataset.bilibili);
    var mp4 = media.dataset.mp4;
    var video = media.querySelector("video");
    var play = media.querySelector(".play");

    if (video && mp4) {
      if (!video.src) video.src = mp4;
      video.muted = false;
      video.volume = 0.2;
      video.loop = false;
      video.controls = true;
      var attempt = video.play();
      if (attempt && attempt.catch) {
        attempt.catch(function () {
          video.muted = true;
          var retry = video.play();
          if (retry && retry.catch) retry.catch(function () {});
        });
      }
      if (play) play.remove();
      addSoundToggle(media, video);
      return;
    }

    if (bili) {
      var iframe = document.createElement("iframe");
      iframe.src = "https://player.bilibili.com/player.html?bvid=" + encodeURIComponent(bili) +
        "&page=1&high_quality=1&danmaku=0&autoplay=1";
      iframe.setAttribute("allowfullscreen", "true");
      iframe.setAttribute("scrolling", "no");
      iframe.setAttribute("frameborder", "0");
      iframe.setAttribute("title", "B 站视频");
      if (play) play.remove();
      media.appendChild(iframe);
      return;
    }

    toast("还没有配置视频：在 assets/js/content.js 里填 video.mp4 或 video.bilibili");
  }

  function setupVideo() {
    document.addEventListener("click", function (e) {
      var play = e.target.closest(".play");
      if (!play) return;
      var media = play.closest("[data-video]");
      if (media) playFull(media);
    });
  }

  /* 预览：进入视口才加载、静音循环；离开就暂停，不抢声音 */
  function setupReels() {
    var vids = $$("video[data-src]");
    if (!vids.length) return;
    if (reduceMotion || !("IntersectionObserver" in window)) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var v = en.target;
        if (en.intersectionRatio > 0.55) {
          if (!v.src) v.src = v.dataset.src;
          var p = v.play();
          if (p && p.catch) p.catch(function () {});
        } else if (en.intersectionRatio < 0.15 && !v.paused) {
          v.pause();
        }
      });
    }, { threshold: [0, 0.15, 0.55] });

    vids.forEach(function (v) { io.observe(v); });
  }

  /* ------------------------------ lightbox ------------------------------ */
  function setupLightbox() {
    var lb = $("#lightbox");
    var img = $("#lbImg");
    var cap = $("#lbCap");
    if (!lb) return;

    var lastFocus = null;

    function open(still) {
      var pic = $("img", still);
      if (!pic) return;
      lastFocus = document.activeElement;
      img.src = pic.src;
      img.alt = pic.alt || "";
      cap.textContent = still.dataset.caption || "";
      lb.hidden = false;
      document.body.style.overflow = "hidden";
      var closeBtn = $("#lbClose");
      if (closeBtn) closeBtn.focus();
    }

    function close() {
      lb.hidden = true;
      img.removeAttribute("src");
      document.body.style.overflow = "";
      if (lastFocus && lastFocus.focus) lastFocus.focus();
      lastFocus = null;
    }

    document.addEventListener("click", function (e) {
      var still = e.target.closest(".still.is-clickable");
      if (still) { open(still); return; }
      if (e.target === lb || e.target.id === "lbClose") close();
    });

    // 键盘：缩略图可 Tab 聚焦，回车/空格打开
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !lb.hidden) { close(); return; }
      if (e.key !== "Enter" && e.key !== " ") return;
      var still = e.target.closest && e.target.closest(".still.is-clickable");
      if (!still) return;
      e.preventDefault();
      open(still);
    });
  }

  /* ------------------------------ nav ------------------------------ */
  function setupNav() {
    var nav = $("#nav");
    if (!nav) return;

    var onScroll = function () {
      nav.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    var links = $$(".nav-links a");
    if (!links.length || !("IntersectionObserver" in window)) return;

    var map = {};
    links.forEach(function (a) {
      var id = a.getAttribute("href").slice(1);
      var sec = document.getElementById(id);
      if (sec) map[id] = a;
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) { a.classList.remove("is-active"); });
        var a = map[en.target.id];
        if (a) a.classList.add("is-active");
      });
    }, { rootMargin: "-42% 0px -52% 0px", threshold: 0 });

    Object.keys(map).forEach(function (id) {
      io.observe(document.getElementById(id));
    });
  }

  /* ------------------------------ contact ------------------------------ */
  function renderContact() {
    var mail = $("#mailLink");
    if (mail && S.email) {
      mail.href = "mailto:" + S.email;
      mail.textContent = S.email;
    }

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

  /* ------------------------------ back to top ------------------------------ */
  function setupToTop() {
    var btn = $("#toTop");
    if (!btn) return;

    var onScroll = function () {
      btn.classList.toggle("is-on", window.scrollY > 900);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  /* ------------------------------ boot ------------------------------ */
  function boot() {
    renderHero();
    splitName();
    renderWorks();
    renderAction();
    renderTech();
    renderPipeline();
    renderStats();
    renderContact();
    setupVideo();
    setupReels();
    setupLightbox();
    setupNav();
    setupToTop();
    revealObserve();
    runCounters();
    window.__PORTFOLIO_READY = true;
    document.dispatchEvent(new CustomEvent("portfolio:ready"));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
