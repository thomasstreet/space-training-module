var _slots = {
  left: null,
  right: null
};

function toggleSlotForObject(obj) {
  if (obj.type === "BattleGroup") {
    toggleSlotForBattleGroup(obj);
  }
  else if (obj.type === "Planet") {
    toggleSlotForPlanet(obj);
  }
}

function toggleSlotForBattleGroup(obj) {
  var destination;
  if (_slots.left === obj) {
    obj.moveToHomePosition({duration: 300});
    _slots.left = null;
    obj.animateOutInfoView();
    return;
  }
  else if (!_slots.left) {
    destination = obj.manualDisplayPosition;
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
    destination = obj.manualDisplayPosition;
    obj.moveToPosition({destination: destination, duration: 300}, () => obj.animateInInfoView());
    _slots.right = obj;
  }
}

function toggleSlotForPlanet(obj) {
  if (_slots.left === obj) {
    obj.moveToHomePosition({duration: 300});
    _slots.left = null;
    obj.animateOutInfoView();
    return;
  }
  else if (!_slots.left) {
    var destination = obj.manualDisplayPosition;
    obj.moveToPosition({destination: destination, duration: 300}, () => obj.animateInInfoView());
    _slots.left = obj;
    return;
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
