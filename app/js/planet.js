require('traceur/bin/traceur-runtime');

var atmosphereGlowMaterial = require('./atmosphereGlowMaterial');

class Planet {
  constructor(options) {
    this.radius = options.radius;
    this.color = options.color;
    this.rotate = options.rotate;

    this.sphereMesh = new THREE.Mesh(
      new THREE.SphereGeometry(this.radius, 32, 32),
      new THREE.MeshBasicMaterial({ color: this.color })
    );

    this.glowMesh = new THREE.Mesh(
      new THREE.SphereGeometry(this.radius * 1.2, 32, 32),
      atmosphereGlowMaterial
    ); 

    if (options.moons) {
      this.moons = [];
      options.moons.forEach(function(moonData) {
        var moon = new THREE.Mesh(
          new THREE.SphereGeometry(moonData.radius, 32, 32),
          new THREE.MeshBasicMaterial({ color: moonData.color })
        );

        if (moonData.orbiting) {
          // Start the orbit at any random angle
          var angle = Math.random() * (Math.PI * 2);
          var distanceFromPlanet = options.radius * 1.4;
          // Random velocity from [0.01, 0.06];
          var velocity = (Math.random() * 0.03) + 0.01;
          setInterval(function() {
            angle += velocity;
            angle = angle % (Math.PI * 2);
            moon.position.x = distanceFromPlanet * Math.cos(angle);
            moon.position.z = distanceFromPlanet * Math.sin(angle);
          }, 16);
        }

        this.moons.push(moon);
      }.bind(this));
    }

    this.group = new THREE.Group();
    this.group.add(this.sphereMesh);
    this.group.add(this.glowMesh);
    this.moons.forEach(function(moon) {
      this.group.add(moon);
    }.bind(this));
  }
}

module.exports = Planet;
