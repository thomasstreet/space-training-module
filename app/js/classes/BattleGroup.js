require('traceur/bin/traceur-runtime');

var BaseObject = require ('./BaseObject');

class BattleGroup extends BaseObject {
  constructor(options) {
    super(options);

    this.radius = options.radius;

    this.laserColor = options.laserColor;
    this.timeOfLastLaserShot = 0;

    var loader = new THREE.OBJMTLLoader();

    loader.load(options.obj, options.mtl, (originalObject) => {
      for (var i = 0; i < options.shipPositions.length; i++) {
        var object = originalObject.clone();
        object.scale.set(options.scale, options.scale, options.scale);
        object.position.set(
          options.shipPositions[i].x,
          options.shipPositions[i].y,
          options.shipPositions[i].z
        );
        //object.children[0].material.emissive = new THREE.Color({r: 255, g: 255, b: 255});
        //object.children[0].material.emissive.setRGB;
        this.group.add(object);
      }
    }, onProgress, onError);
  }

  fadeIn(duration) {
  }

  update(options) {
    // How do I convert this options obj to vars?
    if (options.isHoldingTwoBattleGroups) {
      this.hideInfoViewImmediately();

      var otherObject = options.leftHandObject.id === this.id ?
        options.rightHandObject :
        options.leftHandObject;

      this.group.lookAt(otherObject.group.position);

      this.shootLaserAt(otherObject);

    } else {
      this.rotate();
    }
  }

  shootLaserAt(otherObject) {
    if (Date.now() - this.timeOfLastLaserShot < 100) return;

    this.timeOfLastLaserShot = Date.now();

    var laser = new THREE.Mesh(
      new THREE.BoxGeometry(10, 1, 1),
      new THREE.MeshBasicMaterial({color: this.laserColor})
    );

    laser.rotateY(Math.PI / 2);

    //var thisEdgeOfSphere = this.group.position.z + this.radius;
    //var otherEdgeOfSphere = otherObject.group.position.z + otherObject.radius;
    //var zDistance = Math.abs(this.group.position.z - otherObject.group.position.z);

    laser.position.set(
      (Math.random() * otherObject.radius * 2) - otherObject.radius,
      (Math.random() * otherObject.radius * 2) - otherObject.radius,
      ((Math.random() * 10) - 20) + this.radius
    );

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

    this.group.add(laser);
  }
}

function onProgress() { }
function onError(e) { console.log(e); }

module.exports = BattleGroup;
