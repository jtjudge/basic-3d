
Basic3D.loadModule("EditMenu", function (Input, Display) {

  var components = [], queue = [];

  var menu, altmenu;

  var loaded = false;

  registerComponent(function () {
    var contain = document.createElement("div");
    contain.className = "edit-menu-container";
    var label = document.createElement("div");
    label.innerHTML = "Edit Menu";
    label.className = "edit-menu-label";
    var button = document.createElement("div");
    button.innerHTML = "-";
    button.className = "edit-menu-btn";
    button.onclick = swapMenus;

    contain.appendChild(label);
    contain.appendChild(button);

    var contain2 = document.createElement("div");
    contain2.className = "edit-menu-container";
    var label2 = document.createElement("div");
    label2.innerHTML = "Edit Menu";
    label2.className = "edit-menu-label";
    var button2 = document.createElement("div");
    button2.innerHTML = "+";
    button2.className = "edit-menu-btn";
    button2.onclick = swapMenus;

    contain2.appendChild(label2);
    contain2.appendChild(button2);
    altmenu.addItem(contain2);

    function swapMenus() {
      menu.toggle();
      altmenu.toggle();
    }

    return {
      name: "MenuTitle",
      element: contain,
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
    altmenu = new Display.Menu();
    altmenu.align({ x: "left", y: "top" });
    altmenu.setCSS({ borderRadius: "0 0 10px 0" });
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