var IMAGES = [
  // Skybox textures
  'assets/omxos/Left.png',
  'assets/omxos/Right.png',
  'assets/omxos/Up.png',
  'assets/omxos/Down.png',
  'assets/omxos/Front.png',
  'assets/omxos/Back.png',

  // Planet textures
  'assets/mars.jpg',
  'assets/planet_hoth.png',
  "assets/texture_sun.jpg",
];


function load(callback) {
  var loaded = [];

  var loadingVideo = document.getElementById("loading-entrance");
  var loopVideo = document.getElementById("loading-loop");
  var exitVideo = document.getElementById("loading-exit");

  setTimeout(() => {
    show(loadingVideo);
    loadingVideo.play();

    setTimeout(() => {
      hide(loadingVideo);

      show(loopVideo);
      loopVideo.play();

      console.log(loopVideo.duration * 1000);

      setTimeout(() => {
        hide(loadingVideo);
        loopVideo.pause();

        show(exitVideo);
        exitVideo.play();

        setTimeout(() => {
          callback();
        }, exitVideo.duration * 1000);

      }, loopVideo.duration * 1000);

    }, loadingVideo.duration * 1000);
  }, 1000);

  IMAGES.forEach(function(imageSrc) {
    var img = new Image();
    img.src = imageSrc;
    img.onload = function() {
      loaded.push(img);
      if (loaded.length === IMAGES.length) {
      }
    };
  });
}

function show(el) {
  el.style.display = "block";
}

function hide(el) {
  el.style.display = "none";
}

module.exports = load;
