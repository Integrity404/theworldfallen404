const startLink = document.getElementById('startLink');
const screen = document.getElementById('screen');
const wallpaper = document.createElement('div');
wallpaper.id = 'wallpaper';

const terminal = document.getElementById('terminal');
const terminalText = document.getElementById('terminalText');

const scareAudio1 = document.getElementById('scareAudio1');
const scareAudio2 = document.getElementById('scareAudio2');
const scareAudio3 = document.getElementById('scareAudio3');

startLink.onclick = () => {
  startLink.style.display = 'none';
  screen.style.display = 'flex';
  setTimeout(() => {
    // Fullscreen
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen();
    }
    // Show wallpaper
    wallpaper.style.backgroundImage = "url('peaceful_wallpaper.jpg')";
    wallpaper.style.display = 'block';
    document.body.appendChild(wallpaper);
    startSequence();
  }, 100);
};

async function startSequence() {
  await new Promise(r => setTimeout(r, 10000));
  showTerminal();
  await simulateCommands();
  await playScareSequence();
}

function showTerminal() {
  terminal.style.display = 'block';
  terminalText.innerText = '';
}

async function simulateCommands() {
  const commands = [
    "Microsoft Windows [Version 10.0.22621.1265]\n(c) Microsoft Corporation. All rights reserved.\n\n",
    "C:\\Users\\YOU>locate user\nUser was found.\n\n",
    "C:\\Users\\YOU>locate me\nDeep below the universe.\n\n",
    "C:\\Users\\YOU>open void\nVoid opened, access to the universe valid.\n\n",
    "C:\\Users\\YOU>execute\nIM_HERE.EXE"
  ];

  for (let cmd of commands) {
    for (let i = 0; i < cmd.length; i++) {
      terminalText.innerText += cmd[i];
      await new Promise(r => setTimeout(r, 20));
    }
  }

  // Last word in red
  const lastLine = "IM_HERE.EXE";
  terminalText.innerHTML += `<span style="color:red;">${lastLine}</span>`;
  await new Promise(r => setTimeout(r, 2000));
  await playAndGlitch();
}

async function playAndGlitch() {
  scareAudio1.play();
  glitchEffect();
  await new Promise(r => setTimeout(r, 4050));
  document.body.style.backgroundColor = 'black';
  await new Promise(r => setTimeout(r, 5000));
  scareAudio2.play();
  await new Promise(r => setTimeout(r, 11230));
  startFinalSequence();
}

function glitchEffect() {
  const glitchInterval = setInterval(() => {
    const img = document.createElement('canvas');
    const ctx = img.getContext('2d');
    const width = window.innerWidth;
    const height = window.innerHeight;
    img.width = width;
    img.height = height;
    ctx.drawImage(document.body, 0, 0, width, height);
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      if (Math.random() < 0.5) {
        let r = data[i], g = data[i+1], b = data[i+2];
        data[i] = b;
        data[i+1] = r;
        data[i+2] = g;
      }
    }
    ctx.putImageData(imageData, 0, 0);
    document.body.style.backgroundImage = `url(${img.toDataURL()})`;
  }, 50);
  setTimeout(() => clearInterval(glitchInterval), 4050);
}

async function startFinalSequence() {
  scareAudio3.play();
  document.body.style.backgroundColor = 'black';
  await flashColors();
  showFinalMessage();
  await new Promise(r => setTimeout(r, 28000));
  window.close();
}

function flashColors() {
  return new Promise(async (resolve) => {
    const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFFFFF'];
    let i = 0;
    while (i < 50) {
      document.body.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      await new Promise(r => setTimeout(r, 50));
      i++;
    }
    resolve();
  });
}

function showFinalMessage() {
  const message = document.createElement('div');
  message.innerText = "WE FOUND YOU.";
  message.style.position = 'fixed';
  message.style.top = '50%';
  message.style.left = '50%';
  message.style.transform = 'translate(-50%, -50%)';
  message.style.fontSize = '48px';
  message.style.fontWeight = 'bold';
  message.style.color = getOppositeColor(document.body.style.backgroundColor);
  document.body.appendChild(message);

  fetch('https://api.ipify.org?format=json')
    .then(res => res.json())
    .then(data => {
      const ipText = document.createElement('div');
      ipText.innerText = data.ip;
      ipText.style.position = 'fixed';
      ipText.style.top = '60%';
      ipText.style.left = '50%';
      ipText.style.transform = 'translateX(-50%)';
      ipText.style.fontSize = '24px';
      ipText.style.color = getOppositeColor(document.body.style.backgroundColor);
      document.body.appendChild(ipText);
    });
}

function getOppositeColor(color) {
  if (!color || color === 'transparent') return '#fff';
  if (color.startsWith('#')) {
    const r = (255 - parseInt(color.substr(1,2), 16)).toString(16).padStart(2,'0');
    const g = (255 - parseInt(color.substr(3,2), 16)).toString(16).padStart(2,'0');
    const b = (255 - parseInt(color.substr(5,2), 16)).toString(16).padStart(2,'0');
    return `#${r}${g}${b}`;
  }
  return '#fff';
}
