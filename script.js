(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* theme */
  const root = document.documentElement, tbtn = $('#theme');
  const isDark = () => root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  const paintTheme = () => {
    const d = isDark();
    tbtn.setAttribute('aria-label', d ? 'Switch to light mode' : 'Switch to dark mode');
    $('meta[name=theme-color]').content = d ? '#0f1015' : '#f5f6f9';
  };
  tbtn.addEventListener('click', () => {
    root.dataset.theme = isDark() ? 'light' : 'dark';
    try { localStorage.setItem('atelier-theme', root.dataset.theme); } catch (e) {}
    paintTheme();
  });
  paintTheme();

  /* line-mask headings */
  $$('[data-split]').forEach(el => { el.innerHTML = `<span>${el.innerHTML}</span>`; });

  /* one observer for reveals */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .2 });
  $$('.reveal,[data-split]').forEach(el => io.observe(el));
  requestAnimationFrame(() => requestAnimationFrame(() => $('#hero').classList.add('in')));

  /* sections that scrub */
  const hero = $('#hero'), pan = $('.pan'), track = $('#panTrack'), vault = $('#vault'), nav = $('#nav');
  const pins = $$('.pins i'), vlist = $$('.v-list li');
  $$('.bolts i').forEach((b, i) => b.style.setProperty('--k', i));

  const progress = el => {
    const r = el.getBoundingClientRect();
    return clamp(-r.top / (r.height - innerHeight));
  };
  const sizePan = () => {
    const max = Math.max(0, track.scrollWidth - innerWidth);
    pan.style.setProperty('--max', max + 'px');
    pan.style.height = reduce ? 'auto' : (innerHeight + max) + 'px';
  };
  sizePan();
  addEventListener('resize', sizePan);
  addEventListener('load', sizePan);

  let ticking = false;
  const update = () => {
    ticking = false;
    nav.classList.toggle('stuck', scrollY > 20);
    if (reduce) return;
    hero.style.setProperty('--p', progress(hero).toFixed(4));
    pan.style.setProperty('--p', progress(pan).toFixed(4));

    const vp = progress(vault);
    const open = clamp((vp - .56) / .26);
    vault.style.setProperty('--p', (clamp(vp / .56) ).toFixed(4));
    vault.style.setProperty('--open', open.toFixed(4));
    pins.forEach((p, i) => p.classList.toggle('lit', vp > .15 + i * .14));
    vlist.forEach(li => li.classList.toggle('on', vp > +li.dataset.at));

    const vr = vault.getBoundingClientRect(), gr = $('#download').getBoundingClientRect();
    nav.classList.toggle('dark', (vr.top < 40 && vr.bottom > 40) || (gr.top < 40));
  };
  const queue = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  addEventListener('scroll', queue, { passive: true });
  addEventListener('resize', queue);
  update();

  /* pointer depth for hero (fine pointers only) */
  if (!reduce && matchMedia('(pointer:fine)').matches) {
    let tx = 0, ty = 0, cx = 0, cy = 0, run = false;
    addEventListener('pointermove', e => {
      tx = e.clientX / innerWidth * 2 - 1; ty = e.clientY / innerHeight * 2 - 1;
      if (!run) { run = true; requestAnimationFrame(loop); }
    });
    const loop = () => {
      cx += (tx - cx) * .08; cy += (ty - cy) * .08;
      hero.style.setProperty('--mx', cx.toFixed(3)); hero.style.setProperty('--my', cy.toFixed(3));
      if (Math.abs(tx - cx) + Math.abs(ty - cy) > .002) requestAnimationFrame(loop); else run = false;
    };
  }

  /* app explorer */
  const bar = (c = '') => `<span class="bar ${c}"></span>`;
  const apps = [
    { n: 'Documents', k: 'Alt+1', c: '#5b6bff', d: 'Write reports, letters and essays in a full word processor. Saves as .docx, so anyone can open it.',
      m: `<div class="m-page">${bar('t')}${bar()}${bar()}${bar('h')}${bar()}${bar('s')}${bar()}${bar()}${bar('s')}</div>` },
    { n: 'Presentation', k: 'Alt+2', c: '#ffc455', d: 'Describe a deck and get one that is designed: a colour theme, and a layout for every slide. Every slide is real, editable PowerPoint content.',
      m: `<div class="m-slides"><div class="rail"><i></i><i></i><i></i><i></i></div><div class="big">Q3 in four numbers</div></div>` },
    { n: 'Spreadsheet', k: 'Alt+3', c: '#2dd4bf', d: 'Workbooks with formulas and charts. Ask the assistant to write cells and formulas, and undo any change.',
      m: `<div class="m-grid" style="grid-template-columns:repeat(6,1fr);grid-auto-rows:1fr;inset:clamp(16px,3vw,36px)">${Array.from({ length: 42 }, (_, i) => `<i class="${i < 6 ? 'hd' : (i === 15 || i === 28 || i === 22) ? 'on' : ''}"></i>`).join('')}</div>` },
    { n: 'PDF Editor', k: 'Alt+4', c: '#ff6b9d', d: 'Read, mark up and edit PDFs, with text recognition for scans. Add one to the assistant and ask it questions.',
      m: `<div class="m-page">${bar('t')}${bar()}${bar('h')}${bar('h')}${bar()}${bar('s')}${bar()}${bar('h')}${bar('s')}</div>` }
  ];
  const list = $('#appList'), mock = $('#mock');
  const show = i => {
    const a = apps[i];
    mock.style.setProperty('--c', a.c);
    mock.innerHTML = a.m;
    $('#appName').textContent = a.n;
    $('#appDesc').textContent = a.d;
    $$('.app-btn', list).forEach((b, j) => b.setAttribute('aria-selected', j === i));
  };
  apps.forEach((a, i) => {
    const li = document.createElement('li');
    li.innerHTML = `<button class="app-btn" role="tab" style="--c:${a.c}"><i></i>${a.n}<small>${a.k}</small></button>`;
    const b = li.firstChild;
    b.addEventListener('mouseenter', () => matchMedia('(hover:hover)').matches && show(i));
    b.addEventListener('focus', () => show(i));
    b.addEventListener('click', () => show(i));
    list.appendChild(li);
  });
  show(0);

  /* assistant chips */
  const chips = $$('.chip-btn');
  chips.forEach(c => c.addEventListener('click', () => {
    const on = c.classList.toggle('on');
    c.setAttribute('aria-pressed', on);
    const n = chips.filter(x => x.classList.contains('on')).length;
    $('#readCount').textContent = `${n} of ${chips.length}`;
    $('.think').textContent = `Reading ${n} file${n === 1 ? '' : 's'}`;
  }));
  $('#mkFile').addEventListener('click', e => {
    const card = e.target.closest('.fcard');
    card.classList.add('done');
    e.target.textContent = 'Created';
  });
})();
