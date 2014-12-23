define(function() {

  var callbacks = {};
  var genId = function() {
    return Math.random().toString();
  };

  var running = false;

  var loop = function() {

    if (running) {
      Object.keys(callbacks).forEach(function(id) {
        callbacks[id].call();
      });
    };

    window.requestAnimationFrame(loop);

  };

  loop();

  return {
    register: function(callback) {
      var id = genId();
      callbacks[id] = callback;
      return id;
    },
    unregister: function(id) {
      delete callbacks[id];
    },
    start: function() {
      running = true;
    },
    stop: function() {
      running = false;
    },
  };

});
