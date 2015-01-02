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
  camera.position.z = 500;

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

  var sun = new THREE.Mesh(
    new THREE.SphereGeometry(50, 64, 64),
    new THREE.MeshBasicMaterial({ color: 0xff0000 }) 
  );
  sun.position.copy(spotLight.position);
  scene.add(sun);

  var planet = new Planet({
    radius: 105,
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

  var holding = false;
  var yDistance;

  function render() {
    planet.group.rotateY(-0.005);

    var hand = leapHands.rightHand;
    var palm = hand.palm;
    var velocity = leapHands.rightHand.velocity;

    if (holding) {

      if (velocity && velocity[2] <= -500) {
        console.log('thrown!!!');
        holding = false;

        planet.group.position.x = 0;
        planet.group.position.y = 0;
        planet.group.position.z = 0;
      } else {
        var n = hand.normal;
        planet.group.position.x = palm.position.x + (yDistance * n[0]);
        planet.group.position.y = palm.position.y + (yDistance * n[1]);
        planet.group.position.z = palm.position.z + (yDistance * n[2]);
        planet.group.updateMatrix();
      }

    } else {
      if (isInRange(planet.group, palm)) {
        holding = true;
        console.log('holding');

        // Save the initial yDistance when reaching for the planet
        yDistance = planet.group.position.y - palm.position.y;
        planet.group.position.x = palm.position.x;
        planet.group.position.y = palm.position.y + yDistance;
        planet.group.position.z = palm.position.z;
      }
    }

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


function isInRange(obj1, obj2) {
  var minDistance = 150;
  var dx = Math.abs(obj1.position.x - obj2.position.x);
  var dy = Math.abs(obj1.position.y - obj2.position.y);
  var dz = Math.abs(obj1.position.z - obj2.position.z);

  // Require a closer distance for z
  if (dx <= minDistance && dy <= minDistance && dz <= minDistance) {
    return true;
  }
  return false;
}

