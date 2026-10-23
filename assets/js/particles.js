/* =========================================================
   粒子背景：缓慢漂移 + 近邻连线 + 鼠标视差
   纯 canvas，无依赖；减少动态 / 隐藏标签页时自动停
   ========================================================= */
(function () {
  "use strict";

  var canvas = document.getElementById("particles");
  if (!canvas) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var ctx = canvas.getContext("2d");
  if (!ctx) return;

  var W = 0, H = 0, DPR = 1;
  var parts = [];
  var mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
  var raf = null;
  var running = false;

  function count() {
    var area = window.innerWidth * window.innerHeight;
    return Math.max(60, Math.min(200, Math.round(area / 9000)));
  }

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.floor(W * DPR);
    canvas.height = Math.floor(H * DPR);
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    var n = count();
    while (parts.length < n) parts.push(spawn());
    if (parts.length > n) parts.length = n;
  }

  function spawn() {
    var red = Math.random() < 0.14;
    return {
      x: Math.random() * (W || window.innerWidth),
      y: Math.random() * (H || window.innerHeight),
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      r: red ? 1.4 + Math.random() * 1.2 : 0.6 + Math.random() * 1.1,
      a: red ? 0.55 + Math.random() * 0.35 : 0.18 + Math.random() * 0.4,
      red: red
    };
  }

  function step() {
    ctx.clearRect(0, 0, W, H);

    mouse.x += (mouse.tx - mouse.x) * 0.05;
    mouse.y += (mouse.ty - mouse.y) * 0.05;

    var px = (mouse.x - W / 2) / W;
    var py = (mouse.y - H / 2) / H;

    var i, j, p, q, dx, dy, d2, lim = 152 * 152;

    for (i = 0; i < parts.length; i++) {
      p = parts[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < -20) p.x = W + 20;
      if (p.x > W + 20) p.x = -20;
      if (p.y < -20) p.y = H + 20;
      if (p.y > H + 20) p.y = -20;

      var ox = px * (p.red ? 26 : 14);
      var oy = py * (p.red ? 26 : 14);

      // 近邻连线
      for (j = i + 1; j < parts.length; j++) {
        q = parts[j];
        dx = (p.x + ox) - (q.x + px * (q.red ? 26 : 14));
        dy = (p.y + oy) - (q.y + py * (q.red ? 26 : 14));
        d2 = dx * dx + dy * dy;
        if (d2 < lim) {
          var t = 1 - d2 / lim;
          ctx.strokeStyle = "rgba(216,52,42," + (t * 0.16).toFixed(3) + ")";
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(p.x + ox, p.y + oy);
          ctx.lineTo(q.x + px * (q.red ? 26 : 14), q.y + py * (q.red ? 26 : 14));
          ctx.stroke();
        }
      }

      ctx.beginPath();
      ctx.arc(p.x + ox, p.y + oy, p.r, 0, Math.PI * 2);
      if (p.red) {
        ctx.fillStyle = "rgba(232,65,47," + p.a + ")";
        ctx.shadowColor = "rgba(216,52,42,.85)";
        ctx.shadowBlur = 14;
      } else {
        ctx.fillStyle = "rgba(236,233,226," + p.a + ")";
        ctx.shadowBlur = 0;
      }
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    raf = requestAnimationFrame(step);
  }

  function start() {
    if (running) return;
    running = true;
    resize();
    step();
  }

  function stop() {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = null;
  }

  window.addEventListener("resize", function () {
    if (!running) return;
    resize();
  }, { passive: true });

  window.addEventListener("mousemove", function (e) {
    mouse.tx = e.clientX;
    mouse.ty = e.clientY;
  }, { passive: true });

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stop();
    else if (!document.hidden) start();
  });

  if (window.__SITE_READY) start();
  else document.addEventListener("site:ready", start, { once: true });
})();
