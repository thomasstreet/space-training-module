'use strict';

var utils = require('./utils');

var leapHands = require('./leap-hands');
var objects = require('./objects');
var skybox = require('./skybox');
var vr = require('./vr');
var Planet = require('./planet');
var loading = require('./loading');

var scene = require('./scene');
var camera = require('./camera');

var viewport = document.getElementById('viewport');

function main(vrEnabled, vrHMD, vrHMDSensor) {
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

  var sun = objects.sun;
  sun.position.copy(spotLight.position);
  scene.add(sun);

  addObjects();

  setTimeout(addObjects, 5000);

  scene.add(skybox);

  render();

  function render() {
    rotateObjects();

    determineIfObjectsAreHeld();

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

function addObjects() {
  objects.planets.forEach((planet) => {
    scene.add(planet.group);
    planet.fadeIn();
  });

  scene.add(leapHands.group);
  scene.leapHandsAdded = true;
}

function rotateObjects() {
  objects.planets.forEach((planet) => {
    planet.group.rotateY(-0.005);
  });
}

function determineIfObjectsAreHeld() {
  if (scene.leapHandsAdded) {
    objects.planets.forEach((planet) => {
      determineIfPlanetIsHeld(planet);
    });
  }
}

var throwVelocityThreshold = -850;
var waitBeforeHoldingObjectAgain = 1000;

function determineIfPlanetIsHeld(object) {
  var hand = leapHands.rightHand;
  var palm = hand.palm;
  var velocity = leapHands.rightHand.velocity;

  // LeapHands are holding this planet
  if (leapHands.holdingObjectWithId === object.id) {
    if (velocity && velocity[2] <= throwVelocityThreshold) {
      object.isHeldByLeapHands = false;

      //var tween = new TWEEN.Tween({pos: 0}).to({pos: 1}, 5000);
      //tween.easing(TWEEN.Easing.Quartic.InOut);

      object.group.position.set(
        object.initialPosition[0],
        object.initialPosition[1],
        object.initialPosition[2]
      );

      leapHands.holdingObjectWithId = null;
      leapHands.timeWhenLastThrownObject = Date.now();
    } else {
      var n = hand.normal;
      var yDistance = object.initialYDistanceWhenHeld;
      object.group.position.x = palm.position.x + (yDistance * n[0]);
      object.group.position.y = palm.position.y + (yDistance * n[1]);
      object.group.position.z = palm.position.z + (yDistance * n[2]);
      object.group.updateMatrix();
    }
  } 

  // LeapHands are holding nothing
  else if (leapHands.holdingObjectWithId === null) {
    if (isInRange(object.group, palm)) {

      // If not enough time has elapsed since last held an object, don't hold
      if (Date.now() - leapHands.timeWhenLastThrownObject < waitBeforeHoldingObjectAgain) {
        return;
      }

      leapHands.holdingObjectWithId = object.id;
      object.isHeldByLeapHands = true;

      // Save the initial yDistance when reaching for the object
      //this.initialYDistanceWhenHeld = object.group.position.y - palm.position.y;
      object.initialYDistanceWhenHeld = 150;
      object.group.position.x = palm.position.x;
      object.group.position.y = palm.position.y + object.initialYDistanceWhenHeld;
      object.group.position.z = palm.position.z;
    }
  }

  // LeapHands are already holding an object, but not this one.
  else {
    // Do nothing
  }
}
