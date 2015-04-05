require('traceur/bin/traceur-runtime');

var BaseObject = require ('./BaseObject');

class BattleGroup extends BaseObject {
  constructor(options) {
    super(options);

    this.radius = options.radius;

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

      if (options.leftHandObject.id === this.id) {
        this.group.lookAt(options.rightHandObject.group.position);
      } else {
        this.group.lookAt(options.leftHandObject.group.position);
      }

    } else {
      this.rotate();
    }
  }

  faceObject() {
  
  }
}

function onProgress() { }
function onError(e) { console.log(e); }

module.exports = BattleGroup;
