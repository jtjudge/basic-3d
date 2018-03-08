
Basic3D.loadModule("Menu", function (Scene) {

  // Constructor
  return function () {

    var menu = document.createElement("div");
    menu.style.color = "white";
    menu.style.backgroundColor = "gray";
    //menu.style.height = "100px";
    //menu.style.width = "200px";
    menu.style.padding = "5px";
    menu.innerHTML = "Menu";

    var lines = [];

    // Interface
    return {
      show: function () {
        Scene.addLayer(menu, { top: 100, left: 300 });
      },
      addButton: function (data) {
        var button = document.createElement("span");
        button.style.backgroundColor = "blue";
        button.innerHTML = data.display;
        button.style.margin = "0 20%";
        button.onclick = data.onclick;
        menu.appendChild(button);
      },
      addCloseButton: function (cb) {
        var button = document.createElement("span");
        button.style.backgroundColor = "red";
        button.innerHTML = "X";
        button.onclick = function () {
          // Note -- need to remove!
          menu.style.display = "none";
          cb();
        };
        menu.appendChild(button);
      },
      addLineItem: function(action, key){
        var line = document.createElement("div");

        line.className = "line-item";
        var keyLabel = document.createElement("span");
        keyLabel.innerHTML = key;

        keyLabel.className = "key-label";

        var actionLabel = document.createElement("span");
        actionLabel.innerHTML = action;

        actionLabel.className = "action-label";

        var inputBox = document.createElement("input");

        inputBox.onclick = function() {
          inputBox.focus();
        };

        inputBox.onkeydown = function(event) {
          event.preventDefault();
          inputBox.value = event.code;
        };

        inputBox.className = "input-box";

        lines.push(line);

        line.appendChild(actionLabel);
        line.appendChild(keyLabel);
        line.appendChild(inputBox);

        menu.appendChild(line);
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
    menu.show();

    Controls.disable();

    menu.addButton({
      display: "Click Me",
      onclick: function () {
        console.log("Do something fancy");
      }
    });

    menu.addCloseButton(function () {
      menu.lineItems().forEach( function (line) {
        //console.log(line.children[2].value);
        var newKey = line.children[2].value;
        if(newKey.length > 0)
        {
          Input.removeKeyBinding(line.children[1].innerHTML, line.children[0].innerHTML);
          Input.addKeyBinding(newKey, line.children[0].innerHTML);
        }
      });
      Controls.enable();
    });

    var inputs = Input.bindings();

    for(var i in inputs)
    {
      menu.addLineItem(inputs[i][0], i);
    }

  };
  return script;
});
