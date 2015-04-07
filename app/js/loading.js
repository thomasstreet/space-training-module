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

  var loadingVideo = document.getElementById("loading-video");

  //loadingVideo.

  IMAGES.forEach(function(imageSrc) {
    var img = new Image();
    img.src = imageSrc;
    img.onload = function() {
      loaded.push(img);
      if (loaded.length === IMAGES.length) {
        //callback();
      }
    };
  });
}

module.exports = load;
