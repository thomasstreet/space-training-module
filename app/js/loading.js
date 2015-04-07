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


var loadingVideo = document.getElementById("loading-entrance");
var loopVideo = document.getElementById("loading-loop");
var exitVideo = document.getElementById("loading-exit");

var waitBeforePlayingLoadingVideos = 1000;

function load(callback) {
  var loaded = [];

  setTimeout(startEntranceVideo.bind(null, callback), waitBeforePlayingLoadingVideos);

  IMAGES.forEach(function(imageSrc) {
    var img = new Image();
    img.src = imageSrc;
    img.onload = function() {
      loaded.push(img);
      if (loaded.length === IMAGES.length) {
        //setTimeout(startExitVideo, loopVideo.duration * 1000);
      }
    };
  });
}

function startEntranceVideo(callback) {
  show(loadingVideo);
  loadingVideo.play();

  setTimeout(startLoopVideo.bind(null, callback), loadingVideo.duration * 1000);
}

function startLoopVideo(callback) {
  hide(loadingVideo);

  show(loopVideo);
  loopVideo.play();

  setTimeout(initializeApp.bind(null, callback), loopVideo.duration * 1000);
}

function initializeApp(callback) {
  loopVideo.loop = null;
  hide(loopVideo);
  loopVideo.pause();
  show(exitVideo);

  setTimeout(callback, 1);

  setTimeout(startExitVideo, 2000);
}

function startExitVideo() {
  exitVideo.play();

  setTimeout(() => {
    hide(exitVideo);
    document.body.className = ('loaded');
  }, exitVideo.duration * 1000);
}

function show(el) {
  el.style.display = "block";
}

function hide(el) {
  el.style.display = "none";
}

module.exports = load;
