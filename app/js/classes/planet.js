require('traceur/bin/traceur-runtime');

var Moon = require ('./Moon');
var BaseObject = require ('./BaseObject');

class Planet extends BaseObject {
  constructor(options) {
    super(options);

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

    this.group.add(this.sphereMesh);

    this.moons = [];
    for (var i = 0; i < options.moonCount; i++) {
      var moon = new Moon({
        maxRadius: this.maxMoonRadius,
        moonColor: options.moonColor,
        rotationSpeed: options.autoRotationSpeed,
        parentPlanetRadius: this.radius
      });
      this.moons.push(moon.group);
      this.group.add(moon.group);
    }
  }

  fadeIn(duration) {
    var fade = setInterval(() => {
      this.sphereMesh.material.opacity += 0.01;
      if (this.sphereMesh.material.opacity >= 0.5) {
        clearInterval(fade);
      }
    }, duration / 100);
  }
}

module.exports = Planet;
