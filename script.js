const app = document.getElementById("app");

const audio1 = new Audio("acsendingjumpscare.mp3");
const audio2 = new Audio("beforesoundline.mp3");
const audio3 = new Audio("HELL.mp3");

let started = false;

document.addEventListener("click", startExperience, { once: true });

function startExperience() {
  if (started) return;
  started = true;

  document.documentElement.requestFullscreen?.().catch(()=>{});

  showWallpaper();

  setTimeout(openTerminal, 10000);
}

function showWallpaper() {
  const wall = document.createElement("div");
  wall.className = "wallpaper";
  wall.id = "wallpaper";
  app.appendChild(wall);
}

function openTerminal() {
  const term = document.createElement("div");
  term.className = "terminal";
  term.id = "terminal";
  app.appendChild(term);

  const lines = [
`Microsoft Windows [Version 10.0.22621.1265]
(c) Microsoft Corporation. All rights reserved.

C:\\Users\\YOU> locate user
User was found.

C:\\Users\\YOU> locate me
Deep below the universe.

C:\\Users\\YOU> open void
Void opened, access to the universe valid.

C:\\Users\\YOU> IM_HERE.EXE`
  ];

  typeLines(term, lines[0], 18, () => {
    audio1.play().catch(()=>{});
    setTimeout(glitchPhase, 2000);
  });
}

function typeLines(el, text, speed, done) {
  let i = 0;
  const timer = setInterval(() => {
    el.textContent += text[i];
    i++;
    if (i >= text.length) {
      clearInterval(timer);
      done?.();
    }
  }, speed);
}

function glitchPhase() {
  document.body.classList.add("glitch");

  setTimeout(() => {
    document.body.classList.remove("glitch");
    app.innerHTML = "";
    blackScreen();
  }, 4050);
}

function blackScreen() {
  document.body.style.background = "black";

  setTimeout(() => {
    audio2.play().catch(()=>{});
    scheduleFinal();
  }, 5000);
}

function scheduleFinal() {
  // 11m23s = 683 seconds
  setTimeout(() => {
    audio3.play().catch(()=>{});
    finalScene();
  }, 683000);
}

function finalScene() {
  const final = document.createElement("div");
  final.className = "final flashA";
  final.id = "final";
  final.innerHTML = "THE GATES TO THIS WORLD IS NO MORE.<br>PERISH";

  app.appendChild(final);

  const classes = ["flashA", "flashB", "flashC", "flashD"];
  let i = 0;

  const flash = setInterval(() => {
    final.className = "final " + classes[i % classes.length];
    i++;
  }, 100);

  setTimeout(() => {
    clearInterval(flash);
    final.innerHTML = "END";
  }, 28000);
}
