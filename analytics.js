/* =========================================================================
   Sadaqah Stories: visit counting with GoatCounter (goatcounter.com)
   No cookies, nothing stored in the browser, no personal data: only the
   screen visited (for example /story/02), the referring site's address, and
   the screen size. Counting is off until GOATCOUNTER_CODE is set, and it
   never runs on localhost or when the browser sends "Do Not Track".

   To turn it on: create a site at goatcounter.com and put its code (the part
   before .goatcounter.com) below. To show the public total on the About
   page, also tick "Allow adding visitor counts on your website" in the
   GoatCounter site settings.
   ========================================================================= */
(function () {
  const GOATCOUNTER_CODE = "wajdiz";

  const base = /^[a-z0-9-]{1,50}$/.test(GOATCOUNTER_CODE) ? "https://" + GOATCOUNTER_CODE + ".goatcounter.com" : "";
  const local = location.protocol === "file:" || /^(localhost|127\.|0\.0\.0\.0|\[::1\])/.test(location.hostname);
  const dnt = navigator.doNotTrack === "1" || window.doNotTrack === "1";
  const on = !!base && (!local || window.__ssCountLocal === true) && !dnt;
  let last = "", first = true;

  function send(path, isEvent) {
    if (!on) return;
    const q = ["p=" + encodeURIComponent(path), "t=" + encodeURIComponent(path)];
    if (isEvent) q.push("e=true");
    else {
      // Referring site: origin only (no path), and only on the first screen.
      if (first && document.referrer) {
        try { const o = new URL(document.referrer).origin; if (o !== location.origin) q.push("r=" + encodeURIComponent(o)); } catch (e) {}
      }
      q.push("s=" + [screen.width, screen.height, window.devicePixelRatio || 1].join(","));
      first = false;
    }
    q.push("rnd=" + Math.random().toString(36).slice(2, 10));
    const img = new Image();
    img.referrerPolicy = "no-referrer";
    img.src = base + "/count?" + q.join("&");
  }

  window.SadaqahAnalytics = {
    configured: !!base,
    enabled: on,
    // One count per screen; re-drawing the same screen does not count again.
    view(route, id) {
      const safeId = typeof id === "string" && /^[A-Za-z0-9_-]{1,40}$/.test(id) ? id : "";
      const path = route === "home" ? "/" : "/" + route + (safeId ? "/" + safeId : "");
      if (path === last) return;
      last = path;
      send(path, false);
    },
    // Anonymous choice counts, such as "language-ar" or "age-7-10".
    event(name) { if (/^[a-z0-9-]{1,40}$/.test(name)) send(name, true); },
    // Public total for the About page (needs the GoatCounter setting above).
    total(el, label) {
      if (!base || !el || !window.fetch) return;
      fetch(base + "/counter/TOTAL.json", { referrerPolicy: "no-referrer" })
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          // GoatCounter returns the count as a formatted string ("1,234"); hide it until there is at least one visit.
          const n = d && d.count != null ? String(d.count).replace(/[^0-9]/g, "") : "";
          if (n && Number(n) > 0) { el.textContent = label + " " + Number(n).toLocaleString("en"); el.hidden = false; }
        })
        .catch(() => {});
    },
  };
})();
