var chromeLeapPopup = require('./chrome-leap-popup');

var Hand = require("./classes/Hand");

var left = new Hand("left");
var right = new Hand("right");

var loop = Leap.loop({background: true}, {
  hand: function (data) {
    var hand = data.type === 'left' ? left : right;
    var palm = hand.palm;
    
    if (!hand.isVisible) return;

    hand.updateFingers(data.fingers);

    hand.velocity = data.palmVelocity;

    hand.updatePalm(data.palmPosition, data.palmNormal);

    var normalArray = hand.getRollingAverage(palm.normalSequence, data.palmNormal);
    var normal = new THREE.Vector3(normalArray[0], normalArray[1], normalArray[2]);
    hand.normal = normal;
  }
})
// Provides handFound/handLost events.
.use('handEntry');

function setUpHandEventHandlers() {
  loop.on('handFound', function(data) {
    chromeLeapPopup.leapDetected();
    var hand = data.type === 'left' ? left : right;
    hand.showHand(data);
  })
  .on('handLost', function(data) {
    var hand = data.type === 'left' ? left : right;
    hand.resetRollingAverageSequences();

    var heldObject = hand.getHeldObject();
    if (heldObject) {
      heldObject.moveToHomePosition({duration: 500});
      heldObject.animateOutInfoView();
      hand.stopHoldingObject();
    }

    hand.hideHand(data);
  });
}

module.exports = {
  right: right,
  left: left,
  hands: [right, left],
  isEitherHandHoldingObject(object) {
    return right.isHoldingThisObject(object) ||
      left.isHoldingThisObject(object);
  },
  setUpHandEventHandlers: setUpHandEventHandlers
};
