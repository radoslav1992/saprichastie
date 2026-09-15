/*
 * Accessibility controls: settings panel, persisted display preferences
 * and per-section read-aloud via the Web Speech API.
 */

const STORAGE_KEY = 'saprichastie-a11y';
const doc = document.documentElement;

function loadSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return saved && typeof saved === 'object' && !Array.isArray(saved)
      ? saved
      : {};
  } catch {
    return {};
  }
}

function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    /* private mode — settings just won't persist */
  }
}

const settings = loadSettings();

/* ---------------------------------------------------------------- */
/*  Panel open/close                                                 */
/* ---------------------------------------------------------------- */
const toggle = document.querySelector('[data-a11y-toggle]');
const panel = document.getElementById('a11y-panel');

if (toggle && panel) {
  toggle.addEventListener('click', () => {
    const open = panel.hidden;
    panel.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    if (open) panel.querySelector('button')?.focus();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !panel.hidden) {
      panel.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
      toggle.focus();
    }
  });
}

document.querySelector('[data-a11y-close]')?.addEventListener('click', () => {
  if (panel && toggle) {
    panel.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.focus();
  }
});

/* ---------------------------------------------------------------- */
/*  Display preferences                                              */
/* ---------------------------------------------------------------- */
function reflectPressed() {
  document.querySelectorAll('button[data-fs]').forEach((b) => {
    const active =
      (doc.getAttribute('data-fs') || '100') === b.getAttribute('data-fs');
    b.setAttribute('aria-pressed', String(active));
  });
  document.querySelectorAll('button[data-hc]').forEach((b) => {
    const active =
      (doc.getAttribute('data-hc') || 'off') === b.getAttribute('data-hc');
    b.setAttribute('aria-pressed', String(active));
  });
  document.querySelectorAll('[data-toggle]').forEach((b) => {
    const key = b.getAttribute('data-toggle');
    b.setAttribute(
      'aria-pressed',
      String(doc.getAttribute(`data-${key}`) === '1'),
    );
  });
}

document.querySelectorAll('button[data-fs]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const value = btn.getAttribute('data-fs');
    doc.setAttribute('data-fs', value);
    settings.fs = value === '100' ? undefined : value;
    saveSettings(settings);
    reflectPressed();
  });
});

document.querySelectorAll('button[data-hc]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const value = btn.getAttribute('data-hc');
    if (value === 'dark') {
      doc.setAttribute('data-hc', 'dark');
      settings.hc = 'dark';
    } else {
      doc.removeAttribute('data-hc');
      settings.hc = undefined;
    }
    saveSettings(settings);
    reflectPressed();
  });
});

document.querySelectorAll('[data-toggle]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const key = btn.getAttribute('data-toggle');
    const attr = `data-${key}`;
    const on = doc.getAttribute(attr) === '1';
    if (on) {
      doc.removeAttribute(attr);
      settings[key] = undefined;
    } else {
      doc.setAttribute(attr, '1');
      settings[key] = true;
    }
    saveSettings(settings);
    reflectPressed();
  });
});

reflectPressed();

document.querySelector('[data-reset]')?.addEventListener('click', () => {
  ['fs', 'hc', 'space', 'links'].forEach((key) => {
    doc.removeAttribute(`data-${key}`);
    delete settings[key];
  });
  saveSettings(settings);
  reflectPressed();
  stopReading();
});

/* ---------------------------------------------------------------- */
/*  Read aloud                                                       */
/* ---------------------------------------------------------------- */
const synth = window.speechSynthesis;

function stopReading() {
  if (synth) synth.cancel();
  document.querySelectorAll('.read-btn[aria-pressed="true"]').forEach((b) => {
    b.setAttribute('aria-pressed', 'false');
  });
}

function sectionText(section) {
  const clone = section.cloneNode(true);
  clone
    .querySelectorAll(
      '.read-btn, [aria-hidden="true"], img, button, input, textarea, iframe',
    )
    .forEach((n) => n.remove());
  return (clone.innerText || clone.textContent || '')
    .replace(/\s+/g, ' ')
    .trim();
}

document.querySelectorAll('.read-btn').forEach((btn) => {
  btn.hidden = !synth;
  const title = btn
    .closest('[data-read]')
    ?.querySelector('h1, h2, h3, [data-caption]')
    ?.textContent?.trim();
  if (title)
    btn.setAttribute(
      'aria-label',
      `${btn.getAttribute('aria-label')}: ${title}`,
    );
  btn.addEventListener('click', () => {
    if (!synth) return;
    const wasPlaying = btn.getAttribute('aria-pressed') === 'true';
    stopReading();
    if (wasPlaying) return;

    const section = btn.closest('[data-read]');
    if (!section) return;
    const text = sectionText(section);
    if (!text) return;

    const lang = document.documentElement.lang === 'en' ? 'en-GB' : 'bg-BG';
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.95;
    const voice = synth
      .getVoices()
      .find((v) => v.lang && v.lang.toLowerCase().startsWith(lang.slice(0, 2)));
    if (voice) utterance.voice = voice;
    utterance.onend = stopReading;
    utterance.onerror = stopReading;
    btn.setAttribute('aria-pressed', 'true');
    synth.speak(utterance);
  });
});

const stopBtn = document.querySelector('[data-stop]');
if (stopBtn) {
  stopBtn.disabled = !synth;
  stopBtn.addEventListener('click', stopReading);
}

window.addEventListener('pagehide', stopReading);

/* ---------------------------------------------------------------- */
/*  Contact form: prevent double submits                             */
/* ---------------------------------------------------------------- */
document.querySelectorAll('form[action="/api/contact"]').forEach((form) => {
  form.addEventListener('submit', () => {
    const btn = form.querySelector('button[type="submit"]');
    if (!btn || btn.disabled) return;
    btn.disabled = true;
    btn.setAttribute('aria-disabled', 'true');
    btn.textContent = btn.getAttribute('data-sending-label') || btn.textContent;
  });
});
