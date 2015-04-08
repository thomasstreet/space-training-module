function show(el) {
  el.style.display = "block";
}

function hide(el) {
  el.style.display = "none";
}

function activate(el) {
  el.className = "active";
}

function deactivate(el) {
  el.className = "";
}

function animate(options) {
  var { duration, onUpdate, onFinish } = options;

  if (isNaN(duration)) {
    throw "duration is not a number";
  }

  var start = null;

  requestAnimationFrame(loop);

  function loop(timestamp) {
    if (!start) start = timestamp;

    var progress = timestamp - start;

    var t = Math.min(progress / duration , 1);
    onUpdate(t, progress);

    if (progress < duration) {
      requestAnimationFrame(loop);
    } else {
      if (onFinish) {
        onFinish();
      }
    }
  }
}

module.exports = {
  show: show,
  hide: hide,
  activate: activate,
  deactivate: deactivate,
  animate: animate
};
