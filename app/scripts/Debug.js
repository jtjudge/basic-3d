
var Debug = (function() {

  var DEBUG = true;

  var interface = {
    log: function(message) {
      if(DEBUG) console.log(message);
    }
  };

  // To be expanded for tests

  return interface;

})();