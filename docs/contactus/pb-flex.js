/* Vanilla port of React Bits FlexCarousel (MIT + Commons Clause, reactbits.dev). Requires window.OGL (ogl). */
(function () {
  const PRESETS = {
    liquid: { lensWidth: 0.74, lensHeight: 1.18, tilt: 62, roundness: 1, bend: 0.34, reach: 0.38, curl: 'twist', dispersion: 0.45, liquid: 0, followCursor: false },
    ribbon: { lensWidth: 0.8, lensHeight: 0.8, tilt: 0, roundness: 1, bend: 0.34, reach: 0.34, curl: 'twist', dispersion: 0.4, liquid: 0, followCursor: false },
    vortex: { lensWidth: 0.7, lensHeight: 0.95, tilt: 30, roundness: 1, bend: 0.46, reach: 0.3, curl: 'twist', dispersion: 0.5, liquid: 0, followCursor: false },
    arch: { lensWidth: 0.8, lensHeight: 0.8, tilt: 0, roundness: 1, bend: 0.3, reach: 0.36, curl: 'rise', dispersion: 0.4, liquid: 0, followCursor: false }
  };
  const FIT_ASPECT = { portrait: 0.75, square: 1, landscape: 4 / 3 };
  const TAPS = 12, PIXEL_BUDGET = 4.5e6;
  const INTRO_DURATION = { rise: 2.1, bloom: 1.6, spin: 2.2, deal: 1.5, fade: 0.35 };
  const wrap = (v, s) => ((((v + s / 2) % s) + s) % s) - s / 2;
  const clamp01 = v => Math.min(Math.max(v, 0), 1);
  const easeOut = v => 1 - Math.pow(1 - clamp01(v), 3);
  const easeOutQuint = v => 1 - Math.pow(1 - clamp01(v), 5);
  const easeInOut = v => { const t = clamp01(v); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };

  const cardVertex = `#version 300 es
in vec3 position; in vec2 uv; uniform vec4 uRect; uniform vec2 uResolution; out vec2 vUv; out vec2 vLocal;
void main() { vUv = uv; vLocal = vec2(position.x, -position.y) * uRect.zw; vec2 px = uRect.xy + vLocal;
gl_Position = vec4(px.x / uResolution.x * 2.0 - 1.0, 1.0 - px.y / uResolution.y * 2.0, 0.0, 1.0); }`;
  const cardFragment = `#version 300 es
precision highp float;
uniform sampler2D tMap; uniform vec2 uSize; uniform vec2 uImage; uniform float uRadius; uniform float uAlpha; uniform float uReady; uniform float uShift; uniform float uDpr; uniform vec3 uPlaceholder;
in vec2 vUv; in vec2 vLocal; out vec4 fragColor;
float roundedBox(vec2 p, vec2 b, float r) { vec2 q = abs(p) - b + r; return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r; }
void main() {
  float sd = roundedBox(vLocal, uSize * 0.5, min(uRadius, min(uSize.x, uSize.y) * 0.5));
  float mask = clamp(0.5 - sd * uDpr, 0.0, 1.0);
  vec2 local = vLocal / uSize + 0.5;
  float cardAspect = uSize.x / uSize.y; float imageAspect = uImage.x / max(uImage.y, 1.0);
  vec2 scale = imageAspect > cardAspect ? vec2(cardAspect / imageAspect, 1.0) : vec2(1.0, imageAspect / cardAspect);
  scale /= 1.08;
  vec2 uv = vec2(local.x, 1.0 - local.y); uv = (uv - 0.5) * scale + 0.5; uv.x += uShift * (1.0 - scale.x) * 0.5;
  vec3 image = texture(tMap, uv).rgb; vec3 color = mix(uPlaceholder, image, uReady);
  float alpha = mask * uAlpha; fragColor = vec4(color * alpha, alpha);
}`;
  const lensVertex = `#version 300 es
in vec2 position; void main() { gl_Position = vec4(position, 0.0, 1.0); }`;
  const lensFragment = `#version 300 es
precision highp float;
uniform sampler2D tScene; uniform vec2 uResolution; uniform float uDpr; uniform vec2 uCenter; uniform vec2 uHalf; uniform float uAngle; uniform float uExponent;
uniform float uInner; uniform float uOuter; uniform float uFlow; uniform float uCurl; uniform float uDispersion; uniform float uStrength; uniform float uSceneAlpha;
out vec4 fragColor;
void main() {
  vec2 frag = gl_FragCoord.xy / uDpr; vec2 uv = frag / uResolution;
  vec2 rel = frag - vec2(uCenter.x, uResolution.y - uCenter.y);
  float ca = cos(uAngle); float sa = sin(uAngle);
  vec2 local = vec2(ca * rel.x + sa * rel.y, -sa * rel.x + ca * rel.y);
  vec2 k = max(abs(local) / uHalf, vec2(1e-5));
  float nd = pow(pow(k.x, uExponent) + pow(k.y, uExponent), 1.0 / uExponent);
  vec2 grad = pow(k, vec2(uExponent - 1.0)) * sign(local) / uHalf * pow(nd, 1.0 - uExponent);
  float glen = max(length(grad), 1e-6); float edge = (nd - 1.0) / glen; vec2 outward = grad / glen;
  vec2 normal = vec2(ca * outward.x - sa * outward.y, sa * outward.x + ca * outward.y); vec2 along = vec2(-normal.y, normal.x);
  float t = clamp((edge + uInner) / (uInner + uOuter), 0.0, 1.0);
  float ramp = t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
  float slope = 16.0 * t * t * (1.0 - t) * (1.0 - t);
  float reachX = rel.x / (uResolution.x * 0.5);
  float side = smoothstep(0.02, 0.3, abs(reachX)) * (uCurl == 0.0 ? sign(reachX) : uCurl);
  float lift = ramp * side * uFlow * uStrength;
  vec2 swirl = along * along.y * side * slope * uFlow * uStrength * 0.35;
  vec2 drift = vec2(0.0, -lift) - swirl;
  vec2 shifted = uv + drift / uResolution;
  vec2 texels = uResolution * uDpr;
  vec2 gx = dFdx(shifted); vec2 gy = dFdy(shifted);
  gx *= min(1.0, 3.0 / max(length(gx * texels), 1e-4)); gy *= min(1.0, 3.0 / max(length(gy * texels), 1e-4));
  vec4 color = textureGrad(tScene, shifted, gx, gy);
  vec2 spread = vec2(0.0, side * slope * uFlow * uStrength) / uResolution * uDispersion;
  float spreadPx = length(spread * texels);
  if (color.a > 0.002 && spreadPx > 0.25) {
    vec3 base = color.rgb / color.a; vec3 sumColor = vec3(0.0); vec3 sumWeight = vec3(0.0);
    for (int i = 0; i < ${TAPS}; i++) {
      float s = (float(i) + 0.5) / float(${TAPS});
      vec4 c = textureGrad(tScene, shifted + spread * (s - 0.5), gx, gy);
      vec3 w = max(1.0 - abs(vec3(s) - vec3(0.15, 0.5, 0.85)) * 2.6, 0.0) * c.a;
      sumColor += c.rgb * (w / max(c.a, 0.002)); sumWeight += w;
    }
    vec3 split = mix(base, sumColor / max(sumWeight, vec3(1e-4)), clamp(sumWeight * 2.0, 0.0, 1.0));
    color.rgb = mix(color.rgb, clamp(split, 0.0, 1.0) * color.a, smoothstep(0.25, 1.5, spreadPx));
  }
  fragColor = color * uSceneAlpha;
}`;

  if (!document.getElementById('pb-flex-kf')) {
    const st = document.createElement('style'); st.id = 'pb-flex-kf';
    st.textContent = '@keyframes pbflex-title{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}@keyframes pbflex-reveal{from{opacity:0}to{opacity:1}}';
    document.head.appendChild(st);
  }

  function flexCarousel(container, o) {
    const OGL = window.OGL; if (!OGL) throw new Error('ogl not loaded');
    const { Renderer, Program, Mesh, Triangle, Plane, Texture, RenderTarget } = OGL;
    o = o || {};
    const base = PRESETS[o.preset] || PRESETS.liquid;
    const s = Object.assign({ intro: 'rise', cardHeight: 0.5, gap: 12, radius: 0, fit: 'natural', squeeze: 0.2, focusOnClick: true, autoplay: false, interval: 4, captureWheel: true, captions: true }, base);
    for (const k in o) if (o[k] !== undefined && o[k] !== null) s[k] = o[k];
    const list = (o.items && o.items.length) ? o.items : [];

    Object.assign(container.style, { position: 'relative', overflow: 'hidden', cursor: 'grab', touchAction: 'pan-y', userSelect: 'none', outline: 'none', overscrollBehavior: 'contain', WebkitTapHighlightColor: 'transparent' });
    container.setAttribute('role', 'region'); container.setAttribute('aria-roledescription', 'carousel');
    container.setAttribute('aria-label', o.ariaLabel || 'Image carousel'); container.tabIndex = 0;
    const half = Math.min(Math.max(s.cardHeight, 0.05), 1) * 50;
    const cap = document.createElement('div');
    cap.setAttribute('aria-hidden', 'true');
    cap.style.cssText = `pointer-events:none;position:absolute;left:0;right:0;top:calc(50% + ${half}% * var(--pbflex-lift,1) + 22px);display:none;flex-direction:column;align-items:center;gap:6px;padding:0 16px;text-align:center;animation:pbflex-reveal .9s ease both`;
    const capTitle = document.createElement('span'); capTitle.style.cssText = 'display:flex;flex-direction:column;align-items:center;font-size:15px;font-weight:500;line-height:1.35';
    const capCount = document.createElement('span'); capCount.style.cssText = "font-family:'IBM Plex Mono',monospace;font-size:12px;letter-spacing:.06em;opacity:.55;transition:opacity .4s";
    cap.append(capTitle, capCount);
    const live = document.createElement('div'); live.setAttribute('aria-live', 'polite');
    live.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)';
    container.append(cap, live);
    const pad = n => String(n).padStart(2, '0');
    const setActive = i => {
      const it = list[i]; if (!it) return;
      capTitle.innerHTML = '';
      capTitle.style.animation = 'none'; void capTitle.offsetWidth; capTitle.style.animation = 'pbflex-title .52s cubic-bezier(.22,1,.36,1)';
      capTitle.append(document.createTextNode(it.title || it.alt || ''));
      if (it.subtitle) { const sub = document.createElement('span'); sub.style.cssText = 'font-weight:400;opacity:.6'; sub.textContent = it.subtitle; capTitle.append(sub); }
      capCount.textContent = pad(i + 1) + ' / ' + pad(list.length);
      live.textContent = `${it.title || it.alt || 'Image ' + (i + 1)}, ${i + 1} of ${list.length}`;
    };
    const setRevealed = () => { if (s.captions) cap.style.display = 'flex'; };
    const setFocusOpen = v => { capCount.style.opacity = v ? '0' : '.55'; };

    const renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio || 1, 2), alpha: true, premultipliedAlpha: true, antialias: false, depth: false, webgl: 2 });
    const gl = renderer.gl;
    if (!renderer.isWebgl2) { gl.getExtension('WEBGL_lose_context')?.loseContext(); return { destroy() {} }; }
    gl.clearColor(0, 0, 0, 0);
    const canvas = gl.canvas;
    canvas.style.display = 'block'; canvas.style.width = '100%'; canvas.style.height = '100%'; canvas.setAttribute('aria-hidden', 'true');
    container.prepend(canvas);

    const cardProgram = new Program(gl, { vertex: cardVertex, fragment: cardFragment, transparent: true, depthTest: false, depthWrite: false,
      uniforms: { tMap: { value: new Texture(gl) }, uRect: { value: [0, 0, 1, 1] }, uResolution: { value: [1, 1] }, uSize: { value: [1, 1] }, uImage: { value: [1, 1] }, uRadius: { value: 16 }, uAlpha: { value: 1 }, uReady: { value: 0 }, uShift: { value: 0 }, uDpr: { value: 1 }, uPlaceholder: { value: [0.5, 0.5, 0.5] } } });
    cardProgram.setBlendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    const cardMesh = new Mesh(gl, { geometry: new Plane(gl), program: cardProgram });
    const target = new RenderTarget(gl, { width: 2, height: 2, depth: false, minFilter: gl.LINEAR_MIPMAP_LINEAR, magFilter: gl.LINEAR });
    const U = { tScene: { value: target.texture }, uResolution: { value: [1, 1] }, uDpr: { value: 1 }, uCenter: { value: [0, 0] }, uHalf: { value: [1, 1] }, uAngle: { value: 0 }, uExponent: { value: 2 }, uInner: { value: 60 }, uOuter: { value: 80 }, uFlow: { value: 0 }, uCurl: { value: 0 }, uDispersion: { value: 0 }, uStrength: { value: 0 }, uSceneAlpha: { value: 0 } };
    const lensMesh = new Mesh(gl, { geometry: new Triangle(gl), program: new Program(gl, { vertex: lensVertex, fragment: lensFragment, uniforms: U, depthTest: false, depthWrite: false }) });
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const anisotropy = renderer.getExtension('EXT_texture_filter_anisotropic') ? 8 : 0;

    let slots = [], width = 1, height = 1, pos = 0, vel = 0, goal = 0, mode = 'spring', wheelAt = 0, raf = 0, last = performance.now();
    let visible = true, alive = true, dirty = true, activeIndex = -1, interactedAt = -Infinity, autoplayAt = performance.now(), hasFocus = false;
    let deform = 0, deformVel = 0, layout = null, resnap = false, hover = '', lift = 1, energy = 0, lastPos = 0;
    const lens = { x: 0, y: 0, vx: 0, vy: 0, ready: false };
    const pointer = { x: 0, y: 0, over: false, down: false, id: -1, startX: 0, startY: 0, startPos: 0, dragging: false, touch: false, samples: [] };
    const introState = { kind: 'none', t: 0, running: false, done: false, readyAt: 0 };
    const focus = { index: -1, pending: -1, t: 0, v: 0, target: 0 };
    let instances = [];

    const loadSlot = (item, index) => {
      const texture = new Texture(gl, { generateMipmaps: true, minFilter: gl.LINEAR_MIPMAP_LINEAR, magFilter: gl.LINEAR, anisotropy });
      const slot = { item, index, texture, aspect: 0.8, loaded: false, failed: false, ready: 0, color: [0.5, 0.5, 0.5], image: [1, 1], dispose: () => {} };
      const image = new Image(); image.crossOrigin = 'anonymous'; image.decoding = 'async';
      image.onload = () => {
        if (!alive || !slots.includes(slot)) return;
        texture.image = image; texture.update();
        slot.image = [image.naturalWidth || 1, image.naturalHeight || 1]; slot.aspect = slot.image[0] / slot.image[1];
        try {
          const probe = document.createElement('canvas'); probe.width = 8; probe.height = 8;
          const ctx = probe.getContext('2d', { willReadFrequently: true });
          if (ctx) { ctx.drawImage(image, 0, 0, 8, 8); const d = ctx.getImageData(0, 0, 8, 8).data; const avg = [0, 0, 0]; for (let i = 0; i < d.length; i += 4) { avg[0] += d[i]; avg[1] += d[i + 1]; avg[2] += d[i + 2]; } slot.color = avg.map(v => v / 64 / 255); }
        } catch (e) { slot.color = [0.5, 0.5, 0.5]; }
        slot.loaded = true; dirty = true; start();
      };
      image.onerror = () => { if (!alive) return; slot.failed = true; dirty = true; start(); };
      image.src = item.src;
      slot.dispose = () => { image.onload = null; image.onerror = null; gl.deleteTexture(texture.texture); };
      return slot;
    };
    const setItems = next => {
      slots.forEach(sl => sl.dispose()); slots = next.map(loadSlot);
      activeIndex = -1; layout = null; resnap = true; focus.target = 0; focus.t = 0; focus.v = 0; focus.pending = -1; setFocusOpen(false);
      introState.readyAt = performance.now(); dirty = true; start();
    };
    const metrics = () => {
      const cardH = Math.max(24, s.cardHeight * height); const fixed = FIT_ASPECT[s.fit];
      const widths = slots.map(sl => (fixed || sl.aspect) * cardH); const centers = []; let cursor = 0;
      for (let i = 0; i < widths.length; i++) { centers.push(cursor + widths[i] / 2); cursor += widths[i] + s.gap; }
      return { cardH, widths, centers, gap: s.gap, loop: Math.max(cursor, 1) };
    };
    const nearest = (m, at) => { let best = 0, bd = Infinity; for (let i = 0; i < m.centers.length; i++) { const d = Math.abs(wrap(m.centers[i] - at, m.loop)); if (d < bd) { bd = d; best = i; } } return best; };
    const snapPoint = (m, at) => { const i = nearest(m, at); return at + wrap(m.centers[i] - at, m.loop); };
    const remap = (from, to, at) => { const i = nearest(from, at); const off = wrap(at - from.centers[i], from.loop); const cycles = Math.round((at - off - from.centers[i]) / from.loop); return cycles * to.loop + to.centers[i] + off * (to.widths[i] / from.widths[i]); };
    const step = (m, delta) => {
      let at = snapPoint(m, goal); let index = nearest(m, at); const n = m.centers.length;
      for (let k = 0; k < Math.abs(delta); k++) { const next = (index + (delta > 0 ? 1 : n - 1)) % n; const dist = delta > 0 ? m.widths[index] / 2 + m.gap + m.widths[next] / 2 : -(m.widths[next] / 2 + m.gap + m.widths[index] / 2); at += dist; index = next; }
      goal = at; mode = 'spring'; dirty = true; start();
    };
    const goTo = (m, index) => { const i = ((index % m.centers.length) + m.centers.length) % m.centers.length; goal = goal + wrap(m.centers[i] - goal, m.loop); mode = 'spring'; dirty = true; start(); };
    const openFocus = index => { focus.index = index; focus.pending = -1; focus.target = 1; setFocusOpen(true); dirty = true; start(); };
    const closeFocus = () => { focus.pending = -1; if (focus.target === 0) return false; focus.target = 0; setFocusOpen(false); dirty = true; start(); return true; };
    const skipIntro = () => { if (introState.running) introState.t = 1; };
    const introEffects = () => {
      const t = introState.running ? introState.t : introState.done ? 1 : 0;
      const e = { sceneAlpha: 1, strength: 1, card: null };
      if (!introState.done && !introState.running) { e.sceneAlpha = 0; e.strength = 0; return e; }
      if (t >= 1) return e;
      const kind = introState.kind;
      if (kind === 'rise') {
        e.strength = easeInOut((t - 0.3) / 0.65);
        e.card = rel => { const delay = Math.min(Math.abs(rel) / (width * 0.6), 1) * 0.34; const l = clamp01((t - delay) / 0.6); return { alpha: clamp01(l * 4), x: 0, y: (1 - easeOutQuint(l)) * height * 0.62, scale: 0.5 + 0.5 * easeInOut((l - 0.18) / 0.82) }; };
      } else if (kind === 'bloom') {
        e.strength = easeInOut((t - 0.2) / 0.8);
        e.card = rel => { const delay = Math.min(Math.abs(rel) / (width * 0.6), 1) * 0.25; const l = easeOut((t - delay) / 0.55); return { alpha: l, x: 0, y: 0, scale: 0.92 + 0.08 * l }; };
      } else if (kind === 'spin') {
        e.sceneAlpha = easeOut(t / 0.25); e.strength = easeOut((t - 0.55) / 0.45);
      } else if (kind === 'deal') {
        e.strength = easeOut((t - 0.45) / 0.5);
        e.card = rel => { const spread = Math.min(Math.abs(rel) / (width * 0.6), 1) * 0.3; const l = easeOut((t - 0.12 - spread) / 0.5); return { alpha: easeOut((t - spread) / 0.12), x: -rel * (1 - l), y: 0, scale: 1 }; };
      } else { e.sceneAlpha = easeOut(t); e.strength = easeOut(t); }
      return e;
    };
    const beginIntro = m => {
      const kind = reducedMotion && s.intro !== 'none' ? 'fade' : s.intro;
      introState.kind = INTRO_DURATION[kind] ? kind : 'none';
      introState.running = introState.kind !== 'none'; introState.done = !introState.running; introState.t = 0;
      if (introState.done) setRevealed();
      if (introState.kind === 'spin') { const d = m.loop * 1.6 + width; pos = goal + d; vel = -d * 3; mode = 'spring'; }
    };
    const resize = () => {
      width = Math.max(1, container.clientWidth); height = Math.max(1, container.clientHeight);
      renderer.dpr = Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(PIXEL_BUDGET / (width * height)));
      renderer.setSize(width, height);
      target.setSize(Math.max(2, Math.round(width * renderer.dpr)), Math.max(2, Math.round(height * renderer.dpr)));
      U.tScene.value = target.texture; dirty = true; start();
    };
    const frame = now => {
      raf = 0; if (!alive) return;
      const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000)); last = now;
      if (!slots.length) { if (visible) raf = requestAnimationFrame(frame); return; }
      const m = metrics(); const n = slots.length; let animating = false;
      if (resnap) { goal = snapPoint(m, goal); pos = goal; vel = 0; resnap = false; }
      else if (layout && layout.loop !== m.loop) { pos = remap(layout, m, pos); goal = remap(layout, m, goal); pointer.startPos = pos + (pointer.x - pointer.startX); animating = true; }
      layout = m;
      if (!introState.running && !introState.done) {
        const settled = slots.every(sl => sl.loaded || sl.failed);
        if (settled || now - introState.readyAt > 3500) { goal = snapPoint(m, goal); pos = goal; beginIntro(m); }
      }
      if (introState.running) {
        introState.t = Math.min(1, introState.t + dt / (INTRO_DURATION[introState.kind] || 1));
        if (introState.t >= 1) { introState.running = false; introState.done = true; setRevealed(); }
        animating = true;
      }
      if (mode === 'wheel' && now - wheelAt > 150) { goal = snapPoint(m, goal); mode = 'spring'; }
      if (!pointer.dragging) {
        const spinning = introState.running && introState.kind === 'spin';
        const stiff = spinning ? 9 : mode === 'wheel' ? 80 : 55; const damp = 2 * Math.sqrt(stiff);
        const steps = Math.ceil(dt / (1 / 240)); const h = dt / steps;
        for (let i = 0; i < steps; i++) { const acc = stiff * (goal - pos) - damp * vel; vel += acc * h; pos += vel * h; }
        if (Math.abs(goal - pos) < 0.05 && Math.abs(vel) < 0.5) { pos = goal; vel = 0; } else animating = true;
      } else animating = true;
      if (Math.abs(pos) > m.loop * 8) { const sh = Math.round(pos / m.loop) * m.loop; pos -= sh; goal -= sh; pointer.startPos -= sh; }
      const current = nearest(m, pos);
      if (current !== activeIndex) { activeIndex = current; setActive(current); o.onChange && o.onChange(current, list[current]); }
      if (focus.pending >= 0 && mode === 'spring' && Math.abs(goal - pos) < 1.5 && Math.abs(vel) < 30) { if (current === focus.pending) openFocus(current); else focus.pending = -1; }
      if (s.autoplay && !reducedMotion && introState.done && focus.target === 0 && focus.t < 0.01 && !pointer.over && !pointer.down && !hasFocus && mode === 'spring' && Math.abs(goal - pos) < 1 && now - interactedAt > 3000 && now - autoplayAt > s.interval * 1000) { autoplayAt = now; step(m, 1); }
      if (s.autoplay && !reducedMotion) animating = true;
      const travel = Math.abs(pos - lastPos) / dt; lastPos = pos;
      const eT = reducedMotion ? 0 : Math.min(travel / 2600, 1);
      energy += (eT - energy) * (1 - Math.exp(-dt / (eT > energy ? 0.07 : 0.35)));
      if (energy > 0.001) animating = true;
      const liq = reducedMotion ? 0 : s.liquid;
      const push = Math.max(-1, Math.min(1, vel / 2200));
      const dS = 120, dD = 2 * Math.sqrt(dS) * 0.32;
      deformVel += (dS * (push - deform) - dD * deformVel) * dt; deform += deformVel * dt;
      if (Math.abs(deform) > 0.0005 || Math.abs(deformVel) > 0.005) animating = true;
      const fS = 64;
      focus.v += (fS * (focus.target - focus.t) - 2 * Math.sqrt(fS) * focus.v) * dt; focus.t += focus.v * dt;
      if (Math.abs(focus.target - focus.t) < 0.0005 && Math.abs(focus.v) < 0.001) { focus.t = focus.target; focus.v = 0; } else animating = true;
      const fA = clamp01(focus.t), fE = easeInOut(fA);
      const focusW = focus.index >= 0 && focus.index < n ? m.widths[focus.index] : m.cardH;
      const focusScale = Math.max(1, Math.min(1.3, (height * 0.84) / m.cardH, (width * 0.92) / focusW));
      const nextLift = 1 + (focusScale - 1) * fE;
      if (Math.abs(nextLift - lift) > 0.0005) { lift = nextLift; container.style.setProperty('--pbflex-lift', lift.toFixed(4)); }
      const fx0 = introEffects();
      const homeX = width / 2, homeY = height / 2;
      const follow = s.followCursor && pointer.over && !pointer.dragging && !pointer.touch && focus.target === 0;
      const aimX = follow ? pointer.x : homeX, aimY = follow ? pointer.y : homeY;
      if (!lens.ready) { lens.x = homeX; lens.y = homeY; lens.ready = true; }
      const lK = 110, lC = 2 * Math.sqrt(lK) * 0.8;
      lens.vx += (lK * (aimX - lens.x) - lC * lens.vx) * dt; lens.vy += (lK * (aimY - lens.y) - lC * lens.vy) * dt;
      lens.x += lens.vx * dt; lens.y += lens.vy * dt;
      if (Math.abs(aimX - lens.x) + Math.abs(aimY - lens.y) > 0.2 || Math.abs(lens.vx) + Math.abs(lens.vy) > 0.5) animating = true;
      const cardH = m.cardH;
      let halfW = (s.lensWidth * width) / 2, halfH = (s.lensHeight * width) / 2;
      const squash = Math.abs(deform) * liq; halfW *= 1 + squash * 0.16; halfH *= 1 - squash * 0.08;
      const lensX = lens.x - deform * 14 * liq;
      for (let i = 0; i < n; i++) { const sl = slots[i]; if (sl.loaded && sl.ready < 1) { sl.ready = Math.min(1, sl.ready + dt / 0.45); animating = true; } }
      const waiting = !introState.done;
      if (dirty || animating || pointer.dragging) {
        dirty = false; instances = [];
        const dpr = renderer.dpr;
        cardProgram.uniforms.uResolution.value = [width, height]; cardProgram.uniforms.uDpr.value = dpr; cardProgram.uniforms.uRadius.value = s.radius;
        const shrink = 1 - clamp01(s.squeeze) * energy;
        const draws = [];
        for (let i = 0; i < n; i++) {
          const w = m.widths[i]; const baseRel = wrap(m.centers[i] - pos, m.loop);
          for (let k = -3; k <= 3; k++) {
            const rel = baseRel + k * m.loop;
            if (Math.abs(rel) - w / 2 > width + 40) continue;
            const fx = fx0.card ? fx0.card(rel) : null;
            let x = homeX + rel + (fx ? fx.x : 0); let scale = shrink * (fx ? fx.scale : 1); let alpha = fx ? fx.alpha : 1;
            if (fA > 0) {
              if (i === focus.index && Math.abs(rel) < w) scale *= 1 + (focusScale - 1) * fE;
              else { const order = Math.min(Math.abs(rel) / width, 1) * 0.25; const part = easeInOut(fA * 1.25 - order); x += Math.sign(rel) * part * width * 0.7; alpha *= 1 - part; }
            }
            const cw = w * scale;
            if (alpha <= 0.001 || x + cw / 2 < -40 || x - cw / 2 > width + 40) continue;
            draws.push({ i, rel, x, y: homeY + (fx ? fx.y : 0), cw, ch: cardH * scale, alpha });
          }
        }
        draws.sort((a, b) => Math.abs(b.rel) - Math.abs(a.rel));
        let first = true;
        for (const d of draws) {
          const sl = slots[d.i]; const u = cardProgram.uniforms;
          u.tMap.value = sl.texture; u.uRect.value = [d.x, d.y, d.cw + 2, d.ch + 2]; u.uSize.value = [d.cw, d.ch]; u.uImage.value = sl.image;
          u.uAlpha.value = d.alpha; u.uReady.value = sl.ready; u.uShift.value = reducedMotion ? 0 : Math.max(-1, Math.min(1, d.rel / (width * 0.75))); u.uPlaceholder.value = sl.color;
          renderer.render({ scene: cardMesh, target, clear: first }); first = false;
          instances.push({ index: d.i, x0: d.x - d.cw / 2, x1: d.x + d.cw / 2, y0: d.y - d.ch / 2, y1: d.y + d.ch / 2 });
        }
        if (first) { renderer.bindFramebuffer(target); gl.viewport(0, 0, target.width, target.height); gl.clear(gl.COLOR_BUFFER_BIT); }
        renderer.bindFramebuffer();
        target.texture.bind(); gl.generateMipmap(gl.TEXTURE_2D);
        U.uResolution.value = [width, height]; U.uDpr.value = dpr; U.uCenter.value = [lensX, lens.y];
        U.uHalf.value = [Math.max(halfW, 1), Math.max(halfH, 1)]; U.uAngle.value = (s.tilt * Math.PI) / 180;
        U.uExponent.value = 2 + Math.pow(1 - clamp01(s.roundness), 1.5) * 10;
        const spanW = Math.max(halfW, 1), spanH = Math.max(halfH, 1);
        const inner = Math.max(4, s.reach * (spanW + spanH) * 0.5);
        U.uInner.value = inner; U.uOuter.value = inner * 1.6; U.uFlow.value = s.bend * (spanW + spanH) * 0.45;
        U.uCurl.value = s.curl === 'rise' ? 1 : s.curl === 'fall' ? -1 : 0;
        U.uDispersion.value = s.dispersion * 0.12 * (1 + Math.abs(deform) * liq * 1.2);
        U.uStrength.value = fx0.strength * (1 - fE); U.uSceneAlpha.value = fx0.sceneAlpha;
        renderer.render({ scene: lensMesh });
      }
      let nh = '';
      if (pointer.over && !pointer.dragging && introState.done && (s.focusOnClick || o.onSelect)) {
        const hit = instances.find(it => pointer.x >= it.x0 && pointer.x <= it.x1 && pointer.y >= it.y0 && pointer.y <= it.y1);
        if (focus.target > 0) nh = 'close'; else if (hit) nh = 'open';
      }
      if (nh !== hover) { hover = nh; container.style.cursor = hover === 'open' ? (s.focusOnClick ? 'zoom-in' : 'pointer') : hover === 'close' ? 'zoom-out' : 'grab'; }
      if (visible && (animating || waiting || dirty || pointer.down)) raf = requestAnimationFrame(frame);
    };
    const start = () => { if (raf || !visible || !alive) return; last = performance.now(); raf = requestAnimationFrame(frame); };
    const lp = e => { const r = container.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    const onDown = e => {
      if (e.button !== undefined && e.button > 0) return;
      skipIntro(); const [x, y] = lp(e);
      Object.assign(pointer, { down: true, id: e.pointerId, touch: e.pointerType === 'touch', startX: x, startY: y, x, y, startPos: pos, dragging: false, samples: [{ x, t: performance.now() }] });
      interactedAt = performance.now();
      if (Math.abs(vel) > 40) { goal = pos; vel = 0; }
      dirty = true; start();
    };
    const onMove = e => {
      const [x, y] = lp(e); pointer.x = x; pointer.y = y; pointer.over = true;
      if (pointer.down && e.pointerId === pointer.id) {
        const dx = x - pointer.startX, dy = y - pointer.startY, slop = pointer.touch ? 10 : 5;
        if (!pointer.dragging) {
          if (pointer.touch && Math.abs(dy) > slop && Math.abs(dy) > Math.abs(dx)) { pointer.down = false; return; }
          if (Math.abs(dx) > slop) { pointer.dragging = true; pointer.startX = x; pointer.startPos = pos; closeFocus(); try { container.setPointerCapture(e.pointerId); } catch (er) {} container.style.cursor = 'grabbing'; }
        }
        if (pointer.dragging) {
          pos = pointer.startPos - (x - pointer.startX); goal = pos; vel = 0;
          const now = performance.now(); pointer.samples.push({ x, t: now });
          while (pointer.samples.length > 2 && now - pointer.samples[0].t > 100) pointer.samples.shift();
        }
      }
      dirty = true; start();
    };
    const onUp = e => {
      if (!pointer.down || e.pointerId !== pointer.id) return;
      pointer.down = false; container.style.cursor = 'grab'; hover = '';
      const m = metrics(); interactedAt = performance.now();
      if (pointer.dragging) {
        pointer.dragging = false; const now = performance.now();
        const f = pointer.samples[0], l = pointer.samples[pointer.samples.length - 1]; let v = 0;
        if (f && l && l.t > f.t && now - l.t < 70) v = -((l.x - f.x) / (l.t - f.t)) * 1000;
        vel = v; const landing = snapPoint(m, pos + v * 0.32); goal = landing;
        if (Math.abs(v) > 400 && Math.abs(landing - pos) < 1) step(m, v > 0 ? 1 : -1);
        mode = 'spring'; start(); return;
      }
      if (closeFocus()) return;
      const [x, y] = lp(e);
      const hit = instances.find(it => x >= it.x0 && x <= it.x1 && y >= it.y0 && y <= it.y1);
      if (!hit) return;
      if (hit.index === activeIndex && Math.abs(goal - pos) < 2) { o.onSelect && o.onSelect(hit.index, list[hit.index]); if (s.focusOnClick) openFocus(hit.index); }
      else { const rel = (hit.x0 + hit.x1) / 2 - width / 2; goal = snapPoint(m, pos + rel); mode = 'spring'; if (s.focusOnClick) focus.pending = hit.index; start(); }
    };
    const onLeave = () => { pointer.over = false; dirty = true; start(); };
    const onCancel = () => { pointer.down = false; pointer.dragging = false; container.style.cursor = 'grab'; goal = snapPoint(metrics(), pos); mode = 'spring'; start(); };
    const onWheel = e => {
      if (e.ctrlKey) return;
      let dx = e.deltaX, dy = e.deltaY;
      if (e.shiftKey && Math.abs(dx) < Math.abs(dy)) { dx = dy; dy = 0; }
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? height : 1;
      const horiz = Math.abs(dx) > Math.abs(dy);
      if (!horiz && !s.captureWheel) return;
      e.preventDefault(); skipIntro(); interactedAt = performance.now();
      if (closeFocus()) return;
      goal += Math.max(-120, Math.min(120, (horiz ? dx : dy) * unit)) * 1.25; mode = 'wheel'; wheelAt = performance.now(); start();
    };
    const onKey = e => {
      const m = metrics();
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); skipIntro(); closeFocus(); interactedAt = performance.now(); step(m, 1); }
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); skipIntro(); closeFocus(); interactedAt = performance.now(); step(m, -1); }
      else if (e.key === 'Home') { e.preventDefault(); closeFocus(); goTo(m, 0); }
      else if (e.key === 'End') { e.preventDefault(); closeFocus(); goTo(m, slots.length - 1); }
      else if (e.key === 'Escape') { if (closeFocus()) e.preventDefault(); }
      else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (closeFocus() || activeIndex < 0) return; o.onSelect && o.onSelect(activeIndex, list[activeIndex]); if (s.focusOnClick) openFocus(activeIndex); }
    };
    const onFocus = () => { hasFocus = true; }, onBlur = () => { hasFocus = false; };
    const onVis = () => { if (!document.hidden) start(); };
    container.addEventListener('pointerdown', onDown); container.addEventListener('pointermove', onMove); container.addEventListener('pointerup', onUp);
    container.addEventListener('pointerleave', onLeave); container.addEventListener('pointercancel', onCancel);
    if (s.wheel !== false) container.addEventListener('wheel', onWheel, { passive: false }); container.addEventListener('keydown', onKey);
    container.addEventListener('focus', onFocus); container.addEventListener('blur', onBlur); document.addEventListener('visibilitychange', onVis);
    const ro = new ResizeObserver(resize); ro.observe(container);
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; start(); }); io.observe(container);
    resize(); setItems(list);
    return {
      goTo: i => { const m = metrics(); goTo(m, i); },
      destroy() {
        alive = false; visible = false; cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
        container.removeEventListener('pointerdown', onDown); container.removeEventListener('pointermove', onMove); container.removeEventListener('pointerup', onUp);
        container.removeEventListener('pointerleave', onLeave); container.removeEventListener('pointercancel', onCancel);
        container.removeEventListener('wheel', onWheel); container.removeEventListener('keydown', onKey);
        container.removeEventListener('focus', onFocus); container.removeEventListener('blur', onBlur); document.removeEventListener('visibilitychange', onVis);
        slots.forEach(sl => sl.dispose()); slots = [];
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        canvas.remove(); cap.remove(); live.remove();
      }
    };
  }
  window.PBFlex = { flexCarousel };
})();
