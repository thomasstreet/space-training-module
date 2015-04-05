require('traceur/bin/traceur-runtime');

class InfoView {
  constructor(options) {
    var texture = new THREE.VideoTexture(options.videoSource);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.format = THREE.RGBFormat;

    var chromaVertexShader = document.getElementById('chromaKeyVertexShader').innerHTML;
    var chromaFragmentShader = document.getElementById('chromaKeyFragmentShader').innerHTML;

    var videoMaterial = new THREE.ShaderMaterial({
        vertexShader: chromaVertexShader,
        fragmentShader: chromaFragmentShader,
        uniforms: {
          texture: { type: "t", value: texture },
          color: { type: "c", value: new THREE.Color(0x00AFFF) },
          opacity: { type: "f", value: 1 },
        },
        transparent: true,
    });

    this.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(160 * 0.8, 90 * 0.8, 2),
      videoMaterial
    );

    this.offset = options.offset;

    this.visible = false;
  }
}

module.exports = InfoView;
