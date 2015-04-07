var states = {
  resting: "resting",
  inFlight: "inFlight"
};

class Ship {
  constructor(options) {
    this.mesh = options.mesh;
    this.mesh.scale.set(options.scale, options.scale, options.scale);
    this.mesh.rotateY(options.rotateY);
    this.homePosition = options.position.clone();
    this.mesh.position.copy(this.homePosition.clone());
    this.mesh.children.forEach((child) => {
      child.castShadow = true;
    });

    this.restingPosition();

    this.startTime = Date.now() + (Math.random() * 2000);
  }

  restingPosition() {
    this.state = states.resting;
  }

  hover() {
    var delta = (Date.now() - this.startTime) / 1000;

    var t = Math.sin(delta).toFixed(3);

    this.mesh.position.set(
      this.mesh.position.x,
      this.mesh.position.y,
      // Move between range [-5, 5]
      (t * 10) - 5
    );
  }

  moveToPlanet(offset) {
    this.mesh.position.copy(offset);
  }

  moveToHomePosition() {
    this.mesh.position.copy(this.homePosition);
  }

  update() {
    if (this.state === states.resting) {
      this.hover();
    }
  }
}

module.exports = Ship;
