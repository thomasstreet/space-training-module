require('traceur/bin/traceur-runtime');

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

    var video = document.getElementById(options.videoId);
    var texture = new THREE.VideoTexture(video);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.format = THREE.RGBFormat;

    this.infoView = new THREE.Mesh(
      new THREE.BoxGeometry(160 * 0.6, 90 * 0.8, 2),
      new THREE.MeshLambertMaterial({color: 0xffffff, map: texture, transparent: true})
    );
    this.infoView.shouldCastShadow = true;
    this.infoView.castShadow = false;
    this.infoView.material.opacity = 0;
    this.infoViewVisible = false;
    this.infoViewOffset = new THREE.Vector3(
      options.radius,
      0,
      options.radius + 10
    );

    this.group.position.copy(this.homePosition);
  }

  attachToScene(scene) {
    scene.add(this.group);
    scene.add(this.infoView);
  }

  isInRange(otherObject) {
    var minDistance = 150;
    var dx = Math.abs(this.group.position.x - otherObject.position.x);
    var dy = Math.abs(this.group.position.y - otherObject.position.y);
    var dz = Math.abs(this.group.position.z - otherObject.position.z);

    // Require a closer distance for z
    if (dx <= minDistance && dy <= minDistance && dz <= minDistance) {
      return true;
    }
    return false;
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
    var showThreshold = 50;
    var zPosition = this.group.position.z;
    if (zPosition >= showThreshold && !this.infoViewVisible) {
      this.infoViewVisible = true;
      this.fadeInInfoView(200);
    } else if (zPosition < showThreshold && this.infoViewVisible) {
      this.infoViewVisible = false;
      this.fadeOutInfoView(200);
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

  fadeInInfoView(duration) {
    if (this.infoView.material.opacity >= 1) return;

    var fade = setInterval(() => {
      this.infoView.material.opacity += 0.05;
      if (this.infoView.material.opacity >= 1) {
        if (this.infoView.shouldCastShadow) {
          this.infoView.castShadow = true;
        }
        clearInterval(fade);
      }
    }, duration / 20);
  }

  fadeOutInfoView(duration) {
    if (this.infoView.material.opacity <= 0) return;

    var fade = setInterval(() => {
      this.infoView.material.opacity -= 0.05;
      if (this.infoView.material.opacity <= 0) {
        this.infoView.castShadow = false;
        clearInterval(fade);
      }
    }, duration / 20);
  }

  hideInfoViewImmediately() {
    this.infoViewVisible = false;
    this.infoView.material.opacity = 0;
    this.infoView.castShadow = false;
  }

}

module.exports = BaseObject;
