var Planet = require('./planet');

var tatooine = new Planet({
  id: "Tatooine",
  radius: 100,
  color: 0x000000,
  texture: 'assets/mars.jpg',
  initialPosition: [-200, 0, 0],
  moons: {
    count: 2
  }
});

var hoth = new Planet({
  id: "Hoth",
  radius: 70,
  color: 0x000000,
  texture: 'assets/planet_hoth.png',
  initialPosition: [200, 0, 0],
  moons: {
    count: 4
  }
});


var crag = new Planet({
  id: "crag",
  radius: 50,
  color: 0x000000,
  texture: 'assets/planet_crag.jpg',
  initialPosition: [0, 200, 0],
  moons: {
    count: 1
  }
});

var sun = new THREE.Mesh(
  new THREE.SphereGeometry(50, 64, 64),
  new THREE.MeshBasicMaterial({ color: 0xff0000 }) 
);

module.exports = {
  planets: [
    hoth, tatooine, crag
  ],
  tatooine: tatooine,
  hoth: hoth,
  sun: sun
};
