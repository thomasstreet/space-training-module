require('traceur/bin/traceur-runtime');

class SkinnedMesh {
  constructor(options) {
    console.log(options);
    this.name = options.name;
  }

  sayName() {
    console.log(this.name);
  }

}

var test = new SkinnedMesh({name: 'hi'});
test.sayName();
