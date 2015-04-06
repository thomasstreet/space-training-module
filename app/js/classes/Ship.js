require('traceur/bin/traceur-runtime');

var states = {
  resting: "resting",
  inFlight: "inFlight"
};

class Ship {
  constructor(options) {
    this.mesh = options.mesh;
    this.mesh.scale.set(options.scale, options.scale, options.scale);
    this.mesh.position.copy(options.position);
    this.mesh.children.forEach((child) => {
      child.material.emissive = new THREE.Color({r: 255, g: 255, b: 255});
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

  update() {
    if (this.state === states.resting) {
      this.hover();
    }
  }
}

module.exports = Ship;
