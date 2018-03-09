
Basic3D.loadModule("Menu", function (Scene) {

  // Constructor
  return function () {

    var menu = document.createElement("div");
    menu.className = "menu";

    var lines = [];

    // Interface
    return {
      show: function (location) {
        if(location === undefined) location = { top: 100, left: 300 };
        Scene.addLayer(menu, location);
      },
      hide: function () {
        Scene.removeLayer(menu);
      },
      setClass: function(c) {
        menu.className += " " + c;
      },
      addItem: function (el) {
        menu.appendChild(el);
      },
      removeItem: function (el) {
        menu.removeChild(el);
      },
      addButton: function (data) {
        var button = document.createElement("span");
        button.className = "menu-btn " + data.class;
        button.innerHTML = data.display;
        button.onclick = data.onclick;
        menu.appendChild(button);
      },
      addLineItem: function(action, key) {
        var line = document.createElement("div");
        line.className = "line-item";
        line.innerHTML =
        `<span id = "actionLabel" style = "width: 40%; word-wrap: break-word; display: inline-block;">${action}</span>
        <span>${key}</span>
        <input type="text"></input>`;
        menu.appendChild(line);
        lines.push(line);
        var input = line.children[2];
        input.onclick = input.focus;
        input.onkeydown = function(event) {
          event.preventDefault();
          input.value = event.code;
        };
      },
      lineItems: function() {
        return lines;
      }
    };
  };

});


Basic3D.loadScript("KeyBindingsMenu", function (Controls, Menu, Input) {
  var script = function () {
    var menu = new Menu();

    var bindings = Input.bindings();
    console.log(bindings);
    for(var key in bindings) {
      menu.addLineItem(bindings[key][0], key);
    }

    menu.addButton({
      class: "menu-confirm-btn",
      display: "Confirm",
      onclick: function () {
        menu.lineItems().forEach( function (line) {
          var action = line.children[0].innerHTML;
          var oldKey = line.children[1].innerHTML;
          var newKey = line.children[2].value;
          if(newKey.length > 0) {
            Input.removeKeyBinding(oldKey, action);
            Input.addKeyBinding(newKey, action);
          }
        });
        menu.hide();
        Controls.enable();
      }
    });

    menu.addButton({
      class: "menu-alt-btn",
      display: "Reset Defaults",
      onclick: function () {
        console.log("Do something fancy");
      }
    });

    menu.addButton({
      class: "menu-close-btn",
      display: "Cancel",
      onclick: function () {
        menu.hide();
        Controls.enable();
      }
    });

    menu.show();
    Controls.disable();

  };
  return script;
});



Basic3D.loadScript("ColorChange", function (Controls, Colors, Menu) {

  var script = function (data) {
    var menu = new Menu();
    var picker = document.getElementById("picker");
    menu.addItem(picker);
    menu.addButton({
      class: "menu-confirm-btn",
      display: "Change",
      onclick: function () {
        Colors.apply({
          name: data,
          color: "0x" + picker.value
        });
        document.getElementById("container").appendChild(picker);
        picker.style.display = "none";
        menu.hide();
        Controls.enable();
      }
    });
    menu.show();
    Controls.disable();
    picker.style.display = "inline-block";
  };
  return script;

});