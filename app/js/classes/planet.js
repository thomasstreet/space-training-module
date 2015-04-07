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
      map: THREE.ImageUtils.loadTexture(options.texture)
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
}

module.exports = Planet;
