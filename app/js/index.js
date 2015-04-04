'use strict';

var utils = require('./utils');

var leapHands = require('./leap-hands');
var objects = require('./objects');
var skybox = require('./skybox');
var vr = require('./vr');
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
  //var ambientLight = new THREE.AmbientLight(0x404040);
  var ambientLight = new THREE.AmbientLight(0xffffff);
  scene.add(ambientLight);

  var spotLight	= new THREE.SpotLight( 0xFFFFFF );
  spotLight.target.position.set( 0, 0, 100 );
  spotLight.castShadow = true;
  spotLight.position.z	= 500;		
  spotLight.position.x	= 100;
  scene.add( spotLight );	

  var sun = objects.sun;
  sun.position.copy(spotLight.position);
  scene.add(sun);

  setTimeout(addObjects, 5000);

  scene.add(skybox);

  render();

  function render(time) {
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


function addObjects() {
  objects.objects.forEach((planet, i) => {
    setTimeout(() => {
      planet.attachToScene(scene);
      planet.fadeIn(500);
    }, 500 * i);
  });

  scene.add(leapHands.group);
  scene.leapHandsAdded = true;
}

function rotateObjects() {
  objects.objects.forEach((obj) => {
    obj.rotate();
  });
}

function determineIfObjectsAreHeld() {
  if (scene.leapHandsAdded) {
    objects.objects.forEach((obj) => {
      determineIfObjectIsHeld(obj);
    });
  }
}

var throwVelocityThreshold = -850;
var waitBeforeHoldingObjectAgain = 1000;

function determineIfObjectIsHeld(object) {
  var hand = leapHands.rightHand;
  var palm = hand.palm;
  var velocity = leapHands.rightHand.velocity;

  // LeapHands are holding this object
  if (leapHands.holdingObjectWithId === object.id) {
    if (velocity && velocity[2] <= throwVelocityThreshold) {
      object.isHeldByLeapHands = false;

      object.moveToInitialPosition(1000);
      object.hideInfoViewImmediately();

      leapHands.holdingObjectWithId = null;
      leapHands.timeWhenLastThrownObject = Date.now();
    } else {
      object.positionRelativeToHand(hand);
      object.determineIfShowInfoView();
    }
  } 

  // LeapHands are holding nothing, so check if object is close enough to be held
  else if (!leapHands.holdingObjectWithId) {
    if (object.isInRange(palm)) {

      // If not enough time has elapsed since last held an object, don't hold
      if (Date.now() - leapHands.timeWhenLastThrownObject < waitBeforeHoldingObjectAgain) {
        return;
      }

      leapHands.holdingObjectWithId = object.id;
      object.isHeldByLeapHands = true;

      // Save the initial yDistance when reaching for the object
      object.initialDistanceWhenHeld = [
        object.group.position.x - palm.position.x,
        object.group.position.y - palm.position.y,
        object.group.position.z - palm.position.z
      ];
    }
  }

  // LeapHands are already holding an object, but not this one.
  else {
    // Do nothing
  }
}
