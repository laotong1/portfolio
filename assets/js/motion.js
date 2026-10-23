/* =========================================================
   作品集 · 滚动驱动的动画
   ---------------------------------------------------------
   只做两件事：读滚动位置 → 写 CSS 变量 / class。
   没有动画库，没有外部请求，一帧最多读 3 个 rect。

   降级：<head> 里的脚本会根据 prefers-reduced-motion 决定
   是否加 .motion；没有这个 class，本文件直接返回，
   页面保持静态、内容完整可见。
   ========================================================= */
(function () {
  "use strict";

  if (!document.documentElement.classList.contains("motion")) return;
  if (!("requestAnimationFrame" in window)) return;

  var bar = document.getElementById("scrollbar");
  var portrait = document.querySelector(".hero-portrait img");
  var timeline = document.querySelector(".timeline");
  var pipe = document.getElementById("pipe");
  var readout = document.getElementById("pipeReadout");

  // 节点由 main.js 渲染，必须在 start() 里取，不能在这里取
  var steps = [];
  var nodes = [];
  var clips = [];

  var lastPct = -1;
  var ticking = false;

  function toArray(list) {
    return Array.prototype.slice.call(list);
  }

  function clamp01(v) {
    return v < 0 ? 0 : v > 1 ? 1 : v;
  }

  /* 元素从「顶部到视口 startRatio 处」开始，
     到「底部越过视口 endRatio 处」结束，返回 0–1。 */
  function progress(el, startRatio, endRatio) {
    var r = el.getBoundingClientRect();
    var vh = window.innerHeight || 1;
    var span = r.height + (startRatio - endRatio) * vh;
    if (span <= 0) return r.top <= vh * startRatio ? 1 : 0;
    return clamp01((vh * startRatio - r.top) / span);
  }

  /* 按 p 点亮节点：节点在轨道上的位置是 i/(n-1) */
  function light(list, p, slack) {
    var n = list.length;
    for (var i = 0; i < n; i++) {
      var need = n > 1 ? i / (n - 1) : 0;
      list[i].classList.toggle("is-on", p >= need - slack);
    }
  }

  function update() {
    ticking = false;

    var docH = document.documentElement.scrollHeight - window.innerHeight;
    if (bar) {
      bar.style.transform = "scaleX(" + clamp01(docH > 0 ? window.scrollY / docH : 0).toFixed(4) + ")";
    }

    if (portrait) {
      var py = Math.max(-70, Math.min(0, window.scrollY * -0.05));
      portrait.style.setProperty("--py", py.toFixed(1) + "px");
    }

    if (timeline) {
      var tp = progress(timeline, 0.82, 0.4);
      timeline.style.setProperty("--tp", tp.toFixed(4));
      light(steps, tp, 0.03);
    }

    /* clip-path 隐藏的元素，自身被裁成 0 面积，
       IntersectionObserver 永远判定"不可见"，等不到 is-in。
       所以这里用滚动位置自己放行。 */
    if (clips.length) {
      var vh = window.innerHeight || 1;
      for (var i = 0; i < clips.length; i++) {
        if (clips[i].classList.contains("is-in")) continue;
        var r = clips[i].getBoundingClientRect();
        if (r.top < vh * 0.94 && r.bottom > 0) clips[i].classList.add("is-in");
      }
    }

    if (pipe) {
      var pp = progress(pipe, 0.88, 0.3);
      pipe.style.setProperty("--p", pp.toFixed(4));
      light(nodes, pp, 0.02);

      if (readout) {
        var pct = Math.round(pp * 100);
        if (pct !== lastPct) {
          readout.textContent = pct;
          lastPct = pct;
        }
      }
    }
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  }

  function start() {
    // main.js 已经把作品/四拍/产线节点渲染进 DOM，这里再取
    steps = timeline ? toArray(timeline.querySelectorAll(".step")) : [];
    nodes = pipe ? toArray(pipe.querySelectorAll(".pipe-node")) : [];
    clips = toArray(document.querySelectorAll('[data-reveal="clip"]'));

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("orientationchange", onScroll);

    // 字体加载完成后尺寸会变，重算一次
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(update);
    }
    update();
  }

  // main.js 渲染完（作品/步骤/产线节点都得等它建 DOM）
  if (window.__PORTFOLIO_READY) {
    window.requestAnimationFrame(start);
  } else {
    document.addEventListener("portfolio:ready", function () {
      window.requestAnimationFrame(start);
    }, { once: true });
  }
})();
