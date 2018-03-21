
Basic3D.loadModule("TipsDisplay", function (Input, Bindings, Display) {

  var label = new Display.Label();

  label.align({x: "left", y: "top"});
  label.show();

  return {

    set: function (mode, displayFunc) {
      label.setHTML(`[ ${mode} ] ${displayFunc()}`);
    }

  };

});