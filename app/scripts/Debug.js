
Basic3D.loadModule("Debug", function () {

  var DEBUG = true;

  var interface = {
    log: function (message) {
      if (DEBUG) console.log(message);
    }
  };

  return interface;

});