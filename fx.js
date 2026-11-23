/* =========================================================================
   Sadaqah Stories — small effects shared by the games
   - short sounds made in the browser (no audio files), with an on/off switch
   - a confetti burst for wins
   - number count-up
   - drag and drop that also works by tapping (see "Drag and drop" below)
   Nothing here loads anything from the network. Motion effects are skipped
   when the device asks for reduced motion.
   ========================================================================= */
window.SadaqahFX = (function () {
  const reduced = () => !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const get = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  const set = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };

  /* ---- Sound ---- */
  let ac = null, on = get("ss_sound") !== "off";
  const TUNES = {
    flip: [[520, 0, 0.05, 0.05]],
    ok: [[660, 0, 0.09, 0.08], [880, 0.09, 0.14, 0.08]],
    no: [[220, 0, 0.16, 0.06]],
    pop: [[740, 0, 0.06, 0.06]],
    tick: [[400, 0, 0.03, 0.04]],
    win: [[523, 0, 0.12, 0.08], [659, 0.12, 0.12, 0.08], [784, 0.24, 0.12, 0.08], [1047, 0.36, 0.24, 0.08]],
  };
  function play(name) {
    if (!on || !TUNES[name]) return;
    try {
      const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
      ac = ac || new AC(); if (ac.state === "suspended") ac.resume();
      TUNES[name].forEach(([f, at, dur, vol]) => {
        const o = ac.createOscillator(), g = ac.createGain(), t0 = ac.currentTime + at;
        o.type = name === "no" ? "triangle" : "sine"; o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t0); g.gain.linearRampToValueAtTime(vol, t0 + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
        o.connect(g); g.connect(ac.destination); o.start(t0); o.stop(t0 + dur + 0.02);
      });
    } catch (e) {}
  }
  function toggleSound() { on = !on; set("ss_sound", on ? "on" : "off"); if (on) play("pop"); return on; }

  /* ---- Confetti ---- */
  const COLORS = ["#c79a3a", "#2f8f87", "#5b8c4f", "#e8a23a", "#c66b6b", "#7aa7d9"];
  function confetti() {
    if (reduced()) return;
    const box = document.createElement("div"); box.className = "ss-confetti"; box.setAttribute("aria-hidden", "true");
    for (let i = 0; i < 44; i++) {
      const p = document.createElement("i");
      p.style.left = Math.random() * 100 + "%";
      p.style.background = COLORS[i % COLORS.length];
      p.style.animationDelay = (Math.random() * 0.5).toFixed(2) + "s";
      p.style.animationDuration = (1.4 + Math.random() * 1.2).toFixed(2) + "s";
      p.style.setProperty("--ss-drift", Math.round(Math.random() * 160 - 80) + "px");
      box.appendChild(p);
    }
    document.body.appendChild(box);
    setTimeout(() => box.remove(), 3200);
  }

  /* ---- Count a number up (or down) to its new value ---- */
  function countUp(el, to, from) {
    if (!el) return;
    const fmt = (n) => Math.round(n).toLocaleString("en-US");
    if (reduced() || from == null || from === to) { el.textContent = fmt(to); return; }
    const t0 = performance.now(), dur = 700;
    (function step(now) {
      const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = fmt(from + (to - from) * e);
      if (k < 1 && el.isConnected) requestAnimationFrame(step);
    })(t0);
  }

  /* ---- Drag and drop ----
     Mark something draggable with data-drag and a landing area with data-drop.
       data-drag="self"   : dropping it on a data-drop area clicks the dragged item
       data-drag="target" : dropping it clicks the data-drop element it lands on
     Both elements keep their normal click behaviour, so tapping still works. */
  let d = null, dragEnd = 0, swallow = false, synthetic = false;
  function dropAt(x, y) { const el = document.elementFromPoint(x, y); return el && el.closest ? el.closest("[data-drop]") : null; }
  function clear() {
    if (!d) return;
    if (d.ghost) d.ghost.remove();
    d.el.classList.remove("ss-dragging");
    document.querySelectorAll("[data-drop].over").forEach((n) => n.classList.remove("over"));
    d = null;
  }
  document.addEventListener("pointerdown", (e) => {
    const el = e.target.closest && e.target.closest("[data-drag]");
    if (!el || el.disabled || (e.button != null && e.button > 0)) return;
    d = { el, x: e.clientX, y: e.clientY, ghost: null };
  });
  document.addEventListener("pointermove", (e) => {
    if (!d) return;
    if (!d.ghost) {
      if (Math.hypot(e.clientX - d.x, e.clientY - d.y) < 8) return;
      const r = d.el.getBoundingClientRect(), g = d.el.cloneNode(true);
      g.removeAttribute("data-drag"); g.removeAttribute("data-act"); g.removeAttribute("id");
      g.className += " ss-drag-ghost"; g.style.width = r.width + "px";
      d.dx = e.clientX - r.left; d.dy = e.clientY - r.top;
      document.body.appendChild(g); d.ghost = g; d.el.classList.add("ss-dragging");
    }
    d.ghost.style.transform = `translate(${e.clientX - d.dx}px, ${e.clientY - d.dy}px)`;
    const over = dropAt(e.clientX, e.clientY);
    document.querySelectorAll("[data-drop].over").forEach((n) => { if (n !== over) n.classList.remove("over"); });
    if (over) over.classList.add("over");
    e.preventDefault();
  }, { passive: false });
  document.addEventListener("pointerup", (e) => {
    if (!d) return;
    const had = !!d.ghost, el = d.el, mode = el.getAttribute("data-drag");
    if (d.ghost) d.ghost.style.display = "none";
    const over = had ? dropAt(e.clientX, e.clientY) : null;
    clear();
    if (!had) return;
    dragEnd = Date.now(); swallow = true;
    const target = over ? (mode === "target" ? over : el) : null;
    if (target && !target.disabled && target.isConnected) { synthetic = true; try { target.click(); } finally { synthetic = false; } }
  });
  document.addEventListener("pointercancel", clear);
  // A drag must not also count as a tap on whatever is under the finger, so
  // the one click the browser may send right after a drag is dropped.
  document.addEventListener("click", (e) => {
    if (synthetic || !swallow) return;
    swallow = false;
    if (Date.now() - dragEnd < 350) { e.stopPropagation(); e.preventDefault(); }
  }, true);

  return { play, toggleSound, soundOn: () => on, confetti, countUp, reduced };
})();
