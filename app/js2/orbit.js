define(function() {

  return function(around, options) {

    var start = Date.now();

    return {
      transformAt: function(time) {
        var t = (time - start) / 500;
        var base = around.matrix.copyPosition(new THREE.Matrix4());

        var translateObjectMatrix = new THREE.Matrix4();
        var outPutMatrix = new THREE.Matrix4();
        var offset = Math.sqrt(Math.pow(options.major, 2) - Math.pow(options.minor, 2));
        var x = Math.cos(t) * options.major + offset;
        var y = Math.sin(t) * options.minor;

        return outPutMatrix.multiplyMatrices(
          base,
          translateObjectMatrix.makeTranslation(x, y, 0)
        );
      }
    }
  };

});
