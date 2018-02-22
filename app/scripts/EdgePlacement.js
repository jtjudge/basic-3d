
var EdgePlacement =  (function() {

  var initialized = false;

  //Setting the selct color of the edge to be yellow
  var SELECT_COLOR =  0xffd700;

  //Setting the deselect color of the edge to be white like the vertices
  var DESELECT_COLOR = 0xffffff;

  var edges = [];
  var selected;

  //Checking to see if the module is initialized before using it
  function assertInit(val){
    if(initialized && !val)
    {
      Debug.log("[EdgePlacement] ERROR: Module already initialized");
      return false;
    }
    else if(!initialized && val)
    {
      Debug.log("[EdgePlacement] ERROR: Module not initialized");
      return false;
    }

    return true;
  }

  //Return the edge between two vertices, else return null
  function getEdge(v1, v2) {
    var edge = null;
    edges.forEach(function(e) {
      if((e.v1 === v1.id && e.v2 === v2.id) || (e.v1 === v2.id && e.v2 === v1.id)){
        edge = e;
      }
    });
    return edge;
  }

  var interface = {
    init: function(scene)
    {
      //Testing initialization
      if(!assertInit(false)) return;
      initialized = true;

      //Reference to selected vertices list
      selected = VertexSelection.getSelected();

      InputHandling.register(
        {
        //Creating the edge
        onkeydown: function(input)
        {
          if(input.mode === "EDIT" && input.actions["PLACE_EDGE"])
          {

            //Testing to see if selected has a length of 2
            if(selected.length === 2)
            {

              //Grabbing the vertices from selected
              var v1 = selected[0];
              var v2 = selected[1];

              if(getEdge(v1,v2)) return;

              //Creating the material and geometry for the edge
              var material = new THREE.LineBasicMaterial({color: SELECT_COLOR});
              var geometry = new THREE.Geometry();

              //Setting the coordinates to connect the vertices
              geometry.vertices.push(v1.position);
              geometry.vertices.push(v2.position);

              //Creating the edge variable
              var edge = {
                obj: new THREE.Line(geometry, material),
                v1: v1.id,
                v2: v2.id
              };

              //Adding the new edge to edges and the scene
              edges.push(edge);
              scene.add(edge.obj);
            }
          }
        },

        //Deselecting the edge
        onmousedown: function(input)
        {
          if(input.mode !== "EDIT") return;

          edges.forEach(function(edge) {

            var index1 = selected.findIndex(function(v) {
              return v.id === edge.v1;
            });

            var index2 = selected.findIndex(function(v) {
              return v.id === edge.v2;
            });

            if(index1 > -1 && index2 > -1) {
              edge.obj.material.color.setHex(SELECT_COLOR);
            }
            else {
              edge.obj.material.color.setHex(DESELECT_COLOR);
            }
          });
        },

        //More Deselecting
        onmode: function(input)
        {
            edges.forEach(function(edge){
              edge.obj.material.color.setHex(DESELECT_COLOR);
            });
        } 
      });


      KeyBindings.addKeyBinding("KeyE", "PLACE_EDGE");
    }
  };

  return interface;

})();
