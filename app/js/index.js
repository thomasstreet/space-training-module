'use strict';

var utils = require('./utils');
var gui = require('./gui');

var leapHands = require('./leap-hands');
var skybox = require('./skybox');
var vr = require('./vr');
var Planet = require('./planet');
var loading = require('./loading');

var scene = require('./scene');

var viewport = document.getElementById('viewport');

function main(vrEnabled, vrHMD, vrHMDSensor) {
  var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 100000);
  camera.position.z = 300;

  var renderer = new THREE.WebGLRenderer();
  renderer.shadowMapEnabled = true;
  // to antialias the shadow
  renderer.shadowMapType = THREE.PCFSoftShadowMap;

  renderer.setSize(window.innerWidth, window.innerHeight);
  viewport.appendChild(renderer.domElement);

  if (vrHMD) {
    var vrrenderer = new THREE.VRRenderer(renderer, vrHMD);
  }

  // Camera control by mouse
  var controls = new THREE.OrbitControls(camera, renderer.domElement);

  // Needed to show textures
  var ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);

	var spotLight	= new THREE.SpotLight( 0xFFFFFF );
	spotLight.target.position.set( 0, 0, -500 );
  spotLight.castShadow = true;
  spotLight.position.z	= 500;		
  spotLight.position.x	= 600;		
	scene.add( spotLight );	

  var material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  //material.emissive = 0xffffff;
  var sphereMesh = new THREE.Mesh(
    new THREE.SphereGeometry(50, 64, 64),
    material
  );
  sphereMesh.position.copy(spotLight.position);
  //scene.add(sphereMesh);

  var planet = new Planet({
    radius: 110,
    color: 0x000000,
    moons: {
      count: 2
    }
  });

  setTimeout(function() {
    scene.add(planet.group);
    planet.fadeIn();
    gui.deleteSphere(function() {
      scene.add(leapHands.group);
    });

  }, 10000);

  scene.add(skybox);

  render();

  function render() {
    planet.group.rotateY(-0.005);

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
