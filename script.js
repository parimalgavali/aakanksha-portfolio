(() => {
  document.documentElement.classList.add('js');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const header = document.querySelector('.nav-shell');
  const menu = document.querySelector('.menu-toggle');
  const links = document.querySelector('#nav-links');
  const closeMenu = () => { menu.setAttribute('aria-expanded', 'false'); links.classList.remove('open'); };
  menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation'); links.classList.toggle('open', open); });
  links.addEventListener('click', closeMenu);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  document.addEventListener('click', e => { if (!header.contains(e.target)) closeMenu(); });
  const onScroll = () => header.classList.toggle('scrolled', scrollY > 100);
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  document.querySelector('#year').textContent = new Date().getFullYear();
  const reveals = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); reveals.unobserve(entry.target); } }), { threshold: .08 });
  document.querySelectorAll('.reveal').forEach((e, i) => { e.style.transitionDelay = `${Math.min(i % 4 * 55, 165)}ms`; reveals.observe(e); });
  const navObserver = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) document.querySelectorAll('#nav-links a').forEach(a => { const active = a.hash === `#${entry.target.id}`; a.classList.toggle('active', active); if (active) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current'); }); }), { rootMargin: '-15% 0px -60% 0px' });
  document.querySelectorAll('main section[id]').forEach(e => navObserver.observe(e));
  document.querySelectorAll('.spotlight').forEach(card => card.addEventListener('pointermove', e => { const r = card.getBoundingClientRect(); card.style.setProperty('--mx', `${e.clientX - r.left}px`); card.style.setProperty('--my', `${e.clientY - r.top}px`); }));

  // Draggable tools are constrained to their tray; keyboard users get the same control.
  document.querySelectorAll('.tool').forEach(tool => {
    tool.setAttribute('aria-describedby', 'tool-instructions');
    let x = 0, y = 0, startX = 0, startY = 0, dragging = false;
    const apply = (nextX, nextY) => {
      const tray = tool.parentElement.getBoundingClientRect(), r = tool.getBoundingClientRect();
      const baseX = r.left - tray.left - x, baseY = r.top - tray.top - y;
      x = Math.max(-baseX + 4, Math.min(tray.width - baseX - r.width - 4, nextX));
      y = Math.max(-baseY + 65, Math.min(tray.height - baseY - r.height - 4, nextY));
      tool.style.transform = `translate(${x}px, ${y}px) rotate(${x * .025}deg)`;
    };
    tool.addEventListener('pointerdown', e => { dragging = true; tool.setPointerCapture(e.pointerId); startX = e.clientX - x; startY = e.clientY - y; tool.style.zIndex = '10'; });
    tool.addEventListener('pointermove', e => { if (dragging) apply(e.clientX - startX, e.clientY - startY); });
    const stop = () => { dragging = false; tool.style.zIndex = ''; };
    tool.addEventListener('pointerup', stop); tool.addEventListener('pointercancel', stop);
    tool.addEventListener('keydown', e => { const step = e.shiftKey ? 25 : 10; const directions = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }; if (directions[e.key]) { e.preventDefault(); const [dx, dy] = directions[e.key]; apply(x + dx, y + dy); } else if (e.key === 'Home') { e.preventDefault(); x = 0; y = 0; tool.style.transform = ''; } });
  });

  const hero = document.querySelector('.hero');
  const snow = document.querySelector('#snow');
  const snowContext = snow.getContext('2d');
  const nameCanvas = document.querySelector('#name-particles');
  const nameContext = nameCanvas.getContext('2d');
  const portraitCanvas = document.querySelector('#portrait-particles');
  const portraitContext = portraitCanvas.getContext('2d');
  const portrait = document.querySelector('#portrait');
  let width = 0, height = 0, nameWidth = 0, nameHeight = 0, portraitWidth = 0, portraitHeight = 0;
  let stars = [], namePoints = [], titleIndex = 0, nextTitle = 0;
  let orbitX = 0, orbitY = 0, orbitMode = 0, orbitBurst = 0;
  const stage = portraitCanvas.parentElement;
  const remix = document.querySelector(".orbit-remix");
  remix.addEventListener("click", () => { orbitMode = (orbitMode + 1) % 3; orbitBurst = 1; stage.dataset.orbit = orbitMode; if (reducedMotion.matches) draw(0); });
  let pointer = { x: -1000, y: -1000 }, heroVisible = true, frame = 0, lastTime = 0, elapsed = 0, initialized = false;
  const titles = ['Aakanksha', 'UI/UX Designer'];
  const configureCanvas = canvas => {
    const rect = canvas.getBoundingClientRect(), scale = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * scale); canvas.height = Math.round(rect.height * scale);
    canvas.getContext('2d').setTransform(scale, 0, 0, scale, 0, 0);
    return { width: rect.width, height: rect.height };
  };
  function sampleTitle() {
    if (!nameWidth) return;
    const sample = document.createElement('canvas'); sample.width = Math.ceil(nameWidth); sample.height = Math.ceil(nameHeight);
    const ctx = sample.getContext('2d', { willReadFrequently: true });
    const title = titles[titleIndex]; let fontSize = nameWidth < 300 ? 28 : 46;
    ctx.font = `500 ${fontSize}px Poppins, sans-serif`;
    while (ctx.measureText(title).width > nameWidth - 6) { fontSize--; ctx.font = `500 ${fontSize}px Poppins, sans-serif`; }
    ctx.fillStyle = '#fff'; ctx.textBaseline = 'middle'; ctx.fillText(title, 1, nameHeight / 2);
    const data = ctx.getImageData(0, 0, sample.width, sample.height).data;
    namePoints = [];
    for (let y = 0; y < sample.height; y += 2) for (let x = 0; x < sample.width; x += 2) if (data[(y * sample.width + x) * 4 + 3] > 90) namePoints.push({ tx: x, ty: y, x: Math.random() * nameWidth, y: Math.random() * nameHeight, seed: Math.random() * 10 });
    nameCanvas.parentElement.classList.add('ready');
  }
  function resize() {
    pointer = { x: -1000, y: -1000 };
    const snowSize = configureCanvas(snow); width = snowSize.width; height = snowSize.height;
    const nameSize = configureCanvas(nameCanvas); nameWidth = nameSize.width; nameHeight = nameSize.height;
    const portraitSize = configureCanvas(portraitCanvas); portraitWidth = portraitSize.width; portraitHeight = portraitSize.height;
    stars = Array.from({ length: Math.round(width / 6.5) }, () => ({ x: Math.random() * width, y: Math.random() * height, r: .35 + Math.random() * 1.05, speed: .12 + Math.random() * .25, phase: Math.random() * Math.PI * 2, alpha: .25 + Math.random() * .55 }));
    sampleTitle();
    if (reducedMotion.matches) draw(0);
  }
  function draw(dt) {
    snowContext.clearRect(0, 0, width, height);
    for (const star of stars) {
      if (!reducedMotion.matches) { star.y += star.speed * dt; star.x += Math.sin(elapsed * .0003 + star.phase) * .07 * dt; if (star.y > height + 4) { star.y = -4; star.x = Math.random() * width; } }
      snowContext.beginPath(); snowContext.fillStyle = `rgba(225,231,255,${star.alpha * (.75 + .25 * Math.sin(elapsed * .0008 + star.phase))})`; snowContext.arc(star.x, star.y, star.r, 0, Math.PI * 2); snowContext.fill();
    }
    nameContext.clearRect(0, 0, nameWidth, nameHeight);
    const dissolve = !reducedMotion.matches && elapsed > nextTitle - 650 ? Math.min(1, (elapsed - nextTitle + 650) / 650) : 0;
    for (const p of namePoints) {
      const tx = p.tx + Math.sin(p.seed + elapsed * .002) * dissolve * 45, ty = p.ty + Math.cos(p.seed + elapsed * .002) * dissolve * 35;
      p.x += (tx - p.x) * .09 * dt; p.y += (ty - p.y) * .09 * dt;
      nameContext.fillStyle = `rgba(230,164,241,${.9 - dissolve * .6})`; nameContext.fillRect(p.x, p.y, 1.35, 1.35);
    }
    drawConstellation(dt);
  }
  function drawConstellation(dt) {
    const ctx = portraitContext, w = portraitWidth, h = portraitHeight;
    ctx.clearRect(0, 0, w, h);
    const active = pointer.x > -500;
    const targetX = active ? (pointer.x / w - .5) : 0;
    const targetY = active ? (pointer.y / h - .5) : 0;
    orbitX += (targetX - orbitX) * .045 * dt;
    orbitY += (targetY - orbitY) * .045 * dt;
    orbitBurst *= Math.pow(.975, dt);
    stage.style.setProperty('--orbit-x', `${orbitX * 22}px`);
    stage.style.setProperty('--orbit-y', `${orbitY * 16}px`);
    const palettes = [[191, 127, 255], [92, 220, 212], [248, 157, 181]];
    const color = palettes[orbitMode], rgb = color.join(',');
    const t = reducedMotion.matches ? .5 : elapsed * .00015;
    const cx = w / 2 + orbitX * 25, cy = h * .47 + orbitY * 18;
    const radius = Math.min(w * .405, 330) * (1 + orbitBurst * .08);
    const project = (angle, lane) => {
      const twist = -.45 + lane * .42 + Math.sin(t * .3 + lane) * .1 + orbitX * .18;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * (75 + lane * 16 + orbitY * 32);
      return { x: cx + x * Math.cos(twist) - y * Math.sin(twist), y: cy + x * Math.sin(twist) + y * Math.cos(twist), z: Math.sin(angle) };
    };
    // Fine luminous filaments form a changing spatial drawing behind the portrait.
    for (let lane = 0; lane < 3; lane++) {
      for (let strand = 0; strand < 7; strand++) {
        ctx.beginPath();
        for (let i = 0; i <= 160; i++) {
          const a = i / 160 * Math.PI * 2;
          const p = project(a + t * (lane % 2 ? -.3 : .25), lane);
          const ripple = Math.sin(a * 5 + t * 4 + strand * .3) * (2 + orbitBurst * 18);
          const x = p.x + Math.cos(a) * (strand * 1.5 + ripple);
          const y = p.y + Math.sin(a) * (strand * 1.5 + ripple);
          if (!i) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(${rgb},${.035 + strand * .009})`;
        ctx.lineWidth = strand === 3 ? 1 : .55; ctx.stroke();
      }
      // Small moving lights follow each filament rather than falling mechanically.
      for (let i = 0; i < 45; i++) {
        const a = i / 45 * Math.PI * 2 + t * (.6 + lane * .15) * (lane % 2 ? -1 : 1);
        const p = project(a, lane);
        const pulse = .3 + .7 * Math.pow(Math.sin(a * 2 + t + lane), 4);
        const r = (i % 9 === 0 ? 2 : .7) * (1 + orbitBurst);
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 5);
        glow.addColorStop(0, `rgba(244,226,255,${pulse})`);
        glow.addColorStop(.2, `rgba(${rgb},${pulse * .5})`); glow.addColorStop(1, `rgba(${rgb},0)`);
        ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(p.x, p.y, r * 5, 0, Math.PI * 2); ctx.fill();
      }
    }
    // An elastic constellation reaches toward the pointer at the outer edges.
    if (active && !reducedMotion.matches) {
      const gradient = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 100);
      gradient.addColorStop(0, `rgba(${rgb},.08)`); gradient.addColorStop(1, `rgba(${rgb},0)`);
      ctx.fillStyle = gradient; ctx.fillRect(pointer.x - 100, pointer.y - 100, 200, 200);
      for (let i = 0; i < 15; i++) {
        const p = project(i / 15 * Math.PI * 2 + t, i % 3);
        const d = Math.hypot(p.x - pointer.x, p.y - pointer.y);
        if (d < 160) { ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.quadraticCurveTo(p.x, pointer.y, pointer.x, pointer.y); ctx.strokeStyle = `rgba(${rgb},${(1 - d / 160) * .3})`; ctx.lineWidth = .6; ctx.stroke(); }
      }
    }
  }

  function animate(time) {
    frame = 0;
    if (document.hidden || !heroVisible || reducedMotion.matches) { lastTime = 0; return; }
    const dt = Math.min((time - (lastTime || time - 16.7)) / 16.7, 2); lastTime = time; elapsed += dt * 16.7;
    if (elapsed > nextTitle) { titleIndex = (titleIndex + 1) % titles.length; sampleTitle(); nextTitle = elapsed + 5000; }
    draw(dt); frame = requestAnimationFrame(animate);
  }
  function resume() { if (initialized && !frame && heroVisible && !document.hidden && !reducedMotion.matches) frame = requestAnimationFrame(animate); }
  portraitCanvas.parentElement.addEventListener('pointermove', e => { const r = portraitCanvas.getBoundingClientRect(); pointer = { x: e.clientX - r.left, y: e.clientY - r.top }; });
  portraitCanvas.parentElement.addEventListener('pointerleave', () => { pointer = { x: -1000, y: -1000 }; });

  new IntersectionObserver(entries => { heroVisible = entries[0].isIntersecting; resume(); }, { threshold: 0 }).observe(hero);
  document.addEventListener('visibilitychange', resume);
  reducedMotion.addEventListener('change', () => { resize(); resume(); });
  let resizeTimer;
  window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(resize, 120); });
  document.fonts.ready.then(() => { initialized = true; resize(); nextTitle = 5000; resume(); });
})();
