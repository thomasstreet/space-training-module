var BaseObject = require ('./BaseObject');
var Ship = require ('./Ship');

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

    this.ships.forEach((ship) => {
      ship.update();
    });
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

  releaseFromHand() {
  }

}


function onProgress() { }
function onError(e) { console.log(e); }

module.exports = BattleGroup;
