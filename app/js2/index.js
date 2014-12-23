'use strict';

var vrEnabled;
var vrHMD;
var vrHMDSensor;

require(['body', 'planet', 'rotate', 'orbit', 'SphereGlow', 'loop', 'leap'], function(Body, Planet, Rotate, Orbit, SphereGlow, Loop, Leap) {
  function main() {

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 100000);
    camera.position.z = 300;
    //camera.position.y = 100;

    // Initialize leap instance
    var leap = Leap();
    scene.add(leap.group);

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    if (vrHMD) {
      var vrrenderer = new THREE.VRRenderer(renderer, vrHMD);
    }

    var viewport = document.getElementById('viewport');
    viewport.appendChild(renderer.domElement);

    var ambientLight= new THREE.AmbientLight( 0xffffff );
    scene.add( ambientLight );

    var planet = new THREE.Group();
    var body = Body(Planet(50), Rotate(0.4));
    var glow = SphereGlow(50 * 1.4, 0xffff00, camera);
    planet.add(body);
    planet.add(glow);
    scene.add(planet);

    var moon = Body(Planet(10), Orbit(body, {major: 150, minor: 130}));
    scene.add(moon);



    var imagePrefix = "assets/omxos/";
    //var directions  = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"];
    var directions  = ["Left", "Right", "Up", "Down", "Front", "Back"];
    var imageSuffix = ".png";
    var skyGeometry = new THREE.CubeGeometry( 100000, 100000, 100000 );	
    
    var materialArray = [];
    for (var i = 0; i < 6; i++)
      materialArray.push( new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
        side: THREE.BackSide
      }));
    var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
    var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
    //scene.add( skyBox );

    var controls = new THREE.OrbitControls(camera, renderer.domElement);

    var axis = new THREE.Vector3(0, 1, 0);
    var holding = false;
    var yDistance;

    function animate() {
      var hand = leap.rightHand;
      var palm = hand.palm;
      var velocity = leap.rightHand.velocity;

      if (holding) {

        if (velocity && velocity[2] <= -500) {
          console.log('thrown!!!');
          holding = false;

          planet.position.x = velocity[0] / 100;
          planet.position.y = velocity[1] / 100;
          planet.position.z = velocity[2] / 100;
        } else {
          var n = hand.normal;
          planet.position.x = palm.position.x - (yDistance * n[0]);
          planet.position.y = palm.position.y - (yDistance * n[1]);
          planet.position.z = palm.position.z - (yDistance * n[2]);
          planet.updateMatrix();
        }

      } else {
        if (isInRange(planet, palm)) {
          holding = true;
          console.log('holding');

          // Save the initial yDistance when reaching for the planet
          yDistance = planet.position.y - palm.position.y;
          planet.position.x = palm.position.x;
          planet.position.y = palm.position.y + yDistance;
          planet.position.z = palm.position.z;
        }
      }
      
      render();
    }

    function render() {
      if (vrEnabled) {
        var state = vrHMDSensor.getState();
        camera.quaternion.set(state.orientation.x, 
            state.orientation.y, 
            state.orientation.z, 
            state.orientation.w);
        vrrenderer.render(scene, camera);
      }
      else {
        renderer.render(scene, camera);
      }
    }

    Loop.register(animate);
    Loop.start();

  }

  if (navigator.getVRDevices) {
    navigator.getVRDevices().then(vrDeviceCallback);
  } else if (navigator.mozGetVRDevices) {
    navigator.mozGetVRDevices(vrDeviceCallback);
  } else {
    main();
  }

  function isInRange(planet, palm) {
    var minDistance = 70;
    var dx = Math.abs(planet.position.x - palm.position.x);
    var dy = Math.abs(planet.position.y - palm.position.y);
    var dz = Math.abs(planet.position.z - palm.position.z);

    // Require a closer distance for z
    if (dx <= minDistance && dy <= minDistance && dz <= minDistance / 2) {
      return true;
    }
    return false;
  }

  function rotateAroundObjectAxis(object, axis, radians) {
    var rotObjectMatrix = new THREE.Matrix4();
    rotObjectMatrix.makeRotationAxis(axis.normalize(), radians);
    object.matrix.multiply(rotObjectMatrix);
    object.rotation.setFromRotationMatrix(object.matrix);
  }

  function vrDeviceCallback(vrdevs) {
    for (var i = 0; i < vrdevs.length; ++i) {
      if (vrdevs[i] instanceof HMDVRDevice) {
        vrHMD = vrdevs[i];
        break;
      }
    }
    for (var i = 0; i < vrdevs.length; ++i) {
      if (vrdevs[i] instanceof PositionSensorVRDevice &&
          vrdevs[i].hardwareUnitId == vrHMD.hardwareUnitId) {
        vrHMDSensor = vrdevs[i];
        break;
      }
    }
    if (vrHMD || vrHMDSensor) {
        var vrToggle = document.getElementById('vr-toggle');
        vrToggle.className = 'active';
        vrToggle.addEventListener('click', goVrFullscreen);
        document.addEventListener('webkitfullscreenchange', function() {
          if (!document.webkitFullscreenElement) {
            console.log('exit');
            vrEnabled = false;
          }
        }, false);
    }
    main();
  }

  function goVrFullscreen() {
    vrEnabled = true;
    var viewport = document.querySelector('#viewport canvas');
    viewport.webkitRequestFullScreen({ vrDisplay: vrHMD });
  }

});
