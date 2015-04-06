require('traceur/bin/traceur-runtime');

var BaseObject = require ('./BaseObject');
var Ship = require ('./Ship');

var OBJMTLLoader = new THREE.OBJMTLLoader();
var OBJLoader = new THREE.OBJLoader();


var defaultOBJMaterial = new THREE.MeshBasicMaterial({
  //color: 0x111111
});

class BattleGroup extends BaseObject {
  constructor(options) {
    super(options);

    this.group.add(new THREE.Mesh(
      new THREE.SphereGeometry(this.radius, 64, 64),
      new THREE.MeshBasicMaterial({
        color: 0xff0000,
        transparent: true,
        opacity: 0.3
      }) 
    ));

    // infoView should be offset further to the right for battle groups
    this.infoView.offset = new THREE.Vector3(
      this.radius * 3,
      0,
      this.radius + 20
    );

    this.laserColor = options.laserColor;
    this.timeOfLastLaserShot = 0;

    this.isInteractingWithPlanet = false;

    this.ships = [];

    if (options.mtl) {
      OBJMTLLoader.load(options.obj, options.mtl, (loadedObject) => {
        generateShips.call(this, loadedObject);
      }, onProgress, onError);
    }
    else {
      OBJLoader.load(options.obj, (loadedObject) => {
        loadedObject.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.material = defaultOBJMaterial;
          }
        });
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
    var {objectInLeftHand, objectInRightHand} = options;

    var isOneOfTheHeldObjects = objectInLeftHand === this ||
      objectInRightHand === this;

    var bothHandsHoldingAnObject = objectInLeftHand && objectInRightHand;

    if (isOneOfTheHeldObjects && bothHandsHoldingAnObject) {
      var otherObject = objectInLeftHand === this ?
        objectInRightHand :
        objectInLeftHand;

      var isTwoBattleGroups = otherObject.type === "BattleGroup";
      var isBattleGroupAndPlanet = otherObject.type === "Planet";

      if (isTwoBattleGroups) {
        //this.group.lookAt(otherObject.group.position);
      }

      var distanceFromObject = this.group.position.distanceTo(otherObject.group.position);

      if (distanceFromObject <= 250) {
        if (isTwoBattleGroups) {
          this.shootLaserAt(otherObject);
        }
        else if (isBattleGroupAndPlanet) {
          this.interactWithPlanet(otherObject);
        }
      }
    } else {
      if (!this.isInteractingWithPlanet) {
        //this.rotate();
      }
    }

    if (!bothHandsHoldingAnObject) {
      this.stopInteractingWithPlanet();
    }

    this.ships.forEach((ship) => {
      ship.update();
    });
  }

  positionRelativeToHand(hand) {
    super(hand);
    if (this.isInteractingWithPlanet) {
      var planet = this.isInteractingWithPlanet;

      console.log("this group:", this.group.position);
      console.log("planet group:", planet.group.position);

      var offset = new THREE.Vector3(
        this.group.position.x - planet.group.position.x,
        this.group.position.y - planet.group.position.y,
        this.group.position.z - planet.group.position.z
      );

      offset.negate();

      this.ships.forEach((ship) => {
        //ship.moveToPlanet(offset);
        ship.moveToPlanet(new THREE.Vector3(-100, 0, 0));
      });
    }
  }

  fadeIn() {
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

  interactWithPlanet(planet) {
    if (!this.isInteractingWithPlanet) {
      this.isInteractingWithPlanet = planet;
    }
  }

  stopInteractingWithPlanet() {
    if (this.isInteractingWithPlanet) {
      this.isInteractingWithPlanet = false;

      this.ships.forEach((ship) => {
        console.log("move to home");
        ship.moveToHomePosition();
      });
    }
  }

  releaseFromHand() {
    this.stopInteractingWithPlanet();
  }

}


function onProgress() { }
function onError(e) { console.log(e); }

module.exports = BattleGroup;
