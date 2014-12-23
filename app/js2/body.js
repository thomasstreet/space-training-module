define(['loop'], function(Loop) {

  return function(mesh, physics) {

    var group = new THREE.Group();
    group.add(mesh);
    group.matrixAutoUpdate = false;

    Loop.register(function() {
      var t = Date.now();
      group.matrix = (physics.transformAt(t));
    });

    return group;

  };

});
