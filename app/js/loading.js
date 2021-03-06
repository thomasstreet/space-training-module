var $ = require('./utils');

var loaded = [];

var imageSrcs = [
  // Skybox textures
  'assets/omxos/Left.png',
  'assets/omxos/Right.png',
  'assets/omxos/Up.png',
  'assets/omxos/Down.png',
  'assets/omxos/Front.png',
  'assets/omxos/Back.png',

  // Planet textures
  'assets/planet2432.jpg',
  'assets/new_sedna.png',
  'assets/texture_sun.jpg',

  // Model textures
  'assets/alien_fighter_1/color_1.jpg',
  'assets/alien_fighter_1/specular_1.jpg',
  'assets/alien_fighter_1/illumination_1.jpg',
  'assets/drone/light_drone_2_color.png',
  'assets/drone/light_drone_2_specular.png',
  'assets/drone/light_drone_2_illumination.png',
  'assets/warning-popup.png'
];

var videoEls = [
  document.getElementById('video-0'),
  document.getElementById('video-1'),
  document.getElementById('video-2'),
  document.getElementById('video-3')
];

var backgroundMusic = document.getElementById('background-music');
var loadingVideo = document.getElementById('loading-entrance');
var loopVideo = document.getElementById('loading-loop');
var exitVideo = document.getElementById('loading-exit');

var waitBeforePlayingLoadingVideos = 1000;

function load(callback) {
  setTimeout(startEntranceVideo.bind(null, callback), waitBeforePlayingLoadingVideos);
}

function initLoaders(callback) {
  imageSrcs.forEach(function(imageSrc) {
    var img = new Image();
    img.src = imageSrc;
    img.onload = function() {
      loaded.push(img.src);
      determineIfAllMediaLoaded(callback);
    };
  });

  videoEls.forEach((video) => {
    video.addEventListener('loadedmetadata', () => {
      // Can populate the loaded array with anything. Just need to get the count up
      loaded.push(video.id);
      determineIfAllMediaLoaded(callback);
    }, false);

    video.load();
  });
}

function determineIfAllMediaLoaded(callback) {
  var isEverythingLoaded = loaded.length === imageSrcs.length;
  if (isEverythingLoaded) {
    // Ensure that that the loading videos have had a chance to play before
    // initializing app.  Necessary when for all assets are cached, and
    // loading is immediate.
    setTimeout(initApp.bind(null, callback), loopVideo.duration * 1000);
  }
}

function initApp(callback) {
  $.hide(loopVideo);
  $.show(exitVideo);

  loopVideo.loop = null;
  loopVideo.pause();

  // Fire the callback that initializes the ThreeJS logic. Wrap in a setTimeout
  // so that calls to HTML5 Video api don't get blocked
  setTimeout(callback, 1);

  // Give the app js some time to execute before playing the exit video
  setTimeout(startExitVideo, 2000);
}



function startEntranceVideo(callback) {
  $.show(loadingVideo);
  loadingVideo.play();

  setTimeout(startLoopVideo.bind(null, callback), loadingVideo.duration * 1000);
}

function startLoopVideo(callback) {
  $.hide(loadingVideo);

  $.show(loopVideo);
  loopVideo.play();

  initLoaders(callback);
}

function startExitVideo() {
  // Hide all other videos, just incase they didn't get hidden before
  $.hide(loadingVideo);
  $.hide(loopVideo);

  exitVideo.play();
  backgroundMusic.play();

  setTimeout(() => {
    $.hide(exitVideo);
    $.hide(loadingVideo);
    $.hide(loopVideo);
    document.body.className = ('loaded');
  }, exitVideo.duration * 1000);
}

module.exports = load;
