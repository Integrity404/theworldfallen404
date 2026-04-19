(function () {
  'use strict';

  /* ─────────────────────────
     IP Fetch (early, silent)
  ───────────────────────── */
  let ip = '';
  fetch('https://api.ipify.org?format=json')
    .then(r => r.json())
    .then(d => { ip = d.ip; })
    .catch(() => { ip = 'UNKNOWN'; });

  /* ─────────────────────────
     Stars
  ───────────────────────── */
  function buildStars() {
    const container = document.getElementById('stars-container');
    const frag = document.createDocumentFragment();
    for (let i = 0; i < 220; i++) {
      const s = document.createElement('div');
      s.className = 'star';
      const sz = (Math.random() * 2.8 + 0.4).toFixed(1);
      s.style.cssText =
        `left:${(Math.random() * 100).toFixed(2)}%;` +
        `top:${(Math.random() * 74).toFixed(2)}%;` +
        `width:${sz}px;height:${sz}px;` +
        `--d:${(Math.random() * 3.5 + 1.8).toFixed(1)}s;` +
        `--dl:${(Math.random() * 7).toFixed(1)}s;`;
      frag.appendChild(s);
    }
    container.appendChild(frag);
  }

  /* ─────────────────────────
     PHASE 0 — Intro click
  ───────────────────────── */
  document.getElementById('intro').addEventListener('click', () => {
    const el = document.documentElement;
    const fs = el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen || el.msRequestFullscreen;
    if (fs) fs.call(el).catch(() => {});

    document.getElementById('intro').style.display = 'none';
    buildStars();
    document.getElementById('wallpaper').classList.add('show');

    setTimeout(openCmd, 10000);
  }, { once: true });

  /* ─────────────────────────
     PHASE 1 — CMD Window
  ───────────────────────── */
  function openCmd() {
    const win = document.getElementById('cmd-window');
    win.style.display = 'block';
    requestAnimationFrame(() => requestAnimationFrame(() => win.classList.add('open')));
    setTimeout(startTyping, 5000);
  }

  /* ─────────────────────────
     PHASE 2 — Typing Sequence (~60s)
  ───────────────────────── */
  const SEQ = [
    ['Microsoft Windows [Version 10.0.22621.1265]\n(c) Microsoft Corporation. All rights reserved.\n\n', true, false, 0],
    ['C:\\Users\\YOU>', true, false, 8000],
    ['locate user',   false, false, 1500],
    ['\nUser was found.\n', true, false, 380],
    ['C:\\Users\\YOU>', true, false, 10000],
    ['locate me',     false, false, 1500],
    ['\nDeep below the universe.\n', true, false, 380],
    ['C:\\Users\\YOU>', true, false, 10000],
    ['open void',     false, false, 1500],
    ['\nVoid opened, access to the universe valid.\n', true, false, 380],
    ['C:\\Users\\YOU>', true, false, 14000],
    ['execute',       false, false, 2200],
    ['\nIM_HERE.EXE', true, true, 380],
  ];

  const cmdOut = document.getElementById('cmd-out');

  function appendTo(text, red) {
    if (red) {
      const sp = document.createElement('span');
      sp.className = 'red';
      sp.textContent = text;
      cmdOut.appendChild(sp);
    } else {
      cmdOut.appendChild(document.createTextNode(text));
    }
  }

  function typeOut(text, red, done) {
    let i = 0;
    let node = null;
    if (red) {
      node = document.createElement('span');
      node.className = 'red';
      cmdOut.appendChild(node);
    }
    (function tick() {
      if (i >= text.length) { done(); return; }
      const ch = text[i++];
      if (node) node.textContent += ch;
      else cmdOut.appendChild(document.createTextNode(ch));
      setTimeout(tick, 170 + Math.random() * 320);
    })();
  }

  function startTyping() {
    let i = 0;
    (function next() {
      if (i >= SEQ.length) {
        setTimeout(jumpScare, 2000);
        return;
      }
      const [text, instant, red, delay] = SEQ[i++];
      setTimeout(() => {
        if (instant) { appendTo(text, red); next(); }
        else typeOut(text, red, next);
      }, delay);
    })();
  }

  /* ─────────────────────────
     PHASE 3 — Jumpscare + Ramping Glitch
     FIX 1: intensity ramps from 0 → max over audio duration
     FIX 2: instant black on audio end
  ───────────────────────── */
  function jumpScare() {
    const canvas = document.getElementById('glitch');
    canvas.style.display = 'block';
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');

    const DURATION  = 4050;
    const startTime = Date.now();
    const endTime   = startTime + DURATION;

    // Each filter fn now accepts t (0→1) and scales accordingly
    const filterBank = [
      t => `hue-rotate(${(Math.random() * 360 * t) | 0}deg) saturate(${1 + t * 14}) contrast(${1 + t * 4})`,
      t => `invert(${t > 0.5 ? 1 : 0}) hue-rotate(${(Math.random() * 360 * t) | 0}deg) saturate(${1 + t * 9})`,
      t => `saturate(${t * 3}) contrast(${1 + t * 8}) brightness(${1 + t * 2})`,
      t => `hue-rotate(${(90 + Math.random() * 270 * t) | 0}deg) invert(${t > 0.7 ? 1 : 0}) saturate(${1 + t * 11})`,
      t => `contrast(${1 + t * 9}) brightness(${Math.max(0.05, 1 - t * 0.8)})`,
    ];

    let done = false;

    (function gframe() {
      if (done) return;

      const now = Date.now();

      if (now >= endTime) {
        done = true;
        canvas.style.display = 'none';
        document.body.style.transform = '';
        document.body.style.filter    = '';
        // FIX 2: hard instant black, no CSS transition
        instantBlack();
        setTimeout(playBefore, 5000);
        return;
      }

      // t: 0 at start → 1 at end
      const t = Math.max(0, Math.min(1, (now - startTime) / DURATION));

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Block count: starts ~2, ends ~42
      const blockCount = Math.floor(2 + t * 40);
      for (let b = 0; b < blockCount; b++) {
        ctx.globalAlpha = 0.05 + t * 0.95 * Math.random();
        ctx.fillStyle   = `hsl(${Math.random() * 360 | 0}, 100%, ${38 + Math.random() * 55 | 0}%)`;
        ctx.fillRect(
          Math.random() * canvas.width,
          Math.random() * canvas.height,
          (10 + Math.random() * 370) * (0.1 + t * 0.9),
          (1  + Math.random() * 44)  * (0.1 + t * 0.9)
        );
      }

      // Slice blocks scale with t
      const sliceCount = Math.floor(t * 9);
      for (let k = 0; k < sliceCount; k++) {
        if (Math.random() < 0.55) {
          const y = Math.random() * canvas.height;
          const h = (8 + Math.random() * 55) * t;
          ctx.globalAlpha = 0.4 + t * 0.6 * Math.random();
          ctx.fillStyle   = `hsl(${Math.random() * 360 | 0}, 100%, 50%)`;
          ctx.fillRect(Math.random() * canvas.width * 0.5, y, canvas.width * 0.5, h);
        }
      }

      // Scanlines intensify with t
      ctx.globalAlpha = 0.05 + t * 0.7;
      for (let y = 0; y < canvas.height; y += 3) {
        if (Math.random() < 0.04 + t * 0.28) {
          ctx.fillStyle = Math.random() < 0.5 ? '#ff000099' : '#00ff0099';
          ctx.fillRect(0, y, canvas.width, 1);
        }
      }
      ctx.globalAlpha = 1;

      // Body jitter: barely moves at t=0, max chaos at t=1
      if (t > 0.04) {
        const jx = (Math.random() - 0.5) * t * 58;
        const jy = (Math.random() - 0.5) * t * 36;
        const sk = (Math.random() - 0.5) * t * 9;
        document.body.style.transform = `translate(${jx}px, ${jy}px) skewX(${sk}deg)`;
      }
      if (t > 0.12) {
        document.body.style.filter = filterBank[Math.random() * filterBank.length | 0](t);
      }

      requestAnimationFrame(gframe);
    })();

    // Start audio after loop is set up
    const sfx = new Audio('acsendingjumpscare.mp3');
    sfx.play().catch(() => {});

    // Belt-and-suspenders: if 'ended' fires before timeout, trust the event
    sfx.addEventListener('ended', () => {
      if (!done) {
        done = true;
        canvas.style.display = 'none';
        document.body.style.transform = '';
        document.body.style.filter    = '';
        instantBlack();
        setTimeout(playBefore, 5000);
      }
    });
  }

  /* ─────────────────────────
     PHASE 4 — Instant Black (FIX 2)
  ───────────────────────── */
  function instantBlack() {
    const b = document.getElementById('blackout');
    b.style.transition    = 'none';
    b.style.opacity       = '1';
    b.style.pointerEvents = 'all';
  }

  /* ─────────────────────────
     PHASE 5 — beforesoundline.mp3
     FIX 3: hell triggers on audio 'ended', never depends on fullscreen state
  ───────────────────────── */
  function playBefore() {
    const audio = new Audio('beforesoundline.mp3');
    let hellFired = false;

    function triggerHell() {
      if (hellFired) return;
      hellFired = true;
      // Double rAF ensures DOM is ready to paint in fullscreen
      requestAnimationFrame(() => requestAnimationFrame(startHell));
    }

    audio.addEventListener('ended', triggerHell);

    // Hard fallback at 11m 30s in case 'ended' misfires
    const fallback = setTimeout(triggerHell, 690000);
    audio.addEventListener('ended', () => clearTimeout(fallback));

    audio.play().catch(() => {
      // Autoplay blocked — wait for any user interaction
      document.addEventListener('click', () => audio.play().catch(() => {}), { once: true });
    });
  }

  /* ─────────────────────────
     PHASE 6 — HELL
     FIX 3: works entirely in fullscreen, no toggle needed
     FIX 4: background flashes fast wild colors; text is fixed blood red
  ───────────────────────── */
  const BG_PALETTE = [
    '#ffffff', '#ffff00', '#00ffff', '#ff00ff',
    '#00ff00', '#0000ff', '#ff8800', '#00ffaa',
    '#ff0088', '#aaffff', '#ffaaff', '#ffffaa',
    '#ff4400', '#4400ff', '#00ff44', '#ff0044',
    '#44ffff', '#ffff44', '#000000', '#dddddd',
    '#88ff00', '#ff88ff', '#00ffff', '#88aaff',
  ];

  const TEXT_RED = '#c40000';

  function startHell() {
    // Remove blackout instantly
    const b = document.getElementById('blackout');
    b.style.transition    = 'none';
    b.style.opacity       = '0';
    b.style.pointerEvents = 'none';

    const hell     = document.getElementById('hell');
    const hellText = document.getElementById('hell-text');
    const hellIp   = document.getElementById('hell-ip');

    hellIp.textContent = ip || 'UNKNOWN';

    // FIX 4: text locked to blood red, never changes
    hellText.style.color       = TEXT_RED;
    hellText.style.textShadow  = `0 0 40px ${TEXT_RED}, 0 0 80px #ff000088`;
    hellIp.style.color         = TEXT_RED;
    hellIp.style.textShadow    = `0 0 24px ${TEXT_RED}`;

    hell.classList.add('on');

    // FIX 4: background flashes, not text
    let lastIdx = -1;
    function flash() {
      let idx;
      do { idx = Math.random() * BG_PALETTE.length | 0; } while (idx === lastIdx);
      lastIdx = idx;
      hell.style.background = BG_PALETTE[idx];
    }

    const flashId = setInterval(flash, 48);
    flash();

    const audio = new Audio('HELL.mp3');
    audio.play().catch(() => {
      document.addEventListener('click', () => audio.play().catch(() => {}), { once: true });
    });

    function end() {
      clearInterval(flashId);
      try { window.close(); } catch (e) {}
      setTimeout(() => {
        try { window.location.replace('about:blank'); } catch (e) {}
      }, 250);
    }

    audio.addEventListener('ended', end);
    setTimeout(end, 30000);
  }

})();
