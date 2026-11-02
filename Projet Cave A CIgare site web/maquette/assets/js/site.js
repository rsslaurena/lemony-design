/* Maison Lemony — comportements de la maquette (sans dépendance) */
(() => {
  const D = window.LEMONY;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const store = {
    get(k) { try { return JSON.parse(sessionStorage.getItem(k)); } catch { return null; } },
    set(k, v) { try { sessionStorage.setItem(k, JSON.stringify(v)); } catch { /* navigation privée */ } },
  };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const slug = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  /* En-tête : filet au défilement */
  const header = $('.site-header');
  const onScroll = () => header && header.classList.toggle('is-scrolled', scrollY > 8);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* Menu mobile */
  const menuBtn = $('.menu-btn');
  if (menuBtn) {
    const setMenu = open => {
      document.body.classList.toggle('menu-open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    };
    menuBtn.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
    addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
    $$('.mobile-menu a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  }

  /* Apparitions, cotes qui se tracent, lent zoom des photos */
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }) : null;
  const watch = el => io ? io.observe(el) : el.classList.add('is-in');
  $$('[data-reveal], .cote[data-draw], .photo.slow').forEach(watch);

  /* Index des collections : la photo suit la ligne survolée */
  $$('[data-peek]').forEach(list => {
    const peek = list.parentElement.querySelector('.index-peek');
    if (!peek || matchMedia('(max-width: 760px)').matches) return;
    const pimg = $('img', peek);
    list.parentElement.style.position = 'relative';
    $$('a', list).forEach(a => {
      const show = () => {
        if (pimg.getAttribute('src') !== a.dataset.peekSrc) pimg.src = a.dataset.peekSrc;
        const y = a.parentElement.offsetTop + a.offsetHeight / 2 - peek.offsetHeight / 2;
        peek.style.setProperty('--peek-y', `${Math.max(-40, y)}px`);
        list.classList.add('is-peeking');
      };
      a.addEventListener('mouseenter', show); a.addEventListener('focus', show);
      a.addEventListener('mouseleave', () => list.classList.remove('is-peeking'));
      a.addEventListener('blur', () => list.classList.remove('is-peeking'));
    });
  });

  /* Sommaire des pages de service */
  const tocLinks = $$('.toc a');
  if (tocLinks.length && io) {
    const tio = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) tocLinks.forEach(a => a.classList.toggle('is-active', a.hash === '#' + e.target.id));
    }), { rootMargin: '-30% 0px -60% 0px' });
    tocLinks.forEach(a => { const s = $(a.hash); if (s) tio.observe(s); });
  }

  /* ---------------------------------------------------------------- Composer ma cave */
  const form = $('#composer');
  if (form && D) {
    const panels = $$('.step-panel', form);
    const stepBtns = $$('.stepper button', form);
    const prev = $('[data-prev]', form), next = $('[data-next]', form);
    const KEYS = ['taille', 'cuir', 'coloris', 'bois', 'metal', 'gravure'];
    const params = new URLSearchParams(location.search);
    let state = Object.assign({ taille: '', cuir: '', coloris: '', bois: '', metal: '', gravure: '' }, store.get('lemony-compo') || {});
    if (params.get('collection') && D.collections[params.get('collection')]) {
      const c = params.get('collection') === 'editions' ? 'prestige' : params.get('collection');
      state.cuir = D.collections[c].cuirs[0]; state.coloris = '';
    }
    if (params.get('cuir') && D.cuirs[params.get('cuir')]) { state.cuir = params.get('cuir'); state.coloris = ''; }
    let current = 0, reached = 0;

    const colorisOf = cuir => {
      const c = D.cuirs[cuir]; if (!c) return [];
      return c.coloris.map(x => ({ ...x, id: slug(x.n), sub: '' })).concat((c.editions || []).map(x => ({ ...x, id: 'edition-' + slug(x.n), sub: 'Édition numérotée' })));
    };
    if (params.get('coloris') && state.cuir) {
      const wanted = params.get('coloris');
      const hit = colorisOf(state.cuir).find(x => x.id === wanted || x.id === 'edition-' + wanted);
      if (hit) state.coloris = hit.id;
    }

    const renderColoris = () => {
      const box = $('[data-coloris]', form), intro = $('[data-coloris-intro]', form);
      if (!state.cuir) { box.innerHTML = ''; intro.textContent = 'Choisissez d\'abord un cuir.'; return; }
      const cu = D.cuirs[state.cuir];
      intro.textContent = `${cu.name}, collection ${D.collections[cu.collection].name}. Chaque teinte est montrée à Sam sur une vraie peau avant fabrication.`;
      box.innerHTML = colorisOf(state.cuir).map(x => `<label class="choice"><input type="radio" name="coloris" value="${x.id}"${state.coloris === x.id ? ' checked' : ''}><span class="chip" style="--c:${x.h}"></span><span><b>${esc(x.n)}</b>${x.sub ? `<small>${x.sub}</small>` : ''}</span><span class="tick" aria-hidden="true"></span></label>`).join('');
    };

    const label = {
      taille: v => { const t = D.tailles.find(x => x.id === v); return t && `${t.name}<span class="sub">Ext. ${t.ext} · int. ${t.int}</span><div class="cote" data-draw><span>${t.ext.split(' × ')[0]}</span><i></i></div>`; },
      cuir: v => { const c = D.cuirs[v]; return c && `${c.name}<span class="sub">Collection ${D.collections[c.collection].name}</span>`; },
      coloris: v => { const x = colorisOf(state.cuir).find(c => c.id === v); return x && `${esc(x.n)}<span class="sub">${x.sub || D.cuirs[state.cuir].name}</span>`; },
      bois: v => { const b = D.bois.find(x => x.id === v); return b && `${b.name}<span class="sub">Intérieur sipo</span>`; },
      metal: v => { const m = D.metaux.find(x => x.id === v); return m && `${m.name}<span class="sub">Charnières, serrure, deux clés</span>`; },
      gravure: v => v && `« ${esc(v)} »<span class="sub">+ numéro de pièce</span>`,
    };
    const paint = (key, fresh) => {
      const row = $(`[data-row="${key}"]`); if (!row) return;
      const html = state[key] && label[key](state[key]);
      $('dd', row).innerHTML = html || (key === 'gravure' && reached > 5 ? '<span class="sub" style="margin:0">Numéro de pièce seulement</span>' : '<span class="empty">—</span>');
      if (fresh && html) {
        row.classList.remove('just-set'); void row.offsetWidth; row.classList.add('just-set');
        $$('.cote[data-draw]', row).forEach(c => requestAnimationFrame(() => requestAnimationFrame(() => c.classList.add('is-in'))));
      } else $$('.cote[data-draw]', row).forEach(c => c.classList.add('is-in'));
    };
    const save = () => store.set('lemony-compo', state);
    const done = i => i === 5 ? true : !!state[KEYS[i]];

    const show = (i, focus = true) => {
      current = i; reached = Math.max(reached, i);
      panels.forEach((p, n) => p.hidden = n !== i);
      stepBtns.forEach((b, n) => {
        b.disabled = n > reached;
        b.classList.toggle('is-done', n < 6 && n !== i && done(n) && n <= reached);
        if (n === i) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
      });
      prev.style.visibility = i === 0 ? 'hidden' : 'visible';
      next.hidden = i === panels.length - 1;
      next.disabled = !done(i);
      paint('gravure');
      if (focus) {
        const h = $('h2', panels[i]); h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true });
        const top = form.getBoundingClientRect().top + scrollY - 110;
        if (scrollY > top) scrollTo({ top, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      }
    };

    form.addEventListener('change', e => {
      const { name, value } = e.target; if (!KEYS.includes(name)) return;
      state[name] = value;
      if (name === 'cuir') { state.coloris = ''; renderColoris(); paint('coloris'); }
      paint(name, true); save(); next.disabled = !done(current);
    });
    const grav = $('input[name="gravure"]', form), counter = $('[data-counter]', form);
    grav.value = state.gravure || '';
    const count = () => { counter.textContent = `${grav.value.length} / 40`; };
    grav.addEventListener('input', () => { state.gravure = grav.value.trim(); count(); paint('gravure', true); save(); });
    count();

    next.addEventListener('click', () => { if (done(current)) show(Math.min(current + 1, panels.length - 1)); });
    prev.addEventListener('click', () => show(Math.max(current - 1, 0)));
    stepBtns.forEach((b, n) => b.addEventListener('click', () => { if (n <= reached) show(n); }));
    $('[data-print]', form).addEventListener('click', () => print());

    form.addEventListener('submit', e => {
      e.preventDefault();
      const missing = [0, 1, 2, 3, 4].filter(i => !done(i));
      const out = $('[data-missing]', form);
      if (missing.length) {
        out.hidden = false; out.style.color = 'var(--danger)';
        out.textContent = `Il manque encore : ${missing.map(i => ['la taille', 'le cuir', 'le coloris', 'le bois', 'le métal'][i]).join(', ')}.`;
        return;
      }
      save(); location.href = 'rendez-vous.html?from=composer';
    });

    // État initial : cocher ce qui est déjà connu
    KEYS.slice(0, 5).forEach(k => { const r = form.querySelector(`input[name="${k}"][value="${state[k]}"]`); if (r) r.checked = true; });
    renderColoris();
    KEYS.forEach(k => paint(k));
    const firstOpen = [0, 1, 2, 3, 4].find(i => !done(i));
    reached = firstOpen === undefined ? 5 : firstOpen;
    show(firstOpen === undefined ? 0 : firstOpen, false);
  }

  /* Résumé lisible d'une composition */
  const compoLines = c => {
    if (!c || !D) return [];
    const t = D.tailles.find(x => x.id === c.taille), cu = D.cuirs[c.cuir];
    const col = cu && [...cu.coloris.map(x => ({ id: slug(x.n), n: x.n })), ...(cu.editions || []).map(x => ({ id: 'edition-' + slug(x.n), n: x.n + ' (édition)' }))].find(x => x.id === c.coloris);
    const b = D.bois.find(x => x.id === c.bois), m = D.metaux.find(x => x.id === c.metal);
    return [
      t && `Format : ${t.name} (${t.ext})`,
      cu && `Cuir : ${cu.name}, collection ${D.collections[cu.collection].name}${col ? `, coloris ${col.n}` : ''}`,
      b && `Bois : ${b.name}`,
      m && `Métal : ${m.name}`,
      c.gravure && `Gravure : « ${c.gravure} »`,
    ].filter(Boolean);
  };

  /* ---------------------------------------------------------------- Rendez-vous */
  const rdv = $('#rdv');
  if (rdv && D) {
    const params = new URLSearchParams(location.search);
    const box = $('[data-context]', rdv), area = $('textarea[name="projet"]', rdv);
    const coll = params.get('collection');
    const compo = params.get('from') === 'composer' ? store.get('lemony-compo') : null;
    let context = '';
    if (compo && compoLines(compo).length) {
      const lines = compoLines(compo);
      box.innerHTML = `<p class="mono">Votre composition</p><p>${lines.map(esc).join('<br>')}</p><a class="link-atelier" href="composer.html" style="align-self:start">Modifier</a>`;
      area.value = `Bonjour Sam,\n\nVoici la cave que j'ai composée sur le site :\n${lines.map(l => '— ' + l).join('\n')}\n\nJ'aimerais en parler avec vous. La cave serait pour `;
      context = lines.join(' · ');
    } else if (coll && D.messages[coll]) {
      const isEd = coll === 'editions';
      const c = D.collections[isEd ? 'prestige' : coll];
      box.innerHTML = `<p class="mono">${isEd ? 'Les éditions' : 'Collection ' + esc(c.name)}</p><p>${isEd ? 'Black, Carbone, Polar White, Shadow Blue · alligator' : esc(c.line)}</p><a class="link-atelier" href="composer.html?collection=${isEd ? 'prestige' : coll}" style="align-self:start">Composer dans cette collection</a>`;
      area.value = D.messages[coll];
      context = isEd ? 'Les éditions' : 'Collection ' + c.name;
    }
    if (context) { box.hidden = false; $('[data-hint]', rdv).textContent = 'Message préparé selon votre choix : complétez-le ou réécrivez-le librement.'; }

    const check = f => {
      const input = $('input', f); if (!input) return true;
      const v = input.value.trim();
      const ok = input.name === 'contact' ? /@.+\..+|[0-9][0-9 .+()-]{7,}/.test(v) : v.length > 1;
      f.classList.toggle('has-error', !ok); input.setAttribute('aria-invalid', String(!ok));
      return ok;
    };
    const fields = $$('.field', rdv).filter(f => $('input[required]', f));
    fields.forEach(f => $('input', f).addEventListener('blur', () => { if ($('input', f).value) check(f); }));
    rdv.addEventListener('submit', e => {
      e.preventDefault();
      const okFields = fields.map(check).every(Boolean);
      const consent = $('input[name="consent"]', rdv), cErr = $('[data-consent-err]', rdv);
      cErr.hidden = consent.checked;
      if (!okFields || !consent.checked) { const first = $('.has-error input', rdv) || (!consent.checked && consent); first && first.focus(); return; }
      const fd = new FormData(rdv);
      store.set('lemony-sent', { nom: fd.get('nom'), contact: fd.get('contact'), pays: fd.get('pays'), projet: fd.get('projet'), context });
      location.href = 'merci.html';
    });
  }

  /* ---------------------------------------------------------------- Merci */
  const sentBox = $('[data-sent]');
  if (sentBox) {
    const s = store.get('lemony-sent');
    if (s) {
      $('[data-who]').textContent = `à ${s.contact}`;
      const excerpt = (s.projet || '').split('\n').filter(Boolean).slice(1, 6).join(' ');
      sentBox.innerHTML = `<p class="mono">Ce que vous avez envoyé</p><p>${esc(s.nom)} · ${esc(s.pays)}${s.context ? `<br>${esc(s.context)}` : ''}${excerpt ? `<br><span class="muted">${esc(excerpt.slice(0, 220))}${excerpt.length > 220 ? '…' : ''}</span>` : ''}</p>`;
      sentBox.hidden = false;
    }
  }
})();

/* Mode capture (?capture) : toutes les images chargées et toutes les apparitions jouées, pour les relectures */
if (/[?&]capture\b/.test(location.search)) {
  document.querySelectorAll('img[loading="lazy"]').forEach(i => { i.loading = 'eager'; });
  document.querySelectorAll('[data-reveal], .cote[data-draw], .photo.slow').forEach(e => e.classList.add('is-in'));
}
