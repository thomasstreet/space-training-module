require('traceur/bin/traceur-runtime');

var BaseObject = require ('./BaseObject');

var loader = new THREE.OBJMTLLoader();

class BattleGroup extends BaseObject {
  constructor(options) {
    super(options);

    // infoView should be offset further to the right for battle groups
    this.infoView.offset = new THREE.Vector3(
      this.radius * 3,
      0,
      this.radius + 20
    );

    this.laserColor = options.laserColor;
    this.timeOfLastLaserShot = 0;

    loader.load(options.obj, options.mtl, (originalObject) => {
      for (var i = 0; i < options.shipPositions.length; i++) {
        var object = originalObject.clone();
        object.scale.set(options.scale, options.scale, options.scale);
        object.position.copy(options.shipPositions[i]);
        object.children.forEach((child) => {
          child.material.emissive = new THREE.Color({r: 255, g: 255, b: 255});
          child.castShadow = true;
        });
        this.group.add(object);
      }
    }, onProgress, onError);
  }

  fadeIn(duration) {
    // Don't implement fade for battle groups to save performance.
    // Instead do some sort of translation animation.
  }

  update(options) {
    // How do I convert this options obj to vars?
    if (options.isHoldingTwoBattleGroups) {
      this.animateOutInfoView();

      var otherObject = options.leftHandObject === this ?
        options.rightHandObject :
        options.leftHandObject;

      this.group.lookAt(otherObject.group.position);

      var distanceFromObject = this.group.position.distanceTo(otherObject.group.position);
      if (distanceFromObject <= 250) {
        this.shootLaserAt(otherObject);
      }
    } else {
      this.rotate();
    }
  }

  shootLaserAt(otherObject) {
    if (Date.now() - this.timeOfLastLaserShot < 100) return;

    this.timeOfLastLaserShot = Date.now();

    var laser = new THREE.Mesh(
      new THREE.BoxGeometry(10, 0.5, 0.5),
      new THREE.MeshBasicMaterial({color: this.laserColor})
    );

    laser.rotateY(Math.PI / 2);

    laser.position.set(
      (Math.random() * otherObject.radius * 2) - otherObject.radius,
      (Math.random() * otherObject.radius * 2) - otherObject.radius,
      ((Math.random() * 10) - 20) + this.radius
    );

    this.group.add(laser);

    var travelDistance = 400;
    var t = 0;
    var interval = setInterval(() => {
      t += 0.01;

      var travelZVector = new THREE.Vector3(
        0,
        0,
        travelDistance * 0.01
      );

      laser.position.add(travelZVector);

      if (t >= 1) {
        this.group.remove(laser);
        clearInterval(interval);
      }
    }, 16);
  }
}

function onProgress() { }
function onError(e) { console.log(e); }

module.exports = BattleGroup;
