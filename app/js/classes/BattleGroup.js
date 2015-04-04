require('traceur/bin/traceur-runtime');

var BaseObject = require ('./BaseObject');

class BattleGroup extends BaseObject {
  constructor(options) {
    super(options);

    var loader = new THREE.OBJMTLLoader();

    loader.load(options.obj, options.mtl, (originalObject) => {
      var scale = 0.03;
      var count = 10;
      for (var i = 0; i < count; i++) {
        var object = originalObject.clone();
        object.scale.set(scale,scale,scale);
        object.position.set(
          (i % 5) * 40,
          i < count / 2 ? 0 : 40,
          0
        );
        this.group.add(object);
      }
    }, onProgress, onError);
  }

  fadeIn(duration) {
    //var fade = setInterval(() => {
      //this.sphereMesh.material.opacity += 0.01;
      //if (this.sphereMesh.material.opacity >= 1) {
        //clearInterval(fade);
      //}
    //}, duration / 100);
  }
}

function onProgress() { }
function onError(e) { console.log(e); }

module.exports = BattleGroup;
