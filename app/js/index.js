'use strict';

var leapHands = require('./leap-hands');
var warningToast = require('./warning-toast');
var objects = require('./objects');
var skybox = require('./skybox');
var vr = require('./vr');
var loading = require('./loading');

var camera = require('./camera');

var viewport = document.getElementById('viewport');

var scene = new THREE.Scene();

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

  var spotLight	= new THREE.SpotLight(0xFFFFFF);
  spotLight.target.position.set(0, 0, -300);
  spotLight.castShadow = true;
  spotLight.position.z	= 1000;
  spotLight.position.x	= 500;
  scene.add(spotLight);	

  var sun = objects.sun;
  sun.position.copy(spotLight.position);
  scene.add(sun);

  scene.add(skybox);

  addObjectsToScene({
    onComplete() {
      scene.add(leapHands.right.group);
      scene.add(leapHands.left.group);

      scene.leapHandsAdded = true;

      leapHands.setUpHandEventHandlers();
    }
  });
  render();

  // set up click handling
  function onMouseDown(event) {
    var vector = new THREE.Vector3();
    var raycaster = new THREE.Raycaster();

    vector.set( (event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1, 0.5);
    vector.unproject(camera);
    raycaster.set(camera.position, vector.sub( camera.position ).normalize());
    var intersects = raycaster.intersectObjects(objects.objects);

    if (intersects[0]) {
      manualDisplayToggle(intersects[0]);
    }
  }

  window.addEventListener( 'mousedown', onMouseDown, false );

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
  warningToast.determineIfShouldShowPopup();
});

var manualDisplaySlots = {
  left: null,
  right: null
};

var manualDisplaySlotPositions = {
  left: new THREE.Vector3(-100, 0, 200),
  right: new THREE.Vector3(100, 0, 0)
};

function manualDisplayToggle(object) {
  if (manualDisplaySlots.left === object) {
    object.moveToHomePosition({duration: 300});
    manualDisplaySlots.left = null;
    object.animateOutInfoView();
  }
  else if (!manualDisplaySlots.left) {
    var destination = manualDisplaySlotPositions.left.clone();
    destination.add(object.manualDisplayPositionOffset);

    object.moveToPosition({destination: destination, duration: 300}, () => object.animateInInfoView());
    manualDisplaySlots.left = object;
  }
}

function addObjectsToScene(options) {
  objects.objects.forEach((obj, i) => {
    obj.attachToScene(scene);

    // If last object, trigger callback
    if (i === objects.objects.length - 1) {
      options.onComplete();
    }
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

    // Hand is holding nothing, neither hand is holding object, so check if object is close enough to be held
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
