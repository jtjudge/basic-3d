
Basic3D.loadScript("BindingsMenu", function (Display, Input, Controls, Bindings) {

  var lines, menu;

  function addLine(data) {
    var line = data, label, input;
    line.element = document.createElement("div");
    line.element.className = "line";

    label = document.createElement("div");
    label.className = "line-label";
    label.innerHTML = line.display;

    input = document.createElement("input");
    input.className = "line-input";
    input.value = line.key;
    input.onclick = input.focus;
    input.onkeydown = function(event) {
      event.preventDefault();
      input.value = event.code;
      line.change = input.value;
    };
    line.element.appendChild(label);
    line.element.appendChild(input);

    lines.push(line);
    menu.addItem(line.element);
  }

  function addButton(data) {
    var button = document.createElement("div");
    button.className = "btn " + data.class;
    button.innerHTML = data.display;
    button.onclick = data.onclick;
    menu.addItem(button);
  }

  var script = function () {

    menu = new Display.Menu();
    menu.align({x: "center", y: "center"});

    lines = [];

    Bindings.getBindings().forEach(function (b) {
      addLine({
        code: b.action.code, 
        display: b.action.display, 
        key: b.key
      });
    });

    addButton({
      class: "btn-confirm",
      display: "Confirm",
      onclick: function () {
        lines.forEach(function (line) {
          if (line.change !== undefined) {
            Input.removeKeyBinding(line.key, line.code);
            Input.addKeyBinding(line.change, line.code, line.display);
          }
        });
        menu.hide();
        Controls.enable(["shift", "orbit", "snap"]);
      }
    });

    addButton({
      class: "btn-alt",
      display: "Reset Defaults",
      onclick: function () {
        console.log("Do something fancy");
      }
    });

    addButton({
      class: "btn-close",
      display: "Cancel",
      onclick: function () {
        menu.hide();
        Controls.enable(["shift", "orbit", "snap"]);
      }
    });

    menu.show();
    Controls.disable(["shift", "orbit", "snap"]);

  };

  return script;

});