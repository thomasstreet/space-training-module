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
  var ambientLight = new THREE.AmbientLight(0x404040);
  //var ambientLight = new THREE.AmbientLight(0xffffff);
  scene.add(ambientLight);

 //var directionalLight = new THREE.DirectionalLight(0xffffff);
      //directionalLight.position.set(1, 0, 2).normalize();
      //scene.add(directionalLight);

  var spotLight	= new THREE.SpotLight( 0xFFFFFF );
  spotLight.target.position.set( 0, 0, -300 );
  spotLight.castShadow = true;
  spotLight.position.z	= 500;		
  spotLight.position.x	= 500;
  spotLight.intensity = 1.0;
  scene.add( spotLight );	

  var sun = objects.sun;
  sun.position.copy(spotLight.position);
  scene.add(sun);

  setTimeout(addObjects, 5000);

  scene.add(skybox);


  leapHands.loop.on('handFound', function(data) {
    var hand = data.type === 'left' ? leapHands.left : leapHands.right;
    hand.showHand(data);
  })
  .on('handLost', function(data) {
    var hand = data.type === 'left' ? leapHands.left : leapHands.right;

    if (hand.holdingObjectWithId) {
      var heldObject = objects.objects.filter((obj) => {
        return hand.holdingObjectWithId == obj.id;
      })[0];
      heldObject.moveToHomePosition({duration: 500});
      heldObject.hideInfoViewImmediately();

      this.holdingObjectWithId = null;
    }

    hand.hideHand(data);
  });

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

function isHoldingTwoBattleGroups() {
  for (var i = 0; i < leapHands.hands.length; i++) {
    var hand = leapHands.hands[i];

    if (!hand.holdingObjectWithId) return false;

    var heldObject = objects.objects.filter((obj) => {
      return hand.holdingObjectWithId == obj.id;
    })[0];

    if (heldObject.type != "BattleGroup") return false;
  }

  return true;
}

function updateObjects() {
  var options = {
    isHoldingTwoBattleGroups: isHoldingTwoBattleGroups(),
  };

  if (options.isHoldingTwoBattleGroups) {
    var leftHandObject = objects.objects.filter((obj) => {
      return leapHands.left.holdingObjectWithId == obj.id;
    })[0];

    var rightHandObject = objects.objects.filter((obj) => {
      return leapHands.right.holdingObjectWithId == obj.id;
    })[0];

    options.leftHandObject =leftHandObject;
    options.rightHandObject = rightHandObject;
  }

  objects.objects.forEach((obj) => {
    obj.update(options);
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
var timeWhenLastThrownObject = Date.now();

function determineIfObjectIsHeld(object) {
  leapHands.hands.forEach((hand) => {
    if (!hand.isVisible) return;

    var palm = hand.palm;
    var velocity = hand.velocity;

    // Hand is holding this object
    if (hand.holdingObjectWithId === object.id) {
      if (velocity && velocity[2] <= throwVelocityThreshold) {
        object.moveToHomePosition({duration: 500});
        object.hideInfoViewImmediately();

        hand.holdingObjectWithId = null;
        timeWhenLastThrownObject = Date.now();
      } else {
        object.positionRelativeToHand(hand);
        object.determineIfShowInfoView();
      }
    } 

    // Hand is holding nothing, object is not being held, so check if object is close enough to be held
    else if (!hand.holdingObjectWithId && !leapHands.isObjectNotBeingHeld(object)) {
      if (object.isInRange(palm)) {

        // If not enough time has elapsed since last held an object, don't hold
        if (Date.now() - timeWhenLastThrownObject < waitBeforeHoldingObjectAgain) {
          return;
        }

        hand.holdingObjectWithId = object.id;
      }
    }

  });
}
