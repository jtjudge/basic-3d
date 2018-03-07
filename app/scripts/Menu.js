
Basic3D.loadModule("Menu", function(Scene) {

  // Constructor
  return function() {

    var menu = document.createElement("div");
    menu.style.color = "white";
    menu.style.backgroundColor = "gray";
    menu.style.height = "100px";
    menu.style.width = "200px";
    menu.style.padding = "5px";
    menu.innerHTML = "Menu";

    // Interface
    return {
      show: function() {
        Scene.addLayer(menu, { top: 100, left: 300 });
      },
      addButton: function(data) {
        var button = document.createElement("span");
        button.style.backgroundColor = "blue";
        button.innerHTML = data.display;
        button.style.margin = "0 20%";
        button.onclick = data.onclick;
        menu.appendChild(button);
      },
      addCloseButton: function(cb) {
        var button = document.createElement("span");
        button.style.backgroundColor = "red";
        button.innerHTML = "X";
        button.onclick = function() {
          // Note -- need to remove!
          menu.style.display = "none";
          cb();
        };
        menu.appendChild(button);
      }
    };
  };

});


Basic3D.loadScript("KeyBindingsMenu", function(InputHandling, CameraControls, Menu) {
  var script = function() {
    var bindings = InputHandling.getBindings();

    var menu = new Menu();
    menu.show();

    CameraControls.disable();

    menu.addButton({
      display: "Click Me",
      onclick: function() {
        console.log("Do something fancy");
      }
    });

    menu.addCloseButton(function() {
      CameraControls.enable();
    });

  };
  return script;
});