require('traceur/bin/traceur-runtime');

var Moon = require ('./moon');

class Planet {
  constructor(options) {
    this.radius = options.radius;
    this.maxMoonRadius = this.radius * 0.05;

    this.color = options.color;
    this.rotate = options.rotate;

    this.initialPosition = options.initialPosition;

    var material = new THREE.MeshPhongMaterial({
      ambient		: 0xFFFFFF,
      shininess	: 10, 
      shading		: THREE.SmoothShading,
      transparent: true,
      map: THREE.ImageUtils.loadTexture(options.texture),
      opacity: 0
    });

    this.sphereMesh = new THREE.Mesh(
      new THREE.SphereGeometry(this.radius, 64, 64),
      material
    );
    this.sphereMesh.receiveShadow = true;

    this.group = new THREE.Group();
    
    this.group.position.set(
      this.initialPosition[0],
      this.initialPosition[1],
      this.initialPosition[2]
    );

    this.group.add(this.sphereMesh);

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

  fadeIn() {
    var fade = setInterval(function() {
      this.sphereMesh.material.opacity += 0.01;
      if (this.sphereMesh.material.opacity >= 1) {
        clearInterval(fade);
      }
    }.bind(this), 16);
  }
}

module.exports = Planet;
