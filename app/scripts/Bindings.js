
Basic3D.loadModule("Bindings", function () {

  var actions = [];
  var bindings = [];

  function getAction(actionCode) {
    return actions.find(function(a) {
      return a.code === actionCode;
    });
  }

  function getBinding(actionCode) {
    return bindings.find(function(b) {
      return b.action.code === actionCode;
    });
  }

  function getBindingIndex(keyCode, actionCode) {
    return bindings.findIndex(function(b) {
      return b.key === keyCode && b.action.code === actionCode;
    });
  }

  function addAction(actionCode, actionDisplay) {
    if (getAction(actionCode) !== undefined) return;
    actions.push({
      active: false,
      code: actionCode,
      display: actionDisplay,
      bindable: (actionDisplay !== undefined)
    });
  }

  function getDisplay(code) {
    if (code.indexOf("Key") > -1) return code.replace("Key", "");
    if (code.indexOf("Left") > -1) return code.replace("Left", "");
    if (code.indexOf("Right") > -1) return code.replace("Right", "");
    return code;
  }

  function addBinding(keyCode, actionCode, invert) {
    var index = getBindingIndex(keyCode, actionCode);
    if (index > -1) {
      throw ("ERROR: Cannot register duplicate binding '" + keyCode + "' --> '" + actionCode + "'");
    }
    var action = getAction(actionCode);
    if (action === undefined) {
      throw ("ERROR: Cannot bind to unregistered action '" + actionCode + "'");
    }
    bindings.push({
      key: keyCode,
      keyDisplay: getDisplay(keyCode),
      action: action,
      invert: (invert !== undefined)
    });
    action.active = (invert !== undefined);
  }

  function removeBinding(keyCode, actionCode) {
    var index = getBindingIndex(keyCode, actionCode);
    if (index === -1) {
      throw ("ERROR: Cannot remove unregistered binding '" + keyCode + "' --> '" + actionCode + "'");
    }
    bindings.splice(index, 1);
  }

  function fireBinding(keyCode, value) {
    bindings.forEach(function(b) {
      if (b.key === keyCode) {
        b.action.active = (b.invert) ? !value : value;
      }
    });
  }

  return {
    fire: fireBinding,
    action: function (actionCode) {
      var a = getAction(actionCode);
      return a !== undefined && a.active;
    },
    register: function (data) {
      addAction(data.code, data.display);
      addBinding(data.key, data.code, data.invert);
    },
    getBindings: function() {
      return bindings.filter(function(b) {
        return b.action.bindable;
      });
    },
    removeBinding: removeBinding,
    getBinding: getBinding
  };

});