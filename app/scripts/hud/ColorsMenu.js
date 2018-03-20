
Basic3D.loadScript("ColorsMenu", function (Display, Controls, Colors, Geometry) {

  var script = function (data) {

    var wheel, img, ctx;

    var dropdown, expanded, current;

    var menu, closeButton, resetButton, buttonBar;

    function dropdownItem(color) {
      var style = `"width: 20px; height: 20px; background-color: ${color.value.getStyle()}"`;
      var content = 
      `<div class="picker-dropdown-item" data-name="${color.name}">
        <div>${color.name}</div>
        <div style=${style}></div>
      </div>`;
      return content;
    }

    function refresh() {
      dropdown.innerHTML = dropdownItem(current);
      if (expanded) {
        Colors.getColors().forEach(function (c) {
          if (c.name === current.name) return;
          dropdown.innerHTML += dropdownItem(c);
        });
      }
    }

    function pickColor(event) {
      var pix = ctx.getImageData(event.layerX, event.layerY, 1, 1).data;
      var rgba = `rgba(${pix[0]}, ${pix[1]}, ${pix[2]}, ${pix[3] / 255})`;
      current.value = new THREE.Color(rgba);
      Colors.apply(current);
      refresh();
      Geometry.refresh();
    }

    function pickName(event) {
      var name = event.path.find(function(e) {
        return e.dataset.name !== undefined;
      }).dataset.name;
      var value = Colors[name];
      current = { name: name, value: value };
      expanded = !expanded;
      refresh();
    }

    function hideMenu() {
      menu.hide();
      Controls.enable(["shift", "orbit", "snap"]);
    }

    function resetMenu() {
      Colors.reset();
      current.value = Colors[current.name];
      refresh();
      Geometry.refresh();
    }

    // Color wheel

    wheel = document.createElement("canvas");
    wheel.className = "picker-wheel";

    wheel.height = 200;
    wheel.width = 200;

    img = new Image();
    img.src = "assets/color_wheel.png";
    ctx = wheel.getContext("2d");

    img.onload = function () {
      ctx.drawImage(img, 0, 0, 200, 200);
      img.style.display = "none";
    };

    wheel.onclick = pickColor;

    // Dropdown menu

    dropdown = document.createElement("div");
    dropdown.className = "picker-dropdown";

    expanded = false;
    current = Colors.getColors()[0];

    dropdown.onclick = pickName;

    refresh();

    // Reset button

    resetButton = document.createElement("div");
    resetButton.className = "btn btn-alt";
    resetButton.innerHTML = "Reset";

    resetButton.onclick = resetMenu;

    // Close button

    closeButton = document.createElement("div");
    closeButton.className = "btn btn-confirm";
    closeButton.innerHTML = "Done";

    closeButton.onclick = hideMenu;

    // Button bar

    buttonBar = document.createElement("div");
    buttonBar.appendChild(resetButton);
    buttonBar.appendChild(closeButton);

    // Menu

    menu = new Display.Menu();

    menu.addItem(dropdown);
    menu.addItem(wheel);
    menu.addItem(buttonBar);

    menu.align({x: "center", y: "center"});
    menu.show();
    Controls.disable(["shift", "orbit", "snap"]);

  };

  return script;

});