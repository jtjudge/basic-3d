Basic3D.loadModule("BoxSelect", function (Input, GUI, Scene, Colors, Geometry, Selection){

  var x = 0;
  var y = 0;
  var w = .1;
  var h = .1;

  var material = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: .15
  });

  var geometry = new THREE.Geometry();
  geometry.vertices.push(new THREE.Vector3(x,y,0));
  geometry.vertices.push(new THREE.Vector3(x+w,y,0));
  geometry.vertices.push(new THREE.Vector3(x,y+h,0));
  geometry.vertices.push(new THREE.Vector3(x+w,y+h,0));
  geometry.faces.push(new THREE.Face3(0, 1, 3));
  geometry.faces.push(new THREE.Face3(0, 2, 3));

  var rect = new THREE.Mesh(geometry, material);


  function remakerect(){
    geometry.vertices = [];
    geometry.vertices.push(new THREE.Vector3(x,y,0));
    geometry.vertices.push(new THREE.Vector3(x+w,y,0));
    geometry.vertices.push(new THREE.Vector3(x,y+h,0));
    geometry.vertices.push(new THREE.Vector3(x+w,y+h,0));
    rect.geometry.verticesNeedUpdate = true;
    geometry.faces = [];
    geometry.faces.push(new THREE.Face3(0, 1, 3));
    geometry.faces.push(new THREE.Face3(0, 2, 3));
    geometry.elementsNeedUpdate = true;
  }

  function active(){
    return (Input.mode("START_BOX") ||
      Input.mode("FORM_BOX"));
  }

  Input.register({
    onmousedown: function(input) {
      if(Input.mode("START_BOX")){
        x = (Input.coords().x1 / (window.innerWidth) * 1.2) - .595;
        y = (Input.coords().y1 / (window.innerHeight) * -.83) + .39;
        w = .001;
        h = .001;
        remakerect();
        GUI.add(rect);
        Input.setMode("FORM_BOX");
      }
    },
    onmouseup: function(input){
      if(active()){
        Input.setMode("START_BOX");

        var min = GUI.toScreenPosition(rect.geometry.vertices[0]);
        var max = GUI.toScreenPosition(rect.geometry.vertices[3]);

        Geometry.getVertices().forEach(function(v){
          var vPos = Scene.toScreenPosition(v.obj);
          console.log(vPos.x + " " + min.x + "\n" + vPos.x + " " + max.x + "\n" + vPos.y + " " + min.y + "\n " + vPos.y + " " + max.y);
          if(vPos.x > min.x && vPos.x < max.x && vPos.y > min.y && vPos.y < max.y){

            v.selected = !Input.action("INVERSE_TOGGLE");
            v.obj.material.color.setHex(Input.action("INVERSE_TOGGLE") ? Colors.VERTEX : Colors.VERTEX_SELECT);
            Selection.updateConnected(v);
          }
        });

        GUI.remove(rect);
      }
    },
    onmousemove: function(input) {
      if(Input.mode("FORM_BOX")){
        var newX = (Input.coords().x1 / (window.innerWidth) * 1.2) - .595;
        w = newX - x;
        var newY = (Input.coords().y1 / (window.innerHeight) * -.83) + .39;
        h = newY - y;
        remakerect();

        rect.geometry.verticesNeedUpdate = true;
      }
    },
    onkeydown: function (input) {
      if(Input.action("TOGGLE_BOX_SELECT")){
        if(Input.mode("EDIT")){
          Input.setMode("START_BOX");
        } else if(active()){
          Input.setMode("EDIT");
        }
      }
    }
  });

  Input.addKeyBinding("KeyB", "TOGGLE_BOX_SELECT");
  Input.addKeyBinding("LMB", "FORMING_BOX");
  Input.addKeyBinding("ControlLeft", "INVERSE_TOGGLE");

  return {};
  });
