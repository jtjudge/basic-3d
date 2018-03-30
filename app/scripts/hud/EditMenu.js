
Basic3D.loadModule("EditMenu", function (Input, Display) {

  var components = [], queue = [];

  var menu;

  var loaded = false;

  registerComponent(function () {
    var label = document.createElement("div");
    label.innerHTML = "Edit Menu";
    label.className = "edit-menu-label";
    return {
      name: "MenuTitle",
      element: label,
      update: function () {}
    }
  });

  function addComp(comp) {
    components.push(comp);
    if (comp.parent === undefined) {
      menu.addItem(comp.element);
    } else {
      var parent = components.find(function(c) {
        return c.name === comp.parent;
      });
      parent.element.appendChild(comp.element);
    }
  }

  function registerComponent (func) {
    if (!loaded) {
      queue.push(func);
    } else {
      addComp(func());
    }
  }

  window.onload = function() {
    menu = new Display.Menu();
    menu.align({ x: "left", y: "top" });
    menu.setCSS({ borderRadius: "0 0 10px 0" });
    while(queue.length > 0) {
      addComp(queue.shift()());
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