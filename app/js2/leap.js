define(['AtmosphereGlowMaterial', 'loop'], function(AtmosphereGlowMaterial, Loop) {
  return function() {
    var group = new THREE.Group();

    var left = {
     palm: null,
     fingerTips: []
    };

    var right = {
     palm: null,
     fingerTips: [],
     velocity: null
    };

    var geometry = new THREE.TorusGeometry(25, 1, 32, 32);
    var material = new THREE.MeshBasicMaterial();

    var outer = new THREE.Mesh(geometry, material);
    geometry = new THREE.TorusGeometry(15, 1, 32, 32);
    var inner = new THREE.Mesh(geometry, material);
    inner.position.z = -5;
    left.palm = new THREE.Group();
    left.palm.add(outer);
    left.palm.add(inner);

    left.palm.position.z = 200;

    // Hide until active
    hide(left.palm);
    group.add(left.palm);

    outer = new THREE.Mesh(
      new THREE.TorusGeometry(25, 0.5, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xffffff }) 
    );
    inner = new THREE.Mesh(
      new THREE.TorusGeometry(20, 0.5, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xffffff }) 
    );
    inner.position.z = -3;
    right.palm = new THREE.Group();
    right.palm.add(outer);
    right.palm.add(inner);

    // Set initial z position
    right.palm.position.z = 200;

    hide(right.palm);
    group.add(right.palm);

    var geometry = new THREE.CylinderGeometry(10, 10, 1, 32, 32);
    var material = new THREE.MeshBasicMaterial();

    var ball;
    for (var i = 0; i < 5; i++) {
      var finger = new THREE.Group();
      var leftSphere = new THREE.Mesh(geometry, material);
      ball = new THREE.Mesh(
        new THREE.SphereGeometry(10, 32, 16),
        AtmosphereGlowMaterial
      );
      finger.add(leftSphere);
      finger.add(ball);
      left.fingerTips.push(finger);
      hide(leftSphere);
      group.add(finger);

      var rightSphere = new THREE.Mesh(geometry, material);
      right.fingerTips.push(rightSphere);
      hide(rightSphere);
      group.add(rightSphere);
    }

    Leap.loop({background: true}, {
      hand: function (data) {
        var hand = data.type === 'left' ? left : right;
        data.fingers.forEach(function (finger, i) {
          var sphere = hand.fingerTips[i];
          sphere.position.fromArray(finger.tipPosition);
          var n = finger.direction;
          sphere.lookAt(new THREE.Vector3(n[0] * 1000, n[1] * 1000, n[2] * 1000));
          sphere.updateMatrix();
        });
        var palm = hand.palm;
        palm.position.fromArray(data.palmPosition);

        hand.velocity = data.palmVelocity;
        hand.normal = data.palmNormal;

        var n = data.palmNormal;
        hand.palm.lookAt(new THREE.Vector3(n[0] * 1000, n[1] * 1000, n[2] * 1000));
        hand.palm.updateMatrix();
      }
    })
    // Provides handFound/handLost events.
    .use('handEntry')
    .on('handFound', function(data) {
      var hand = data.type === 'left' ? left : right;
      data.fingers.forEach(function (finger, i) {
        var sphere = hand.fingerTips[i];
        show(sphere);
      });
      var palm = hand.palm;
      show(palm);
    })
    .on('handLost', function(data) {
      var hand = data.type === 'left' ? left : right;
      data.fingers.forEach(function (finger, i) {
        var sphere = hand.fingerTips[i];
        hide(sphere);
      });
      var palm = hand.palm;
      hide(palm);
    });

    function show(mesh) {
      mesh.traverse(function(child) {
        child.visible = true;
      });
    }

    function hide(mesh) {
      mesh.traverse(function(child) {
        child.visible = false;
      });
    }

    return {
      group: group,
      rightHand: right,
      leftHand: left
    };
  };
});
