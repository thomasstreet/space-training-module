var camera = require('./camera');
var objects = require('./objects');

var manualDisplaySlots = {
  left: null,
  right: null
};

var manualDisplaySlotPositions = {
  left: new THREE.Vector3(-100, 0, 200),
  right: new THREE.Vector3(100, 0, 0)
};

function manualDisplayToggle(object) {
  if (manualDisplaySlots.left === object) {
    object.moveToHomePosition({duration: 300});
    manualDisplaySlots.left = null;
    object.animateOutInfoView();
  }
  else if (!manualDisplaySlots.left) {
    var destination = manualDisplaySlotPositions.left.clone();
    destination.add(object.manualDisplayPositionOffset);

    object.moveToPosition({destination: destination, duration: 300}, () => object.animateInInfoView());
    manualDisplaySlots.left = object;
  }
}

function onMouseDown(event) {
  var vector = new THREE.Vector3();
  var raycaster = new THREE.Raycaster();

  vector.set( (event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1, 0.5);
  vector.unproject(camera);
  raycaster.set(camera.position, vector.sub( camera.position ).normalize());
  var intersects = raycaster.intersectObjects(objects.objects);

  if (intersects[0]) {
    manualDisplayToggle(intersects[0]);
  }
}

module.exports = {
  mousedownHandler: onMouseDown
};
