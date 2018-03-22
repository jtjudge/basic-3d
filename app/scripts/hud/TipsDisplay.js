
Basic3D.loadModule("TipsDisplay", function (Input, Bindings, Display) {

  var label = new Display.Label();

  var modes = {};

  var list = false;

  label.align({ x: "left", y: "top" });
  label.show();

  Input.addKeyBinding("KeyH", "TOGGLE_TIPS", "Toggle Tips");
  Input.register({
    onkeydown: function () {
      if (Input.action("TOGGLE_TIPS")) label.toggle();
    }
  });

  function buildTip(content, index) {
    var html = "";
    if (!list) {
      html += "<div>";
    } else {
      html += (index > 0) ? ", " : " ";
    }
    html += content;
    if (!list) {
      html += "</div>";
    }
    return html;
  }

  return {
    update: function () {
      var mode = modes[Input.mode()];
      if (mode === undefined) {
        mode = { display: Input.mode(), tips: [] };
      }
      var html = `[ ${mode.display} ]`;
      var shown = mode.tips.filter(function (obj) {
        if (obj.condition === undefined) return true;
        return obj.condition();
      });
      shown.forEach(function(obj, index) {
        var txt = obj.builder(function (actionCode) {
          return Bindings.getBinding(actionCode).key;
        });
        html += buildTip(txt, index);
      });
      html += buildTip(`${Bindings.getBinding("TOGGLE_TIPS").key} to hide tips`, shown.length);
      label.setHTML(html);
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
    },
    toggleListMode: function () {
      list = !list;
    }
  };

});

Basic3D.loadScript("ToggleTipsList", function (TipsDisplay) {

  return TipsDisplay.toggleListMode;

});