require('traceur/bin/traceur-runtime');

var Moon = require ('./moon');

var atmosphereGlowMaterial = require('./atmosphere-glow-material');

class Planet {
  constructor(options) {
    this.radius = options.radius;
    this.maxMoonRadius = this.radius * 0.1;

    this.color = options.color;
    this.rotate = options.rotate;

    var materials = [
      new THREE.MeshPhongMaterial({ 
        color: this.color,
        opacity: 0,
        transparent: true
      }),
      new THREE.MeshPhongMaterial({ 
        color: this.color,
        transparent: true
      }),
    ];

    this.sphereMesh = THREE.SceneUtils.createMultiMaterialObject(
      new THREE.SphereGeometry(this.radius, 64, 64),
      materials
    );
    this.sphereMesh.receiveShadow = true;

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
    this.sphereMesh.children[0].material = this.sphereMesh.children[1].material;

    material.opacity = 0;
    this.sphereMesh.children[1].material = material;

    var fade = setInterval(function() {
      this.sphereMesh.children[1].material.opacity += 0.005;
      this.sphereMesh.children[0].material.opacity -= 0.005;
      if (this.sphereMesh.children[1].material.opacity >= 1) {
        clearInterval(fade);
      }
    }.bind(this), 16);
  }
}

module.exports = Planet;
