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

    this.group = new THREE.Group();
    this.group.add(this.sphereMesh);
    this.group.add(this.glowMesh);
  }
}

module.exports = Planet;
