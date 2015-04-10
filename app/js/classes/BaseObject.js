var $ = require('../utils');

var VideoController = require('./VideoController');
var InfoView = require('./InfoView');

class BaseObject {
  constructor(options) {
    this.id = options.id;
    this.type = options.type;
    this.radius = options.radius;

    this.manualDisplayPosition = options.manualDisplayPosition;

    // The position that the object will always move back to once no longer
    // held/moved
    this.homePosition = options.homePosition;
    // Set to true when moving back to home
    this.movingHome = false;

    this.shouldAutoRotate = options.shouldAutoRotate || true;
    this.autoRotationSpeed = options.autoRotationSpeed || -0.005;

    this.group = new THREE.Group();

    this.videoController = new VideoController(options.videoId);

    this.infoView = new InfoView({
      videoSource: this.videoController.video,
      offset: new THREE.Vector3(
        options.radius + 15,
        0,
        options.radius + 10
      ) 
    });

    this.group.position.copy(this.homePosition);
    this.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), options.radius);
  }

  raycast(raycaster, intersects) {

    var sphere = new THREE.Sphere();

    sphere.copy(this.boundingSphere);
    sphere.applyMatrix4(this.group.matrixWorld);

    if (raycaster.ray.isIntersectionSphere(sphere) === false) {
        return;
    }
    else {
      intersects.push(this)
    }
  }

  attachToScene(scene) {
    scene.add(this.group);
    scene.add(this.infoView.mesh);
  }

  moveToHomePosition(options) {
    var startPosition = new THREE.Vector3();
    startPosition.copy(this.group.position);

    this.movingHome = true;

    var groupDistance = this.homePosition.clone().sub(startPosition);

    $.animate({duration: options.duration,
      onUpdate: (t) => {
        this.group.position.addVectors(startPosition, groupDistance.clone().multiplyScalar(t));
        this.infoView.mesh.position.addVectors(this.group.position, this.infoView.offset);
      },
      onFinish: () => {
        this.movingHome = false;
      }
    });
  }

  moveToPosition(options, callback) {
    var startPosition = new THREE.Vector3();
    startPosition.copy(this.group.position);

    var groupDistance = options.destination.clone().sub(startPosition);

    $.animate({duration: options.duration,
      onUpdate: (t) => {
        this.group.position.addVectors(startPosition, groupDistance.clone().multiplyScalar(t));
        this.infoView.mesh.position.addVectors(this.group.position, this.infoView.offset);
      },
      onFinish: () => {
        callback();
      }
    });
  }

  positionRelativeToHand(hand) {
    var palm = hand.palm;

    var yDistance = (this.radius || 100) + 30;

    this.group.position.addVectors(palm.position, hand.normal.multiplyScalar(yDistance));
    this.infoView.mesh.position.addVectors(this.group.position, this.infoView.offset);
  }

  determineIfShowInfoView() {
    var showThreshold = 125;
    var zPosition = this.group.position.z;
    if (zPosition >= showThreshold && !this.infoView.visible) {
      this.animateInInfoView();
    } else if (zPosition < showThreshold && this.infoView.visible) {
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
    if (!this.infoView.visible) {
      this.infoView.visible = true;
      this.videoController.playFromStartToMiddle();
    }
  }

  animateOutInfoView() {
    if (this.infoView.visible) {
      this.infoView.visible = false;
      this.videoController.playFromMiddleToEnd();
    }
  }

  // Abstract method
  releaseFromHand() {
    // Implement on subclass basis
  }
}

module.exports = BaseObject;
