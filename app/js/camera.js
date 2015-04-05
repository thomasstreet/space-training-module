document.getElementById('reset-camera').onclick = () => {
  camera.position.set(0, 0, 500);
  camera.lookAt(new THREE.Vector3(0, 0, -500));
}; 

var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 100000);

camera.position.z = 500;

module.exports = camera;
