(function () {
  var EP = 'https://api.jayzzhang.online/t';
  var lastPv = '';

  function send(payload) {
    var body = JSON.stringify(payload);
    try {
      if (navigator.sendBeacon && navigator.sendBeacon(EP, body)) return;
    } catch (e) {}
    try {
      var q = 'e=' + encodeURIComponent(payload.e)
        + '&p=' + encodeURIComponent(payload.p)
        + '&r=' + encodeURIComponent(payload.r || '')
        + (payload.v ? '&v=' + encodeURIComponent(payload.v) : '');
      var img = new Image();
      img.referrerPolicy = 'no-referrer';
      img.src = EP + '?' + q;
    } catch (e2) {}
  }

  function track(name, val) {
    if (!name) return;
    var payload = {
      e: String(name).slice(0, 40),
      p: (location.pathname || '/').slice(0, 120),
      r: '',
    };
    try {
      if (document.referrer) payload.r = new URL(document.referrer).hostname;
    } catch (err) {}
    if (val != null && val !== '') payload.v = String(val).slice(0, 32);
    send(payload);
  }

  function pageview() {
    var p = location.pathname || '/';
    if (p === lastPv) return;
    lastPv = p;
    track('page_view');
  }

  window.jzTrack = track;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', pageview);
  } else {
    pageview();
  }
  document.addEventListener('astro:after-swap', function () {
    lastPv = '';
    pageview();
  });
})();
