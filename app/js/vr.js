var vrToggle = document.getElementById('vr-toggle');

function init(callback) {
  if (navigator.getVRDevices) {
    navigator.getVRDevices().then(function(vrDevices) {
      proccessVrDevices(vrDevices, callback);
    });
  } else {
    callback();
  }
}

function proccessVrDevices(vrDevices, callback) {
  for (var i = 0; i < vrDevices.length; ++i) {
    if (vrDevices[i] instanceof HMDVRDevice) {
      vrHMD = vrDevices[i];
      break;
    }
  }

  for (i = 0; i < vrDevices.length; ++i) {
    if (vrDevices[i] instanceof PositionSensorVRDevice &&
        vrDevices[i].hardwareUnitId == vrHMD.hardwareUnitId) {
      vrHMDSensor = vrDevices[i];
      break;
    }
  }

  if (vrHMD || vrHMDSensor) {
      vrToggle.className = 'active';
      vrToggle.addEventListener('click', goVrFullscreen);
      document.addEventListener('webkitfullscreenchange', function() {
        if (!document.webkitFullscreenElement) {
          console.log('exit');
          vrEnabled = false;
        }
      }, false);
  }
  callback(true, vrHMD, vrHMDSensor);
}

function goVrFullscreen() {
  vrEnabled = true;
  var viewport = document.querySelector('#viewport canvas');
  viewport.webkitRequestFullScreen({ vrDisplay: vrHMD });
}

module.exports = {
  init: init
};
