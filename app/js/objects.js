var Planet = require('./classes/Planet');
var BattleGroup = require('./classes/BattleGroup');

var Planet2432 = new Planet({
  id: "Planet2432",
  type: "Planet",
  radius: 70,
  color: 0x000000,
  moonColor: 0xffffff,
  texture: 'assets/planet2432.jpg',
  homePosition: new THREE.Vector3(-250, 100, 0),
  manualDisplayPosition: new THREE.Vector3(-100, 0, 200),
  autoRotationSpeed: -0.005,
  videoId: 'video-0',
  moonCount: 2
});

var NewSedna = new Planet({
  id: "NewSedna",
  type: "Planet",
  radius: 100,
  color: 0x000000,
  moonColor: 0x000000,
  texture: 'assets/new_sedna.png',
  homePosition: new THREE.Vector3(250, 100, 0),
  manualDisplayPosition: new THREE.Vector3(-100, 0, 200),
  autoRotationSpeed: 0.005,
  videoId: 'video-1',
  moonCount: 4
});

var ErdaneseBattleGroup = new BattleGroup({
  id: "Erdanese Battle Group",
  type: "BattleGroup",
  laserColor: 0xEE1A26,
  obj: 'assets/alien_fighter_1/alien_fighter_1.obj',
  texture: {
    map: THREE.ImageUtils.loadTexture('assets/alien_fighter_1/color_1.jpg'),
    specularMap: THREE.ImageUtils.loadTexture('assets/alien_fighter_1/specular_1.jpg'),
    lightMap: THREE.ImageUtils.loadTexture('assets/alien_fighter_1/illumination_1.jpg'),
  },
  homePosition: new THREE.Vector3(-200, -100, -50),
  manualDisplayPosition: new THREE.Vector3(-60, 0, 250),
  radius: 30,
  initialTimeOffset: 1000,
  shipPositions: [
    new THREE.Vector3(0, 20, 30),
    new THREE.Vector3(20, 0, 0),
    new THREE.Vector3(-20, 0, 0),
    new THREE.Vector3(0, -20, 0),
  ],
  autoRotationSpeed: -0.002,
  shipAutoRotationSpeed: {
    x: 0.01,
    y: 0
  },
  scale: 0.4,
  rotateY: Math.PI / 2,
  videoId: 'video-2'
});

var SedneseBattleGroup = new BattleGroup({
  id: "Sednese Battle Group",
  type: "BattleGroup",
  laserColor: 0x04ADC3,
  obj: 'assets/drone/light_drone_2.obj',
  texture: {
    map: THREE.ImageUtils.loadTexture('assets/drone/light_drone_2_color.png'),
    specularMap: THREE.ImageUtils.loadTexture('assets/drone/light_drone_2_specular.png'),
    lightMap: THREE.ImageUtils.loadTexture('assets/drone/light_drone_2_illumination.png'),
  },
  homePosition: new THREE.Vector3(200, -100, -50),
  manualDisplayPosition: new THREE.Vector3(-50, 0, 250),
  radius: 30,
  initialTimeOffset: 0,
  shipPositions: [
    new THREE.Vector3(20, 20, 0),
    new THREE.Vector3(-20, 20, 0),

    new THREE.Vector3(0, 0, 30),

    new THREE.Vector3(0, -20, 0),
  ],
  autoRotationSpeed: 0.002,
  scale: 0.5,
  rotateY: Math.PI / 2,
  videoId: 'video-3'
});

var sun = new THREE.Mesh(
  new THREE.SphereGeometry(50, 16, 16),
  new THREE.MeshBasicMaterial({
    map: THREE.ImageUtils.loadTexture("assets/texture_sun.jpg")
  }) 
);

module.exports = {
  objects: [
    Planet2432, NewSedna, ErdaneseBattleGroup, SedneseBattleGroup
  ],
  sun: sun
};
