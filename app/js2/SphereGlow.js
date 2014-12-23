define(function() {

  return function(radius, color, camera) {
    var geometry = new THREE.SphereGeometry(radius, 32, 32);

    var material = new THREE.ShaderMaterial({
      uniforms: {
        "c":   { type: "f", value: 0.4 },
        "p":   { type: "f", value: 2.0 },
        glowColor: { type: "c", value: new THREE.Color(color) },
        viewVector: { type: "v3", value: camera.position }
      },
      vertexShader:   document.getElementById( 'glowVertexShader'   ).textContent,
      fragmentShader: document.getElementById( 'glowFragmentShader' ).textContent,
      side: THREE.FrontSide,
      blending: THREE.AdditiveBlending,
      transparent: true
    });

    return new THREE.Mesh(geometry, material);

  };

});
