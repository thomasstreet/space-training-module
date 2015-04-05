require('traceur/bin/traceur-runtime');

class Hand {
  constructor(type, group) {
    this.type = type;
    this.isVisible = false;
    this.objectBeingHeld = null;

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

  showHand(data) {
    this.isVisible = true;

    data.fingers.forEach((finger, i) => {
      show(this.fingerTips[i]);
    });

    show(this.palm);
  }

  hideHand(data) {
    this.isVisible = false;

    data.fingers.forEach((finger, i) => {
      hide(this.fingerTips[i]);
    });

    hide(this.palm);
  }

  isHoldingThisObject(object) {
    return this.objectBeingHeld === object;
  }

  isHoldingAnyObject() {
    return !!this.objectBeingHeld;
  }

  stopHoldingObject() {
    this.objectBeingHeld = null;
  }

  holdObject(object) {
    this.objectBeingHeld = object; 
  }

  getHeldObject() {
    return this.objectBeingHeld;
  }
}

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

module.exports = Hand;
