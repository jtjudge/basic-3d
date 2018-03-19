
Basic3D.loadModule("ModeDisplay", function (Display, Input) {

  var modeDisplay = new Display.Label();
  modeDisplay.setHTML(Input.mode());
  modeDisplay.show();

  Input.register({
    onmode: function () {
      modeDisplay.setHTML(Input.mode());
    }
  });

  return {
    toggle: modeDisplay.toggle
  };

});

Basic3D.loadScript("ToggleModeDisplay", function (ModeDisplay) {
  return ModeDisplay.toggle;
});