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
  let stars = [], namePoints = [], portraitPoints = [], titleIndex = 0, nextTitle = 0;
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
  function samplePortrait() {
    if (!portrait.naturalWidth || !portraitWidth) return;
    const sample = document.createElement('canvas'); sample.width = Math.round(portraitWidth); sample.height = Math.round(portraitHeight);
    const ctx = sample.getContext('2d', { willReadFrequently: true });
    const stage = portraitCanvas.getBoundingClientRect(), rect = portrait.getBoundingClientRect();
    const scale = Math.min(rect.width / portrait.naturalWidth, rect.height / portrait.naturalHeight);
    const w = portrait.naturalWidth * scale, h = portrait.naturalHeight * scale;
    ctx.drawImage(portrait, rect.left - stage.left + (rect.width - w) / 2, rect.top - stage.top + rect.height - h, w, h);
    const data = ctx.getImageData(0, 0, sample.width, sample.height).data;
    portraitPoints = [];
    for (let y = 15; y < sample.height - 35; y += 5) for (let x = 0; x < sample.width; x += 5) {
      const i = (y * sample.width + x) * 4;
      if (data[i + 3] > 100 && data[i] + data[i + 1] + data[i + 2] > 90) portraitPoints.push({ x, y, r: data[i], g: data[i + 1], b: data[i + 2], seed: Math.random() * 10 });
    }
  }
  function resize() {
    const snowSize = configureCanvas(snow); width = snowSize.width; height = snowSize.height;
    const nameSize = configureCanvas(nameCanvas); nameWidth = nameSize.width; nameHeight = nameSize.height;
    const portraitSize = configureCanvas(portraitCanvas); portraitWidth = portraitSize.width; portraitHeight = portraitSize.height;
    stars = Array.from({ length: Math.round(width / 6.5) }, () => ({ x: Math.random() * width, y: Math.random() * height, r: .35 + Math.random() * 1.05, speed: .12 + Math.random() * .25, phase: Math.random() * Math.PI * 2, alpha: .25 + Math.random() * .55 }));
    sampleTitle(); samplePortrait();
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
    portraitContext.clearRect(0, 0, portraitWidth, portraitHeight);
    if (!reducedMotion.matches) for (const p of portraitPoints) {
      const distance = Math.hypot(p.x - pointer.x, p.y - pointer.y);
      const influence = Math.max(0, 1 - distance / 100);
      const sweep = Math.max(0, 1 - Math.abs(p.y - (elapsed * .04 % (portraitHeight + 180) - 90)) / 35);
      const force = influence * 25 + sweep * 6;
      if (force < 1) continue;
      portraitContext.fillStyle = `rgba(${p.r},${p.g},${p.b},${Math.min(.9, force / 25)})`;
      portraitContext.fillRect(p.x + Math.sin(p.seed + elapsed * .002) * force, p.y + Math.cos(p.seed + elapsed * .002) * force, 1.5, 1.5);
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
  portrait.addEventListener('load', samplePortrait);
  new IntersectionObserver(entries => { heroVisible = entries[0].isIntersecting; resume(); }, { threshold: 0 }).observe(hero);
  document.addEventListener('visibilitychange', resume);
  reducedMotion.addEventListener('change', () => { resize(); resume(); });
  let resizeTimer;
  window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(resize, 120); });
  document.fonts.ready.then(() => { initialized = true; resize(); nextTitle = 5000; resume(); });
})();
