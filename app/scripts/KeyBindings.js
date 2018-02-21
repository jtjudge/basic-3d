
var KeyBindings = (function() {

  var bindings = {
    keys: {},
    actions: {}
  };

  function map(key, action) {
    if(!bindings.keys[key]) {
      bindings.keys[key] = [];
    }
    if(!bindings.actions[action]) {
      bindings.actions[action] = false;
    }
    bindings.keys[key].push(action);
  }

  var interface = {
    getKeyBindings: function() {
      return bindings;
    },
    addKeyBinding: map
  };

  return interface;

})();