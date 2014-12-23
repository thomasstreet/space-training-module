define(function(SphereGlow) {

    return function(radius, texture) {

      var planetMaterial = new THREE.MeshPhongMaterial();
      planetMaterial.map   = THREE.ImageUtils.loadTexture('assets/mars.jpg')

      var planet = new THREE.Mesh(
        new THREE.SphereGeometry(radius, 32, 32),
        planetMaterial
      );
      planet.mass = 100;

      return planet;

    };

});
