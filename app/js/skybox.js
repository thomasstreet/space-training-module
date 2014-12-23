var imagePrefix = 'assets/omxos/';
var directions  = ['Left', 'Right', 'Up', 'Down', 'Front', 'Back'];
var imageSuffix = '.png';

var skyGeometry = new THREE.CubeGeometry(100000, 100000, 100000);	

var materialArray = [];
for (var i = 0; i < 6; i++)
  materialArray.push( new THREE.MeshBasicMaterial({
    map: THREE.ImageUtils.loadTexture(imagePrefix + directions[i] + imageSuffix),
    side: THREE.BackSide
  }));
var skyMaterial = new THREE.MeshFaceMaterial(materialArray);

var skybox = new THREE.Mesh(skyGeometry, skyMaterial);

module.exports = skybox;
