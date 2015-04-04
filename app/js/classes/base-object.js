require('traceur/bin/traceur-runtime');

class BaseObject {
  constructor(options) {
    this.id = options.id;

    this.initialPosition = options.initialPosition;

    this.rotationSpeed = options.rotationSpeed;

    this.isHeldByLeapHands = false;
    this.initialDistanceWhenHeld = null;

    this.group = new THREE.Group();

    var video = document.getElementById( 'video' );

    var texture = new THREE.VideoTexture( video );
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.format = THREE.RGBFormat;

    this.infoView = new THREE.Mesh(
      new THREE.BoxGeometry(160 * 0.6, 90 * 0.8, 2),
      new THREE.MeshLambertMaterial({color: 0xffffff, map: texture, transparent: true})
    );
    this.infoView.castShadow = false;
    this.infoView.material.opacity = 0;
    this.infoViewVisible = false;

    this.infoViewOffset = [
      options.radius,
      0,
      options.radius + 10
    ];

    this.moveToInitialPosition();
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

  moveToInitialPosition() {
    //var tween = new TWEEN.Tween({pos: 0}).to({pos: 1}, 5000);
    //tween.easing(TWEEN.Easing.Quartic.InOut);

    this.group.position.set(
      this.initialPosition[0],
      this.initialPosition[1],
      this.initialPosition[2]
    );

    this.infoView.position.set(
      this.initialPosition[0] + this.infoViewOffset[0],
      this.initialPosition[1] + this.infoViewOffset[1],
      this.initialPosition[2] + this.infoViewOffset[2]
    );
  }

  positionRelativeToHand(hand) {
    var palm = hand.palm;

    //var yDistance = object.initialDistanceWhenHeld[1];
    var yDistance = (this.radius || 100) + 30;

    this.group.position.x = palm.position.x + (yDistance * hand.normal[0]);
    this.group.position.y = palm.position.y + (yDistance * hand.normal[1]);
    this.group.position.z = palm.position.z + (yDistance * hand.normal[2]);

    this.group.updateMatrix();

    this.infoView.position.x = palm.position.x + (yDistance * hand.normal[0]) + this.infoViewOffset[0];
    this.infoView.position.y = palm.position.y + (yDistance * hand.normal[1]) + this.infoViewOffset[1];
    this.infoView.position.z = palm.position.z + (yDistance * hand.normal[2]) + this.infoViewOffset[2];

    this.infoView.updateMatrix();
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

  rotate() {
    this.group.rotateY(-0.005);
  }

  fadeInInfoView(duration) {
    if (this.infoView.material.opacity >= 1) return;

    var fade = setInterval(() => {
      this.infoView.material.opacity += 0.05;
      if (this.infoView.material.opacity >= 1) {
        this.infoView.castShadow = true;
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
