define(function() {

  return function(speed) {
    // speed is radians / second

    var start = Date.now();

    return {
      transformAt: function(t) {
        var angle = speed * ((t - start) / 1000);
        var axis = new THREE.Vector3(0, 1, 0);
        var rotObjectMatrix = new THREE.Matrix4();
        rotObjectMatrix.makeRotationAxis(axis.normalize(), angle);
        return rotObjectMatrix;
      }
    }
  };

});
