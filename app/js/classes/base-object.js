require('traceur/bin/traceur-runtime');

class BaseObject {
  constructor(options) {
    this.id = options.id;

    this.initialPosition = options.initialPosition;

    this.rotationSpeed = options.rotationSpeed;

    this.isHeldByLeapHands = false;
    this.initialDistanceWhenHeld = null;

    this.group = new THREE.Group();
  }

  isInRange(otherObject) {
    var minDistance = 150;
    var dx = Math.abs(this.group.position.x - otherObject.position.x);
    var dy = Math.abs(this.group.position.y - otherObject.position.y);
    var dz = Math.abs(this.group.position.z - otherObject.position.z);

    // Require a closer distance for z
    if (dx <= minDistance && dy <= minDistance && dz <= minDistance) {
      return true;
    }
    return false;
  }

  moveToInitialPosition() {
    //var tween = new TWEEN.Tween({pos: 0}).to({pos: 1}, 5000);
    //tween.easing(TWEEN.Easing.Quartic.InOut);

    this.group.position.set(
      this.initialPosition[0],
      this.initialPosition[1],
      this.initialPosition[2]
    );
  }

  positionRelativeToHand(hand) {
    var palm = hand.palm;

    //var yDistance = object.initialDistanceWhenHeld[1];
    var yDistance = 100;

    this.group.position.x = palm.position.x + (yDistance * hand.normal[0]);
    this.group.position.y = palm.position.y + (yDistance * hand.normal[1]);
    this.group.position.z = palm.position.z + (yDistance * hand.normal[2]);

    this.group.updateMatrix();
  }

  rotate() {
    this.group.rotateY(-0.005);
  }
}

module.exports = BaseObject;
