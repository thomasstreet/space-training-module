'use strict';

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
  var ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);

  var spotLight	= new THREE.SpotLight( 0xFFFFFF );
  spotLight.target.position.set( 0, 0, -300 );
  spotLight.castShadow = true;
  spotLight.position.z	= 1000;
  spotLight.position.x	= 500;
  scene.add( spotLight );	

  var sun = objects.sun;
  sun.position.copy(spotLight.position);
  scene.add(sun);

  scene.add(skybox);

  setTimeout(() => {
    addObjectsToScene({
      onComplete() {
        scene.add(leapHands.right.group);
        scene.add(leapHands.left.group);

        scene.leapHandsAdded = true;

        leapHands.setUpHandEventHandlers();
      }
    });
  }, 5000);

  render();

  function render() {
    updateObjects();

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

function addObjectsToScene(options) {
  objects.objects.forEach((obj, i) => {
    setTimeout(() => {
      obj.attachToScene(scene);
      obj.fadeIn(500);

      // If last object, trigger callback
      if (i === objects.objects.length - 1) {
        options.onComplete();
      }
    }, 500 * i);
  });
}

function updateObjects() {
  var options = {
    objectInLeftHand: leapHands.left.getHeldObject(),
    objectInRightHand: leapHands.right.getHeldObject(),
  };

  objects.objects.forEach((obj) => {
    obj.update(options);
  });
}

function determineIfObjectsAreHeld() {
  if (scene.leapHandsAdded) {
    objects.objects.forEach(determineIfObjectIsHeld);
  }
}

var throwVelocityThreshold = -850;
var waitBeforeHoldingObjectAgain = 1000;
var timeWhenLastThrownObject = Date.now();

function determineIfObjectIsHeld(object) {
  leapHands.hands.forEach((hand) => {
    if (!hand.isVisible) return;

    var velocity = hand.velocity;

    // Hand is holding this object
    if (hand.isHoldingThisObject(object)) {
      if (velocity && velocity[2] <= throwVelocityThreshold) {
        object.moveToHomePosition({duration: 500});
        object.animateOutInfoView();

        hand.stopHoldingObject();
        timeWhenLastThrownObject = Date.now();
      } else {
        object.positionRelativeToHand(hand);
        object.determineIfShowInfoView();
      }
    } 

    // Hand is holding nothing, object is not being held, so check if object is close enough to be held
    else if (!hand.isHoldingAnyObject() && !leapHands.isEitherHandHoldingObject(object)) {
      if (hand.isInRangeOf(object)) {

        // If not enough time has elapsed since last held an object, don't hold
        if (Date.now() - timeWhenLastThrownObject < waitBeforeHoldingObjectAgain) {
          return;
        }

        hand.holdObject(object);
      }
    }

  });
}
