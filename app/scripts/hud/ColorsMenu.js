
Basic3D.loadScript("ColorsMenu", function (Display, Controls, Colors, Geometry) {

  var script = function (data) {

    var menu, container, controls, wheel, button;

    menu = new Display.Menu();
    container = document.createElement("div");
    container.className = "picker";
    controls = document.createElement("div");
    controls.className = "picker-controls";
    wheel = document.createElement("canvas");
    wheel.className = "picker-wheel";
    wheel.height = 200;
    wheel.width = 200;

    button = document.createElement("div");
    button.className = "btn btn-confirm";
    button.innerHTML = "Confirm";
    button.onclick = function () {
      Colors.apply({
        name: "VERTEX",
        color: new THREE.Color(button.style.backgroundColor).getHex()
      });
      Geometry.refresh();
      menu.hide();
      Controls.enable();
    };

    controls.appendChild(button);
    container.appendChild(controls);
    container.appendChild(wheel);

    menu.addItem(container);

    var img, ctx;

    img = new Image();
    img.src = "assets/color_wheel.png";
    ctx = wheel.getContext("2d");

    img.onload = function () {
      ctx.drawImage(img, 0, 0, 200, 200);
      img.style.display = "none";
    };

    wheel.onclick = function (event) {
      var pix = ctx.getImageData(event.layerX, event.layerY, 1, 1).data;
      var rgba = `rgba(${pix[0]}, ${pix[1]}, ${pix[2]}, ${pix[3] / 255})`;
      button.style.backgroundColor = rgba;
    };

    menu.align({x: "center", y: "center"});
    menu.show();
    Controls.disable();

  };

  return script;

});