require('traceur/bin/traceur-runtime');

class Hand {
  constructor(type, group) {
    this.type = type;
    this.isVisible = false;
    this.holdingObjectWithId = null;

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

var left = new Hand("left", group);
var right = new Hand("right", group);

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
  hand.isVisible = true;

  data.fingers.forEach(function (finger, i) {
    var sphere = hand.fingerTips[i];
    show(sphere);
  });
  var palm = hand.palm;
  show(palm);
})
.on('handLost', function(data) {
  var hand = data.type === 'left' ? left : right;
  hand.isVisible = false;

  hand.holdingObjectWithId = null;

  data.fingers.forEach(function (finger, i) {
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
  leftHand: left,
  hands: [right, left],
  atLeastOneHandFree() {
    return !right.holdingObjectWithId || !left.holdingObjectWithId;
  },
  isBothHandsHoldingObject() {
    return right.holdingObjectWithId && left.holdingObjectWithId;
  },
  isObjectNotBeingHeld(object) {
    return right.holdingObjectWithId == object.id ||
      left.holdingObjectWithId == object.id;
  }
};
