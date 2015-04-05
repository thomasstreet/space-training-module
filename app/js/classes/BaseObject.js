require('traceur/bin/traceur-runtime');

var VideoController = require('./VideoController');

class BaseObject {
  constructor(options) {
    this.id = options.id;
    this.type = options.type;
    this.radius = options.radius;

    // The position that the object will always move back to once no longer
    // held/moved
    this.homePosition = options.homePosition;
    // Set to true when moving back to home
    this.movingHome = false;

    this.shouldAutoRotate = options.shouldAutoRotate || true;
    this.autoRotationSpeed = options.autoRotationSpeed || -0.005;

    this.group = new THREE.Group();

    this.videoController = new VideoController(options.videoId);

    var texture = new THREE.VideoTexture(this.videoController.video);
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

    this.infoView = new THREE.Mesh(
      new THREE.BoxGeometry(160 * 0.8, 90 * 0.8, 2),
      videoMaterial
    );
    this.infoViewVisible = false;
    this.infoViewOffset = new THREE.Vector3(
      options.radius + 60,
      0,
      options.radius + 30
    );

    this.group.position.copy(this.homePosition);
  }

  attachToScene(scene) {
    scene.add(this.group);
    scene.add(this.infoView);
  }

  moveToHomePosition(options) {
    var startPosition = new THREE.Vector3();
    startPosition.copy(this.group.position);

    this.movingHome = true;

    // Face the home destination while moving home
    this.group.lookAt(startPosition);
    this.group.rotateY(Math.PI);

    var groupDistance = this.homePosition.clone().sub(startPosition);

    var deltaPercentPerTick = 1 / (options.duration / 16);
    var t = 0;

    var interval = setInterval(() => {
      t += deltaPercentPerTick;

      this.group.position.addVectors(startPosition, groupDistance.clone().multiplyScalar(t));
      this.infoView.position.addVectors(this.group.position, this.infoViewOffset);

      if (t >= 1) {
        clearInterval(interval);
        this.movingHome = false;
      }
    }, 16);
  }

  positionRelativeToHand(hand) {
    var palm = hand.palm;

    var yDistance = (this.radius || 100) + 30;

    this.group.position.addVectors(palm.position, hand.normal.multiplyScalar(yDistance));
    this.infoView.position.addVectors(this.group.position, this.infoViewOffset);
  }

  determineIfShowInfoView() {
    var showThreshold = 125;
    var zPosition = this.group.position.z;
    if (zPosition >= showThreshold && !this.infoViewVisible) {
      this.animateInInfoView();
    } else if (zPosition < showThreshold && this.infoViewVisible) {
      this.animateOutInfoView();
    }
  }

  update() {
    if(!this.movingHome) {
      this.rotate();
    }
  }

  rotate() {
    this.group.rotateY(this.autoRotationSpeed);
  }

  animateInInfoView() {
    if (!this.infoViewVisible) {
      this.infoViewVisible = true;
      this.videoController.play();
    }
  }

  animateOutInfoView() {
    if (this.infoViewVisible) {
      this.infoViewVisible = false;
      this.videoController.goToStart();
    }
  }
}

module.exports = BaseObject;
