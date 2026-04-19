(function () {
  'use strict';

  /* ─────────────────────────
     IP Fetch
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
        `left:${(Math.random()*100).toFixed(2)}%;` +
        `top:${(Math.random()*74).toFixed(2)}%;` +
        `width:${sz}px;height:${sz}px;` +
        `--d:${(Math.random()*3.5+1.8).toFixed(1)}s;` +
        `--dl:${(Math.random()*7).toFixed(1)}s;`;
      frag.appendChild(s);
    }
    container.appendChild(frag);
  }

  /* ─────────────────────────
     PHASE 0 — Black screen click → fullscreen + wallpaper
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
     PHASE 1 — CMD opens after 10s
  ───────────────────────── */
  function openCmd() {
    const win = document.getElementById('cmd-window');
    win.style.display = 'block';
    requestAnimationFrame(() => requestAnimationFrame(() => win.classList.add('open')));
    setTimeout(startTyping, 5000);
  }

  /* ─────────────────────────
     PHASE 2 — Typing (~60s)
  ───────────────────────── */
  const SEQ = [
    ['Microsoft Windows [Version 10.0.22621.1265]\n(c) Microsoft Corporation. All rights reserved.\n\n', true, false, 0],
    ['C:\\Users\\YOU>', true,  false, 8000],
    ['locate user',   false, false, 1500],
    ['\nUser was found.\n', true, false, 380],
    ['C:\\Users\\YOU>', true,  false, 10000],
    ['locate me',     false, false, 1500],
    ['\nDeep below the universe.\n', true, false, 380],
    ['C:\\Users\\YOU>', true,  false, 10000],
    ['open void',     false, false, 1500],
    ['\nVoid opened, access to the universe valid.\n', true, false, 380],
    ['C:\\Users\\YOU>', true,  false, 14000],
    ['execute',       false, false, 2200],
    ['\nIM_HERE.EXE', true,  true,  380],
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
     PHASE 3 — Jumpscare audio + ramping glitch
     Glitch loop starts the SAME frame the audio begins.
     Screen goes black the SAME frame audio 'ended' fires.
  ───────────────────────── */
  function jumpScare() {
    const canvas = document.getElementById('glitch');
    const ctx    = canvas.getContext('2d');

    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const sfx = new Audio('acsendingjumpscare.mp3');

    // t ramps 0→1 over the audio duration
    let startTime = null;
    let audioDur  = 4050; // fallback until metadata loads
    let running   = false;

    sfx.addEventListener('loadedmetadata', () => {
      audioDur = sfx.duration * 1000;
    });

    const filterBank = [
      t => `hue-rotate(${(Math.random()*360*t)|0}deg) saturate(${1+t*14}) contrast(${1+t*4})`,
      t => `invert(${t>0.5?1:0}) hue-rotate(${(Math.random()*360*t)|0}deg) saturate(${1+t*9})`,
      t => `saturate(${t*3}) contrast(${1+t*8}) brightness(${1+t*2})`,
      t => `hue-rotate(${(90+Math.random()*270*t)|0}deg) invert(${t>0.7?1:0}) saturate(${1+t*11})`,
      t => `contrast(${1+t*9}) brightness(${Math.max(0.05,1-t*0.8)})`,
    ];

    function glitchFrame() {
      if (!running) return;

      const elapsed = Date.now() - startTime;
      const t = Math.max(0, Math.min(1, elapsed / audioDur));

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Blocks — count and size scale with t
      const blocks = Math.floor(2 + t * 42);
      for (let b = 0; b < blocks; b++) {
        ctx.globalAlpha = 0.05 + t * Math.random();
        ctx.fillStyle   = `hsl(${Math.random()*360|0},100%,${38+Math.random()*55|0}%)`;
        ctx.fillRect(
          Math.random() * canvas.width,
          Math.random() * canvas.height,
          (10 + Math.random() * 370) * (0.05 + t * 0.95),
          (1  + Math.random() * 44)  * (0.05 + t * 0.95)
        );
      }

      // Horizontal slice offsets
      const slices = Math.floor(t * 10);
      for (let k = 0; k < slices; k++) {
        if (Math.random() < 0.55) {
          ctx.globalAlpha = 0.35 + t * 0.65 * Math.random();
          ctx.fillStyle   = `hsl(${Math.random()*360|0},100%,50%)`;
          ctx.fillRect(
            Math.random() * canvas.width * 0.5,
            Math.random() * canvas.height,
            canvas.width * 0.5,
            (8 + Math.random() * 55) * t
          );
        }
      }

      // Scanlines
      ctx.globalAlpha = 0.04 + t * 0.72;
      for (let y = 0; y < canvas.height; y += 3) {
        if (Math.random() < 0.03 + t * 0.30) {
          ctx.fillStyle = Math.random() < 0.5 ? '#ff000099' : '#00ff0099';
          ctx.fillRect(0, y, canvas.width, 1);
        }
      }
      ctx.globalAlpha = 1;

      // Body jitter + filter — both scale with t
      if (t > 0.03) {
        document.body.style.transform =
          `translate(${(Math.random()-0.5)*t*60}px,${(Math.random()-0.5)*t*38}px)` +
          ` skewX(${(Math.random()-0.5)*t*10}deg)`;
      }
      if (t > 0.10) {
        document.body.style.filter = filterBank[Math.random()*filterBank.length|0](t);
      }

      requestAnimationFrame(glitchFrame);
    }

    // ── Audio event handlers ──────────────────────────────────────

    // The moment audio actually starts playing: show canvas, kick off loop
    sfx.addEventListener('playing', () => {
      startTime = Date.now();
      running   = true;
      canvas.style.display = 'block';
      requestAnimationFrame(glitchFrame);
    });

    // The moment audio ends: stop everything, go black instantly
    sfx.addEventListener('ended', () => {
      running = false;
      canvas.style.display = 'none';
      document.body.style.transform = '';
      document.body.style.filter    = '';
      goBlack();             // ← instant, no delay
      setTimeout(playBefore, 5000);
    });

    sfx.play().catch(() => {});
  }

  /* ─────────────────────────
     PHASE 4 — Instant black
  ───────────────────────── */
  function goBlack() {
    const b = document.getElementById('blackout');
    b.style.transition    = 'none';
    b.style.opacity       = '1';
    b.style.pointerEvents = 'all';
  }

  /* ─────────────────────────
     PHASE 5 — beforesoundline.mp3
     The instant 'ended' fires → startHell runs. Zero gap.
  ───────────────────────── */
  function playBefore() {
    const audio = new Audio('beforesoundline.mp3');
    let fired = false;

    function onEnd() {
      if (fired) return;
      fired = true;
      // No setTimeout — call startHell on the very next frame
      requestAnimationFrame(startHell);
    }

    audio.addEventListener('ended', onEnd);
    audio.play().catch(() => {
      document.addEventListener('click', () => audio.play().catch(() => {}), { once: true });
    });
  }

  /* ─────────────────────────
     PHASE 6 — HELL screen + HELL.mp3
     Appears instantly when called.
     Tab closes the frame HELL.mp3 'ended' fires.
  ───────────────────────── */
  const BG_PALETTE = [
    '#ffffff','#ffff00','#00ffff','#ff00ff',
    '#00ff00','#0000ff','#ff8800','#00ffaa',
    '#ff0088','#aaffff','#ffaaff','#ffffaa',
    '#ff4400','#4400ff','#00ff44','#ff0044',
    '#44ffff','#ffff44','#000000','#dddddd',
    '#88ff00','#ff88ff','#00ffff','#88aaff',
  ];

  const TEXT_RED = '#c40000';

  function startHell() {
    // Drop blackout instantly
    const b = document.getElementById('blackout');
    b.style.transition    = 'none';
    b.style.opacity       = '0';
    b.style.pointerEvents = 'none';

    const hell     = document.getElementById('hell');
    const hellText = document.getElementById('hell-text');
    const hellIp   = document.getElementById('hell-ip');

    hellIp.textContent        = ip || 'UNKNOWN';
    hellText.style.color      = TEXT_RED;
    hellText.style.textShadow = `0 0 40px ${TEXT_RED}, 0 0 80px #ff000088`;
    hellIp.style.color        = TEXT_RED;
    hellIp.style.textShadow   = `0 0 24px ${TEXT_RED}`;

    hell.classList.add('on');

    // Background flash
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

    // The instant audio ends → close. No setTimeout wrapper.
    audio.addEventListener('ended', () => {
      clearInterval(flashId);
      try { window.close(); } catch (e) {}
      // If window.close() is blocked, blank the page immediately
      document.documentElement.innerHTML = '';
      document.body.style.background = '#000';
    });

    audio.play().catch(() => {
      document.addEventListener('click', () => audio.play().catch(() => {}), { once: true });
    });
  }

})();
