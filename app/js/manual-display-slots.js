var battleGroupPositions = {
  left: new THREE.Vector3(-150, 0, 150),
  right: new THREE.Vector3(50, 0, 150)
};

var _slots = {
  center: null,
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
  if (!_slots.center) {
    let destination = obj.manualDisplayPosition;
    obj.moveToPosition({destination: destination, duration: 300}, () => obj.animateInInfoView());
    _slots.center = obj;
    return;
  }

  if (_slots.center && _slots.center !== "reserved") {
    if (_slots.center === obj) {
      obj.moveToHomePosition({duration: 300});
      obj.animateOutInfoView();
      _slots.center = null;
    } 
    else if (_slots.center.type === "BattleGroup"){
      let leftObj = _slots.center;
      leftObj.moveToPosition({
        destination: battleGroupPositions.left,
        duration: 300
      }, () => {
        leftObj.animateInInfoView();
        leftObj.startStrafing(leftObj);
      });
      _slots.left = leftObj;

      let rightObj = obj;
      rightObj.moveToPosition({
        destination: battleGroupPositions.right,
        duration: 300
      }, () => {
        rightObj.animateInInfoView();
        rightObj.startStrafing(rightObj);
      });
      _slots.right = rightObj;

      _slots.center = "reserved";
    }
    return;
  }

  if (_slots.left === obj && _slots.right) {
    let leftObj = obj;
    leftObj.stopStrafing();
    leftObj.moveToHomePosition({duration: 300});
    leftObj.animateOutInfoView();
    _slots.left = null;

    let rightObj = _slots.right;
    rightObj.stopStrafing();
    rightObj.moveToPosition({destination: rightObj.manualDisplayPosition, duration: 300}, () => rightObj.animateInInfoView());
    _slots.right = null;
    _slots.center = rightObj;
    
    return;
  }

  if (_slots.right === obj && _slots.left) {
    let rightObj = obj;
    rightObj.stopStrafing();
    rightObj.moveToHomePosition({duration: 300});
    rightObj.animateOutInfoView();
    _slots.right = null;
    
    let leftObj = _slots.left;
    leftObj.stopStrafing();
    leftObj.moveToPosition({destination: leftObj.manualDisplayPosition, duration: 300}, () => leftObj.animateInInfoView());
    _slots.left = null;
    _slots.center = leftObj;

    return;
  }


}

function toggleSlotForPlanet(obj) {
  if (_slots.center === obj) {
    obj.moveToHomePosition({duration: 300});
    _slots.center = null;
    obj.animateOutInfoView();
    return;
  }
  else if (!_slots.center) {
    var destination = obj.manualDisplayPosition.clone();
    obj.moveToPosition({destination: destination, duration: 300}, () => obj.animateInInfoView());
    _slots.center = obj;
    return;
  }
}

module.exports = {
  left() {
    return _slots.left;
  },
  right() {
    return _slots.right;
  },
  battleGroupPositions() {
    return battleGroupPositions;
  },
  toggleSlotForObject: toggleSlotForObject
};
