
Basic3D.loadModule("EditMenu", function (Display) {

  var components = [], queue = [];

  var menu;

  var loaded = false;

  registerComponent(function () {
    var label = document.createElement("div");
    label.innerHTML = "Edit Menu";
    label.className = "edit-menu-label";
    return {
      name: "Menu Title",
      element: label,
      update: function () {}
    }
  });

  function registerComponent (func) {
    if (!loaded) queue.push(func);
    if (loaded) {
      var comp = func();
      components.push(comp);
      menu.addItem(comp.element);
      console.log(components);
    }
  }

  window.onload = function() {
    menu = new Display.Menu();
    menu.align({x: "left", y: "center"});
    while(queue.length > 0) {
      var comp = (queue.shift())();
      components.push(comp);
      menu.addItem(comp.element);
      console.log(components);
    }
    loaded = true;
    menu.show();
  };

  return {
    update: function () {
      components.forEach(function(comp) {
        comp.update();
      });
    },
    registerComponent: registerComponent
  };

});