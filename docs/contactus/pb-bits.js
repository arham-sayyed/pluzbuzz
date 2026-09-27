/* Vanilla ports of React Bits components (MIT + Commons Clause, reactbits.dev):
   TearTicket, PaperCrumple, DepthText, DriftWall, RefineFrame, ScrollExpand, SlideCommit. */
(function () {
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const reduceMQ = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const el = (tag, css, attrs) => { const e = document.createElement(tag); if (css) e.style.cssText = css; if (attrs) for (const k in attrs) e.setAttribute(k, attrs[k]); return e; };
  const NS = 'http://www.w3.org/2000/svg';
  const sv = (tag, attrs) => { const e = document.createElementNS(NS, tag); for (const k in attrs || {}) e.setAttribute(k, attrs[k]); return e; };
  const smoothstep = (a, b, x) => { const t = clamp((x - a) / (b - a || 1e-6), 0, 1); return t * t * (3 - 2 * t); };
  const rng = seed => { let s = seed | 0; return () => { s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };

  /* ---------- flames (solid layers, no blending) ---------- */
  function drawFlames(ctx, w, h, t, amp, colors) {
    ctx.clearRect(0, 0, w, h);
    if (amp <= 0.001) return;
    const L = [{ c: colors[0], s: 1.0, sp: 0.8, o: 0 }, { c: colors[1], s: 0.72, sp: 1.2, o: 2.1 }, { c: colors[2], s: 0.44, sp: 1.7, o: 4.2 }];
    for (const l of L) {
      ctx.fillStyle = l.c; ctx.beginPath(); ctx.moveTo(-20, h + 20);
      for (let x = -20; x <= w + 20; x += 4) {
        const u = x / w;
        const n = Math.sin(u * 8 + t * l.sp * 1.6 + l.o) * 0.5 + Math.sin(u * 21 - t * l.sp * 2.5 + l.o * 1.7) * 0.32 + Math.sin(u * 43 + t * l.sp * 4.1) * 0.18;
        const tongue = Math.pow(Math.max(0, (n + 1) / 2), 2.1);
        ctx.lineTo(x, h - h * l.s * amp * (0.16 + 0.84 * tongue));
      }
      ctx.lineTo(w + 20, h + 20); ctx.closePath(); ctx.fill();
    }
  }
  function flameCanvas(canvas, o) {
    o = Object.assign({ amp: 0.45, speed: 0.5, colors: ['#555AFE', '#E453EE', '#F2D458'] }, o);
    const ctx = canvas.getContext('2d'); let raf = 0, live = false;
    const fit = () => { const w = canvas.clientWidth, h = canvas.clientHeight; if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; } };
    const loop = now => { fit(); drawFlames(ctx, canvas.width, canvas.height, now / 1000 * o.speed, o.amp, o.colors); if (live) raf = requestAnimationFrame(loop); };
    if (reduceMQ()) { fit(); drawFlames(ctx, canvas.width, canvas.height, 2, o.amp, o.colors); return () => {}; }
    const io = new IntersectionObserver(([e]) => { const was = live; live = e.isIntersecting; if (live && !was) raf = requestAnimationFrame(loop); });
    io.observe(canvas);
    return () => { live = false; cancelAnimationFrame(raf); io.disconnect(); };
  }

  /* ---------- TearTicket ---------- */
  function buildGeometry(W, H, S, R, holes, hole, notch, rough, vertical) {
    const f = n => n.toFixed(2);
    const main = vertical ? H : W, cross = vertical ? W : H, x = main - S, hr = hole / 2;
    const n = Math.max(1, Math.round(holes)), span = cross - 2 * notch;
    const bridge = Math.max(2, (span - n * hole) / (n + 1));
    const random = rng(n * 7919 + Math.round(cross));
    const at = (u, v) => (vertical ? { x: v, y: u } : { x: u, y: v });
    const pt = (u, v) => (vertical ? `${f(v)},${f(u)}` : `${f(u)},${f(v)}`);
    const arc = (r, sweep, u, v) => `A${f(r)},${f(r)} 0 0 ${vertical ? 1 - sweep : sweep} ${pt(u, v)}`;
    const bridges = [];
    for (let i = 0; i <= n; i++) {
      const y0 = notch + i * (bridge + hole), y1 = y0 + bridge;
      const steps = Math.max(2, Math.round(bridge / 2.2)), pts = [];
      for (let k = 1; k < steps; k++) pts.push([x + (random() - 0.5) * 2 * rough, y0 + (bridge * k) / steps]);
      bridges.push(Object.assign({ y0, y1, mid: (y0 + y1) / 2, pts }, at(x, (y0 + y1) / 2)));
    }
    let body = `M${pt(R, 0)}L${pt(x - notch, 0)}${arc(notch, 0, x, notch)}`;
    bridges.forEach((b, i) => { b.pts.forEach(p => { body += `L${pt(p[0], p[1])}`; }); body += `L${pt(x, b.y1)}`; if (i < n) body += arc(hr, 0, x, b.y1 + hole); });
    body += `${arc(notch, 0, x - notch, cross)}L${pt(R, cross)}${arc(R, 1, 0, cross - R)}L${pt(0, R)}${arc(R, 1, R, 0)}Z`;
    let stub = `M${pt(x + notch, 0)}L${pt(main - R, 0)}${arc(R, 1, main, R)}L${pt(main, cross - R)}${arc(R, 1, main - R, cross)}L${pt(x + notch, cross)}${arc(notch, 0, x, cross - notch)}`;
    for (let i = n; i >= 0; i--) { const b = bridges[i]; for (let k = b.pts.length - 1; k >= 0; k--) stub += `L${pt(b.pts[k][0], b.pts[k][1])}`; stub += `L${pt(x, b.y0)}`; if (i > 0) stub += arc(hr, 0, x, b.y0 - hole); }
    stub += `${arc(notch, 0, x + notch, 0)}Z`;
    const ends = [Object.assign({ v: notch }, at(x, notch)), Object.assign({ v: cross - notch }, at(x, cross - notch))];
    const bodyOutline = `M${pt(x, cross - notch)}${arc(notch, 0, x - notch, cross)}L${pt(R, cross)}${arc(R, 1, 0, cross - R)}L${pt(0, R)}${arc(R, 1, R, 0)}L${pt(x - notch, 0)}${arc(notch, 0, x, notch)}`;
    const stubOutline = `M${pt(x, notch)}${arc(notch, 0, x + notch, 0)}L${pt(main - R, 0)}${arc(R, 1, main, R)}L${pt(main, cross - R)}${arc(R, 1, main - R, cross)}L${pt(x + notch, cross)}${arc(notch, 0, x, cross - notch)}`;
    return { vertical, cross, body, stub, bridges, ends, bodyOutline, stubOutline };
  }

  function tearTicket(root, o) {
    o = Object.assign({ width: 460, height: 250, stubSize: 150, radius: 16, holes: 12, holeSize: 6, notch: 3, roughness: 0, tearAngle: 30, stretch: 30, resistance: 0.45, rotate: 4, tilt: true, tiltMax: 9, tiltReach: 260, parallax: 6, perspective: 1000, background: '#27272a', color: '#f5f5f5', border: true, borderColor: '', borderWidth: 1, stubBackground: '', recenter: true, body: '', stub: '', ariaLabel: 'Tear off the stub', onTear: null }, o);
    const reduce = reduceMQ(), W = o.width, H = o.height, S = o.stubSize;
    const geo = buildGeometry(W, H, S, o.radius, o.holes, o.holeSize, o.notch, o.roughness, false);
    const f = n => n.toFixed(2);
    const RETRACT = 0.17, GRAVITY = 2400;
    const edge = o.borderColor || `color-mix(in srgb, ${o.color} 16%, transparent)`;
    root.innerHTML = '';
    Object.assign(root.style, { position: 'relative', userSelect: 'none', webkitUserSelect: 'none', width: `min(${W}px,100%)`, color: o.color });
    const stage = el('div', `position:absolute;top:0;left:0;width:${W}px;height:${H}px;transform-origin:0 0;transition:transform 650ms cubic-bezier(.22,1,.36,1)`);
    const plane = el('div', 'position:absolute;inset:0');
    const bodyEl = el('div', 'position:absolute;inset:0;pointer-events:none');
    const outline = d => { const s = sv('svg', { viewBox: `0 0 ${W} ${H}` }); s.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none'; s.appendChild(sv('path', { d, fill: 'none', stroke: edge, 'stroke-width': o.borderWidth })); return s; };
    if (o.border) bodyEl.appendChild(outline(geo.bodyOutline));
    const paper = el('div', `position:absolute;inset:0;background:${o.background};pointer-events:auto`); paper.style.clipPath = `path('${geo.body}')`;
    const ink = el('div', `position:absolute;top:0;bottom:0;left:0;width:${W - S}px;transition:opacity 500ms ease`); ink.innerHTML = o.body;
    paper.appendChild(ink); bodyEl.appendChild(paper);
    const fsvg = sv('svg', {}); fsvg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none';
    const fibres = [];
    geo.bridges.forEach(() => { for (let k = 0; k < 2; k++) { const p = sv('path', { fill: 'none', stroke: o.stubBackground || o.background, 'stroke-linecap': 'round' }); p.style.opacity = '0'; fsvg.appendChild(p); fibres.push(p); } });
    const stubEl = el('div', 'position:absolute;inset:0;pointer-events:none;outline:none;will-change:transform', { role: 'button', tabindex: '0', 'aria-label': o.ariaLabel });
    if (o.border) stubEl.appendChild(outline(geo.stubOutline));
    const stubPaper = el('div', `position:absolute;inset:0;background:${o.stubBackground || o.background};pointer-events:auto;cursor:grab;touch-action:none`); stubPaper.style.clipPath = `path('${geo.stub}')`;
    const stubInner = el('div', `position:absolute;top:0;bottom:0;right:0;width:${S}px`); stubInner.innerHTML = o.stub;
    stubPaper.appendChild(stubInner); stubEl.appendChild(stubPaper);
    plane.append(bodyEl, fsvg, stubEl); stage.appendChild(plane); root.appendChild(stage);

    let fit = 1, used = false;
    const layout = () => { fit = Math.min(1, root.clientWidth / W) || 1; root.style.height = `${H * fit}px`; stage.style.transform = (used && o.recenter ? `translateX(${S * fit / 2}px) ` : '') + `scale(${fit})`; };
    const ro = new ResizeObserver(layout); ro.observe(root); layout();

    // tilt spring
    const tilt = { x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0, raf: 0, last: 0 };
    const depth = o.tiltMax > 0 ? o.parallax / o.tiltMax : 0;
    const applyTilt = () => { plane.style.transform = `perspective(${o.perspective}px) rotate(${o.rotate}deg) rotateX(${tilt.x.toFixed(3)}deg) rotateY(${tilt.y.toFixed(3)}deg)`; ink.style.transform = `translate(${(tilt.y * depth * 0.22).toFixed(2)}px, ${(-tilt.x * depth * 0.22).toFixed(2)}px)`; };
    const tiltStep = now => {
      const dt = Math.min(0.034, (now - tilt.last) / 1000 || 0.016); tilt.last = now;
      for (const [p, v, t] of [['x', 'vx', 'tx'], ['y', 'vy', 'ty']]) { const a = (220 * (tilt[t] - tilt[p]) - 24 * tilt[v]) / 0.6; tilt[v] += a * dt; tilt[p] += tilt[v] * dt; }
      applyTilt();
      if (Math.abs(tilt.tx - tilt.x) + Math.abs(tilt.ty - tilt.y) + Math.abs(tilt.vx) + Math.abs(tilt.vy) > 0.01) tilt.raf = requestAnimationFrame(tiltStep); else tilt.raf = 0;
    };
    const kickTilt = () => { if (!tilt.raf) { tilt.last = performance.now(); tilt.raf = requestAnimationFrame(tiltStep); } };
    applyTilt();

    const s = { raf: 0, last: 0, phase: 'idle', id: null, sign: 1, hinge: { x: 0, y: 0 }, hingeV: 0, grab: { x: 0, y: 0 }, start: { x: 0, y: 0 }, point: { x: 0, y: 0 }, a0: 0, theta: 0, thetaV: 0, sx: 0, sy: 0, vx: 0, vy: 0, spin: 0, pvx: 0, pvy: 0, pt: 0, fade: 1, age: 0, bx: 0, bv: 0, snapped: [], snapAt: [], span: [] };
    const wrap = a => Math.atan2(Math.sin(a), Math.cos(a));
    const paint = now => {
      stubEl.style.transform = `translate(${s.sx.toFixed(2)}px, ${s.sy.toFixed(2)}px) rotate(${((s.theta * s.sign * 180) / Math.PI).toFixed(3)}deg)`;
      stubEl.style.opacity = s.fade.toFixed(3);
      bodyEl.style.transform = `translateX(${s.bx.toFixed(2)}px)`;
      const cos = Math.cos(s.theta * s.sign), sin = Math.sin(s.theta * s.sign), lx = 0, ly = 1.6;
      let busy = false;
      geo.bridges.forEach((b, i) => {
        const dx = b.x - s.hinge.x, dy = b.y - s.hinge.y;
        const tx = s.hinge.x + dx * cos - dy * sin + s.sx, ty = s.hinge.y + dx * sin + dy * cos + s.sy;
        const ox = b.x + s.bx, oy = b.y, gx = tx - ox, gy = ty - oy, gap = Math.hypot(gx, gy);
        const near = fibres[i * 2], far = fibres[i * 2 + 1];
        const live = s.phase !== 'idle' && !reduce;
        if (!s.snapped[i]) {
          if (!live || gap < 0.35) { near.style.opacity = far.style.opacity = '0'; return; }
          const k = clamp(gap / o.stretch, 0, 1), sag = gap * 0.18, w = (1.7 - 1.15 * k).toFixed(2);
          const cx = gx / 2, cy = sag + gy / 2;
          near.setAttribute('d', `M${f(ox - lx)},${f(oy - ly)}Q${f(ox - lx + cx)},${f(oy - ly + cy)} ${f(tx - lx)},${f(ty - ly)}`);
          far.setAttribute('d', `M${f(ox + lx)},${f(oy + ly)}Q${f(ox + lx + gx - cx)},${f(oy + ly + gy - cy)} ${f(tx + lx)},${f(ty + ly)}`);
          near.style.strokeWidth = far.style.strokeWidth = w; near.style.opacity = far.style.opacity = '1'; s.span[i] = gap; return;
        }
        const t = (now - s.snapAt[i]) / 1000 / RETRACT;
        if (!live || t >= 1 || !s.snapAt[i]) { near.style.opacity = far.style.opacity = '0'; return; }
        busy = true;
        const left = (1 - t) * (1 - t), len = (s.span[i] || o.stretch) * 0.5 * left;
        const ux = gap > 0.01 ? gx / gap : 1, uy = gap > 0.01 ? gy / gap : 0;
        near.setAttribute('d', `M${f(ox)},${f(oy)}L${f(ox + ux * len)},${f(oy + uy * len)}`);
        far.setAttribute('d', `M${f(tx)},${f(ty)}L${f(tx - ux * len)},${f(ty - uy * len)}`);
        near.style.strokeWidth = far.style.strokeWidth = '0.9'; near.style.opacity = far.style.opacity = left.toFixed(2);
      });
      return busy;
    };
    const finish = () => { stubEl.style.visibility = 'hidden'; used = true; ink.style.opacity = '.55'; stubEl.setAttribute('aria-hidden', 'true'); stubEl.tabIndex = -1; layout(); o.onTear && o.onTear(); };
    const step = now => {
      const dt = clamp((now - s.last) / 1000, 0.001, 0.034); s.last = now;
      const limit = (o.tearAngle * Math.PI) / 180;
      if (s.phase === 'held') {
        const count = geo.bridges.length; let intact = 0;
        for (let i = 0; i < count; i++) if (!s.snapped[i]) intact++;
        const follow = 0.92 * (1 - clamp(o.resistance, 0, 0.95) * (count ? intact / count : 0));
        const a = Math.atan2(s.point.y - s.hinge.y, s.point.x - s.hinge.x);
        const want = clamp(wrap(a - s.a0) * s.sign * follow, 0, limit + 0.1);
        s.theta += (want - s.theta) * (1 - Math.exp(-dt / 0.035));
        const px = clamp((s.point.x - s.start.x || 0) * 0.05, -2, 4), py = clamp((s.point.y - s.start.y || 0) * 0.05, -3, 3);
        s.sx += (px - s.sx) * (1 - Math.exp(-dt / 0.05)); s.sy += (py - s.sy) * (1 - Math.exp(-dt / 0.05));
        const slack = Math.hypot(s.sx, s.sy); let left = 0;
        geo.bridges.forEach((b, i) => { if (s.snapped[i]) return; const d = Math.abs(b.mid - s.hingeV); if (2 * d * Math.sin(s.theta / 2) + slack > o.stretch || s.theta >= limit) { s.snapped[i] = true; s.snapAt[i] = now; s.bv -= 560 / geo.bridges.length; } else left++; });
        if (left === 0) { s.phase = 'free'; s.bv -= 150; }
      } else if (s.phase === 'free') {
        const cos = Math.cos(s.theta * s.sign), sin = Math.sin(s.theta * s.sign);
        const gx = s.grab.x - s.hinge.x, gy = s.grab.y - s.hinge.y;
        const wx = s.point.x - s.hinge.x - (gx * cos - gy * sin), wy = s.point.y - s.hinge.y - (gx * sin + gy * cos);
        s.sx += (wx - s.sx) * (1 - Math.exp(-dt / 0.045)); s.sy += (wy - s.sy) * (1 - Math.exp(-dt / 0.045));
        const hang = limit * 0.55 + clamp(s.pvx * 0.0009 * s.sign, -0.3, 0.3);
        s.theta += (hang - s.theta) * (1 - Math.exp(-dt / 0.12));
      } else if (s.phase === 'drop') {
        s.age += dt; s.vy += GRAVITY * dt; s.sx += s.vx * dt; s.sy += s.vy * dt; s.theta += s.spin * dt;
        if (s.age > 0.16) s.fade = clamp(1 - (s.age - 0.16) / 0.42, 0, 1);
        if (s.fade <= 0) { s.phase = 'idle'; finish(); }
      } else if (s.phase === 'return') {
        s.thetaV += (-300 * s.theta - 24 * s.thetaV) * dt; s.theta += s.thetaV * dt;
        s.sx += (0 - s.sx) * (1 - Math.exp(-dt / 0.07)); s.sy += (0 - s.sy) * (1 - Math.exp(-dt / 0.07));
        if (Math.abs(s.theta) < 0.0008 && Math.abs(s.thetaV) < 0.01 && Math.hypot(s.sx, s.sy) < 0.05) { s.theta = s.thetaV = s.sx = s.sy = 0; s.phase = 'idle'; }
      }
      s.bv += (-520 * s.bx - 30 * s.bv) * dt; s.bx += s.bv * dt;
      const busy = paint(now), moving = Math.abs(s.bx) > 0.02 || Math.abs(s.bv) > 0.5;
      if (s.phase !== 'idle' || moving || busy) s.raf = requestAnimationFrame(step); else { s.bx = s.bv = 0; paint(now); s.raf = 0; }
    };
    const run = () => { if (s.raf) return; s.last = performance.now(); s.raf = requestAnimationFrame(step); };
    const local = e => { const r = stage.getBoundingClientRect(), k = r.width / W || 1; return { x: (e.clientX - r.left) / k, y: (e.clientY - r.top) / k }; };
    const tearNow = () => { cancelAnimationFrame(s.raf); s.raf = 0; s.phase = 'idle'; finish(); };
    const onDown = e => {
      if (used || e.button !== 0 || s.id !== null || s.phase === 'drop') return;
      try { stubEl.setPointerCapture(e.pointerId); } catch (_) {}
      const p = local(e); s.id = e.pointerId; s.start = p; s.point = p; s.pt = performance.now(); s.pvx = s.pvy = 0;
      if (s.theta < 0.01) { const far = p.y < geo.cross / 2, end = geo.ends[far ? 1 : 0]; s.sign = far ? 1 : -1; s.hinge = { x: end.x, y: end.y }; s.hingeV = end.v; stubEl.style.transformOrigin = `${s.hinge.x}px ${s.hinge.y}px`; }
      const cos = Math.cos(-s.theta * s.sign), sin = Math.sin(-s.theta * s.sign), ux = p.x - s.sx - s.hinge.x, uy = p.y - s.sy - s.hinge.y;
      s.grab = { x: s.hinge.x + ux * cos - uy * sin, y: s.hinge.y + ux * sin + uy * cos };
      s.a0 = Math.atan2(s.grab.y - s.hinge.y, s.grab.x - s.hinge.x) - (s.theta * s.sign) / 0.92;
      s.phase = 'held'; s.thetaV = 0; tilt.tx = tilt.ty = 0; kickTilt(); stubPaper.style.cursor = 'grabbing'; run();
    };
    const onMove = e => {
      if (s.id !== e.pointerId) return;
      const p = local(e), now = performance.now(), dt = Math.max(0.004, (now - s.pt) / 1000);
      s.pvx += ((p.x - s.point.x) / dt - s.pvx) * 0.35; s.pvy += ((p.y - s.point.y) / dt - s.pvy) * 0.35; s.pt = now; s.point = p;
      if (reduce && Math.hypot(p.x - s.start.x, p.y - s.start.y) > 28) { s.id = null; tearNow(); }
    };
    const onUp = e => {
      if (s.id !== e.pointerId) return; s.id = null; stubPaper.style.cursor = 'grab';
      try { if (stubEl.hasPointerCapture(e.pointerId)) stubEl.releasePointerCapture(e.pointerId); } catch (_) {}
      if (s.phase === 'free') { const still = performance.now() - s.pt > 80; s.vx = still ? 0 : clamp(s.pvx, -1600, 1600); s.vy = still ? 0 : clamp(s.pvy, -1600, 1200); s.spin = clamp(s.vx * 0.004, -6, 6) + 1.2 * s.sign; s.age = 0; s.phase = 'drop'; }
      else if (s.phase === 'held') s.phase = 'return';
      run();
    };
    const onKey = e => { if (used || (e.key !== 'Enter' && e.key !== ' ')) return; e.preventDefault(); if (!e.repeat) tearNow(); };
    const onTilt = e => {
      if (!o.tilt || reduce || e.pointerType === 'touch' || s.id !== null || used) return;
      const r = root.getBoundingClientRect();
      tilt.ty = clamp((e.clientX - (r.left + r.width / 2)) / (r.width / 2 + o.tiltReach), -1, 1) * o.tiltMax;
      tilt.tx = -clamp((e.clientY - (r.top + r.height / 2)) / (r.height / 2 + o.tiltReach), -1, 1) * o.tiltMax;
      kickTilt();
    };
    stubEl.addEventListener('pointerdown', onDown); stubEl.addEventListener('pointermove', onMove);
    stubEl.addEventListener('pointerup', onUp); stubEl.addEventListener('pointercancel', onUp); stubEl.addEventListener('lostpointercapture', onUp);
    stubEl.addEventListener('keydown', onKey); stubEl.addEventListener('dragstart', e => e.preventDefault());
    window.addEventListener('pointermove', onTilt, { passive: true });
    const reset = () => {
      cancelAnimationFrame(s.raf); Object.assign(s, { raf: 0, phase: 'idle', id: null, theta: 0, thetaV: 0, sx: 0, sy: 0, fade: 1, age: 0, bx: 0, bv: 0, snapped: [], snapAt: [], span: [] });
      used = false; stubEl.style.visibility = ''; stubEl.removeAttribute('aria-hidden'); stubEl.tabIndex = 0; ink.style.opacity = '1'; layout(); paint(performance.now());
    };
    return { reset, destroy: () => { cancelAnimationFrame(s.raf); cancelAnimationFrame(tilt.raf); ro.disconnect(); window.removeEventListener('pointermove', onTilt); root.innerHTML = ''; } };
  }

  /* ---------- DepthText ---------- */
  function depthText(root, o) {
    o = Object.assign({ text: 'Elevate', layers: 34, depth: 2.4, faceColor: '#f8fafc', depthColor: '#7c3aed', tilt: 7.5, pointerTracking: true, smoothing: 0.14, perspective: 900, autoOrbit: true, orbitSpeed: 0.35, fontSize: 'clamp(3rem,12vw,7rem)', fontWeight: 900, fontFamily: 'inherit', letterSpacing: '-0.065em', shadow: true }, o);
    const layers = clamp(Math.round(o.layers), 2, 64), dep = clamp(o.depth, 0, 12), tl = clamp(o.tilt, 0, 12), sm = clamp(o.smoothing, 0.02, 0.35);
    root.innerHTML = '';
    Object.assign(root.style, { perspective: `${clamp(o.perspective, 300, 2000)}px`, perspectiveOrigin: '50% 48%', contain: 'layout paint', isolation: 'isolate', display: 'inline-block' });
    const base = { x: -tl * 0.32, y: tl * 0.42 };
    const stage = el('span', 'position:relative;display:inline-grid;place-items:center;transform-style:preserve-3d;transform-origin:50% 50%;will-change:transform');
    const ts = `font-family:${o.fontFamily};font-size:${o.fontSize};font-weight:${o.fontWeight};line-height:.86;letter-spacing:${o.letterSpacing};white-space:nowrap;user-select:none;transform-style:preserve-3d;backface-visibility:hidden;text-transform:uppercase`;
    for (let li = 0; li < layers; li++) {
      const index = layers - li, p = index / layers, mix = Math.round((1 - p * p) * 72 + 4);
      const band = o.depthColors ? o.depthColors[Math.min(o.depthColors.length - 1, Math.floor((index - 1) / layers * o.depthColors.length))] : null;
      const s = el('span', `${ts};position:absolute;inset:0;z-index:0;display:inline-block;pointer-events:none;filter:brightness(.95) saturate(.95);color:color-mix(in srgb, ${o.faceColor} ${mix}%, ${o.depthColor});transform:translateZ(${-index * dep}px)`, { 'aria-hidden': 'true' });
      if (band) { s.style.color = band; s.style.filter = 'none'; s.textContent = o.text; }
      else if (o.parts) o.parts.forEach(([t, c]) => { const p = el('span', `color:color-mix(in srgb, ${c} ${mix}%, ${o.depthColor})`); p.textContent = t; s.appendChild(p); });
      else s.textContent = o.text;
      stage.appendChild(s);
    }
    const face = el('span', `${ts};position:relative;z-index:10;display:inline-block;color:${o.faceColor};transform:translateZ(.6px);text-shadow:${o.shadow ? `0 22px 34px color-mix(in srgb, ${o.depthColor} 36%, transparent), 0 4px 8px rgba(0,0,0,.18)` : 'none'}`);
    if (o.parts) o.parts.forEach(([t, c]) => { const p = el('span', `color:${c}`); p.textContent = t; face.appendChild(p); });
    else face.textContent = o.text;
    stage.appendChild(face); root.appendChild(stage);
    const apply = (x, y) => { stage.style.transform = `rotateX(${x.toFixed(3)}deg) rotateY(${y.toFixed(3)}deg)`; };
    apply(base.x, base.y);
    if (reduceMQ()) return () => {};
    const can = o.pointerTracking && matchMedia('(hover: hover) and (pointer: fine)').matches;
    const cur = Object.assign({}, base), tgt = Object.assign({}, base); let active = false, raf = 0, live = false; const t0 = performance.now();
    const move = e => { const r = root.getBoundingClientRect(); if (!r.width) return; active = true; tgt.x = base.x - clamp((e.clientY - (r.top + r.height / 2)) / (r.height * 0.8), -1, 1) * tl; tgt.y = base.y + clamp((e.clientX - (r.left + r.width / 2)) / (r.width * 0.8), -1, 1) * tl; };
    const leave = () => { active = false; tgt.x = base.x; tgt.y = base.y; };
    if (can) { window.addEventListener('pointermove', move, { passive: true }); window.addEventListener('blur', leave); }
    const tick = now => {
      if ((!can || !active) && o.autoOrbit) { const orb = ((now - t0) / 1000) * o.orbitSpeed * Math.PI * 2, amt = can ? 0.18 : 0.55; tgt.x = base.x + Math.sin(orb) * tl * amt; tgt.y = base.y + Math.cos(orb * 0.85) * tl * amt; }
      cur.x += (tgt.x - cur.x) * sm; cur.y += (tgt.y - cur.y) * sm; apply(cur.x, cur.y);
      if (live) raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([e]) => { const was = live; live = e.isIntersecting; if (live && !was) raf = requestAnimationFrame(tick); }); io.observe(root);
    return () => { live = false; cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener('pointermove', move); window.removeEventListener('blur', leave); };
  }

  /* ---------- DriftWall (typographic tiles + hover popup) ---------- */
  function driftWall(root, o) {
    o = Object.assign({ items: [], columns: 5, tileWidth: 200, tileHeight: 132, gap: 18, radius: 14, tilt: 16, turn: -14, roll: 0, perspective: 1200, depth: 120, speed: 42, direction: 'up', variance: 0.45, parallax: 0.6, lift: 64, fade: 0.6, dim: 0.55, overlayColor: '#060010' }, o);
    const reduce = reduceMQ(), items = o.items, C = o.columns;
    root.innerHTML = '';
    const edgeP = `${Math.max(0, (1 - o.fade) * 100)}%`;
    const mask = `radial-gradient(ellipse 78% 82% at 50% 46%, #000 ${edgeP}, transparent 100%), linear-gradient(to top, #000 ${edgeP}, transparent 100%)`;
    Object.assign(root.style, { position: 'relative', overflow: 'hidden', perspective: `${o.perspective}px`, perspectiveOrigin: '50% 50%' });
    const maskBox = el('div', 'position:absolute;inset:0'); maskBox.style.webkitMaskImage = mask; maskBox.style.maskImage = mask; maskBox.style.webkitMaskComposite = 'source-in'; maskBox.style.maskComposite = 'intersect';
    maskBox.style.perspective = `${o.perspective}px`;
    const plane = el('div', 'position:absolute;left:50%;top:50%;display:flex;flex-direction:row;transform-style:preserve-3d;transform-origin:50% 50%;will-change:transform;cursor:pointer');
    const cols = Array.from({ length: C }, () => []); items.forEach((it, i) => cols[i % C].push(it));
    const unit = o.tileHeight + o.gap, H = root.clientHeight || 600;
    const tracks = [], metas = [], tiles = [];
    cols.forEach((col, c) => {
      if (!col.length) col.push(items[0]);
      const copyHeight = Math.max(unit, col.length * unit), copies = Math.max(2, Math.ceil((H * 1.6) / copyHeight) + 1);
      metas.push({ copyHeight });
      const colEl = el('div', `position:relative;width:${o.tileWidth + o.gap}px;transform-style:preserve-3d`);
      const track = el('div', 'display:flex;flex-direction:column;transform-style:preserve-3d;will-change:transform');
      for (let k = 0; k < copies; k++) col.forEach(it => {
        const t = el('div', `position:relative;display:block;flex:none;width:100%;height:${unit}px;transform-style:preserve-3d;outline:none`, { tabindex: '0', role: 'button', 'aria-label': it.title || 'tile' });
        t.dataset.col = c; t.__item = it;
        const inner = el('span', `pointer-events:none;position:absolute;inset:${o.gap / 2}px;display:flex;flex-direction:column;justify-content:space-between;padding:14px;overflow:hidden;border-radius:${o.radius}px;background:${it.bg || '#10154f'};color:${it.fg || '#fff'};opacity:${o.dim};transform:translateZ(0);transition:transform 420ms cubic-bezier(.22,1,.36,1),opacity 420ms cubic-bezier(.22,1,.36,1),box-shadow 420ms`);
        if (it.image) { const img = el('img', 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover'); img.src = it.image; img.alt = it.title || ''; inner.appendChild(img); }
        else inner.appendChild(el('span', `position:absolute;inset:0;background:repeating-linear-gradient(135deg,${it.fg === '#0a0c24' ? 'rgba(10,12,36,.05)' : 'rgba(255,255,255,.05)'} 0 9px,transparent 9px 18px)`));
        const tag = el('span', "position:relative;font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:.1em;text-transform:uppercase;opacity:.7"); tag.textContent = it.tag || '';
        const ttl = el('span', "position:relative;font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:24px;line-height:.95;text-transform:uppercase"); ttl.textContent = it.title || '';
        const ov = el('span', `position:absolute;inset:0;background:${o.overlayColor};opacity:.42;transition:opacity 420ms`);
        inner.append(tag, ttl, ov); t.appendChild(inner); t.__inner = inner; t.__ov = ov;
        track.appendChild(t); tiles.push(t);
      });
      colEl.appendChild(track); plane.appendChild(colEl); tracks.push(track);
    });
    maskBox.appendChild(plane); root.appendChild(maskBox);
    const pop = el('div', 'position:absolute;left:clamp(16px,4vw,56px);bottom:clamp(16px,3vw,40px);max-width:min(380px,calc(100% - 32px));padding:20px 22px;border-radius:8px;background:#fff;color:#0a0c24;box-shadow:0 30px 60px -20px rgba(0,0,0,.5);opacity:0;transform:translateY(12px);transition:opacity .3s,transform .35s cubic-bezier(.2,.7,.2,1);pointer-events:none;z-index:5');
    const pTag = el('p', "margin:0 0 8px;font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#3a5bff");
    const pTitle = el('p', "margin:0 0 8px;font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:30px;line-height:.95;text-transform:uppercase");
    const pDesc = el('p', 'margin:0;font-size:14px;line-height:1.5;color:#55566a');
    pop.append(pTag, pTitle, pDesc); root.appendChild(pop);
    const factor = i => 1 + o.variance * ((((i * 0.6180339887 + 0.35) % 1) * 2) - 1);
    const base = cols.map((_, c) => o.speed * factor(c) * (o.direction === 'up' ? 1 : -1) * (c % 2 === 0 ? 1 : -1));
    const offs = metas.map((m, c) => m.copyHeight * ((c * 0.37) % 1)), vels = cols.map(() => 0);
    let active = null, hovCol = -1, ptr = { x: 0, y: 0 }, damp = { x: 0, y: 0 }, last = null, raf = 0, live = false;
    const setActive = t => {
      if (t === active) return;
      if (active) { active.__inner.style.opacity = o.dim; active.__inner.style.transform = 'translateZ(0)'; active.__inner.style.boxShadow = 'none'; active.__ov.style.opacity = '.42'; }
      active = t; hovCol = t ? +t.dataset.col : -1;
      if (t) { t.__inner.style.opacity = '1'; t.__inner.style.transform = `translateZ(${o.lift}px)`; t.__inner.style.boxShadow = '0 24px 60px -18px rgba(0,0,0,.7)'; t.__ov.style.opacity = '0';
        const it = t.__item; pTag.textContent = it.tag || ''; pTitle.textContent = it.title || ''; pDesc.textContent = it.desc || ''; pop.style.opacity = '1'; pop.style.transform = 'none'; }
      else { pop.style.opacity = '0'; pop.style.transform = 'translateY(12px)'; }
    };
    const onMove = e => {
      const r = root.getBoundingClientRect();
      if (o.parallax > 0 && !reduce) ptr = { x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 };
      const hit = document.elementFromPoint(e.clientX, e.clientY), t = hit && hit.closest ? hit.closest('[data-col]') : null;
      if (t && root.contains(t)) setActive(t);
    };
    const onLeave = () => { ptr = { x: 0, y: 0 }; setActive(null); };
    root.addEventListener('pointermove', onMove); root.addEventListener('pointerleave', onLeave);
    tiles.forEach(t => { t.addEventListener('focus', () => setActive(t)); t.addEventListener('blur', () => setActive(null)); });
    const animate = ts => {
      if (last === null) last = ts; const dt = Math.min(0.05, Math.max(0, ts - last) / 1000); last = ts;
      const mt = o.parallax * 8, dd = 1 - Math.exp(-dt / 0.12);
      damp.x += (ptr.x * mt - damp.x) * dd; damp.y += (-ptr.y * mt - damp.y) * dd;
      plane.style.transform = `translate(-50%,-50%) scale(1.18) rotateX(${o.tilt + damp.y}deg) rotateY(${o.turn + damp.x}deg) rotateZ(${o.roll}deg) translateZ(${-o.depth}px)`;
      tracks.forEach((tr, c) => {
        if (!reduce) {
          const target = base[c] * (hovCol === c ? 0 : 1), ease = 1 - Math.exp(-dt / (target === 0 ? 0.16 : 0.28));
          vels[c] += (target - vels[c]) * ease;
          const ch = metas[c].copyHeight; let n = offs[c] + vels[c] * dt; n = ((n % ch) + ch) % ch; offs[c] = n;
        }
        tr.style.transform = `translate3d(0,${-offs[c]}px,0)`;
      });
      if (live) raf = requestAnimationFrame(animate);
    };
    const io = new IntersectionObserver(([e]) => { const was = live; live = e.isIntersecting; if (live && !was) { last = null; raf = requestAnimationFrame(animate); } }); io.observe(root);
    animate(performance.now());
    return () => { live = false; cancelAnimationFrame(raf); io.disconnect(); root.innerHTML = ''; };
  }

  /* ---------- RefineFrame ---------- */
  function refineFrame(root, o) {
    o = Object.assign({ image: null, aspectRatio: '4 / 3', width: 620, radius: 12, background: '#27272a', color: '#f5f5f5', stageDuration: 420, labels: {}, hideAfter: 0 }, o);
    const STAGES = { queued: { blur: 4, sat: 0.6, scale: 1.04, opacity: 0.55 }, generating: { blur: 1.5, sat: 0.8, scale: 1.02, opacity: 0.85 }, refining: { blur: 0.5, sat: 0.95, scale: 1.005, opacity: 1 }, complete: { blur: 0, sat: 1, scale: 1, opacity: 1 } };
    const TARGET = { queued: 0, generating: 0.5, refining: 0.875, complete: 1 };
    const LEVELS = [48, 32, 20, 12, 8, 5, 3, 2, 1], EDGE = 28, STRIPS = 14;
    const reduce = reduceMQ(); const src = o.image;
    root.innerHTML = '';
    Object.assign(root.style, { position: 'relative', isolation: 'isolate', overflow: 'hidden', width: `min(${o.width}px,100%)`, aspectRatio: o.aspectRatio, borderRadius: `${o.radius}px`, background: o.background, color: o.color, fontSize: '12px', lineHeight: '1', fontWeight: '500' });
    const media = el('div', `position:absolute;inset:0;transition:opacity ${o.stageDuration}ms cubic-bezier(.23,1,.32,1)`);
    const canvas = el('canvas', 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none');
    media.appendChild(canvas); root.appendChild(media);
    const chip = el('div', `position:absolute;left:10px;bottom:10px;display:inline-flex;align-items:center;gap:7px;height:28px;padding:0 12px 0 9px;border-radius:14px;background:color-mix(in srgb, ${o.background} 72%, transparent);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:.04em;pointer-events:none`);
    const icon = el('span', 'display:inline-flex;width:13px;height:13px');
    const spinSvg = '<svg width="13" height="13" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2.6" stroke-opacity=".25"></circle><path d="M12 3a9 9 0 0 1 9 9" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"></path></svg>';
    const tickSvg = '<svg width="13" height="13" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
    const label = el('span', 'transition:opacity .2s,filter .2s');
    chip.append(icon, label); root.appendChild(chip);
    const text = Object.assign({ queued: 'Queued', generating: 'Generating', refining: 'Refining', complete: 'Ready' }, o.labels);
    const s = { p: 0, raf: 0, last: 0, key: '', w: 0, h: 0, levels: [] };
    let status = 'queued', spinA = null;
    const build = () => {
      const dpr = Math.min(2, devicePixelRatio || 1), r = canvas.getBoundingClientRect();
      const W = Math.max(1, Math.round(r.width * dpr)), H = Math.max(1, Math.round(r.height * dpr)), key = `${W}x${H}`;
      if (s.key === key) return; s.key = key; s.w = W; s.h = H; canvas.width = W; canvas.height = H;
      const iw = src.naturalWidth || src.width, ih = src.naturalHeight || src.height;
      const cover = Math.max(W / iw, H / ih), sw = W / cover, sh = H / cover, sx = (iw - sw) / 2, sy = (ih - sh) / 2;
      s.levels = LEVELS.map(block => {
        const b = block === 1 ? 1 : Math.max(2, Math.round(block * dpr));
        const full = document.createElement('canvas'); full.width = W; full.height = H; const fc = full.getContext('2d');
        if (b === 1) { fc.imageSmoothingQuality = 'high'; fc.drawImage(src, sx, sy, sw, sh, 0, 0, W, H); return full; }
        const small = document.createElement('canvas'); small.width = Math.max(1, Math.round(W / b)); small.height = Math.max(1, Math.round(H / b));
        const sc = small.getContext('2d'); sc.imageSmoothingQuality = 'high'; sc.drawImage(src, sx, sy, sw, sh, 0, 0, small.width, small.height);
        fc.imageSmoothingEnabled = false; fc.drawImage(small, 0, 0, W, H); return full;
      });
    };
    const tick = now => {
      if (!src) { s.raf = 0; return; }
      const dt = Math.min(0.05, s.last ? (now - s.last) / 1000 : 0.016); s.last = now;
      build();
      const n = s.levels.length - 1, target = TARGET[status] ?? s.p;
      const step = (reduce ? 1e9 : 1 / (n * (o.stageDuration / 1000))) * dt;
      if (target < s.p) s.p = Math.max(target, s.p - step * 1.5); else if (target - s.p <= step) s.p = target; else s.p += step;
      const ctx = canvas.getContext('2d'), Lv = s.p * n, i = Math.min(n, Math.floor(Lv + 1e-6)), frac = Lv - i;
      ctx.globalAlpha = 1; ctx.drawImage(s.levels[i], 0, 0);
      if (i < n && frac > 0) {
        const dpr = Math.min(2, devicePixelRatio || 1), edge = EDGE * dpr, front = frac * (s.h + edge) - edge / 2, top = Math.max(0, Math.floor(front - edge / 2));
        if (top > 0) ctx.drawImage(s.levels[i + 1], 0, 0, s.w, top, 0, 0, s.w, top);
        const sh = edge / STRIPS;
        for (let k = 0; k < STRIPS; k++) { const y = front - edge / 2 + k * sh; if (y + sh <= 0 || y >= s.h) continue; const t = 1 - (k + 0.5) / STRIPS; ctx.globalAlpha = t * t * (3 - 2 * t); const y0 = Math.max(0, y), h0 = Math.min(s.h, y + sh) - y0; if (h0 > 0) ctx.drawImage(s.levels[i + 1], 0, y0, s.w, h0, 0, y0, s.w, h0); }
        ctx.globalAlpha = 0.25; ctx.fillStyle = '#fff'; if (front > 0 && front < s.h) ctx.fillRect(0, front - dpr, s.w, 2 * dpr); ctx.globalAlpha = 1;
      }
      s.raf = Math.abs(target - s.p) > 0.0005 ? requestAnimationFrame(tick) : 0; if (!s.raf) s.last = 0;
    };
    const wake = () => { if (!s.raf) s.raf = requestAnimationFrame(tick); };
    const setStatus = st => {
      if (st === status && s.levels.length) return; status = st;
      const g = STAGES[st]; media.style.opacity = g.opacity;
      label.textContent = text[st];
      const done = st === 'complete';
      icon.innerHTML = done ? tickSvg : spinSvg;
      if (spinA) spinA.cancel(); spinA = null;
      if (!done && !reduce) spinA = icon.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(360deg)' }], { duration: 1100, iterations: Infinity });
      root.setAttribute('aria-label', text[st]); wake();
    };
    root.setAttribute('role', 'img');
    const ro = new ResizeObserver(() => { s.key = ''; wake(); }); ro.observe(root);
    setStatus('queued');
    return { setStatus, destroy: () => { cancelAnimationFrame(s.raf); ro.disconnect(); spinA && spinA.cancel(); root.innerHTML = ''; } };
  }

  /* ---------- ScrollExpand (markup lives in the page; this drives it) ---------- */
  function scrollExpand(root, o) {
    o = Object.assign({ startWidth: 42, startHeight: 58, startRadius: 24, endRadius: 0, mediaZoom: 1.35, scrollDistance: 1.2, holdDistance: 0.35, smoothing: 0.1, overlayScrim: 0.45 }, o);
    const q = k => root.querySelector(`[data-se-${k}]`);
    const track = q('track'), stage = q('stage'), frame = q('frame'), media = q('media'), title = q('title'), overlay = q('overlay'), scrim = q('scrim'), hint = q('hint');
    const reduce = reduceMQ(); let raf = 0, cur = 0, tgt = 0, stageH = 0, running = false;
    const apply = p => {
      const e = smoothstep(0, 1, p), w = o.startWidth + (100 - o.startWidth) * e, h = o.startHeight + (100 - o.startHeight) * e;
      const ix = Math.max(0, (100 - w) / 2), iy = Math.max(0, (100 - h) / 2), r = o.startRadius + (o.endRadius - o.startRadius) * e;
      frame.style.clipPath = `inset(${iy}% ${ix}% ${iy}% ${ix}% round ${r}px)`;
      if (media) media.style.transform = `scale(${o.mediaZoom + (1 - o.mediaZoom) * e})`;
      if (scrim) scrim.style.opacity = `${o.overlayScrim * e}`;
      if (title) { const out = smoothstep(0.4, 0.88, p); title.style.opacity = `${1 - out}`; title.style.transform = `translate3d(0,${-28 * out}px,0) scale(${1 + 0.06 * out})`; }
      if (hint) { const g = smoothstep(0, 0.12, p); hint.style.opacity = `${1 - g}`; hint.style.transform = `translate3d(0,${8 * g}px,0)`; }
      if (overlay) { const inn = smoothstep(0.68, 1, p); overlay.style.opacity = `${inn}`; overlay.style.transform = `translate3d(0,${18 * (1 - inn)}px,0)`; overlay.style.pointerEvents = inn > 0.5 ? 'auto' : 'none'; }
    };
    const measure = () => { stageH = innerHeight; stage.style.height = `${stageH}px`; track.style.height = `${stageH * (1 + o.scrollDistance + o.holdDistance)}px`; };
    const read = () => clamp(-track.getBoundingClientRect().top / (stageH * o.scrollDistance), 0, 1);
    const tick = () => { const k = o.smoothing <= 0 ? 1 : 1 - Math.exp(-1 / (60 * o.smoothing)); cur += (tgt - cur) * k; if (Math.abs(tgt - cur) < 0.0004) { cur = tgt; running = false; } apply(cur); raf = running ? requestAnimationFrame(tick) : 0; };
    const onScroll = () => { tgt = read(); if (reduce || o.smoothing <= 0) { cur = tgt; apply(cur); return; } if (!running) { running = true; if (!raf) raf = requestAnimationFrame(tick); } };
    const onResize = () => { measure(); tgt = cur = read(); apply(cur); };
    measure(); tgt = cur = read(); apply(cur);
    addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(raf); removeEventListener('scroll', onScroll); removeEventListener('resize', onResize); };
  }

  /* ---------- SlideCommit ---------- */
  function slideCommit(root, o) {
    o = Object.assign({ label: 'Slide to pay', doneLabel: 'Paid', errorLabel: 'Payment failed', onConfirm: null, onDone: null, onError: null, trackColor: '#262626', handleColor: '#f5f5f5', successColor: '#22c55e', dangerColor: '#e5484d', width: 280, height: 56, radius: 28, speed: 50, returnBounce: 0.38, landingDip: 0.026, holdMs: 1500 }, o);
    const reduce = reduceMQ(), PAD = 4;
    const onColor = hex => { const raw = hex.replace('#', ''), full = raw.length === 3 ? [...raw].map(c => c + c).join('') : raw.slice(0, 6), n = parseInt(full, 16); if (isNaN(n)) return '#fff'; return (((n >> 16) & 255) * 299 + ((n >> 8) & 255) * 587 + (n & 255) * 114) / 1000 >= 128 ? '#111111' : '#ffffff'; };
    let W = o.width; const Hh = o.height, GRIP = Hh - PAD * 2;
    let INNER = W - PAD * 2, TRAVEL = Math.max(1, INNER - GRIP);
    const r = clamp(o.radius, 0, Hh / 2), gripR = Math.max(0, r - PAD);
    const k = 260 + (clamp(o.speed, 0, 100) / 100) * 640, m = 0.9, crit = 2 * Math.sqrt(k * m);
    const commitS = { k, c: crit, m }, homeS = { k, c: crit * (1 - clamp(o.returnBounce, 0, 0.5)), m };
    root.innerHTML = '';
    Object.assign(root.style, { position: 'relative', display: 'inline-block', verticalAlign: 'middle', width: `${W}px`, maxWidth: '100%', height: `${Hh}px` });
    const track = el('div', `position:relative;width:100%;height:100%;cursor:grab;touch-action:none;user-select:none;-webkit-user-select:none;border-radius:${r}px;background:${o.trackColor}`);
    const fs = clamp(Math.round(Hh * 0.25), 13, 17);
    const labels = el('span', `pointer-events:none;position:absolute;inset:0;display:grid;place-items:center;white-space:nowrap;font-weight:500;font-size:${fs}px;line-height:1`, { 'aria-hidden': 'true' });
    const lab = el('span', `grid-area:1/1;transition:opacity .2s,filter .2s;color:color-mix(in srgb, ${o.handleColor} 55%, transparent)`); lab.textContent = o.label;
    const err = el('span', `grid-area:1/1;transition:opacity .2s,filter .2s;color:${o.dangerColor};opacity:0;filter:blur(2px)`); err.textContent = o.errorLabel;
    labels.append(lab, err);
    const cap = el('div', `position:absolute;top:${PAD}px;left:${PAD}px;height:calc(100% - ${PAD * 2}px);width:calc(100% - ${PAD * 2}px);outline:none;background:${o.handleColor};color:${onColor(o.handleColor)};transition:background-color .2s,color .2s`, { role: 'slider', tabindex: '0', 'aria-label': o.label, 'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-valuenow': '0' });
    const content = el('div', 'position:absolute;inset:0');
    const lay = `pointer-events:none;position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:8px;white-space:nowrap;font-weight:600;font-size:${fs}px;line-height:1`;
    const isz = Math.round(GRIP * 0.42);
    const arrow = el('span', lay); arrow.innerHTML = `<svg width="${isz}" height="${isz}" viewBox="0 0 24 24"><path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;
    const spin = el('span', lay + ';opacity:0'); spin.innerHTML = `<svg width="${isz}" height="${isz}" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2.4" stroke-opacity=".25"></circle><path d="M12 3a9 9 0 0 1 9 9" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"></path></svg>`;
    const done = el('span', lay + ';opacity:0;transform:scale(.95);transition:opacity .2s,transform .2s'); done.innerHTML = `<svg width="${Math.round(GRIP * 0.38)}" height="${Math.round(GRIP * 0.38)}" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;
    done.appendChild(document.createTextNode(o.doneLabel));
    content.append(arrow, spin, done); cap.appendChild(content);
    const live = el('span', 'position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)', { 'aria-live': 'polite' });
    track.append(labels, cap, live); root.appendChild(track);
    const V = { x: 0, anchor: 0, shown: 1, spin: 0, pulse: 1, shake: 0 }, A = {}; let raf = 0, last = 0, phase = 'idle', hot = false, held = false, grip = null, run = 0; const timers = [];
    let spinAnim = null;
    const render = () => {
      const seen = clamp(V.x, 0, TRAVEL), edge = seen + GRIP + clamp(V.anchor - seen, 0, TRAVEL);
      cap.style.clipPath = `inset(0 ${INNER - edge}px 0 0 round ${gripR}px)`;
      content.style.transform = `translateX(${(seen + edge) / 2 - INNER / 2}px)`;
      const swell = hot && !held && phase === 'idle' && !reduce ? 1.03 : 1, q = 1 - Math.min(0.08, Math.max(0, -V.x) / 110);
      cap.style.transform = `scale(${q * swell}, ${swell / q})`; cap.style.transformOrigin = `${seen}px 50%`;
      labels.style.opacity = clamp(1 - seen / (TRAVEL * 0.55), 0, 1);
      arrow.style.opacity = V.shown * clamp(1 - (seen - TRAVEL * 0.55) / (TRAVEL * 0.4), 0, 1);
      spin.style.opacity = V.spin;
      track.style.transform = `translateX(${V.shake}px) scale(${V.pulse})`;
      const pc = Math.round((seen / TRAVEL) * 100); cap.setAttribute('aria-valuenow', pc);
    };
    const loop = now => {
      const dt = Math.min(0.034, (now - last) / 1000 || 0.016); last = now; let any = false;
      for (const key in A) {
        const a = A[key];
        if (a.type === 's') {
          const sub = 4, h = dt / sub;
          for (let i = 0; i < sub; i++) { const acc = (a.k * (a.to - V[key]) - a.c * a.v) / a.m; a.v += acc * h; V[key] += a.v * h; }
          if (Math.abs(a.to - V[key]) < 0.05 && Math.abs(a.v) < 0.5) { V[key] = a.to; delete A[key]; } else any = true;
        } else {
          const p = (now - a.t0) / a.dur; if (p < 0) { any = true; continue; }
          const pp = clamp(p, 0, 1), times = a.times || a.frames.map((_, i) => i / (a.frames.length - 1));
          let seg = 0; while (seg < times.length - 2 && pp > times[seg + 1]) seg++;
          const lt = (pp - times[seg]) / ((times[seg + 1] - times[seg]) || 1), e = 1 - Math.pow(1 - lt, 3);
          V[key] = a.frames[seg] + (a.frames[seg + 1] - a.frames[seg]) * e;
          if (p >= 1) { V[key] = a.frames[a.frames.length - 1]; delete A[key]; } else any = true;
        }
      }
      render(); raf = any ? requestAnimationFrame(loop) : 0;
    };
    const kick = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(loop); } };
    const springTo = (key, to, sp, v) => { A[key] = { type: 's', to, v: v || 0, k: sp.k, c: sp.c, m: sp.m }; kick(); };
    const tween = (key, frames, dur, delay, times) => { A[key] = { type: 't', frames: Array.isArray(frames) ? frames : [V[key], frames], t0: performance.now() + (delay || 0), dur: dur * 1000, times }; kick(); };
    const setPhase = p => {
      phase = p; root.dataset.phase = p;
      cap.style.background = p === 'done' ? o.successColor : p === 'error' ? o.dangerColor : o.handleColor;
      cap.style.color = onColor(p === 'done' ? o.successColor : p === 'error' ? o.dangerColor : o.handleColor);
      lab.style.opacity = p === 'error' ? '0' : '1'; lab.style.filter = p === 'error' ? 'blur(2px)' : 'none';
      err.style.opacity = p === 'error' ? '1' : '0'; err.style.filter = p === 'error' ? 'none' : 'blur(2px)';
      done.style.opacity = p === 'done' ? '1' : '0'; done.style.transform = p === 'done' || reduce ? 'scale(1)' : 'scale(.95)';
      track.style.cursor = p === 'pending' || p === 'done' ? 'default' : 'grab';
      if (spinAnim) { spinAnim.cancel(); spinAnim = null; }
      if (p === 'pending' && !reduce) spinAnim = spin.firstChild.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(360deg)' }], { duration: 1000, iterations: Infinity });
      live.textContent = p === 'pending' ? 'Working' : p === 'done' ? o.doneLabel : p === 'error' ? o.errorLabel : '';
    };
    const goHome = v => { if (reduce) tween('x', 0, 0.2); else springTo('x', 0, homeS, Math.min(0, v)); };
    const settle = () => { setPhase('idle'); tween('shown', 1, 0.2, 120); if (reduce) V.anchor = 0; else springTo('anchor', 0, { k: 400, c: 40, m: 1 }); render(); };
    const resolve = viaKey => {
      setPhase('done'); V.anchor = V.x; tween('spin', 0, 0.12);
      if (reduce) V.x = 0; else { springTo('x', 0, commitS); if (!viaKey && o.landingDip > 0) tween('pulse', [1, 1 - o.landingDip, 1], 0.46, 100, [0, 0.62, 1]); }
      o.onDone && o.onDone(); if (o.holdMs > 0) timers.push(setTimeout(settle, o.holdMs)); render();
    };
    const reject = reason => {
      setPhase('error'); o.onError && o.onError(reason); tween('spin', 0, 0.12); tween('shown', 1, 0.2, 120);
      if (reduce) goHome(0); else { tween('shake', [0, -5, 5, -3, 3, -1, 0], 0.45); timers.push(setTimeout(() => { if (!grip) goHome(0); }, 300)); }
      timers.push(setTimeout(() => { if (phase === 'error') setPhase('idle'); }, Math.max(o.holdMs, 1800)));
    };
    const commit = viaKey => {
      timers.forEach(clearTimeout); const id = ++run; delete A.x; V.x = TRAVEL; render();
      let out; try { out = o.onConfirm && o.onConfirm(); } catch (e) { reject(e); return; }
      const pending = out && typeof out.then === 'function' ? out : null;
      if (!pending) { tween('shown', 0, 0.12); resolve(viaKey); return; }
      setPhase('pending'); tween('shown', 0, 0.2); tween('spin', 1, 0.2);
      const t0 = performance.now(), later = fn => setTimeout(() => { if (id === run) fn(); }, Math.max(0, 300 - (performance.now() - t0)));
      pending.then(() => later(() => resolve(viaKey)), rs => later(() => reject(rs)));
    };
    const local = cx => { const rc = track.getBoundingClientRect(); return (cx - rc.left) / (rc.width / W || 1); };
    const vel = hist => { if (hist.length < 2) return 0; const [t0, x0] = hist[0], [t1, x1] = hist[hist.length - 1]; return ((x1 - x0) / Math.max(1, t1 - t0)) * 1000; };
    const move = e => { const g = grip; if (!g || g.id !== e.pointerId) return; const at = local(e.clientX); if (g.grab === null) { g.grab = at - V.x; return; } const nx = clamp(at - g.grab, 0, TRAVEL); if (Math.abs(nx - V.x) > 0.5) g.moved = true; g.hist.push([e.timeStamp, nx]); if (g.hist.length > 4) g.hist.shift(); V.x = nx; render(); };
    const up = e => { const g = grip; if (!g || g.id !== e.pointerId) return; grip = null; held = false; removeEventListener('pointermove', move); removeEventListener('pointerup', up); removeEventListener('pointercancel', up); if (V.x >= TRAVEL) commit(false); else if (g.moved) goHome(vel(g.hist)); else goHome(0); };
    const down = e => {
      if (grip || phase === 'pending' || phase === 'done' || e.button !== 0) return;
      delete A.x; grip = { id: e.pointerId, grab: null, moved: false, hist: [] }; held = true;
      addEventListener('pointermove', move); addEventListener('pointerup', up); addEventListener('pointercancel', up);
      move(e);
    };
    track.addEventListener('pointerdown', down);
    cap.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') { hot = true; render(); } });
    cap.addEventListener('pointerleave', () => { hot = false; render(); });
    cap.addEventListener('keydown', e => {
      if (phase === 'pending' || phase === 'done') return; const st = TRAVEL / 10;
      if (e.key === 'End' || e.key === 'Enter') { e.preventDefault(); commit(true); }
      else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); V.x = Math.min(TRAVEL, V.x + st); render(); if (V.x >= TRAVEL) commit(true); }
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); V.x = Math.max(0, V.x - st); render(); }
      else if (e.key === 'Home' || e.key === 'Escape') { e.preventDefault(); V.x = 0; render(); }
    });
    const ro = new ResizeObserver(() => { const w = Math.min(o.width, root.parentElement ? root.parentElement.clientWidth : o.width); if (w && w !== W) { W = w; INNER = W - PAD * 2; TRAVEL = Math.max(1, INNER - GRIP); render(); } });
    if (root.parentElement) ro.observe(root.parentElement);
    setPhase('idle'); render();
    return () => { cancelAnimationFrame(raf); timers.forEach(clearTimeout); ro.disconnect(); root.innerHTML = ''; };
  }

  /* ---------- PaperCrumple (three.js) ---------- */
  function createPaperPath(rest, triangles, shortSide, density, sharpness, depth, seed) {
    const count = rest.length / 3, points = Float64Array.from(rest), previous = Float64Array.from(rest), before = Float64Array.from(rest);
    const edges = [], hinges = [], adjacency = new Map(), random = rng(seed);
    const guides = Array.from({ length: density }, () => { const a = random() * Math.PI * 2; return { x: Math.cos(a), y: Math.sin(a), phase: random() * Math.PI * 2, weight: random() * 0.6 + 0.4 }; });
    for (let t = 0; t < triangles.length; t += 3) for (let k = 0; k < 3; k++) {
      const a = triangles[t + k], b = triangles[t + ((k + 1) % 3)], opposite = triangles[t + ((k + 2) % 3)];
      const key = Math.min(a, b) * count + Math.max(a, b), other = adjacency.get(key);
      if (!other) { adjacency.set(key, { a, b, opposite }); edges.push(a * 3, b * 3, Math.hypot(rest[a * 3] - rest[b * 3], rest[a * 3 + 1] - rest[b * 3 + 1])); }
      else {
        const c = other.opposite * 3, d = opposite * 3, length = Math.hypot(rest[c] - rest[d], rest[c + 1] - rest[d + 1]);
        const mx = (rest[c] + rest[d]) * 0.5, my = (rest[c + 1] + rest[d + 1]) * 0.5; let weak = 0;
        for (const g of guides) { const dist = Math.abs(Math.sin(((mx * g.x + my * g.y) / shortSide) * 4 + g.phase)); weak = Math.max(weak, Math.exp(-dist * dist * 80) * g.weight); }
        hinges.push(c, d, length, 0.12 + (1 - weak) * 0.75);
      }
    }
    const spacing = Math.sqrt((shortSide * shortSide) / count), thickness = shortSide * 0.008, samples = [rest.slice()];
    const frameCount = 64, spf = 3, total = frameCount * spf; let initR = 0;
    for (let i = 0; i < rest.length; i += 3) initR = Math.max(initR, Math.hypot(rest[i] / 0.94, rest[i + 1] / 1.02));
    initR *= 1.02;
    function constrain(list, stride, stiff, reverse) {
      for (let n = 0; n < list.length; n += stride) {
        const e = reverse ? list.length - stride - n : n, a = list[e], b = list[e + 1];
        const dx = points[b] - points[a], dy = points[b + 1] - points[a + 1], dz = points[b + 2] - points[a + 2], len = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (len < 1e-6) continue;
        const w = stride === 4 ? list[e + 3] : 1, amt = (1 - list[e + 2] / len) * 0.5 * stiff * w;
        points[a] += dx * amt; points[b] -= dx * amt; points[a + 1] += dy * amt; points[b + 1] -= dy * amt; points[a + 2] += dz * amt; points[b + 2] -= dz * amt;
      }
    }
    function separate() {
      const margin = thickness * 2;
      for (let t = 0; t < triangles.length; t += 3) {
        const a = triangles[t] * 3, b = triangles[t + 1] * 3, c = triangles[t + 2] * 3;
        const ax = points[a], ay = points[a + 1], az = points[a + 2];
        const bx = points[b] - ax, by = points[b + 1] - ay, bz = points[b + 2] - az, cx = points[c] - ax, cy = points[c + 1] - ay, cz = points[c + 2] - az;
        let nx = by * cz - bz * cy, ny = bz * cx - bx * cz, nz = bx * cy - by * cx; const L = Math.hypot(nx, ny, nz); if (L < 1e-7) continue; nx /= L; ny /= L; nz /= L;
        const minX = Math.min(ax, points[b], points[c]) - margin, maxX = Math.max(ax, points[b], points[c]) + margin;
        const minY = Math.min(ay, points[b + 1], points[c + 1]) - margin, maxY = Math.max(ay, points[b + 1], points[c + 1]) + margin;
        const minZ = Math.min(az, points[b + 2], points[c + 2]) - margin, maxZ = Math.max(az, points[b + 2], points[c + 2]) + margin;
        const bb = bx * bx + by * by + bz * bz, cc = cx * cx + cy * cy + cz * cz, bc = bx * cx + by * cy + bz * cz, det = bb * cc - bc * bc; if (det < 1e-10) continue;
        for (let p = 0; p < points.length; p += 3) {
          if (p === a || p === b || p === c) continue;
          if (points[p] < minX || points[p] > maxX || points[p + 1] < minY || points[p + 1] > maxY || points[p + 2] < minZ || points[p + 2] > maxZ) continue;
          const rx = rest[p] - (rest[a] + rest[b] + rest[c]) / 3, ry = rest[p + 1] - (rest[a + 1] + rest[b + 1] + rest[c + 1]) / 3; if (rx * rx + ry * ry < spacing * spacing * 6) continue;
          const dx = points[p] - ax, dy = points[p + 1] - ay, dz = points[p + 2] - az, dist = dx * nx + dy * ny + dz * nz;
          const pd = (before[p] - before[a]) * nx + (before[p + 1] - before[a + 1]) * ny + (before[p + 2] - before[a + 2]) * nz, side = pd >= 0 ? 1 : -1;
          if (dist * side >= thickness || Math.abs(dist) > margin) continue;
          const pb = dx * bx + dy * by + dz * bz, pc = dx * cx + dy * cy + dz * cz, u = (cc * pb - bc * pc) / det, v = (bb * pc - bc * pb) / det;
          if (u < 0 || v < 0 || u + v > 1) continue;
          const w = 1 - u - v, corr = (thickness * side - dist) / (1 + w * w + u * u + v * v);
          for (let ax2 = 0; ax2 < 3; ax2++) { const nn = ax2 === 0 ? nx : ax2 === 1 ? ny : nz, mv = nn * corr; points[p + ax2] += mv; points[a + ax2] -= mv * w; points[b + ax2] -= mv * u; points[c + ax2] -= mv * v; }
        }
      }
    }
    for (let st = 1; st <= total; st++) {
      const pr = st / total, comp = pr * pr * (3 - 2 * pr), radius = initR * (1 - comp) + shortSide * (0.19 - depth * 0.025) * comp;
      before.set(points);
      for (let i = 0; i < points.length; i += 3) {
        const x = rest[i] / shortSide, y = rest[i + 1] / shortSide; let buckle = 0;
        for (const g of guides) buckle += Math.sin((x * g.x + y * g.y) * 5 + g.phase) * g.weight;
        for (let a = 0; a < 3; a++) { const vel = (points[i + a] - previous[i + a]) * 0.55; previous[i + a] = points[i + a]; points[i + a] += clamp(vel, -spacing * 0.15, spacing * 0.15); }
        points[i + 2] += (buckle / density) * shortSide * 0.0007 * Math.sin(pr * Math.PI);
      }
      for (let pass = 0; pass < 18; pass++) {
        constrain(hinges, 4, 0.45 * (1 - sharpness * 0.4), pass % 2 === 0);
        for (let i = 0; i < points.length; i += 3) { const x = points[i] / 0.94, y = points[i + 1] / 1.02, z = points[i + 2] / 0.86, d = Math.hypot(x, y, z); if (d > radius) { const push = (1 - radius / d) * 0.55; points[i] -= points[i] * push; points[i + 1] -= points[i + 1] * push; points[i + 2] -= points[i + 2] * push; } }
        constrain(edges, 3, 1, pass % 2 !== 0);
        if (pass === 8 || pass === 17) separate();
      }
      for (let h = 0; h < hinges.length; h += 4) { const a = hinges[h], b = hinges[h + 1], len = Math.hypot(points[a] - points[b], points[a + 1] - points[b + 1], points[a + 2] - points[b + 2]); if (len < hinges[h + 2] * 0.86) hinges[h + 2] += (len - hinges[h + 2]) * 0.12; }
      if (st % spf === 0) samples.push(Float32Array.from(points));
    }
    const folded = Float64Array.from(points);
    for (let st = 1; st <= 80; st++) {
      const t = st / 80, un = t * t * (3 - 2 * t);
      for (let pass = 0; pass < 12; pass++) {
        for (let i = 0; i < points.length; i++) { const tg = folded[i] + (rest[i] - folded[i]) * un; points[i] += (tg - points[i]) * (i % 3 === 2 ? 0.04 : 0.22); }
        constrain(hinges, 4, 0.7, pass % 2 === 0); constrain(edges, 3, 1, pass % 2 !== 0);
      }
    }
    return { samples, creased: Float32Array.from(points) };
  }

  function paperCrumple(root, o) {
    const THREE = window.THREE; if (!THREE) throw new Error('three.js not loaded');
    o = Object.assign({ src: '', alt: 'Crumplable image', width: 320, height: 400, releaseBehavior: 'restore', crumpleAmount: 0.85, crumpleDuration: 0.55, releaseDuration: 0.4, foldCount: 6, foldSharpness: 0.6, wrinkleDepth: 0.65, creaseStrength: 0.18, paperColor: '#f4f0e8', roughness: 0.92, paperTexture: 0.08, lightIntensity: 1.8, lightAngle: -35, shadow: true, shadowOpacity: 0.08, draggable: true, dragRotation: 10, dragRadius: 180, returnToOrigin: true, rotation: 0, seed: 7, detail: 64, onStateChange: null }, o);
    const finite = (v, f) => (Number.isFinite(v) ? v : f);
    const spring = (v = 0) => ({ value: v, target: v, velocity: 0 });
    const advance = (s, dt, dur, inst) => { if (inst || dur <= 0) { s.value = s.target; s.velocity = 0; return false; } const om = 8 / Math.max(0.06, dur), off = s.value - s.target, term = s.velocity + om * off, dec = Math.exp(-om * dt); s.value = s.target + (off + term * dt) * dec; s.velocity = (s.velocity - om * term * dt) * dec; if (Math.abs(s.value - s.target) < 1e-4 && Math.abs(s.velocity) < 1e-3) { s.value = s.target; s.velocity = 0; return false; } return true; };
    root.innerHTML = '';
    Object.assign(root.style, { position: 'relative', isolation: 'isolate', overflow: 'hidden' });
    const canvas = el('canvas', 'pointer-events:none;position:absolute;inset:0;display:block;width:100%;height:100%;visibility:hidden', { 'aria-hidden': 'true' });
    const shadowFilter = o.shadow ? `drop-shadow(0 6px 10px rgb(0 0 0 / ${clamp(o.shadowOpacity, 0, 1)}))` : '';
    canvas.style.filter = shadowFilter;
    const fallback = el('img', `pointer-events:none;position:absolute;left:50%;top:50%;width:var(--pc-image-width,60%);height:var(--pc-image-height,72%);transform:translate(-50%,-50%) rotate(${o.rotation}deg);object-fit:cover;user-select:none`, { alt: o.alt, draggable: 'false' });
    fallback.src = o.src;
    const hit = el('button', 'position:absolute;left:0;top:0;margin:0;padding:0;border:0;background:transparent;cursor:grab;touch-action:none;appearance:none;outline:none;visibility:hidden', { type: 'button', 'aria-label': `${o.alt}. Hold to crumple and drag. Keyboard: hold Space or Enter, arrow keys to move, Escape to reset.`, 'aria-pressed': 'false' });
    root.append(canvas, fallback, hit);
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' }); } catch (e) { return { reset() {}, destroy() {} }; }
    const pw = Math.max(1, o.width), ph = Math.max(1, o.height), aspect = ph / pw, shortSide = Math.min(1, aspect);
    const res = Math.round(clamp(o.detail / 4, 8, 24)), columns = Math.max(8, Math.round(res / Math.max(1, aspect))), rows = Math.max(8, Math.round(res * Math.min(1, aspect)));
    const R = rng(o.seed), sharp = clamp(o.foldSharpness, 0, 1), folds = Math.round(clamp(o.foldCount, 3, 16)), depth = clamp(o.wrinkleDepth, 0, 2);
    const count = (columns + 1) * (rows + 1), original = new Float32Array(count * 3), positions = new Float32Array(count * 3), uvs = new Float32Array(count * 2), indices = [];
    for (let row = 0; row <= rows; row++) for (let col = 0; col <= columns; col++) {
      const idx = row * (columns + 1) + col;
      const u = (col + (col > 0 && col < columns ? (R() - 0.5) * 0.5 : 0)) / columns, v = (row + (row > 0 && row < rows ? (R() - 0.5) * 0.5 : 0)) / rows;
      original[idx * 3] = u - 0.5; original[idx * 3 + 1] = (v - 0.5) * aspect; uvs[idx * 2] = u; uvs[idx * 2 + 1] = v;
      if (col < columns && row < rows) { const a = idx, b = idx + 1, c = idx + columns + 1, d = c + 1; if (R() > 0.5) indices.push(a, b, d, a, d, c); else indices.push(a, b, c, b, d, c); }
    }
    const path = createPaperPath(original, indices, shortSide, folds, sharp, depth, o.seed);
    const rPos = new Float32Array(indices.length * 3), rNor = new Float32Array(indices.length * 3), rUv = new Float32Array(indices.length * 2), fN = new Float32Array(indices.length);
    const inc = Array.from({ length: count }, () => []);
    for (let i = 0; i < indices.length; i++) { rUv[i * 2] = uvs[indices[i] * 2]; rUv[i * 2 + 1] = uvs[indices[i] * 2 + 1]; inc[indices[i]].push(Math.floor(i / 3) * 3); }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(rPos, 3).setUsage(THREE.DynamicDrawUsage));
    geometry.setAttribute('normal', new THREE.BufferAttribute(rNor, 3).setUsage(THREE.DynamicDrawUsage));
    geometry.setAttribute('uv', new THREE.BufferAttribute(rUv, 2));
    const gd = new Uint8Array(128 * 128 * 4); for (let i = 0; i < gd.length; i += 4) { const v = 100 + Math.floor(R() * 155); gd[i] = gd[i + 1] = gd[i + 2] = v; gd[i + 3] = 255; }
    const grain = new THREE.DataTexture(gd, 128, 128); grain.wrapS = grain.wrapT = THREE.RepeatWrapping; grain.repeat.set(5, 5 * aspect); grain.magFilter = grain.minFilter = THREE.LinearFilter; grain.needsUpdate = true;
    const mo = { roughness: clamp(o.roughness, 0, 1), metalness: 0, bumpMap: grain, bumpScale: clamp(o.paperTexture, 0, 1) * 0.32, alphaTest: 0.04, alphaToCoverage: true, flatShading: false };
    const front = new THREE.MeshStandardMaterial(Object.assign({}, mo, { side: THREE.FrontSide }));
    const back = new THREE.MeshStandardMaterial(Object.assign({}, mo, { side: THREE.BackSide, color: o.paperColor }));
    const lighting = { value: 0 };
    for (const mat of [front, back]) {
      mat.onBeforeCompile = sh => {
        sh.uniforms.paperLighting = lighting;
        sh.fragmentShader = 'uniform float paperLighting;\n' + sh.fragmentShader;
        sh.fragmentShader = sh.fragmentShader.replace('#include <map_fragment>', `#include <map_fragment>\n#ifdef USE_MAP\nif (vMapUv.x < 0.0 || vMapUv.x > 1.0 || vMapUv.y < 0.0 || vMapUv.y > 1.0) discard;\n${mat === back ? 'diffuseColor.rgb = diffuse;' : ''}\n#endif\n`);
        sh.fragmentShader = sh.fragmentShader.replace('#include <opaque_fragment>', 'outgoingLight = mix(diffuseColor.rgb, outgoingLight, paperLighting);\n#include <opaque_fragment>');
      };
      mat.customProgramCacheKey = () => `paper-${mat === back ? 'stock' : 'print'}`;
    }
    const depthMat = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, alphaTest: 0.04, side: THREE.DoubleSide });
    depthMat.onBeforeCompile = sh => { sh.fragmentShader = sh.fragmentShader.replace('#include <map_fragment>', '#include <map_fragment>\n#ifdef USE_MAP\nif (vMapUv.x < 0.0 || vMapUv.x > 1.0 || vMapUv.y < 0.0 || vMapUv.y > 1.0) discard;\n#endif\n'); };
    const sheet = new THREE.Group(), fMesh = new THREE.Mesh(geometry, front), bMesh = new THREE.Mesh(geometry, back);
    fMesh.castShadow = o.shadow; fMesh.receiveShadow = o.shadow; bMesh.receiveShadow = o.shadow; fMesh.customDepthMaterial = depthMat; sheet.add(fMesh, bMesh);
    const scene = new THREE.Scene(); scene.add(sheet);
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 10000);
    scene.add(new THREE.HemisphereLight(0xffffff, 0xa4a0b0, 1.35));
    const light = new THREE.DirectionalLight(0xfffaf0, Math.max(0, o.lightIntensity));
    light.castShadow = o.shadow; light.shadow.mapSize.set(1024, 1024); light.shadow.bias = -0.0002; light.shadow.normalBias = 0.6; light.shadow.radius = 3; scene.add(light, light.target);
    const floorG = new THREE.PlaneGeometry(1, 1), floorM = new THREE.ShadowMaterial({ opacity: clamp(o.shadowOpacity, 0, 1), depthWrite: false }), floor = new THREE.Mesh(floorG, floorM);
    floor.receiveShadow = true; floor.visible = o.shadow; scene.add(floor);
    renderer.setClearColor(0x000000, 0); renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.shadowMap.enabled = o.shadow; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    const amount = spring(), memory = spring(), posX = spring(), posY = spring(), tiltX = spring(), tiltY = spring(), springs = [amount, memory, posX, posY, tiltX, tiltY];
    const ray = new THREE.Raycaster(), pointer = new THREE.Vector2(), plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const anchor = new THREE.Vector3(), world = new THREE.Vector3(), corner = new THREE.Vector3(), va = new THREE.Vector3(), vb = new THREE.Vector3(), vc = new THREE.Vector3(), weights = new THREE.Vector3(1, 0, 0);
    let grips = [Math.floor(count / 2), 0, 0], vw = 1, vh = 1, scale = pw, px = 0, py = 0, lx = 0, ly = 0, lastMove = 0, spx = 0, spy = 0;
    let held = false, keyboard = false, pid = null, peak = 0, disposed = false, ready = false, inView = true, frame = 0, lastT = 0, state = 'flat', prevA = -1, prevM = -1;
    const reduceMotion = reduceMQ(), baseRot = THREE.MathUtils.degToRad(o.rotation), textures = [];
    const publish = n => { if (n === state) return; state = n; o.onStateChange && o.onStateChange(n); };
    function deform() {
      if (amount.value === prevA && memory.value === prevM) return; prevA = amount.value; prevM = memory.value;
      const fold = clamp(amount.value, 0, 1), fr = fold * (path.samples.length - 1), lo = Math.floor(fr), hi = Math.min(lo + 1, path.samples.length - 1), mix = fr - lo, from = path.samples[lo], to = path.samples[hi];
      for (let i = 0; i < positions.length; i++) { positions[i] = from[i] + (to[i] - from[i]) * mix; positions[i] += (path.creased[i] - original[i]) * memory.value * (1 - fold); }
      for (let f = 0; f < indices.length; f += 3) {
        const a = indices[f] * 3, b = indices[f + 1] * 3, c = indices[f + 2] * 3;
        const bx = positions[b] - positions[a], by = positions[b + 1] - positions[a + 1], bz = positions[b + 2] - positions[a + 2], cx = positions[c] - positions[a], cy = positions[c + 1] - positions[a + 1], cz = positions[c + 2] - positions[a + 2];
        const nx = by * cz - bz * cy, ny = bz * cx - bx * cz, nz = bx * cy - by * cx, L = Math.hypot(nx, ny, nz) || 1; fN[f] = nx / L; fN[f + 1] = ny / L; fN[f + 2] = nz / L;
      }
      for (let i = 0; i < indices.length; i++) {
        const src = indices[i] * 3, face = Math.floor(i / 3) * 3; let nx = 0, ny = 0, nz = 0;
        for (const nb of inc[indices[i]]) { const dot = fN[face] * fN[nb] + fN[face + 1] * fN[nb + 1] + fN[face + 2] * fN[nb + 2], w = THREE.MathUtils.smoothstep(dot, 0.88 - (1 - sharp) * 0.18, 0.98); nx += fN[nb] * w; ny += fN[nb + 1] * w; nz += fN[nb + 2] * w; }
        const L = Math.hypot(nx, ny, nz) || 1; rPos[i * 3] = positions[src]; rPos[i * 3 + 1] = positions[src + 1]; rPos[i * 3 + 2] = positions[src + 2]; rNor[i * 3] = nx / L; rNor[i * 3 + 1] = ny / L; rNor[i * 3 + 2] = nz / L;
      }
      geometry.attributes.position.needsUpdate = true; geometry.attributes.normal.needsUpdate = true; geometry.computeBoundingSphere(); geometry.computeBoundingBox();
      lighting.value = THREE.MathUtils.smoothstep(fold + memory.value, 0, 0.4);
    }
    function placeHit() {
      const bd = geometry.boundingBox; if (!bd) return; let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      for (let i = 0; i < 8; i++) { corner.set(i & 1 ? bd.max.x : bd.min.x, i & 2 ? bd.max.y : bd.min.y, i & 4 ? bd.max.z : bd.min.z); corner.applyMatrix4(sheet.matrixWorld).project(camera); const x = ((corner.x + 1) * vw) / 2, y = ((1 - corner.y) * vh) / 2; x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
      hit.style.transform = `translate3d(${x0}px,${y0}px,0)`; hit.style.width = `${Math.max(24, x1 - x0)}px`; hit.style.height = `${Math.max(24, y1 - y0)}px`;
    }
    const setPointer = (x, y) => { pointer.set((x / vw) * 2 - 1, 1 - (y / vh) * 2); ray.setFromCamera(pointer, camera); };
    function render(time) {
      frame = 0; if (disposed || !ready || !inView || document.hidden) return;
      const dt = lastT ? Math.min(0.04, (time - lastT) / 1000) : 1 / 60; lastT = time; let moving = false;
      const dur = held ? o.crumpleDuration : o.releaseDuration;
      for (const s of springs) moving = advance(s, dt, s === amount || s === memory ? dur : 0.42, reduceMotion || keyboard) || moving;
      peak = Math.max(peak, amount.value); deform(); sheet.rotation.set(tiltX.value, tiltY.value, baseRot);
      if (held && !keyboard && o.draggable) {
        const at = geometry.attributes.position; anchor.set(0, 0, 0);
        for (let i = 0; i < 3; i++) { va.fromBufferAttribute(at, grips[i]); anchor.addScaledVector(va, weights.getComponent(i)); }
        anchor.multiplyScalar(scale).applyEuler(sheet.rotation); plane.constant = -anchor.z; setPointer(px, py);
        if (ray.ray.intersectPlane(plane, world)) { posX.value = posX.target = world.x - anchor.x; posY.value = posY.target = world.y - anchor.y; posX.velocity = posY.velocity = 0; }
      }
      sheet.position.set(posX.value, posY.value, 0); sheet.updateMatrixWorld(true);
      const sb = geometry.boundingBox; if (sb) { let bz = Infinity; for (let i = 0; i < 8; i++) { corner.set(i & 1 ? sb.max.x : sb.min.x, i & 2 ? sb.max.y : sb.min.y, i & 4 ? sb.max.z : sb.min.z); corner.applyMatrix4(sheet.matrixWorld); bz = Math.min(bz, corner.z); } floor.position.z = bz - scale * shortSide * 0.08; }
      renderer.render(scene, camera); placeHit(); if (moving) wake();
    }
    function wake() { if (!frame && !disposed && ready && inView && !document.hidden) frame = requestAnimationFrame(render); }
    function resize() {
      const rc = root.getBoundingClientRect(); vw = Math.max(1, rc.width); vh = Math.max(1, rc.height);
      scale = pw * Math.min(1, Math.max(1, vw - 48) / pw, Math.max(1, vh - 48) / ph); sheet.scale.setScalar(scale);
      camera.aspect = vw / vh; camera.position.z = vh / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))); camera.updateProjectionMatrix(); camera.updateMatrixWorld();
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2)); renderer.setSize(vw, vh, false);
      const reach = Math.max(vw, vh), ang = THREE.MathUtils.degToRad(o.lightAngle);
      light.position.set(Math.sin(ang) * reach, Math.cos(ang) * reach, reach * 4);
      light.shadow.camera.left = light.shadow.camera.bottom = -reach; light.shadow.camera.right = light.shadow.camera.top = reach; light.shadow.camera.near = 1; light.shadow.camera.far = reach * 6; light.shadow.camera.updateProjectionMatrix();
      floor.position.z = -scale * shortSide * 0.12; floor.scale.set(vw * 4, vh * 4, 1);
      root.style.setProperty('--pc-image-width', `${scale}px`); root.style.setProperty('--pc-image-height', `${scale * aspect}px`);
      if (!held) { const lx2 = Math.max(0, (vw - scale) / 2 - 16), ly2 = Math.max(0, (vh - scale * aspect) / 2 - 16); posX.value = posX.target = clamp(posX.value, -lx2, lx2); posY.value = posY.target = clamp(posY.value, -ly2, ly2); }
      wake();
    }
    function finish(instant) {
      if (!held) return; held = false; hit.setAttribute('aria-pressed', 'false'); hit.style.cursor = 'grab';
      const cap = pid; pid = null; if (cap !== null && hit.hasPointerCapture(cap)) hit.releasePointerCapture(cap);
      if (o.releaseBehavior === 'stay') { amount.target = amount.value; amount.velocity = 0; }
      else { amount.target = 0; memory.target = o.releaseBehavior === 'creased' ? Math.max(memory.value, peak * clamp(o.creaseStrength, 0, 1)) : 0; }
      tiltX.target = tiltY.target = 0;
      if (o.returnToOrigin && o.releaseBehavior !== 'stay') posX.target = posY.target = 0;
      else {
        const bd = geometry.boundingBox, sx = o.releaseBehavior === 'stay' && bd ? bd.max.x - bd.min.x : 1, sy = o.releaseBehavior === 'stay' && bd ? bd.max.y - bd.min.y : aspect;
        const hw = ((Math.abs(Math.cos(baseRot)) * sx + Math.abs(Math.sin(baseRot)) * sy) * scale) / 2, hh = ((Math.abs(Math.sin(baseRot)) * sx + Math.abs(Math.cos(baseRot)) * sy) * scale) / 2;
        const lx2 = Math.min(Math.max(0, o.dragRadius), Math.max(0, vw / 2 - hw - 16)), ly2 = Math.min(Math.max(0, o.dragRadius), Math.max(0, vh / 2 - hh - 16));
        const coast = !reduceMotion && !keyboard && performance.now() - lastMove < 90 ? 0.06 : 0;
        posX.target = clamp(posX.value + spx * coast, -lx2, lx2); posY.target = clamp(posY.value - spy * coast, -ly2, ly2);
      }
      if (instant || keyboard || reduceMotion) for (const s of springs) advance(s, 0, 0, true);
      keyboard = false;
      publish(o.releaseBehavior === 'stay' && amount.target > 0.001 ? 'crumpled' : memory.target > 0.001 ? 'creased' : 'flat'); wake();
    }
    function reset() { finish(true); for (const s of springs) s.target = s.value = s.velocity = 0; peak = 0; prevA = -1; publish('flat'); wake(); }
    function start() { held = true; peak = amount.value; amount.target = clamp(o.crumpleAmount, 0, 1); hit.setAttribute('aria-pressed', 'true'); hit.style.cursor = 'grabbing'; publish('holding'); wake(); }
    function pDown(e) {
      if (!ready || held || e.button !== 0 || !e.isPrimary) return;
      const rc = root.getBoundingClientRect(); px = lx = e.clientX - rc.left; py = ly = e.clientY - rc.top; setPointer(px, py); sheet.updateMatrixWorld(true);
      const is = ray.intersectObjects([fMesh, bMesh], false)[0]; if (!is || !is.face) return;
      e.preventDefault(); hit.focus({ preventScroll: true });
      const f = is.face; grips = [f.a, f.b, f.c]; const at = geometry.attributes.position;
      va.fromBufferAttribute(at, f.a); vb.fromBufferAttribute(at, f.b); vc.fromBufferAttribute(at, f.c);
      THREE.Triangle.getBarycoord(sheet.worldToLocal(is.point.clone()), va, vb, vc, weights);
      keyboard = false; pid = e.pointerId; spx = spy = 0; lastMove = performance.now(); hit.setPointerCapture(e.pointerId); start();
    }
    function pMove(e) {
      if (!held || e.pointerId !== pid || !o.draggable) return;
      const rc = root.getBoundingClientRect(), now = performance.now(), x = e.clientX - rc.left, y = e.clientY - rc.top, dt = Math.max(0.008, (now - lastMove) / 1000);
      spx = (x - lx) / dt; spy = (y - ly) / dt; lx = x; ly = y; lastMove = now; px = clamp(x, 12, vw - 12); py = clamp(y, 12, vh - 12);
      const mt = reduceMotion ? 0 : THREE.MathUtils.degToRad(clamp(o.dragRotation, 0, 60)); tiltX.target = clamp(spy / 1800, -1, 1) * mt; tiltY.target = clamp(spx / 1800, -1, 1) * mt; wake();
    }
    const pUp = e => { if (e.pointerId === pid) finish(); }, pCancel = e => { if (e.pointerId === pid) finish(true); }, cancel = () => finish(true);
    const kDown = e => { if (!ready) return; if (e.key === 'Escape') { e.preventDefault(); reset(); return; } if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); if (e.repeat || held) return; keyboard = true; start(); advance(amount, 0, 0, true); peak = Math.max(peak, amount.value); } };
    const kUp = e => { if (keyboard && (e.key === ' ' || e.key === 'Enter')) { e.preventDefault(); finish(true); } };
    const vis = () => { lastT = 0; if (document.hidden) cancel(); else wake(); };
    hit.addEventListener('pointerdown', pDown); hit.addEventListener('pointermove', pMove); hit.addEventListener('pointerup', pUp); hit.addEventListener('pointercancel', pCancel); hit.addEventListener('lostpointercapture', pUp);
    hit.addEventListener('keydown', kDown); hit.addEventListener('keyup', kUp); hit.addEventListener('blur', cancel); addEventListener('blur', cancel); document.addEventListener('visibilitychange', vis);
    const ro = new ResizeObserver(resize); ro.observe(root);
    const iob = new IntersectionObserver(es => { inView = es[0].isIntersecting; lastT = 0; if (!inView) cancel(); else wake(); }); iob.observe(root);
    deform(); resize();
    new THREE.TextureLoader().load(o.src, tex => {
      if (disposed) { tex.dispose(); return; }
      textures.push(tex); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
      const img = tex.image, ia = img.width / img.height, ta = pw / ph; let rx = 1, ry = 1; if (ia > ta) rx = ta / ia; else ry = ia / ta;
      tex.repeat.set(rx, ry); tex.offset.set((1 - rx) / 2, (1 - ry) / 2);
      front.map = tex; back.map = tex; depthMat.map = tex; front.needsUpdate = back.needsUpdate = depthMat.needsUpdate = true;
      ready = true; canvas.style.visibility = 'visible'; hit.style.visibility = 'visible'; fallback.style.display = 'none'; wake();
    });
    return {
      reset,
      destroy: () => {
        disposed = true; cancelAnimationFrame(frame); ro.disconnect(); iob.disconnect(); removeEventListener('blur', cancel); document.removeEventListener('visibilitychange', vis);
        geometry.dispose(); floorG.dispose(); front.dispose(); back.dispose(); depthMat.dispose(); floorM.dispose(); grain.dispose(); textures.forEach(t => t.dispose()); renderer.dispose(); root.innerHTML = '';
      }
    };
  }

  /* ---------- SlingButton ---------- */
  function slingButton(root, o) {
    o = Object.assign({ onSend: null, padColor: '#f5f5f5', iconColor: '#18181b', accentColor: '#f5f5f5', wellColor: '#27272a', bandColor: '#52525b', size: 56, strokeWidth: 3, armAt: 48, maxPull: 160, launchSpeed: 2600, recoil: 0.2, flight: 120, particles: 14, spread: 60, axis: 'any', tapSends: true, ariaLabel: 'Send' }, o);
    const reduce = reduceMQ(), R = o.maxPull, ARM = Math.min(o.armAt, 0.8 * R), sw = o.strokeWidth, size = o.size;
    const wellR = size / 2 + 4 + sw, padR = size / 2 - sw / 2, H = wellR + sw + 2, DOT = Math.max(6, Math.round(size / 7));
    const rubber = (v, dim, c = 0.55) => (v * dim * c) / (dim + c * Math.abs(v));
    root.innerHTML = '';
    Object.assign(root.style, { position: 'relative', display: 'inline-block', width: size + 'px', height: size + 'px', flex: 'none' });
    const svg = sv('svg', { viewBox: `${-H} ${-H} ${2 * H} ${2 * H}`, 'aria-hidden': 'true' });
    svg.style.cssText = `pointer-events:none;position:absolute;left:50%;top:50%;width:${2 * H}px;height:${2 * H}px;margin:${-H}px 0 0 ${-H}px;overflow:visible`;
    const fx = sv('g', {}); fx.style.opacity = '0';
    const band = sv('path', { fill: 'none', stroke: o.bandColor, 'stroke-linecap': 'round', 'stroke-width': sw });
    const hot = sv('path', { fill: 'none', stroke: o.accentColor, 'stroke-linecap': 'round', 'stroke-width': sw });
    fx.append(band, hot);
    const well = sv('circle', { r: wellR, fill: o.wellColor }); well.style.transition = 'fill .2s ease';
    const arc = sv('circle', { r: wellR, fill: 'none', stroke: o.accentColor, 'stroke-width': sw, pathLength: '1', 'stroke-dasharray': '0 1' }); arc.style.opacity = '0';
    svg.append(fx, well, arc); root.appendChild(svg);
    const dots = [];
    for (let i = 0; i < Math.max(0, Math.round(o.particles)); i++) { const d = el('span', `pointer-events:none;position:absolute;left:50%;top:50%;width:${DOT}px;height:${DOT}px;margin:${-DOT / 2}px 0 0 ${-DOT / 2}px;border-radius:50%;opacity:0;background:${o.accentColor}`, { 'aria-hidden': 'true' }); root.appendChild(d); dots.push(d); }
    const mover = el('span', 'position:absolute;inset:0');
    const pad = el('button', 'position:relative;display:block;width:100%;height:100%;margin:0;padding:0;border:0;border-radius:50%;background:transparent;cursor:grab;touch-action:none;user-select:none;outline:none', { type: 'button', 'aria-label': o.ariaLabel, title: 'Press Enter, tap, or pull back and release' });
    const face = el('span', `display:flex;width:100%;height:100%;align-items:center;justify-content:center;border-radius:50%;background:${o.padColor};color:${o.iconColor};transition:transform .16s cubic-bezier(.23,1,.32,1)`);
    const icon = el('span', 'display:inline-flex;will-change:transform');
    const is = Math.round(size * 0.4);
    icon.innerHTML = `<svg width="${is}" height="${is}" viewBox="0 0 24 24"><path d="M12 19V5M6 11l6-6 6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;
    face.appendChild(icon); pad.appendChild(face); mover.appendChild(pad); root.appendChild(mover);
    let x = 0, y = 0, vx = 0, vy = 0, springing = false, raf = 0, last = 0, grip = null, armed = false, dotPending = false, dotTimer = 0, power = 0, skipClick = false;
    let dir = { ux: 0, uy: -1 };
    const zeta = 1 - clamp(o.recoil, 0, 0.9), K = Math.pow((2 * Math.PI) / 0.4, 2), C = 2 * zeta * Math.sqrt(K);
    const relaxIcon = () => { icon.style.transition = reduce ? 'none' : 'transform 360ms cubic-bezier(.23,1,.32,1)'; icon.style.transform = 'rotate(0deg)'; };
    const aimIcon = dist => { const ang = (Math.atan2(-dir.uy, -dir.ux) * 180) / Math.PI + 90; icon.style.transition = 'none'; icon.style.transform = `rotate(${ang * clamp(dist / 12, 0, 1)}deg)`; };
    const launchDot = () => {
      dotPending = false; clearTimeout(dotTimer); relaxIcon();
      const base = Math.atan2(-dir.uy, -dir.ux), cone = (o.spread * Math.PI) / 180, push = 0.85 + 0.35 * power;
      dots.forEach((d, i) => {
        const lead = i === 0, ang = base + (lead ? 0 : (Math.random() + Math.random() - 1) * (cone / 2)), cx = Math.cos(ang), cy = Math.sin(ang);
        const reach = (lead ? o.flight : o.flight * (0.3 + Math.random())) * push, drift = lead ? 0 : (Math.random() - 0.5) * o.flight * 0.4;
        const sc = lead ? 1 : 0.3 + Math.random() * 0.6, shrink = lead ? 0.6 : sc * (0.2 + Math.random() * 0.4), dur = lead ? 300 : 300 * (0.7 + Math.random()), delay = lead ? 0 : Math.random() * 70, to = wellR + reach;
        d.animate([{ transform: `translate(${cx * wellR}px,${cy * wellR}px) scale(${sc})` }, { transform: `translate(${cx * to - cy * drift}px,${cy * to + cx * drift}px) scale(${shrink})` }], { duration: dur, delay, easing: 'cubic-bezier(.23,1,.32,1)' });
        d.animate([{ opacity: 1, offset: 0 }, { opacity: 1, offset: 0.55 }, { opacity: 0, offset: 1 }], { duration: dur, delay });
      });
    };
    const paint = () => {
      mover.style.transform = `translate(${x}px,${y}px)`;
      const proj = x * dir.ux + y * dir.uy, p = clamp(proj / ARM, 0, 1), dist = Math.hypot(x, y);
      let d = '';
      if (dist > 0.5) { const a = Math.atan2(y, x), bb = Math.acos(clamp((wellR - padR) / dist, -1, 1)); d = [a + bb, a - bb].map(t => { const cx = Math.cos(t), cy = Math.sin(t); return `M${(wellR * cx).toFixed(2)},${(wellR * cy).toFixed(2)}L${(x + padR * cx).toFixed(2)},${(y + padR * cy).toFixed(2)}`; }).join(''); }
      band.setAttribute('d', d); hot.setAttribute('d', d); hot.style.opacity = p; fx.style.opacity = clamp(proj / 6, 0, 1);
      arc.setAttribute('stroke-dasharray', `${p} ${1 - p}`); arc.setAttribute('stroke-dashoffset', p / 2); arc.style.opacity = p > 0.01 ? '1' : '0';
      arc.setAttribute('transform', `rotate(${(Math.atan2(-dir.uy, -dir.ux) * 180) / Math.PI})`);
      const w = armed ? sw * 1.5 : sw; band.setAttribute('stroke-width', w); hot.setAttribute('stroke-width', w); arc.setAttribute('stroke-width', w);
      if (grip) aimIcon(dist);
      if (dotPending && proj <= size / 4) launchDot();
    };
    const step = now => {
      const dt = Math.min(0.034, (now - last) / 1000 || 0.016); last = now;
      for (let i = 0; i < 4; i++) { const h = dt / 4; vx += (-K * x - C * vx) * h; vy += (-K * y - C * vy) * h; x += vx * h; y += vy * h; }
      paint();
      if (Math.hypot(x, y) < 0.05 && Math.hypot(vx, vy) < 1) { x = y = vx = vy = 0; paint(); springing = false; raf = 0; return; }
      raf = requestAnimationFrame(step);
    };
    const settle = (v0x, v0y) => {
      if (reduce) { fx.style.transition = 'opacity .2s'; fx.style.opacity = '0'; setTimeout(() => { x = y = 0; paint(); fx.style.transition = ''; }, 200); return; }
      vx = v0x; vy = v0y; if (!springing) { springing = true; last = performance.now(); raf = requestAnimationFrame(step); }
    };
    const setArmed = a => { armed = a; face.style.transform = a ? 'scale(1.04)' : grip ? 'scale(.97)' : ''; };
    pad.addEventListener('pointerdown', e => {
      if (grip || e.button !== 0) return;
      cancelAnimationFrame(raf); springing = false;
      const dNow = Math.hypot(x, y), dc = Math.min(dNow, 0.95 * R), rawNow = dNow > 0.5 ? (R * dc) / (R - dc) : 0;
      grip = { id: e.pointerId, sx: e.clientX, sy: e.clientY, moved: false, hist: [], ro: dNow > 0.5 ? { x: (rawNow * x) / dNow, y: (rawNow * y) / dNow } : { x: 0, y: 0 }, slop: e.pointerType === 'touch' ? 8 : 4 };
      try { pad.setPointerCapture(e.pointerId); } catch (_) {}
      pad.style.cursor = 'grabbing'; face.style.transform = 'scale(.97)';
    });
    pad.addEventListener('pointermove', e => {
      const g = grip; if (!g || g.id !== e.pointerId) return;
      const dx = e.clientX - g.sx, dy = e.clientY - g.sy; let rx = g.ro.x + dx, ry = g.ro.y + dy;
      if (o.axis === 'horizontal') ry = rubber(ry, size / 4); else if (o.axis === 'vertical') rx = rubber(rx, size / 4);
      if (!g.moved && Math.hypot(dx, dy) > g.slop) g.moved = true;
      const raw = Math.hypot(rx, ry); if (raw < 0.01) return;
      const d = (R * raw) / (R + raw); dir = { ux: rx / raw, uy: ry / raw }; x = d * dir.ux; y = d * dir.uy;
      const t = performance.now(); g.hist.push({ x, y, t }); while (g.hist.length > 4 || t - g.hist[0].t > 80) g.hist.shift();
      if ((d >= ARM) !== armed) setArmed(d >= ARM);
      paint();
    });
    const release = (id, cancelled) => {
      const g = grip; if (!g || g.id !== id) return; grip = null; skipClick = true; pad.style.cursor = 'grab';
      try { pad.releasePointerCapture(id); } catch (_) {}
      const d = Math.hypot(x, y), p = d / ARM; let hvx = 0, hvy = 0;
      if (!cancelled && g.hist.length > 1) { const a = g.hist[0], bb = g.hist[g.hist.length - 1], dt = bb.t - a.t; if (dt > 0 && performance.now() - bb.t < 50) { hvx = ((bb.x - a.x) / dt) * 1000; hvy = ((bb.y - a.y) / dt) * 1000; } }
      const fm = Math.hypot(hvx, hvy); if (fm > 3000) { hvx *= 3000 / fm; hvy *= 3000 / fm; }
      if (!g.moved) { relaxIcon(); if (o.tapSends && !cancelled) o.onSend && o.onSend(); }
      else {
        const fire = armed && !cancelled, launch = fire ? o.launchSpeed * Math.min(p, 1.5) : 0.5 * o.launchSpeed * Math.min(p, 1);
        let v0x = hvx - dir.ux * launch, v0y = hvy - dir.uy * launch; const m = Math.hypot(v0x, v0y); if (m > 6000) { v0x *= 6000 / m; v0y *= 6000 / m; }
        if (!fire) relaxIcon();
        if (fire) { o.onSend && o.onSend(); if (reduce) { well.setAttribute('fill', o.accentColor); setTimeout(() => well.setAttribute('fill', o.wellColor), 200); } else { power = clamp((Math.min(p, 1.5) - 1) / 0.5, 0, 1); dotPending = true; dotTimer = setTimeout(launchDot, 150); } }
        settle(v0x, v0y);
      }
      setArmed(false); face.style.transform = '';
    };
    pad.addEventListener('pointerup', e => release(e.pointerId, false));
    pad.addEventListener('pointercancel', e => release(e.pointerId, true));
    pad.addEventListener('lostpointercapture', e => release(e.pointerId, true));
    pad.addEventListener('keydown', e => { if (e.key === 'Escape' && grip) release(grip.id, true); });
    pad.addEventListener('click', () => { if (skipClick) { skipClick = false; return; } o.onSend && o.onSend(); });
    pad.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse' && !grip) face.style.transform = 'scale(1.02)'; });
    pad.addEventListener('pointerleave', () => { if (!grip) face.style.transform = ''; });
    paint();
    return () => { cancelAnimationFrame(raf); clearTimeout(dotTimer); root.innerHTML = ''; };
  }

  window.PBBits = { drawFlames, flameCanvas, tearTicket, depthText, driftWall, refineFrame, scrollExpand, slideCommit, paperCrumple, slingButton };
})();
