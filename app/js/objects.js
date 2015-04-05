var Planet = require('./classes/Planet');
var BattleGroup = require('./classes/BattleGroup');

var Tatooine = new Planet({
  id: "Tatooine",
  type: "Planet",
  radius: 100,
  color: 0x000000,
  texture: 'assets/mars.jpg',
  initialPosition: new THREE.Vector3(-300, 100, 0),
  autoRotationSpeed: -0.005,
  moons: {
    count: 2
  }
});

var Hoth = new Planet({
  id: "Hoth",
  type: "Planet",
  radius: 70,
  color: 0x000000,
  texture: 'assets/planet_hoth.png',
  initialPosition: new THREE.Vector3(300, 100, 0),
  autoRotationSpeed: -0.005,
  moons: {
    count: 4
  }
});


var Crag = new Planet({
  id: "Crag",
  type: "Planet",
  radius: 50,
  color: 0x000000,
  texture: 'assets/planet_crag.jpg',
  initialPosition: new THREE.Vector3(0, 200, 0),
  autoRotationSpeed: -0.005,
  moons: {
    count: 1
  }
});


var RebelAllianceBattleGroup = new BattleGroup({
  id: "Rebal Alliance Battle Group",
  type: "BattleGroup",
  obj: 'assets/star-wars/ARC170-2/Arc170.obj',
  mtl: 'assets/star-wars/ARC170-2/Arc170.mtl',
  initialPosition: new THREE.Vector3(200, -100, 0),
  radius: 80,
  shipPositions: [
    new THREE.Vector3(0, 40, 0),
    new THREE.Vector3(20, 20, 0),
    new THREE.Vector3(-20, 20, 0),

    new THREE.Vector3(0, 0, 30),
    new THREE.Vector3(0, 0, -30),

    new THREE.Vector3(-40, 0, 0),
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(40, 0, 0),

    new THREE.Vector3(20, -20, 0),
    new THREE.Vector3(-20, -20, 0),
    new THREE.Vector3(0, -40, 0),
  ],
  autoRotationSpeed: -0.004,
  scale: 0.02
});

var RepublicBattleGroup = new BattleGroup({
  id: "Republic Battle Group",
  type: "BattleGroup",
  obj: 'assets/star-wars/ARC170-2/Arc170.obj',
  mtl: 'assets/star-wars/ARC170-2/Arc170.mtl',
  initialPosition: new THREE.Vector3(-200, -100, 0),
  radius: 80,
  shipPositions: [
    new THREE.Vector3(0, 40, 0),
    new THREE.Vector3(20, 20, 0),
    new THREE.Vector3(-20, 20, 0),

    new THREE.Vector3(0, 0, 30),
    new THREE.Vector3(0, 0, -30),

    new THREE.Vector3(-40, 0, 0),
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(40, 0, 0),

    new THREE.Vector3(20, -20, 0),
    new THREE.Vector3(-20, -20, 0),
    new THREE.Vector3(0, -40, 0),
  ],
  autoRotationSpeed: -0.004,
  scale: 0.02
});

var sun = new THREE.Mesh(
  new THREE.SphereGeometry(50, 64, 64),
  new THREE.MeshBasicMaterial({
    map: THREE.ImageUtils.loadTexture("assets/texture_sun.jpg")
  }) 
);

module.exports = {
  objects: [
    Hoth, Tatooine, Crag, RebelAllianceBattleGroup, RepublicBattleGroup
  ],
  sun: sun
};
