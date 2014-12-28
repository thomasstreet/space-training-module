var scene = require('./scene');

var tween = new TWEEN.Tween({pos: 0}).to({pos: 1}, 5000);
tween.easing(TWEEN.Easing.Quartic.InOut);

var sphere;

var material = new THREE.PointCloudMaterial({
    color: 0xffffff,
    size: 5,
    opacity: 0.6,
    transparent: true,
    blending: THREE.AdditiveBlending,
    map: generateSprite()
});

// setup the control gui
function Controls() {
  // we need the first child, since it's a multimaterial
  this.radius = 100;
  this.widthSegments = 64;
  this.heightSegments = 32;
  this.phiStart = 0;

  this.phiLength = 0;
  this.thetaStart = 0;
  this.thetaLength = Math.PI;


  this.redraw = function () {
    // remove the old plane
    if (sphere) {
      scene.remove(sphere);
    }
    // create a new one
    var geometry = new THREE.SphereGeometry(
      this.radius,
      this.widthSegments,
      this.heightSegments,
      this.phiStart,
      this.phiLength,
      this.thetaStart,
      this.thetaLength
    );

    sphere = new THREE.PointCloud(geometry, material);
    sphere.sortParticles = true;

    // add it to the scene.
    scene.add(sphere);
  }.bind(this);
}
var controls = new Controls();

setTimeout(animateIn, 5000);

tween.onUpdate(function() {
  controls.phiLength = this.pos * (Math.PI * 2); 
  controls.redraw();
  //if (controls.phiLength >= Math.PI * 2) {
    //clearInterval(interval);
  //}
});

function animateIn() {
  tween.start();
  var interval = setInterval(TWEEN.update, 16);
}

function rotate() {
  var interval = setInterval(function() {
    this.phiLength += Math.PI / 90; 
    this.redraw();
    if (this.phiLength >= Math.PI * 2) {
      clearInterval(interval);
    }
  }.bind(controls), 16);
}

var gui = new dat.GUI();
gui.add(controls, 'radius', 0, 1000).onChange(controls.redraw);
gui.add(controls, 'widthSegments', 0, 128).onChange(controls.redraw);
gui.add(controls, 'heightSegments', 0, 128).onChange(controls.redraw);
gui.add(controls, 'phiStart', 0, 2 * Math.PI).onChange(controls.redraw);
gui.add(controls, 'phiLength', 0, 2 * Math.PI).onChange(controls.redraw);
gui.add(controls, 'thetaStart', 0, 2 * Math.PI).onChange(controls.redraw);
gui.add(controls, 'thetaLength', 0, 2 * Math.PI).onChange(controls.redraw);


// from THREE.js examples
function generateSprite() {
    var canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;

    var context = canvas.getContext('2d');
    var gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.2, 'rgba(0,255,255,1)');
    gradient.addColorStop(0.4, 'rgba(0,0,64,1)');
    gradient.addColorStop(1, 'rgba(0,0,0,1)');

    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    return texture;
}

module.exports = gui;
