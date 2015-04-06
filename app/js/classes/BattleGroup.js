require('traceur/bin/traceur-runtime');

var BaseObject = require ('./BaseObject');
var Ship = require ('./Ship');

var OBJMTLLoader = new THREE.OBJMTLLoader();
var OBJLoader = new THREE.OBJLoader();


var defaultOBJMaterial = new THREE.MeshBasicMaterial({
  color: 0x111111
});

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

    if (options.mtl) {
      OBJMTLLoader.load(options.obj, options.mtl, (loadedObject) => {
        generateShips.call(this, loadedObject);
      }, onProgress, onError);
    }
    else {
      OBJLoader.load(options.obj, (loadedObject) => {
        loadedObject.traverse( function ( child ) {
          if ( child instanceof THREE.Mesh ) {
            child.material = defaultOBJMaterial;
          }
        } );
        generateShips.call(this, loadedObject);
      }, onProgress, onError);
    }

    function generateShips(originalObject) {
      for (var i = 0; i < options.shipPositions.length; i++) {
        var ship = new Ship({
          mesh: originalObject.clone(),
          scale: options.scale,
          position: options.shipPositions[i]
        });

        this.ships.push(ship);

        this.group.add(ship.mesh);
      }
    }
  }

  update(options) {
    // How do I convert this options obj to vars?
    if (options.leftHandObject && options.rightHandObject) {
      var otherObject = options.leftHandObject === this ?
        options.rightHandObject :
        options.leftHandObject;

      this.group.lookAt(otherObject.group.position);

      var distanceFromObject = this.group.position.distanceTo(otherObject.group.position);
      if (distanceFromObject <= 250 &&
         options.rightHandObject.type === "BattleGroup" &&
         options.leftHandObject.type === "BattleGroup"
       ) {
        this.shootLaserAt(otherObject);
      }
    } else {
      this.rotate();
    }

    this.ships.forEach((ship) => {
      ship.update();
    });
  }

  fadeIn(duration) {
    // Don't implement fade for battle groups to save performance.
    // Instead do some sort of translation animation.
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
