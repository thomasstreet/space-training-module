(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/andrelevi/webgl/planet-creator/app/js/atmosphereGlowMaterial.js":[function(require,module,exports){
"use strict";
var __moduleName = "atmosphereGlowMaterial";
var material = new THREE.ShaderMaterial({
  vertexShader: document.getElementById('vertexAtmosphereGlow').textContent,
  fragmentShader: document.getElementById('fragmentAtmosphereGlow').textContent,
  side: THREE.BackSide,
  blending: THREE.AdditiveBlending,
  transparent: true
});
module.exports = material;

},{}],"/Users/andrelevi/webgl/planet-creator/app/js/index.js":[function(require,module,exports){
"use strict";
var __moduleName = "index";
'use strict';
var leapHands = require('./leap-hands');
var skybox = require('./skybox');
var vr = require('./vr');
var viewport = document.getElementById('viewport');
function main(vrEnabled, vrHMD, vrHMDSensor) {
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100000);
  camera.position.z = 300;
  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  viewport.appendChild(renderer.domElement);
  if (vrHMD) {
    var vrrenderer = new THREE.VRRenderer(renderer, vrHMD);
  }
  var controls = new THREE.OrbitControls(camera, renderer.domElement);
  var ambientLight = new THREE.AmbientLight(0xffffff);
  scene.add(ambientLight);
  scene.add(leapHands.group);
  scene.add(skybox);
  render();
  function render() {
    if (vrEnabled) {
      var state = vrHMDSensor.getState();
      camera.quaternion.set(state.orientation.x, state.orientation.y, state.orientation.z, state.orientation.w);
      vrrenderer.render(scene, camera);
    } else {
      renderer.render(scene, camera);
    }
    requestAnimationFrame(render);
  }
}
vr.init(main);

},{"./leap-hands":"/Users/andrelevi/webgl/planet-creator/app/js/leap-hands.js","./skybox":"/Users/andrelevi/webgl/planet-creator/app/js/skybox.js","./vr":"/Users/andrelevi/webgl/planet-creator/app/js/vr.js"}],"/Users/andrelevi/webgl/planet-creator/app/js/leap-hands.js":[function(require,module,exports){
"use strict";
var __moduleName = "leap-hands";
var atmosphereGlowMaterial = require('./atmosphereGlowMaterial');
var group = new THREE.Group();
var left = {
  palm: null,
  fingerTips: []
};
var right = {
  palm: null,
  fingerTips: [],
  velocity: null
};
var geometry = new THREE.TorusGeometry(25, 1, 32, 32);
var material = new THREE.MeshBasicMaterial();
var outer = new THREE.Mesh(geometry, material);
geometry = new THREE.TorusGeometry(15, 1, 32, 32);
var inner = new THREE.Mesh(geometry, material);
inner.position.z = -5;
left.palm = new THREE.Group();
left.palm.add(outer);
left.palm.add(inner);
left.palm.position.z = 200;
hide(left.palm);
group.add(left.palm);
outer = new THREE.Mesh(new THREE.TorusGeometry(25, 0.5, 32, 32), new THREE.MeshBasicMaterial({color: 0xffffff}));
inner = new THREE.Mesh(new THREE.TorusGeometry(20, 0.5, 32, 32), new THREE.MeshBasicMaterial({color: 0xffffff}));
inner.position.z = -3;
right.palm = new THREE.Group();
right.palm.add(outer);
right.palm.add(inner);
right.palm.position.z = 200;
hide(right.palm);
group.add(right.palm);
var geometry = new THREE.CylinderGeometry(10, 10, 1, 32, 32);
var material = new THREE.MeshBasicMaterial();
var ball;
for (var i = 0; i < 5; i++) {
  var finger = new THREE.Group();
  var leftSphere = new THREE.Mesh(geometry, material);
  ball = new THREE.Mesh(new THREE.SphereGeometry(10, 32, 16), atmosphereGlowMaterial);
  finger.add(leftSphere);
  finger.add(ball);
  left.fingerTips.push(finger);
  hide(leftSphere);
  group.add(finger);
  var rightSphere = new THREE.Mesh(geometry, material);
  right.fingerTips.push(rightSphere);
  hide(rightSphere);
  group.add(rightSphere);
}
Leap.loop({background: true}, {hand: function(data) {
    var hand = data.type === 'left' ? left : right;
    data.fingers.forEach(function(finger, i) {
      var sphere = hand.fingerTips[i];
      sphere.position.fromArray(finger.tipPosition);
      var n = finger.direction;
      sphere.lookAt(new THREE.Vector3(n[0] * 1000, n[1] * 1000, n[2] * 1000));
      sphere.updateMatrix();
    });
    var palm = hand.palm;
    palm.position.fromArray(data.palmPosition);
    hand.velocity = data.palmVelocity;
    hand.normal = data.palmNormal;
    var n = data.palmNormal;
    hand.palm.lookAt(new THREE.Vector3(n[0] * 1000, n[1] * 1000, n[2] * 1000));
    hand.palm.updateMatrix();
  }}).use('handEntry').on('handFound', function(data) {
  var hand = data.type === 'left' ? left : right;
  data.fingers.forEach(function(finger, i) {
    var sphere = hand.fingerTips[i];
    show(sphere);
  });
  var palm = hand.palm;
  show(palm);
}).on('handLost', function(data) {
  var hand = data.type === 'left' ? left : right;
  data.fingers.forEach(function(finger, i) {
    var sphere = hand.fingerTips[i];
    hide(sphere);
  });
  var palm = hand.palm;
  hide(palm);
});
function show(mesh) {
  mesh.traverse(function(child) {
    child.visible = true;
  });
}
function hide(mesh) {
  mesh.traverse(function(child) {
    child.visible = false;
  });
}
module.exports = {
  group: group,
  rightHand: right,
  leftHand: left
};

},{"./atmosphereGlowMaterial":"/Users/andrelevi/webgl/planet-creator/app/js/atmosphereGlowMaterial.js"}],"/Users/andrelevi/webgl/planet-creator/app/js/skybox.js":[function(require,module,exports){
"use strict";
var __moduleName = "skybox";
var imagePrefix = 'assets/omxos/';
var directions = ['Left', 'Right', 'Up', 'Down', 'Front', 'Back'];
var imageSuffix = '.png';
var skyGeometry = new THREE.CubeGeometry(100000, 100000, 100000);
var materialArray = [];
for (var i = 0; i < 6; i++)
  materialArray.push(new THREE.MeshBasicMaterial({
    map: THREE.ImageUtils.loadTexture(imagePrefix + directions[i] + imageSuffix),
    side: THREE.BackSide
  }));
var skyMaterial = new THREE.MeshFaceMaterial(materialArray);
var skybox = new THREE.Mesh(skyGeometry, skyMaterial);
module.exports = skybox;

},{}],"/Users/andrelevi/webgl/planet-creator/app/js/vr.js":[function(require,module,exports){
"use strict";
var __moduleName = "vr";
var vrToggle = document.getElementById('vr-toggle');
function init(callback) {
  if (navigator.getVRDevices) {
    navigator.getVRDevices().then(function(vrDevices) {
      proccessVrDevices(vrDevices, callback);
    });
  } else {
    callback();
  }
}
function proccessVrDevices(vrDevices, callback) {
  for (var i = 0; i < vrDevices.length; ++i) {
    if (vrDevices[i] instanceof HMDVRDevice) {
      vrHMD = vrDevices[i];
      break;
    }
  }
  for (i = 0; i < vrDevices.length; ++i) {
    if (vrDevices[i] instanceof PositionSensorVRDevice && vrDevices[i].hardwareUnitId == vrHMD.hardwareUnitId) {
      vrHMDSensor = vrDevices[i];
      break;
    }
  }
  if (vrHMD || vrHMDSensor) {
    vrToggle.className = 'active';
    vrToggle.addEventListener('click', goVrFullscreen);
    document.addEventListener('webkitfullscreenchange', function() {
      if (!document.webkitFullscreenElement) {
        console.log('exit');
        vrEnabled = false;
      }
    }, false);
  }
  callback(true, vrHMD, vrHMDSensor);
}
function goVrFullscreen() {
  vrEnabled = true;
  var viewport = document.querySelector('#viewport canvas');
  viewport.webkitRequestFullScreen({vrDisplay: vrHMD});
}
module.exports = {init: init};

},{}]},{},["/Users/andrelevi/webgl/planet-creator/app/js/index.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvanMvYXRtb3NwaGVyZUdsb3dNYXRlcmlhbC5qcyIsImFwcC9qcy9pbmRleC5qcyIsImFwcC9qcy9sZWFwLWhhbmRzLmpzIiwiYXBwL2pzL3NreWJveC5qcyIsImFwcC9qcy92ci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX21vZHVsZU5hbWUgPSBcImF0bW9zcGhlcmVHbG93TWF0ZXJpYWxcIjtcbnZhciBtYXRlcmlhbCA9IG5ldyBUSFJFRS5TaGFkZXJNYXRlcmlhbCh7XG4gIHZlcnRleFNoYWRlcjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ZlcnRleEF0bW9zcGhlcmVHbG93JykudGV4dENvbnRlbnQsXG4gIGZyYWdtZW50U2hhZGVyOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZnJhZ21lbnRBdG1vc3BoZXJlR2xvdycpLnRleHRDb250ZW50LFxuICBzaWRlOiBUSFJFRS5CYWNrU2lkZSxcbiAgYmxlbmRpbmc6IFRIUkVFLkFkZGl0aXZlQmxlbmRpbmcsXG4gIHRyYW5zcGFyZW50OiB0cnVlXG59KTtcbm1vZHVsZS5leHBvcnRzID0gbWF0ZXJpYWw7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX21vZHVsZU5hbWUgPSBcImluZGV4XCI7XG4ndXNlIHN0cmljdCc7XG52YXIgbGVhcEhhbmRzID0gcmVxdWlyZSgnLi9sZWFwLWhhbmRzJyk7XG52YXIgc2t5Ym94ID0gcmVxdWlyZSgnLi9za3lib3gnKTtcbnZhciB2ciA9IHJlcXVpcmUoJy4vdnInKTtcbnZhciB2aWV3cG9ydCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2aWV3cG9ydCcpO1xuZnVuY3Rpb24gbWFpbih2ckVuYWJsZWQsIHZySE1ELCB2ckhNRFNlbnNvcikge1xuICB2YXIgc2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKTtcbiAgdmFyIGNhbWVyYSA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSg3NSwgd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQsIDAuMSwgMTAwMDAwKTtcbiAgY2FtZXJhLnBvc2l0aW9uLnogPSAzMDA7XG4gIHZhciByZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKCk7XG4gIHJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG4gIHZpZXdwb3J0LmFwcGVuZENoaWxkKHJlbmRlcmVyLmRvbUVsZW1lbnQpO1xuICBpZiAodnJITUQpIHtcbiAgICB2YXIgdnJyZW5kZXJlciA9IG5ldyBUSFJFRS5WUlJlbmRlcmVyKHJlbmRlcmVyLCB2ckhNRCk7XG4gIH1cbiAgdmFyIGNvbnRyb2xzID0gbmV3IFRIUkVFLk9yYml0Q29udHJvbHMoY2FtZXJhLCByZW5kZXJlci5kb21FbGVtZW50KTtcbiAgdmFyIGFtYmllbnRMaWdodCA9IG5ldyBUSFJFRS5BbWJpZW50TGlnaHQoMHhmZmZmZmYpO1xuICBzY2VuZS5hZGQoYW1iaWVudExpZ2h0KTtcbiAgc2NlbmUuYWRkKGxlYXBIYW5kcy5ncm91cCk7XG4gIHNjZW5lLmFkZChza3lib3gpO1xuICByZW5kZXIoKTtcbiAgZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIGlmICh2ckVuYWJsZWQpIHtcbiAgICAgIHZhciBzdGF0ZSA9IHZySE1EU2Vuc29yLmdldFN0YXRlKCk7XG4gICAgICBjYW1lcmEucXVhdGVybmlvbi5zZXQoc3RhdGUub3JpZW50YXRpb24ueCwgc3RhdGUub3JpZW50YXRpb24ueSwgc3RhdGUub3JpZW50YXRpb24ueiwgc3RhdGUub3JpZW50YXRpb24udyk7XG4gICAgICB2cnJlbmRlcmVyLnJlbmRlcihzY2VuZSwgY2FtZXJhKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVuZGVyZXIucmVuZGVyKHNjZW5lLCBjYW1lcmEpO1xuICAgIH1cbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVuZGVyKTtcbiAgfVxufVxudnIuaW5pdChtYWluKTtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fbW9kdWxlTmFtZSA9IFwibGVhcC1oYW5kc1wiO1xudmFyIGF0bW9zcGhlcmVHbG93TWF0ZXJpYWwgPSByZXF1aXJlKCcuL2F0bW9zcGhlcmVHbG93TWF0ZXJpYWwnKTtcbnZhciBncm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xudmFyIGxlZnQgPSB7XG4gIHBhbG06IG51bGwsXG4gIGZpbmdlclRpcHM6IFtdXG59O1xudmFyIHJpZ2h0ID0ge1xuICBwYWxtOiBudWxsLFxuICBmaW5nZXJUaXBzOiBbXSxcbiAgdmVsb2NpdHk6IG51bGxcbn07XG52YXIgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuVG9ydXNHZW9tZXRyeSgyNSwgMSwgMzIsIDMyKTtcbnZhciBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCgpO1xudmFyIG91dGVyID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsKTtcbmdlb21ldHJ5ID0gbmV3IFRIUkVFLlRvcnVzR2VvbWV0cnkoMTUsIDEsIDMyLCAzMik7XG52YXIgaW5uZXIgPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuaW5uZXIucG9zaXRpb24ueiA9IC01O1xubGVmdC5wYWxtID0gbmV3IFRIUkVFLkdyb3VwKCk7XG5sZWZ0LnBhbG0uYWRkKG91dGVyKTtcbmxlZnQucGFsbS5hZGQoaW5uZXIpO1xubGVmdC5wYWxtLnBvc2l0aW9uLnogPSAyMDA7XG5oaWRlKGxlZnQucGFsbSk7XG5ncm91cC5hZGQobGVmdC5wYWxtKTtcbm91dGVyID0gbmV3IFRIUkVFLk1lc2gobmV3IFRIUkVFLlRvcnVzR2VvbWV0cnkoMjUsIDAuNSwgMzIsIDMyKSwgbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHtjb2xvcjogMHhmZmZmZmZ9KSk7XG5pbm5lciA9IG5ldyBUSFJFRS5NZXNoKG5ldyBUSFJFRS5Ub3J1c0dlb21ldHJ5KDIwLCAwLjUsIDMyLCAzMiksIG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7Y29sb3I6IDB4ZmZmZmZmfSkpO1xuaW5uZXIucG9zaXRpb24ueiA9IC0zO1xucmlnaHQucGFsbSA9IG5ldyBUSFJFRS5Hcm91cCgpO1xucmlnaHQucGFsbS5hZGQob3V0ZXIpO1xucmlnaHQucGFsbS5hZGQoaW5uZXIpO1xucmlnaHQucGFsbS5wb3NpdGlvbi56ID0gMjAwO1xuaGlkZShyaWdodC5wYWxtKTtcbmdyb3VwLmFkZChyaWdodC5wYWxtKTtcbnZhciBnZW9tZXRyeSA9IG5ldyBUSFJFRS5DeWxpbmRlckdlb21ldHJ5KDEwLCAxMCwgMSwgMzIsIDMyKTtcbnZhciBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCgpO1xudmFyIGJhbGw7XG5mb3IgKHZhciBpID0gMDsgaSA8IDU7IGkrKykge1xuICB2YXIgZmluZ2VyID0gbmV3IFRIUkVFLkdyb3VwKCk7XG4gIHZhciBsZWZ0U3BoZXJlID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsKTtcbiAgYmFsbCA9IG5ldyBUSFJFRS5NZXNoKG5ldyBUSFJFRS5TcGhlcmVHZW9tZXRyeSgxMCwgMzIsIDE2KSwgYXRtb3NwaGVyZUdsb3dNYXRlcmlhbCk7XG4gIGZpbmdlci5hZGQobGVmdFNwaGVyZSk7XG4gIGZpbmdlci5hZGQoYmFsbCk7XG4gIGxlZnQuZmluZ2VyVGlwcy5wdXNoKGZpbmdlcik7XG4gIGhpZGUobGVmdFNwaGVyZSk7XG4gIGdyb3VwLmFkZChmaW5nZXIpO1xuICB2YXIgcmlnaHRTcGhlcmUgPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuICByaWdodC5maW5nZXJUaXBzLnB1c2gocmlnaHRTcGhlcmUpO1xuICBoaWRlKHJpZ2h0U3BoZXJlKTtcbiAgZ3JvdXAuYWRkKHJpZ2h0U3BoZXJlKTtcbn1cbkxlYXAubG9vcCh7YmFja2dyb3VuZDogdHJ1ZX0sIHtoYW5kOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgdmFyIGhhbmQgPSBkYXRhLnR5cGUgPT09ICdsZWZ0JyA/IGxlZnQgOiByaWdodDtcbiAgICBkYXRhLmZpbmdlcnMuZm9yRWFjaChmdW5jdGlvbihmaW5nZXIsIGkpIHtcbiAgICAgIHZhciBzcGhlcmUgPSBoYW5kLmZpbmdlclRpcHNbaV07XG4gICAgICBzcGhlcmUucG9zaXRpb24uZnJvbUFycmF5KGZpbmdlci50aXBQb3NpdGlvbik7XG4gICAgICB2YXIgbiA9IGZpbmdlci5kaXJlY3Rpb247XG4gICAgICBzcGhlcmUubG9va0F0KG5ldyBUSFJFRS5WZWN0b3IzKG5bMF0gKiAxMDAwLCBuWzFdICogMTAwMCwgblsyXSAqIDEwMDApKTtcbiAgICAgIHNwaGVyZS51cGRhdGVNYXRyaXgoKTtcbiAgICB9KTtcbiAgICB2YXIgcGFsbSA9IGhhbmQucGFsbTtcbiAgICBwYWxtLnBvc2l0aW9uLmZyb21BcnJheShkYXRhLnBhbG1Qb3NpdGlvbik7XG4gICAgaGFuZC52ZWxvY2l0eSA9IGRhdGEucGFsbVZlbG9jaXR5O1xuICAgIGhhbmQubm9ybWFsID0gZGF0YS5wYWxtTm9ybWFsO1xuICAgIHZhciBuID0gZGF0YS5wYWxtTm9ybWFsO1xuICAgIGhhbmQucGFsbS5sb29rQXQobmV3IFRIUkVFLlZlY3RvcjMoblswXSAqIDEwMDAsIG5bMV0gKiAxMDAwLCBuWzJdICogMTAwMCkpO1xuICAgIGhhbmQucGFsbS51cGRhdGVNYXRyaXgoKTtcbiAgfX0pLnVzZSgnaGFuZEVudHJ5Jykub24oJ2hhbmRGb3VuZCcsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgdmFyIGhhbmQgPSBkYXRhLnR5cGUgPT09ICdsZWZ0JyA/IGxlZnQgOiByaWdodDtcbiAgZGF0YS5maW5nZXJzLmZvckVhY2goZnVuY3Rpb24oZmluZ2VyLCBpKSB7XG4gICAgdmFyIHNwaGVyZSA9IGhhbmQuZmluZ2VyVGlwc1tpXTtcbiAgICBzaG93KHNwaGVyZSk7XG4gIH0pO1xuICB2YXIgcGFsbSA9IGhhbmQucGFsbTtcbiAgc2hvdyhwYWxtKTtcbn0pLm9uKCdoYW5kTG9zdCcsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgdmFyIGhhbmQgPSBkYXRhLnR5cGUgPT09ICdsZWZ0JyA/IGxlZnQgOiByaWdodDtcbiAgZGF0YS5maW5nZXJzLmZvckVhY2goZnVuY3Rpb24oZmluZ2VyLCBpKSB7XG4gICAgdmFyIHNwaGVyZSA9IGhhbmQuZmluZ2VyVGlwc1tpXTtcbiAgICBoaWRlKHNwaGVyZSk7XG4gIH0pO1xuICB2YXIgcGFsbSA9IGhhbmQucGFsbTtcbiAgaGlkZShwYWxtKTtcbn0pO1xuZnVuY3Rpb24gc2hvdyhtZXNoKSB7XG4gIG1lc2gudHJhdmVyc2UoZnVuY3Rpb24oY2hpbGQpIHtcbiAgICBjaGlsZC52aXNpYmxlID0gdHJ1ZTtcbiAgfSk7XG59XG5mdW5jdGlvbiBoaWRlKG1lc2gpIHtcbiAgbWVzaC50cmF2ZXJzZShmdW5jdGlvbihjaGlsZCkge1xuICAgIGNoaWxkLnZpc2libGUgPSBmYWxzZTtcbiAgfSk7XG59XG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgZ3JvdXA6IGdyb3VwLFxuICByaWdodEhhbmQ6IHJpZ2h0LFxuICBsZWZ0SGFuZDogbGVmdFxufTtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fbW9kdWxlTmFtZSA9IFwic2t5Ym94XCI7XG52YXIgaW1hZ2VQcmVmaXggPSAnYXNzZXRzL29teG9zLyc7XG52YXIgZGlyZWN0aW9ucyA9IFsnTGVmdCcsICdSaWdodCcsICdVcCcsICdEb3duJywgJ0Zyb250JywgJ0JhY2snXTtcbnZhciBpbWFnZVN1ZmZpeCA9ICcucG5nJztcbnZhciBza3lHZW9tZXRyeSA9IG5ldyBUSFJFRS5DdWJlR2VvbWV0cnkoMTAwMDAwLCAxMDAwMDAsIDEwMDAwMCk7XG52YXIgbWF0ZXJpYWxBcnJheSA9IFtdO1xuZm9yICh2YXIgaSA9IDA7IGkgPCA2OyBpKyspXG4gIG1hdGVyaWFsQXJyYXkucHVzaChuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoe1xuICAgIG1hcDogVEhSRUUuSW1hZ2VVdGlscy5sb2FkVGV4dHVyZShpbWFnZVByZWZpeCArIGRpcmVjdGlvbnNbaV0gKyBpbWFnZVN1ZmZpeCksXG4gICAgc2lkZTogVEhSRUUuQmFja1NpZGVcbiAgfSkpO1xudmFyIHNreU1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hGYWNlTWF0ZXJpYWwobWF0ZXJpYWxBcnJheSk7XG52YXIgc2t5Ym94ID0gbmV3IFRIUkVFLk1lc2goc2t5R2VvbWV0cnksIHNreU1hdGVyaWFsKTtcbm1vZHVsZS5leHBvcnRzID0gc2t5Ym94O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19tb2R1bGVOYW1lID0gXCJ2clwiO1xudmFyIHZyVG9nZ2xlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ZyLXRvZ2dsZScpO1xuZnVuY3Rpb24gaW5pdChjYWxsYmFjaykge1xuICBpZiAobmF2aWdhdG9yLmdldFZSRGV2aWNlcykge1xuICAgIG5hdmlnYXRvci5nZXRWUkRldmljZXMoKS50aGVuKGZ1bmN0aW9uKHZyRGV2aWNlcykge1xuICAgICAgcHJvY2Nlc3NWckRldmljZXModnJEZXZpY2VzLCBjYWxsYmFjayk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgY2FsbGJhY2soKTtcbiAgfVxufVxuZnVuY3Rpb24gcHJvY2Nlc3NWckRldmljZXModnJEZXZpY2VzLCBjYWxsYmFjaykge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHZyRGV2aWNlcy5sZW5ndGg7ICsraSkge1xuICAgIGlmICh2ckRldmljZXNbaV0gaW5zdGFuY2VvZiBITURWUkRldmljZSkge1xuICAgICAgdnJITUQgPSB2ckRldmljZXNbaV07XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgZm9yIChpID0gMDsgaSA8IHZyRGV2aWNlcy5sZW5ndGg7ICsraSkge1xuICAgIGlmICh2ckRldmljZXNbaV0gaW5zdGFuY2VvZiBQb3NpdGlvblNlbnNvclZSRGV2aWNlICYmIHZyRGV2aWNlc1tpXS5oYXJkd2FyZVVuaXRJZCA9PSB2ckhNRC5oYXJkd2FyZVVuaXRJZCkge1xuICAgICAgdnJITURTZW5zb3IgPSB2ckRldmljZXNbaV07XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgaWYgKHZySE1EIHx8IHZySE1EU2Vuc29yKSB7XG4gICAgdnJUb2dnbGUuY2xhc3NOYW1lID0gJ2FjdGl2ZSc7XG4gICAgdnJUb2dnbGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBnb1ZyRnVsbHNjcmVlbik7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignd2Via2l0ZnVsbHNjcmVlbmNoYW5nZScsIGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKCFkb2N1bWVudC53ZWJraXRGdWxsc2NyZWVuRWxlbWVudCkge1xuICAgICAgICBjb25zb2xlLmxvZygnZXhpdCcpO1xuICAgICAgICB2ckVuYWJsZWQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9LCBmYWxzZSk7XG4gIH1cbiAgY2FsbGJhY2sodHJ1ZSwgdnJITUQsIHZySE1EU2Vuc29yKTtcbn1cbmZ1bmN0aW9uIGdvVnJGdWxsc2NyZWVuKCkge1xuICB2ckVuYWJsZWQgPSB0cnVlO1xuICB2YXIgdmlld3BvcnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjdmlld3BvcnQgY2FudmFzJyk7XG4gIHZpZXdwb3J0LndlYmtpdFJlcXVlc3RGdWxsU2NyZWVuKHt2ckRpc3BsYXk6IHZySE1EfSk7XG59XG5tb2R1bGUuZXhwb3J0cyA9IHtpbml0OiBpbml0fTtcbiJdfQ==
