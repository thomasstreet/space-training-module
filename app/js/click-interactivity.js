var camera = require('./camera');
var objects = require('./objects');
var manualDisplaySlots = require('./manual-display-slots');

window.objects = objects;

function onMouseDown(event) {
  var vector = new THREE.Vector3();
  var raycaster = new THREE.Raycaster();

  vector.set( (event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1, 0.5);
  vector.unproject(camera);
  raycaster.set(camera.position, vector.sub( camera.position ).normalize());
  var intersects = raycaster.intersectObjects(objects.objects);

  intersects.forEach((intersect) => {
    manualDisplaySlots.toggleSlotForObject(intersect);
  });
}

module.exports = {
  mousedownHandler: onMouseDown
};
