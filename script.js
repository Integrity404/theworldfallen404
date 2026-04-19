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
    // Request fullscreen
    const el = document.documentElement;
    const fs = el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen || el.msRequestFullscreen;
    if (fs) fs.call(el).catch(() => {});

    // Hide intro, show wallpaper
    document.getElementById('intro').style.display = 'none';
    buildStars();
    document.getElementById('wallpaper').classList.add('show');

    // Phase 1: open CMD after 10 seconds
    setTimeout(openCmd, 10000);
  }, { once: true });

  /* ─────────────────────────
     PHASE 1 — CMD Window
  ───────────────────────── */
  function openCmd() {
    const win = document.getElementById('cmd-window');
    win.style.display = 'block';
    // Double rAF forces a real repaint before transition fires
    requestAnimationFrame(() => requestAnimationFrame(() => win.classList.add('open')));
    // Start typing 5 seconds after window opens
    setTimeout(startTyping, 5000);
  }

  /* ─────────────────────────
     PHASE 2 — Typing Sequence
     Total ≈ 60 seconds
  ───────────────────────── */

  // [text, instant, red, delayBeforeMs]
  const SEQ = [
    // Header appears immediately at typing start
    ['Microsoft Windows [Version 10.0.22621.1265]\n(c) Microsoft Corporation. All rights reserved.\n\n', true, false, 0],

    // 8s pause — then first prompt
    ['C:\\Users\\YOU>', true, false, 8000],
    // 1.5s "thinking" — then type command
    ['locate user',   false, false, 1500],
    // Enter → response
    ['\nUser was found.\n', true, false, 380],

    // 10s pause — user "reads"
    ['C:\\Users\\YOU>', true, false, 10000],
    ['locate me',     false, false, 1500],
    ['\nDeep below the universe.\n', true, false, 380],

    // 10s pause
    ['C:\\Users\\YOU>', true, false, 10000],
    ['open void',     false, false, 1500],
    ['\nVoid opened, access to the universe valid.\n', true, false, 380],

    // 14s pause — long dread
    ['C:\\Users\\YOU>', true, false, 14000],
    ['execute',       false, false, 2200],
    ['\nIM_HERE.EXE', true,  true,  380],
    // Total ≈ 0+8+1.5+~3.5+0.38+10+1.5+~2.8+0.38+10+1.5+~2.8+0.38+14+2.2+~1.8+0.38 ≈ 60s
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
      // Realistic random keystroke timing
      setTimeout(tick, 170 + Math.random() * 320);
    })();
  }

  function startTyping() {
    let i = 0;
    (function next() {
      if (i >= SEQ.length) {
        // Typing done — 2 second pause, then jumpscare
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
     PHASE 3 — Jumpscare + Glitch (4.05s)
  ───────────────────────── */
  function jumpScare() {
    // Play audio
    const sfx = new Audio('acsendingjumpscare.mp3');
    sfx.play().catch(() => {});

    // Glitch canvas
    const canvas = document.getElementById('glitch');
    canvas.style.display = 'block';
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');

    const DURATION = 4050;
    const glitchEnd = Date.now() + DURATION;

    const filterBank = [
      () => `hue-rotate(${Math.random() * 360 | 0}deg) saturate(${5 + Math.random() * 12}) contrast(${1.5 + Math.random() * 3})`,
      () => `invert(1) hue-rotate(${Math.random() * 360 | 0}deg) saturate(${6 + Math.random() * 8})`,
      () => `saturate(0) contrast(${6 + Math.random() * 6}) brightness(${2 + Math.random() * 3})`,
      () => `hue-rotate(${90 + Math.random() * 270 | 0}deg) invert(1) saturate(${7 + Math.random() * 10})`,
      () => `contrast(${8 + Math.random() * 8}) brightness(${0.1 + Math.random() * 0.4})`,
    ];

    (function gframe() {
      if (Date.now() >= glitchEnd) {
        // Glitch ends — clean up, fade to black
        canvas.style.display = 'none';
        document.body.style.transform = '';
        document.body.style.filter    = '';
        fadeBlack();
        setTimeout(playBefore, 5000); // 5s of silence then next audio
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Random colored horizontal slices (pixel swap simulation)
      const blockCount = 14 + Math.random() * 28 | 0;
      for (let b = 0; b < blockCount; b++) {
        ctx.globalAlpha = 0.25 + Math.random() * 0.75;
        ctx.fillStyle   = `hsl(${Math.random() * 360 | 0}, 100%, ${38 + Math.random() * 55 | 0}%)`;
        ctx.fillRect(
          Math.random() * canvas.width,
          Math.random() * canvas.height,
          40 + Math.random() * 380,
          2  + Math.random() * 45
        );
      }

      // Diagonal slice offset blocks
      for (let k = 0; k < 5; k++) {
        if (Math.random() < 0.5) {
          const y = Math.random() * canvas.height;
          const h = 8 + Math.random() * 60;
          ctx.globalAlpha = 0.5 + Math.random() * 0.5;
          ctx.fillStyle   = `hsl(${Math.random() * 360 | 0}, 100%, 50%)`;
          ctx.fillRect(Math.random() * canvas.width * 0.5, y, canvas.width * 0.5, h);
        }
      }

      // Scanlines
      ctx.globalAlpha = 0.55;
      for (let y = 0; y < canvas.height; y += 3) {
        if (Math.random() < 0.22) {
          ctx.fillStyle = Math.random() < 0.5 ? '#ff000066' : '#00ff0066';
          ctx.fillRect(0, y, canvas.width, 1);
        }
      }
      ctx.globalAlpha = 1;

      // Full-body jitter + extreme color filter
      const jx = (Math.random() - 0.5) * 44;
      const jy = (Math.random() - 0.5) * 28;
      const sk = (Math.random() - 0.5) * 6;
      document.body.style.transform = `translate(${jx}px, ${jy}px) skewX(${sk}deg)`;
      document.body.style.filter    = filterBank[Math.random() * filterBank.length | 0]();

      requestAnimationFrame(gframe);
    })();
  }

  /* ─────────────────────────
     PHASE 4 — Black Screen
  ───────────────────────── */
  function fadeBlack() {
    document.getElementById('blackout').classList.add('on');
  }

  /* ─────────────────────────
     PHASE 5 — beforesoundline.mp3
  ───────────────────────── */
  function playBefore() {
    const audio = new Audio('beforesoundline.mp3');
    audio.play().catch(() => {});
    audio.addEventListener('ended', startHell);
    // No hard timeout — we wait for the audio to end naturally
  }

  /* ─────────────────────────
     PHASE 6 — HELL
  ───────────────────────── */
  const BG_PALETTE = [
    '#ff0000', '#cc0000', '#dd1000', '#ff1a00',
    '#aa0000', '#ff3300', '#bb0000', '#ee0000',
    '#ff0011', '#990000', '#ff2200',
  ];
  const FG_PALETTE = [
    '#ffffff', '#ffff00', '#000000',
    '#00ffff', '#ff00ff', '#ffe500',
  ];

  function startHell() {
    // Remove black overlay
    document.getElementById('blackout').classList.remove('on');

    const hell = document.getElementById('hell');
    hell.classList.add('on');

    const hellText = document.getElementById('hell-text');
    const hellIp   = document.getElementById('hell-ip');
    hellIp.textContent = ip || 'UNKNOWN';

    // Rapid flashing
    function flash() {
      const bg = BG_PALETTE[Math.random() * BG_PALETTE.length | 0];
      const fg = FG_PALETTE[Math.random() * FG_PALETTE.length | 0];
      hell.style.background    = bg;
      hellText.style.color     = fg;
      hellText.style.textShadow = `0 0 60px ${fg}, 0 0 120px ${fg}`;
      hellIp.style.color       = fg;
    }

    const flashId = setInterval(flash, 55);
    flash();

    // Play HELL audio
    const audio = new Audio('HELL.mp3');
    audio.play().catch(() => {});

    function end() {
      clearInterval(flashId);
      // Attempt to close tab; fallback to blank page
      try { window.close(); } catch (e) {}
      setTimeout(() => {
        try { window.location.replace('about:blank'); } catch (e) {}
      }, 250);
    }

    audio.addEventListener('ended', end);
    setTimeout(end, 30000); // hard safety fallback at 30s
  }

})();
