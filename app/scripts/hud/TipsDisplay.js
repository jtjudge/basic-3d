
Basic3D.loadModule("TipsDisplay", function (Input, Bindings, Display) {

  var tips = {};

  var label = new Display.Label();

  function register(mode, actions) {
    tips[mode] = actions;
  }

  function refresh() {
    var mode = Input.mode();
    if (tips[mode] === undefined) {
      label.setHTML("[ " + mode + " ]");
    } else {
      var html = "";
      tips[mode].forEach(function (actionCode) {
        var binding = Bindings.getBinding(actionCode);
        html += `, ${binding.action.display}: '${binding.key}'`
      });
      html = "[ " + mode + " ] " + html.substring(1, html.length);
      label.setHTML(html);
    }
  }

  register("EDIT", [
    "TOGGLE_TRANSLATE_MODE", 
    "TOGGLE_ROTATE_MODE",
    "TOGGLE_SCALE_MODE"
  ]);

  refresh();

  label.align({x: "left", y: "top"});
  label.show();

  Input.register({
    onmode: refresh
  });

  return {};

});