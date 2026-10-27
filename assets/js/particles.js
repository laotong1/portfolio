/* =========================================================
   背景粒子：极淡的尘埃，慢速漂移 + 轻微视差
   与暖炭底色同调，只在空白处若隐若现
   ========================================================= */
(function () {
  "use strict";

  var canvas = document.getElementById("particles");
  if (!canvas) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var ctx = canvas.getContext("2d");
  if (!ctx) return;

  var W = 0, H = 0, DPR = 1, parts = [], raf = null, running = false;
  var mouse = { x: 0, y: 0, tx: 0, ty: 0 };

  function count() {
    var a = window.innerWidth * window.innerHeight;
    return Math.max(40, Math.min(110, Math.round(a / 24000)));
  }

  function spawn() {
    var gold = Math.random() < 0.16;
    return {
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.00013,
      vy: (Math.random() - 0.5) * 0.00013 - 0.00004,
      r: gold ? 1.5 + Math.random() * 1.1 : 0.6 + Math.random() * 0.9,
      a: gold ? 0.6 + Math.random() * 0.3 : 0.16 + Math.random() * 0.26,
      gold: gold
    };
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

  function frame() {
    ctx.clearRect(0, 0, W, H);

    mouse.x += (mouse.tx - mouse.x) * 0.04;
    mouse.y += (mouse.ty - mouse.y) * 0.04;
    var px = mouse.x / W - 0.5;
    var py = mouse.y / H - 0.5;

    var i, j, p, q, dx, dy, d2, lim = 190 * 190;
    var pts = [];

    for (i = 0; i < parts.length; i++) {
      p = parts[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -0.02) p.x = 1.02;
      if (p.x > 1.02) p.x = -0.02;
      if (p.y < -0.02) p.y = 1.02;
      if (p.y > 1.02) p.y = -0.02;

      var sx = p.x * W + px * (p.gold ? 34 : 18);
      var sy = p.y * H + py * (p.gold ? 34 : 18);
      pts.push({ x: sx, y: sy, r: p.r, a: p.a, gold: p.gold });
    }

    for (i = 0; i < pts.length; i++) {
      p = pts[i];
      for (j = i + 1; j < pts.length; j++) {
        q = pts[j];
        dx = p.x - q.x;
        dy = p.y - q.y;
        d2 = dx * dx + dy * dy;
        if (d2 < lim) {
          var t = 1 - d2 / lim;
          ctx.strokeStyle = "rgba(245,240,230," + (t * 0.07).toFixed(3) + ")";
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
    }

    for (i = 0; i < pts.length; i++) {
      p = pts[i];
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      if (p.gold) {
        ctx.fillStyle = "rgba(200,169,126," + p.a + ")";
        ctx.shadowColor = "rgba(200,169,126,.75)";
        ctx.shadowBlur = 10;
      } else {
        ctx.fillStyle = "rgba(245,240,230," + p.a + ")";
        ctx.shadowBlur = 0;
      }
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    raf = requestAnimationFrame(frame);
  }

  function start() {
    if (running) return;
    running = true;
    resize();
    frame();
  }

  function stop() {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = null;
  }

  window.addEventListener("resize", function () { if (running) resize(); }, { passive: true });
  window.addEventListener("mousemove", function (e) {
    mouse.tx = e.clientX;
    mouse.ty = e.clientY;
  }, { passive: true });
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stop();
    else start();
  });

  start();
})();
