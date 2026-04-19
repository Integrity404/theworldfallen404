const startLink = document.getElementById('start-link');

startLink.addEventListener('click', () => {
  document.body.innerHTML = '';
  document.body.requestFullscreen().then(() => {
    startSequence();
  });
});

async function startSequence() {
  // Show peaceful wallpaper for 10 seconds
  document.body.style.backgroundImage = "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.1&auto=format&fit=crop&w=1920&q=80')";
  document.body.style.backgroundSize = "cover";

  await new Promise(r => setTimeout(r, 10000));

  // Create terminal window
  const terminal = document.createElement('div');
  terminal.style.position = 'absolute';
  terminal.style.bottom = '10px';
  terminal.style.left = '10px';
  terminal.style.backgroundColor = 'black';
  terminal.style.color = 'white';
  terminal.style.fontFamily = 'monospace';
  terminal.style.padding = '10px';
  terminal.style.width = '80%';
  terminal.style.height = '50%';
  terminal.style.overflowY = 'auto';
  document.body.appendChild(terminal);

  const lines = [
    "Microsoft Windows [Version 10.0.22621.1265]",
    "(c) Microsoft Corporation. All rights reserved.",
    "",
    "C:\\Users\\YOU>locate user",
    "User was found.",
    "",
    "C:\\Users\\YOU>locate me",
    "Deep below the universe.",
    "",
    "C:\\Users\\YOU>open void",
    "Void opened, access to the universe valid.",
    "",
    "C:\\Users\\YOU>execute",
    "IM_HERE.EXE"
  ];

  for (let i = 0; i < lines.length; i++) {
    await typeLine(terminal, lines[i]);
    await new Promise(r => setTimeout(r, 500));
  }

  // Display IM_HERE.EXE in blood red
  const bloodRedSpan = document.createElement('span');
  bloodRedSpan.textContent = 'IM_HERE.EXE';
  bloodRedSpan.style.color = 'red';
  terminal.appendChild(bloodRedSpan);

  // Wait 2 seconds then play sound
  await new Promise(r => setTimeout(r, 2000));
  playAudio('ascsendingjumpscare.mp3');

  // Glitch effect for 4.05 seconds
  glitchPage(4050);

  // Wait until glitch is over
  await new Promise(r => setTimeout(r, 4050));

  // Page black
  document.body.style.backgroundColor = 'black';

  // Wait 5 seconds then play second audio
  await new Promise(r => setTimeout(r, 5000));
  playAudio('beforesoundline.mp3');

  // Wait for second audio to finish
  await new Promise(r => setTimeout(r, 11230));

  // Play last audio and start flashing text
  playAudio('HELL.mp3');
  startFlashingText();

  // Wait for last audio to finish
  await new Promise(r => setTimeout(r, 28000));

  // Close page
  window.close();
}

function typeLine(container, line) {
  return new Promise(resolve => {
    let i = 0;
    const span = document.createElement('div');
    container.appendChild(span);
    const interval = setInterval(() => {
      span.textContent += line[i];
      i++;
      if (i >= line.length) {
        clearInterval(interval);
        resolve();
      }
    }, 50);
  });
}

function playAudio(src) {
  const audio = new Audio(src);
  audio.play();
  return new Promise(r => {
    audio.onended = r;
  });
}

function glitchPage(duration) {
  const originalFilter = document.body.style.filter;
  const interval = setInterval(() => {
    document.body.style.filter = `blur(${Math.random() * 5}px)`;
  }, 100);
  setTimeout(() => {
    clearInterval(interval);
    document.body.style.filter = originalFilter;
  }, duration);
}

function startFlashingText() {
  const flashingDiv = document.createElement('div');
  flashingDiv.style.position = 'absolute';
  flashingDiv.style.top = '50%';
  flashingDiv.style.left = '50%';
  flashingDiv.style.transform = 'translate(-50%, -50%)';
  flashingDiv.style.fontSize = '48px';
  flashingDiv.style.fontWeight = 'bold';
  document.body.appendChild(flashingDiv);

  const message = "WE FOUND YOU.";
  let colorFlag = false;
  let ipAddress = 'Your IP: 192.168.1.1'; // Placeholder, replace with actual IP if possible

  const interval = setInterval(() => {
    flashingDiv.textContent = message;
    flashingDiv.style.color = colorFlag ? 'white' : 'black';
    colorFlag = !colorFlag;
  }, 100);

  // Stop flashing after 28 seconds
  setTimeout(() => {
    clearInterval(interval);
    flashingDiv.remove();
    window.close();
  }, 28000);
}
