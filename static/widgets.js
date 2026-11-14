// Accessibility menu + cookie notice. No third-party code; choices are kept in localStorage.
(function () {
  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* private mode */ } },
  };
  const root = document.documentElement;

  /* ---------------- Accessibility ---------------- */
  const A11Y_KEY = 'odem-a11y';
  const toggles = [
    ['contrast', 'ניגודיות גבוהה'],
    ['grayscale', 'גווני אפור'],
    ['links', 'הדגשת קישורים'],
    ['readable', 'גופן קריא'],
    ['noanim', 'עצירת אנימציות'],
    ['cursor', 'סמן גדול'],
  ];
  const state = Object.assign({ text: 0 }, store.get(A11Y_KEY) || {});

  function apply() {
    root.classList.remove('a11y-text-1', 'a11y-text-2', 'a11y-text-3');
    if (state.text > 0) root.classList.add('a11y-text-' + state.text);
    toggles.forEach(([k]) => root.classList.toggle('a11y-' + k, !!state[k]));
    document.querySelectorAll('[data-a11y]').forEach((b) => b.setAttribute('aria-pressed', !!state[b.dataset.a11y]));
    const lvl = document.getElementById('a11y-text-level');
    if (lvl) lvl.textContent = ['100%', '115%', '130%', '150%'][state.text];
    store.set(A11Y_KEY, state);
  }

  const icon = '<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true" fill="currentColor"><circle cx="12" cy="4" r="2"/><path d="M19 8.5c-2.3.6-4.6.9-7 .9s-4.7-.3-7-.9l-.5 1.9c1.9.5 3.8.8 5.8.9V14l-2.1 6.6 1.9.6L12 15.7l1.9 5.4 1.9-.6-2.1-6.6v-2.7c2-.1 3.9-.4 5.8-.9L19 8.5z"/></svg>';

  const wrap = document.createElement('div');
  wrap.id = 'a11y-root';
  wrap.innerHTML = `
    <button type="button" class="a11y-fab" aria-label="תפריט נגישות" aria-expanded="false" aria-controls="a11y-panel">${icon}</button>
    <div class="a11y-panel" id="a11y-panel" role="dialog" aria-label="תפריט נגישות" hidden>
      <div class="a11y-head"><strong>נגישות</strong><button type="button" class="a11y-close" aria-label="סגירה">&times;</button></div>
      <div class="a11y-row">
        <span>גודל טקסט</span>
        <div class="a11y-size">
          <button type="button" data-text="-1" aria-label="הקטנת טקסט">A-</button>
          <span id="a11y-text-level" aria-live="polite">100%</span>
          <button type="button" data-text="1" aria-label="הגדלת טקסט">A+</button>
        </div>
      </div>
      <div class="a11y-grid">
        ${toggles.map(([k, l]) => `<button type="button" class="a11y-opt" data-a11y="${k}" aria-pressed="false">${l}</button>`).join('')}
      </div>
      <div class="a11y-foot">
        <button type="button" class="a11y-reset">איפוס</button>
        <a href="/accessibility/">הצהרת נגישות</a>
      </div>
    </div>`;
  document.body.appendChild(wrap);

  const fab = wrap.querySelector('.a11y-fab');
  const panel = wrap.querySelector('.a11y-panel');
  const open = (v) => {
    panel.hidden = !v;
    fab.setAttribute('aria-expanded', v);
    if (v) panel.querySelector('button').focus();
  };
  fab.addEventListener('click', () => open(panel.hidden));
  wrap.querySelector('.a11y-close').addEventListener('click', () => { open(false); fab.focus(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !panel.hidden) { open(false); fab.focus(); } });
  wrap.querySelectorAll('[data-text]').forEach((b) =>
    b.addEventListener('click', () => {
      state.text = Math.max(0, Math.min(3, state.text + Number(b.dataset.text)));
      apply();
    })
  );
  wrap.querySelectorAll('[data-a11y]').forEach((b) =>
    b.addEventListener('click', () => { state[b.dataset.a11y] = !state[b.dataset.a11y]; apply(); })
  );
  wrap.querySelector('.a11y-reset').addEventListener('click', () => {
    Object.keys(state).forEach((k) => delete state[k]);
    state.text = 0;
    apply();
  });
  apply();

  /* ---------------- Cookie notice ---------------- */
  const CONSENT_KEY = 'odem-consent';
  // Read by any future analytics script: only load it when window.odemConsent.analytics === true.
  window.odemConsent = store.get(CONSENT_KEY);

  const bar = document.createElement('div');
  bar.id = 'cookie-banner';
  bar.setAttribute('role', 'region');
  bar.setAttribute('aria-label', 'הודעת עוגיות');
  bar.innerHTML = `
    <p>האתר משתמש רק באחסון חיוני: שמירת הבחירות שלכם בהודעה הזו ובתפריט הנגישות. אין עוגיות פרסום או מעקב. <a href="/privacy/">מדיניות פרטיות</a></p>
    <div class="cookie-actions">
      <button type="button" class="cookie-accept">אישור</button>
      <button type="button" class="cookie-decline">חיוניות בלבד</button>
    </div>`;
  document.body.appendChild(bar);

  const showBar = (v) => { bar.classList.toggle('show', v); };
  const decide = (analytics) => {
    window.odemConsent = { essential: true, analytics, date: new Date().toISOString() };
    store.set(CONSENT_KEY, window.odemConsent);
    showBar(false);
  };
  bar.querySelector('.cookie-accept').addEventListener('click', () => decide(true));
  bar.querySelector('.cookie-decline').addEventListener('click', () => decide(false));
  document.querySelectorAll('[data-open-cookies]').forEach((b) => b.addEventListener('click', () => showBar(true)));
  if (!window.odemConsent) setTimeout(() => showBar(true), 600);
})();
