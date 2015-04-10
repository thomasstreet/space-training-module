var slotPositions = {
  left: new THREE.Vector3(-100, 0, 200),
  right: new THREE.Vector3(100, 0, 200)
};

var _slots = {
  left: null,
  right: null
};

function toggleSlotForObject(obj) {
  if (_slots.left === obj) {
    obj.moveToHomePosition({duration: 300});
    _slots.left = null;
    obj.animateOutInfoView();
    return;
  }
  else if (!_slots.left) {
    var destination = slotPositions.left.clone();
    destination.add(obj.manualDisplayPositionOffset);

    obj.moveToPosition({destination: destination, duration: 300}, () => obj.animateInInfoView());
    _slots.left = obj;
    return;
  }

  if (_slots.right === obj) {
    obj.moveToHomePosition({duration: 300});
    _slots.right = null;
    obj.animateOutInfoView();
  }
  else if (!_slots.right) {
    var destination = slotPositions.right.clone();
    destination.add(obj.manualDisplayPositionOffset);

    obj.moveToPosition({destination: destination, duration: 300}, () => obj.animateInInfoView());
    _slots.right = obj;
  }
}

module.exports = {
  left: function() {
    return _slots.left;
  },
  right: function() {
    return _slots.right;
  },
  toggleSlotForObject: toggleSlotForObject
};
