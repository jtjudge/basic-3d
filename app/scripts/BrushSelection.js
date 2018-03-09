Basic3D.loadModule("BrushSelect", function (Input, GUI, Scene, Colors, Geometry, Selection){
  console.log("brushg");
  var x = 0;
  var y = 0;
  var w = .1;
  var h = .1;
  var mod = 1;
  var modded = false;


  var material = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: .15
  });

  var vert = 32;
  var boundStart = 1;

  var geometry = new THREE.CircleGeometry(0.025, vert);
  var circle = new THREE.Mesh(geometry, material);

  function remakeCircle(){
    geometry.vertices.forEach(function(v) {
      v.x = v.x + w;
      v.y = v.y + h;
    });
    geometry.elementsNeedUpdate = true;
    circle.geometry.verticesNeedUpdate = true;
    GUI.add(circle);
  }

  function calculateCircle(){
    var newX = mod * ((Input.coords().x1 / (window.innerWidth) * 1.2) - .595);
    w = newX - x;
    x = newX;
    var newY = mod * ((Input.coords().y1 / (window.innerHeight) * -.83) + .39);
    h = newY - y;
    y = newY;
  }

  function active(){
    return (Input.mode("CIRCLE_DOWN") ||
      Input.mode("START_CIRCLE"));
  }

  Input.register({
    onmousedown: function(input) {
      if(active()){
        Input.setMode("CIRCLE_DOWN");
      }
    },
    onmouseup: function(input) {
      if(active()){
        Input.setMode("START_CIRCLE");
      }
    },
    onmousemove: function(input) {
      if(active()){
        calculateCircle();
        remakeCircle();
      }
      if(Input.mode("CIRCLE_DOWN")){
        var minY = GUI.toScreenPosition(circle.geometry.vertices[boundStart + 1 *(vert / 4)]);
        var minX = GUI.toScreenPosition(circle.geometry.vertices[boundStart + 2 *(vert / 4)]);
        var maxY = GUI.toScreenPosition(circle.geometry.vertices[boundStart + 3 *(vert / 4)]);
        var maxX = GUI.toScreenPosition(circle.geometry.vertices[boundStart + 0 *(vert / 4)]);
        Geometry.getVertices().forEach(function(v){
          var vPos = Scene.toScreenPosition(v.obj);
          if(vPos.x > minX.x && vPos.x < maxX.x && vPos.y > minY.y && vPos.y < maxY.y){
            v.selected = !Input.action("INVERSE_TOGGLE");
            v.obj.material.color.setHex(Input.action("INVERSE_TOGGLE") ? Colors.VERTEX : Colors.VERTEX_SELECT);
            Selection.updateConnected(v);
          }
        });
      }
    },
    onkeydown: function (input) {
      if(Input.action("TOGGLE_CIRCLE_SELECT")){
        if(Input.mode("EDIT")){
          Input.setMode("START_CIRCLE");
          GUI.add(circle);
        } else if(active()){
          Input.setMode("EDIT");
          GUI.remove(circle);
        }
      }
      if(Input.action("DOUBLE") && !modded) {
        circle.scale.set(2, 2, 1);
        mod = 0.5;
        calculateCircle();
        remakeCircle();
        modded = true;
      }
    },
    onkeyup: function(input) {
      if(!Input.action("DOUBLE") && modded) {
        circle.scale.set(1, 1, 1);
        mod = 1;
        calculateCircle();
        remakeCircle();
        modded = false;
      }
    }
  });

  Input.addKeyBinding("KeyC", "TOGGLE_CIRCLE_SELECT");
  Input.addKeyBinding("LMB", "FORMING_CIRCLE");
  Input.addKeyBinding("ShiftLeft", "DOUBLE");

  return {};
  });
