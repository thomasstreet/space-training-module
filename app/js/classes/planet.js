require('traceur/bin/traceur-runtime');

var Moon = require ('./moon');
var BaseObject = require ('./base-object');

class Planet extends BaseObject {
  constructor(options) {
    super(options);

    this.radius = options.radius;
    this.maxMoonRadius = this.radius * 0.05;

    this.color = options.color;

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
          parentPlanetRadius: this.radius
        });
        this.moons.push(moon.group);
      }
    }
    this.moons.forEach(function(moon) {
      this.group.add(moon);
    }.bind(this));
  }

  fadeIn(duration) {
    var fade = setInterval(() => {
      this.sphereMesh.material.opacity += 0.01;
      if (this.sphereMesh.material.opacity >= 1) {
        clearInterval(fade);
      }
    }, duration / 100);
  }
}

module.exports = Planet;
