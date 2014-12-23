define(function() {
  return new THREE.ShaderMaterial({
    vertexShader:   document.getElementById( 'vertexAtmosphereGlow' ).textContent,
    fragmentShader: document.getElementById( 'fragmentAtmosphereGlow' ).textContent,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    transparent: true
  });
});
