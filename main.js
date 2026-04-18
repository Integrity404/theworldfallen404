function fullscreen()
  const element = document.getElementById('linkContainer');
  element.style.display = 'block'; 
}

documentgetElementById("linkContainer").addEventListener('click', function() {
   fullscreen();
});

function showWallpaper() { 
    // your browser's API to change the wallpaper 
    // You might need to check for specific options like 'window.screenSize')}

// Add event listener to show wallpaper on click of link
documentgetElementById("linkContainer").addEventListener('click', function() {
showWallpaper(); 
});


function displayText() {
  const textLines = [
    "Microsoft [Version 10..22621.1265]",
    "(c) Microsoft Corporation. All rights.",
    "C:\\YOU>locate user",
    "User was found.",
    "C:\Users\YOU>locate me",
    "Deep the universe.",
    "C:\Users\YOU>open void",
    "Void opened, to the universe valid.",
    C:\Users\YOU>execute",
    "IM_HERE.EXE", 
  

   for (let i = ; i < textLines.length; i++) {
     document.querySelector('#commandPrompt'). += textLines[i] + "<br>";
}


}



// Add event listener to show wallpaper on click of link
documentgetElementById("linkContainer").addEventListener('click', function()
   displayText(); 
});
