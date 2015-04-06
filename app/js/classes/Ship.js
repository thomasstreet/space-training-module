require('traceur/bin/traceur-runtime');

class Ship {
  constructor(options) {
    this.mesh = options.mesh;
    this.mesh.scale.set(options.scale, options.scale, options.scale);
    this.mesh.position.copy(options.position);
    this.mesh.children.forEach((child) => {
      child.material.emissive = new THREE.Color({r: 255, g: 255, b: 255});
      child.castShadow = true;
    });
  }
}

module.exports = Ship;
