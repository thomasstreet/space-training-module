var BaseObject = require('./BaseObject');
var Ship = require('./Ship');
var $ = require('../utils');

var manualDisplaySlots = require('../manual-display-slots');

var OBJLoader = new THREE.OBJLoader();

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

    // Properties for strafing
    this.isStrafing = false;
    this.startTime = Date.now();
    this.initialTimeOffset = options.initialTimeOffset;

    this.ships = [];

    OBJLoader.load(options.obj, (loadedObject) => {
      loadedObject.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
          var material = new THREE.MeshPhongMaterial({
            map: options.texture.map,
            ambient: 0xFFFFFF,
            shading: THREE.SmoothShading,
            specularMap: options.texture.specularMap,
          });
          child.material = material;
        }
      });

      for (var i = 0; i < options.shipPositions.length; i++) {
        var ship = new Ship({
          mesh: loadedObject.clone(),
          scale: options.scale,
          rotateY: options.rotateY || 0,
          position: options.shipPositions[i],
          autoRotationSpeed: options.shipAutoRotationSpeed
        });

        this.ships.push(ship);

        this.group.add(ship.mesh);
      }
    }, onProgress, onError);
  }

  update(options) {
    this.ships.forEach((ship) => {
      ship.update();
    });

    var leftSlot = manualDisplaySlots.left();
    var rightSlot = manualDisplaySlots.right();
    if (leftSlot === this && rightSlot && rightSlot.type === "BattleGroup") {
      if (this.isStrafing) {
        this.strafeFromPosition(manualDisplaySlots.battleGroupPositions().left);
      }
      this.group.lookAt(rightSlot.group.position);
      this.shootLaserAt(rightSlot);
      return;
    }
    else if (rightSlot === this && leftSlot && leftSlot.type === "BattleGroup") {
      if (this.isStrafing) {
        this.strafeFromPosition(manualDisplaySlots.battleGroupPositions().right);
      }
      this.group.lookAt(leftSlot.group.position);
      this.shootLaserAt(leftSlot);
      return;
    }

    var {objectInLeftHand, objectInRightHand} = options;

    var isOneOfTheHeldObjects = objectInLeftHand === this ||
      objectInRightHand === this;

    var bothHandsHoldingAnObject = objectInLeftHand && objectInRightHand;

    if (isOneOfTheHeldObjects && bothHandsHoldingAnObject) {
      var otherObject = objectInLeftHand === this ?
        objectInRightHand :
        objectInLeftHand;

      var isTwoBattleGroups = otherObject.type === "BattleGroup";

      this.group.lookAt(otherObject.group.position);

      var distanceFromObject = this.group.position.distanceTo(otherObject.group.position);

      if (distanceFromObject <= 250) {
        if (isTwoBattleGroups) {
          this.shootLaserAt(otherObject);
        }
      }
    } else {
      this.rotate();
    }
  }

  startStrafing() {
    this.isStrafing = true;
    this.startTime = Date.now();
  }

  stopStrafing() {
    this.isStrafing = false;
  }

  strafeFromPosition(position) {
    var delta = ((Date.now() - this.startTime));

    if (delta < this.initialTimeOffset) return;
    delta -= this.initialTimeOffset;

    delta /= 1000;

    var t = Number((Math.sin(delta)).toFixed(3));
    var t2 = Number((Math.sin(delta)).toFixed(3));

    var strafeVec = new THREE.Vector3(
      (t * 10),
      ((t2) * 80),
      (t * 80)
    );
    this.group.position.addVectors(position, strafeVec);
    this.infoView.mesh.position.addVectors(this.group.position, this.infoView.offset);
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

    var group = this.group;

    $.animate({
      duration: 1000,
      onUpdate() {
        var travelZVector = new THREE.Vector3(
          0,
          0,
          5
        );

        laser.position.add(travelZVector);
      },
      onFinish() {
        group.remove(laser);
      }
    });
  }

  releaseFromHand() {
  }

}


function onProgress() { }
function onError(e) { console.log(e); }

module.exports = BattleGroup;
