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
          color: { type: "c", value: new THREE.Color(0x1e2841) },
          opacity: { type: "f", value: 1 },
        },
        transparent: true,
    });

    var invisibleMaterial = new THREE.MeshBasicMaterial({opacity: 0, transparent: true});

    var cubeMaterialArray = [];
    cubeMaterialArray.push(invisibleMaterial);
    cubeMaterialArray.push(invisibleMaterial);
    cubeMaterialArray.push(invisibleMaterial);
    cubeMaterialArray.push(invisibleMaterial);
    cubeMaterialArray.push(videoMaterial);
    cubeMaterialArray.push(invisibleMaterial);

    var cubeMaterials = new THREE.MeshFaceMaterial(cubeMaterialArray);

    this.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(160 * 0.8, 90 * 0.8, 2),
      cubeMaterials
    );

    // Set the initial position to be way off the screen, so that a black box
    // doesn't show while waiting for the video texture to load
    this.mesh.position.set(9999, 9999, 9999);

    this.offset = options.offset;

    this.visible = false;
  }
}

module.exports = InfoView;
