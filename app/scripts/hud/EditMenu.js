
Basic3D.loadModule("EditMenu", function (Display) {

  var menu;

  function button(parent, info) {
    var button = document.createElement("div");
    button.className = "btn edit-menu-btn";
    button.innerHTML = info.label;
    button.onclick = info.onclick;
    parent.appendChild(button);
  }

  function label(parent, info) {
    var label = document.createElement("div");
    label.className = "edit-menu-label";
    label.innerHTML = info;
    parent.appendChild(label);
  }

  window.onload = function() {
    menu = new Display.Menu();

    var row1 = document.createElement("div");
    var row2 = document.createElement("div");
    var row3 = document.createElement("div");

    label(row1, "Edit Menu");
    button(row1, {
      label: "<<<",
      onclick: function () {
        menu.hide();
      }
    });

    button(row2, {
      label: "Create Vertex",
      onclick: function () {
        console.log("Create vertex");
      }
    });
    button(row3, {
      label: "Delete Vertex",
      onclick: function () {
        console.log("Delete vertex");
      }
    });

    menu.addItem(row1);
    menu.addItem(row2);
    menu.addItem(row3);

    menu.align({ x: "left", y: "center" });
    menu.show();
  };

  return {

  };

});