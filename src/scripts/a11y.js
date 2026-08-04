/*
 * Accessibility controls: settings panel, persisted display preferences
 * and per-section read-aloud via the Web Speech API.
 */

const STORAGE_KEY = 'saprichastie-a11y';
const doc = document.documentElement;

function loadSettings() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
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
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !panel.hidden) {
      panel.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
      toggle.focus();
    }
  });
}

/* ---------------------------------------------------------------- */
/*  Display preferences                                              */
/* ---------------------------------------------------------------- */
function reflectPressed() {
  document.querySelectorAll('[data-fs]').forEach((b) => {
    const active = (doc.getAttribute('data-fs') || '100') === b.getAttribute('data-fs');
    b.setAttribute('aria-pressed', String(active));
  });
  document.querySelectorAll('[data-hc]').forEach((b) => {
    const active = (doc.getAttribute('data-hc') || 'off') === b.getAttribute('data-hc');
    b.setAttribute('aria-pressed', String(active));
  });
  document.querySelectorAll('[data-toggle]').forEach((b) => {
    const key = b.getAttribute('data-toggle');
    b.setAttribute('aria-pressed', String(doc.getAttribute(`data-${key}`) === '1'));
  });
}

document.querySelectorAll('[data-fs]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const value = btn.getAttribute('data-fs');
    doc.setAttribute('data-fs', value);
    settings.fs = value === '100' ? undefined : value;
    saveSettings(settings);
    reflectPressed();
  });
});

document.querySelectorAll('[data-hc]').forEach((btn) => {
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
    .querySelectorAll('.read-btn, [aria-hidden="true"], img, button, input, textarea, iframe')
    .forEach((n) => n.remove());
  return (clone.innerText || clone.textContent || '').replace(/\s+/g, ' ').trim();
}

document.querySelectorAll('.read-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    if (!synth) return;
    const wasPlaying = btn.getAttribute('aria-pressed') === 'true';
    stopReading();
    if (wasPlaying) return;

    const section = btn.closest('[data-read]');
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
if (stopBtn) stopBtn.addEventListener('click', stopReading);

window.addEventListener('pagehide', stopReading);
