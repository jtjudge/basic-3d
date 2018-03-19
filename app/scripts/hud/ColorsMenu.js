
Basic3D.loadScript("ColorsMenu", function (Display, Controls, Colors) {

  var script = function (data) {

    var menu = new Display.Menu();

    var picker = document.createElement("canvas");
    picker.height = 200;
    picker.width = 200;

    picker.onclick = function() {
      console.log("Do something fancy");
    };

    menu.addItem(picker);

    menu.align({x: "center", y: "center"});

    menu.show();

  };

  return script;

});