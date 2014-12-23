'use strict';

var leapHands = require('./leap-hands');
var skybox = require('./skybox');
var vr = require('./vr');
var Planet = require('./planet');
var loading = require('./loading');

var viewport = document.getElementById('viewport');

function main(vrEnabled, vrHMD, vrHMDSensor) {
  var scene = new THREE.Scene();

  var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 100000);
  camera.position.z = 300;

  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  viewport.appendChild(renderer.domElement);

  if (vrHMD) {
    var vrrenderer = new THREE.VRRenderer(renderer, vrHMD);
  }

  // Camera control by mouse
  var controls = new THREE.OrbitControls(camera, renderer.domElement);

  // Needed to show textures
  var ambientLight = new THREE.AmbientLight( 0xffffff );
  scene.add(ambientLight);

  scene.add(leapHands.group);

  var planet = new Planet({
    radius: 50,
    color: 0x000000,
    moons: {
      count: 10
    }
  });

  setTimeout(function() {
    //planet.changeMaterial(
      //new THREE.MeshBasicMaterial({ color: 0xff00ff })
    //);

    var planetMaterial = new THREE.MeshPhongMaterial();
    planetMaterial.map = THREE.ImageUtils.loadTexture('assets/mars.jpg');
    planet.changeMaterial(planetMaterial);
  }, 5000);

  scene.add(planet.group);
  scene.add(skybox);

  render();

  function render() {
    if (vrEnabled) {
      var state = vrHMDSensor.getState();
      camera.quaternion.set(
        state.orientation.x,
        state.orientation.y,
        state.orientation.z,
        state.orientation.w
      );
      vrrenderer.render(scene, camera);
    }
    else {
      renderer.render(scene, camera);
    }
    requestAnimationFrame(render);
  }
}

loading(function() {
  vr.init(main);
  document.body.className = ('loaded');
});
