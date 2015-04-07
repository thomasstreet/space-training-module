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


var loadingEl = document.getElementById("loading");
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
  show(loopVideo);
  loopVideo.play();

  setTimeout(() => {
    loopVideo.loop = false;
    loopVideo.pause();
    hide(loopVideo);
    callback();

    setTimeout(startExitVideo, 2000);
  }, loopVideo.duration * 1000);
}

function startExitVideo() {
  hide(loadingVideo);

  document.body.className = ('loaded');
  show(exitVideo);
  exitVideo.play();

  setTimeout(() => {
    hide(exitVideo);
    exitVideo.pause();
  }, exitVideo.duration * 1000);
}

function show(el) {
  el.style.display = "block";
}

function hide(el) {
  el.style.display = "none";
}

module.exports = load;
