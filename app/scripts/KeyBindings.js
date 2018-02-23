
var KeyBindings = (function() {

  var bindings = {
    keys: {},
    actions: {}
  };

  var interface = {
    getKeyBindings: function() {
      return bindings;
    },
    addKeyBinding: function(key, action) {
      if(!bindings.keys[key]) {
        bindings.keys[key] = [];
      }
      if(!bindings.actions[action]) {
        bindings.actions[action] = false;
      }
      var index = bindings.keys[key].findIndex(function(a) {
        return a === action;
      });
      if(index > -1) {
        Debug.log("[KeyBindings] Duplicate key binding '" + 
          key + " --> " + action + "' attempted");
        return false;
      }
      bindings.keys[key].push(action);
      return true;
    },
    removeKeyBinding: function(key, action) {
      if(!bindings.keys[key] === undefined) {
        Debug.log("[KeyBindings] Key '" + key + "' not registered");
        return false;
      }
      if(bindings.actions[action] === undefined) {
        Debug.log("[KeyBindings] Action '" + action + "' not registered");
        return false;
      }
      var index = bindings.keys[key].findIndex(function(a) {
        return a === action;
      });
      if(index === -1) {
        Debug.log("[KeyBindings] Key binding '" + 
          key + " --> " + action + "' not registered");
        return false;
      }
      bindings.keys[key].splice(index, 1);
      return true;
    }
  };

  return interface;

})();