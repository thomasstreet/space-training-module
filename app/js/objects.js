var Planet = require('./classes/Planet');
var BattleGroup = require('./classes/BattleGroup');

var Tatooine = new Planet({
  id: "Tatooine",
  radius: 100,
  color: 0x000000,
  texture: 'assets/mars.jpg',
  initialPosition: new THREE.Vector3(-200, 0, 0),
  rotationSpeed: -0.005,
  moons: {
    count: 2
  }
});

var Hoth = new Planet({
  id: "Hoth",
  radius: 70,
  color: 0x000000,
  texture: 'assets/planet_hoth.png',
  initialPosition: new THREE.Vector3(200, 0, 0),
  rotationSpeed: -0.005,
  moons: {
    count: 4
  }
});


var Crag = new Planet({
  id: "Crag",
  radius: 50,
  color: 0x000000,
  texture: 'assets/planet_crag.jpg',
  initialPosition: new THREE.Vector3(0, 200, 0),
  rotationSpeed: -0.005,
  moons: {
    count: 1
  }
});


var RebelAllianceBattleGroup = new BattleGroup({
  id: "Rebal Alliance Battle Group",
  obj: 'assets/star-wars/ARC170-2/Arc170.obj',
  mtl: 'assets/star-wars/ARC170-2/Arc170.mtl',
  initialPosition: new THREE.Vector3(0, -200, 0),
  rotationSpeed: 0,
  scale: 0.03,
  count: 10
});

var sun = new THREE.Mesh(
  new THREE.SphereGeometry(50, 64, 64),
  new THREE.MeshBasicMaterial({ color: 0xff0000 }) 
);

module.exports = {
  objects: [
    Hoth, Tatooine, Crag, RebelAllianceBattleGroup
  ],
  sun: sun
};
