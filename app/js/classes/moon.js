require('traceur/bin/traceur-runtime');

class Moon {
  constructor(options) {
    this.radius = options.maxRadius * Math.max(0.7, Math.random());
    this.color = 0xffffff;

    this.sphereMesh = new THREE.Mesh(
      new THREE.SphereGeometry(this.radius, 32, 32),
      new THREE.MeshPhongMaterial({ color: this.color })
    );
    this.sphereMesh.castShadow = true;

    this.group = new THREE.Group();
    this.group.add(this.sphereMesh);

    var distanceFromPlanet = ((Math.random() * 30)) + 160;

    // Random velocity from [0.001, 0.006];
    var velocity = (Math.random() * 0.005) + 0.001;

    // Determine position.y based upon random angle with range of
    // [-maxYangle / 2, maxYAngle / 2].  To keep the yPosition following
    // the natural arc of the sphere
    var maxYAngle = Math.PI / 12;
    var yAngle = (Math.random() * maxYAngle) - maxYAngle / 2;
    this.group.position.y = distanceFromPlanet * Math.sin(yAngle);

    // Start the orbit at any random angle
    var angle = Math.random() * (Math.PI * 2);

    setInterval(function() {
      angle += velocity;
      angle = angle % (Math.PI * 2);
      this.group.position.x = distanceFromPlanet * Math.cos(angle);
      this.group.position.z = distanceFromPlanet * Math.sin(angle);
    }.bind(this), 16);
  }
}

module.exports = Moon;
