
Basic3D.loadModule("TipsDisplay", function (Input, Bindings, Display) {

  var label = new Display.Label();

  var modes = {};

  label.align({ x: "left", y: "top" });
  label.show();

  return {
    update: function () {
      var mode = modes[Input.mode()];
      if (mode !== undefined) {
        var html = "[ " + mode.display + " ]";
        mode.tips.filter(function (obj) {
          if (obj.condition === undefined) return true;
          return obj.condition();
        }).forEach(function(obj, index) {
          html += (index > 0 ? ", " : " ");
          html += obj.builder(function (actionCode) {
            return Bindings.getBinding(actionCode).key;
          });
        });
        label.setHTML(html);
      } else {
        label.setHTML("[ " + Input.mode() + " ]");
      }
    },
    registerMode: function (params) {
      modes[params.name] = { display: params.display, tips: [] };
      if (params.mapped !== undefined) {
        params.mapped.forEach(function (m) {
          modes[m] = modes[params.name];
        });
      }
    },
    registerTip: function (params) {
      if (modes[params.mode] === undefined) {
        throw (`Cannot register tip for unregistered mode '${params.mode}'`)
      }
      modes[params.mode].tips.push(params);
    }
  };

});