var atmosphereGlowMaterial = require('./atmosphere-glow-material');

var camera = require('./camera');

var yOffset = -300;

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

var outer = new THREE.Mesh(
  new THREE.TorusGeometry(25, 0.5, 32, 32),
  new THREE.MeshBasicMaterial({ color: 0xffffff }) 
);
var inner = new THREE.Mesh(
  new THREE.TorusGeometry(20, 0.5, 32, 32),
  new THREE.MeshBasicMaterial({ color: 0xffffff }) 
);
inner.position.z = -5;
left.palm = new THREE.Group();
left.palm.add(outer);
left.palm.add(inner);

left.palm.position.z = 200;

// Hide until active
hide(left.palm);
group.add(left.palm);

outer = new THREE.Mesh(
  new THREE.TorusGeometry(25, 0.5, 32, 32),
  new THREE.MeshBasicMaterial({ color: 0xffffff }) 
);
inner = new THREE.Mesh(
  new THREE.TorusGeometry(20, 0.5, 32, 32),
  new THREE.MeshBasicMaterial({ color: 0xffffff }) 
);
inner.position.z = -3;
right.palm = new THREE.Group();
right.palm.add(outer);
right.palm.add(inner);

// Set initial z position
right.palm.position.z = 200;

hide(right.palm);
group.add(right.palm);

var geometry = new THREE.CylinderGeometry(10, 10, 1, 32, 32);
var material = new THREE.MeshBasicMaterial();

for (var i = 0; i < 5; i++) {
  var leftSphere = new THREE.Mesh(geometry, material);
  left.fingerTips.push(leftSphere);
  hide(leftSphere);
  group.add(leftSphere);

  var rightSphere = new THREE.Mesh(geometry, material);
  right.fingerTips.push(rightSphere);
  hide(rightSphere);
  group.add(rightSphere);
}

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
    palm.position.fromArray(data.palmPosition);
    palm.position.y += yOffset;

    hand.velocity = data.palmVelocity;
    hand.normal = data.palmNormal;

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
