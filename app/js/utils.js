function rotateAroundObjectAxis( object, axis, radians ) {
  var rotationMatrix = new THREE.Matrix4(); rotationMatrix.makeRotationAxis( axis.normalize(), radians );
  object.matrix.multiplySelf( rotationMatrix );                       // post-multiply
  object.rotation.setEulerFromRotationMatrix(object.matrix, object.order);
}

function animate(duration, callback) {

}

module.exports = {
  rotateAroundObjectAxis: rotateAroundObjectAxis
};
