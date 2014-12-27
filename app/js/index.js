'use strict';

var utils = require('./utils');

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
  //scene.add(ambientLight);

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
  scene.add(sphereMesh);

  scene.add(leapHands.group);

  var planet = new Planet({
    radius: 50,
    color: 0x000000,
    moons: {
      count: 10
    }
  });

  setTimeout(function() {
    var planetMaterial = new THREE.MeshPhongMaterial({
      ambient		: 0xFFFFFF,
      shininess	: 10, 
      shading		: THREE.SmoothShading,
      transparent: true,
      map: THREE.ImageUtils.loadTexture('assets/mars.jpg')
    });
    planet.changeMaterial(planetMaterial);
  }, 5000);

  scene.add(planet.group);
  scene.add(skybox);

  render();

  var angle = 0;
  function render() {
    planet.group.rotateY(-0.005);
    angle += Math.PI / 360;
    angle %= Math.PI * 2;
    planet.sphereMesh.material.opacity = Math.abs(Math.cos(angle));

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
