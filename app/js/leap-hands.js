require('traceur/bin/traceur-runtime');

var Hand = require("./classes/Hand");

var yOffset = -300;

var group = new THREE.Group();

var left = new Hand("left", group);
var right = new Hand("right", group);

var loop = Leap.loop({background: true}, {
  hand: function (data) {
    var hand = data.type === 'left' ? left : right;
    
    if (!hand.isVisible) return;

    data.fingers.forEach(function (finger, i) {
      var sphere = hand.fingerTips[i];
      sphere.position.fromArray(finger.tipPosition);
      sphere.position.y += yOffset;
      var n = finger.direction;
      sphere.lookAt(new THREE.Vector3(n[0] * 1000, n[1] * 1000, n[2] * 1000));
      sphere.updateMatrix();
    });

    var palm = hand.palm;
    var position = hand.getRollingAverage(palm.posSequence, data.palmPosition);
    palm.position.fromArray(position);
    palm.position.y += yOffset;

    hand.velocity = data.palmVelocity;
    var normalArray = hand.getRollingAverage(palm.normalSequence, data.palmNormal);
    hand.normal = new THREE.Vector3(normalArray[0], normalArray[1], normalArray[2]);

    var n = data.palmNormal;
    hand.palm.lookAt(new THREE.Vector3(n[0] * 1000, n[1] * 1000, n[2] * 1000));
  }
})
// Provides handFound/handLost events.
.use('handEntry');

function setUpHandEventHandlers() {
  loop.on('handFound', function(data) {
    var hand = data.type === 'left' ? left : right;
    hand.showHand(data);
  })
  .on('handLost', function(data) {
    var hand = data.type === 'left' ? left : right;
    hand.resetRollingAverageSequences();

    var heldObject = hand.getHeldObject();
    if (heldObject) {
      heldObject.moveToHomePosition({duration: 500});
      heldObject.hideInfoViewImmediately();
      hand.stopHoldingObject();
    }

    hand.hideHand(data);
  });
}

module.exports = {
  group: group,
  right: right,
  left: left,
  hands: [right, left],
  isEitherHandHoldingObject(object) {
    return right.isHoldingThisObject(object) ||
      left.isHoldingThisObject(object);
  },
  setUpHandEventHandlers: setUpHandEventHandlers
};
