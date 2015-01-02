require('traceur/bin/traceur-runtime');
var atmosphereGlowMaterial = require('./atmosphere-glow-material');
var camera = require('./camera');

class Hand {
  constructor(group) {
   var outer = new THREE.Mesh(
     new THREE.TorusGeometry(25, 0.5, 32, 32),
     new THREE.MeshBasicMaterial({ color: 0xffffff }) 
   );
   var inner = new THREE.Mesh(
     new THREE.TorusGeometry(20, 0.5, 32, 32),
     new THREE.MeshBasicMaterial({ color: 0xffffff }) 
   );
   inner.position.z = -3;

   this.palm = new THREE.Group();
   this.palm.add(outer);
   this.palm.add(inner);
   this.palm.position.z = 200;
   this.palm.posSequence = [];
   this.palm.normalSequence = [];

   // Hide until active
   hide(this.palm);
   group.add(this.palm);

   this.fingerTips = [];
   this.velocity = null;

   var geometry = new THREE.CylinderGeometry(10, 10, 1, 32, 32);
   var material = new THREE.MeshBasicMaterial();
   for (var i = 0; i < 5; i++) {
     var sphere = new THREE.Mesh(geometry, material);
     this.fingerTips.push(sphere);
     hide(sphere);
     group.add(sphere);
   }
  }
  getRollingAverage(array, newPos) {
    var maxLength = 10;
    array.push(newPos);
    if (array.length >= maxLength) {
      array.shift();
    }
    var len = array.length;
    var x = 0, y = 0, z = 0;
    for (var i = 0; i < len; i++) {
      var pos = array[i];
      x += pos[0];
      y += pos[1];
      z += pos[2];
    }
    var out = [
      x / len,
      y / len,
      z / len
    ];
    return out;
  }
}

var yOffset = -300;

var group = new THREE.Group();

var left = new Hand(group);
var right = new Hand(group);

Leap.loop({background: true}, {
  hand: function (data) {
    var hand = data.type === 'left' ? left : right;
    data.fingers.forEach(function (finger, i) {
      var sphere = hand.fingerTips[i];
      sphere.position.fromArray(finger.tipPosition);
      sphere.position.y += yOffset;
      var n = finger.direction;
      sphere.lookAt(new THREE.Vector3(n[0] * 1000, n[1] * 1000, n[2] * 1000));
      sphere.updateMatrix();
    });

    var palm = hand.palm;
    var position = hand.getRollingAverage(palm.posSequence, data.palmPosition);
    palm.position.fromArray(position);
    palm.position.y += yOffset;

    hand.velocity = data.palmVelocity;
    var normal = hand.getRollingAverage(palm.normalSequence, data.palmNormal);
    hand.normal = normal;

    var n = data.palmNormal;
    hand.palm.lookAt(new THREE.Vector3(n[0] * 1000, n[1] * 1000, n[2] * 1000));
    hand.palm.updateMatrix();
  }
})
// Provides handFound/handLost events.
.use('handEntry')
.on('handFound', function(data) {
  var hand = data.type === 'left' ? left : right;
  data.fingers.forEach(function (finger, i) {
    var sphere = hand.fingerTips[i];
    show(sphere);
  });
  var palm = hand.palm;
  show(palm);
})
.on('handLost', function(data) {
  var hand = data.type === 'left' ? left : right;
  data.fingers.forEach(function (finger, i) {
    var sphere = hand.fingerTips[i];
    hide(sphere);
  });
  var palm = hand.palm;
  hide(palm);
});

//Leap.loopController.use('transform', {
  //vr: true,
  //effectiveParent: camera
//});

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


// from THREE.js examples
function generateSprite() {
    var canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;

    var context = canvas.getContext('2d');
    var gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.2, 'rgba(0,255,255,1)');
    gradient.addColorStop(0.4, 'rgba(0,0,64,1)');
    gradient.addColorStop(1, 'rgba(0,0,0,1)');

    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    return texture;
}

module.exports = {
  group: group,
  rightHand: right,
  leftHand: left
};
