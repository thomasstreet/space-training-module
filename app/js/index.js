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

  var spotLight	= new THREE.SpotLight( 0xFFFFFF );
  spotLight.target.position.set( 0, 0, -500 );
  spotLight.castShadow = true;
  spotLight.position.z	= 500;		
  spotLight.position.x	= 600;		
  scene.add( spotLight );	

  var sun = objects.sun;
  sun.position.copy(spotLight.position);
  scene.add(sun);

  setTimeout(addObjects, 5000);

  scene.add(skybox);
  var manager = new THREE.LoadingManager();
  manager.onProgress = function ( item, loaded, total ) {
    console.log( item, loaded, total );
  };

    //THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );
  //var loader = new THREE.OBJMTLLoader();
  //loader.load( 'assets/star-wars/ARC170/ARC170.obj', 'assets/star-wars/ARC170/ARC170.mtl', function ( object ) {
    ////object.position.y = - 80;
    //scene.add( object );
  //}, onProgress, onError );

  //var texture = new THREE.Texture();

  //var loader = new THREE.ImageLoader( manager );
  //loader.load( 'textures/UV_Grid_Sm.jpg', function ( image ) {
    //texture.image = image;
    //texture.needsUpdate = true;
  //} );
  //
  //
  //
  //var loader = new THREE.OBJLoader( manager );
  //loader.load('assets/star-wars/x-wing/star-wars-x-wing.obj', function (object) {
  ////loader.load('assets/Charizard.obj', function (object) {
    //object.scale.set(10, 10, 10);
    //object.traverse(function (child) {
      //if (child instanceof THREE.Mesh) {
        ////child.material.map = texture;
      //}
    //});
    //scene.add(object);
  //}, onProgress, onError);

  function onProgress() {
  }
  function onError() {
  }

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


function addObjects() {
  objects.planets.forEach((planet, i) => {
    setTimeout(() => {
      scene.add(planet.group);
      planet.fadeIn(500);
    }, 500 * i);
  });

  scene.add(leapHands.group);
  scene.leapHandsAdded = true;
}

function rotateObjects() {
  objects.planets.forEach((obj) => {
    obj.rotate();
  });
}

function determineIfObjectsAreHeld() {
  if (scene.leapHandsAdded) {
    objects.planets.forEach((obj) => {
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

  console.log(leapHands.holdingObjectWithId);
  // LeapHands are holding this object
  if (leapHands.holdingObjectWithId === object.id) {
    if (velocity && velocity[2] <= throwVelocityThreshold) {
      object.isHeldByLeapHands = false;

      object.moveToInitialPosition();

      leapHands.holdingObjectWithId = null;
      leapHands.timeWhenLastThrownObject = Date.now();
    } else {
      //var yDistance = object.initialDistanceWhenHeld[1];
      var yDistance = 100;

      object.group.position.x = palm.position.x + (yDistance * hand.normal[0]);
      object.group.position.y = palm.position.y + (yDistance * hand.normal[1]);
      object.group.position.z = palm.position.z + (yDistance * hand.normal[2]);

      object.group.updateMatrix();
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

      object.group.position.x = palm.position.x + object.initialDistanceWhenHeld[0];
      object.group.position.y = palm.position.y + object.initialDistanceWhenHeld[1];
      object.group.position.z = palm.position.z + object.initialDistanceWhenHeld[2];
    }
  }

  // LeapHands are already holding an object, but not this one.
  else {
    // Do nothing
  }
}
