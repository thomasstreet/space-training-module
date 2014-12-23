require('traceur/bin/traceur-runtime');

var Moon = require ('./moon');

var atmosphereGlowMaterial = require('./atmosphere-glow-material');

class Planet {
  constructor(options) {
    this.radius = options.radius;
    this.maxMoonRadius = this.radius * 0.1;

    this.color = options.color;
    this.rotate = options.rotate;

    this.sphereMesh = new THREE.Mesh(
      new THREE.SphereGeometry(this.radius, 64, 64),
      new THREE.MeshBasicMaterial({ color: this.color })
    );

    this.glowMesh = new THREE.Mesh(
      new THREE.SphereGeometry(this.radius * 1.1, 64, 64),
      atmosphereGlowMaterial
    ); 

    this.group = new THREE.Group();
    this.group.add(this.sphereMesh);
    this.group.add(this.glowMesh);

    if (options.moons) {
      this.moons = [];
      for (var i = 0; i < options.moons.count; i++) {
        var moon = new Moon({
          maxRadius: this.maxMoonRadius,
          //orbitTarget: this.group
        });
        this.moons.push(moon.group);
      }
    }
    this.moons.forEach(function(moon) {
      this.group.add(moon);
    }.bind(this));
  }

  changeMaterial(material) {
    this.sphereMesh.material = material;
    this.sphereMesh.needsUpdate;
  }
}

module.exports = Planet;
