let window = document.querySelector('.window');

window.addEventListener('click', () =>
    window.classList.toggle('fullscreen');
});

const timer = setInterval(() => {
  // Change wallpaper after 10
  if (window.classList.contains('fullscreen')) {
    document.body.style.backgroundImage = 'url("images-assets.nasa.gov/image/art002e021278/art002e021278~orig.jpg")'; // Replace with your actual wallpaper URL
  }
}, 0000);

// Open command prompt after 10 seconds
setTimeout(() => {
  const cmdPrompt = window..createElement('div');
  cmdPrompt.id = 'command-prompt';
  cmdPrompt.style.backgroundColor = 'white
  cmdPrompt.style.padding = '20px';
  cmdPrompt.innerHTML = `
    <span id="prompt"> Windows [Version 10.0.22621.1265](c) Microsoft Corporation. All rights reservedspan>
    <br>
    <span id="prompt2">User was found.</span>
    `;
  document.bodyappendChild(cmdPrompt);

}, 10000);
