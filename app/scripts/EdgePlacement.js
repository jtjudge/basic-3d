
var EdgePlacement =  (function() {

  var initialized = false;

  //Setting the selct color of the edge to be yellow
  var SELECT_COLOR =  0xffd700;

  //Setting the deselect color of the edge to be white like the vertices
  var DESELECT_COLOR = 0xffffff;

  //I'm assuming we'll need to add more variables up here for keeping track of edges
  var edge{
    var selected: false,
    var placed: false,
    var obj: NULL
  }

};

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

  var interface = {
    //Not sure on all the arguments we need
    init: function(edges, camera, scene, renderer)
    {
      //Testing initialization
      if(!assertInit(false)) return;
      initialized = true;
      InputHandling.register(
        {
        //Creating the edge
        onkeydown: function(input)
        {
          if(input.actions["PLACE_EDGE"])
          {
            //Not sure if I can call VertexSelection.selected like this
            //Also pretty sure that edge.placed needs to be changed
            if(edge.placed === false && VertexSelection.selected.length === 2)
            {
              //Creating the material and geometry for the edge
              var material = new THREE.LineBasicMaterial({SELECT_COLOR});
              var geometry = new THREE.Geometry();

              geometry.vertices.push(VertexSelection.selected[0]);
              geometry.vertices.push(VertexSelection.selected[1]);

              edge.obj = new THREE.Line(geometry, material);

              scene.add(edge);

              edge.placed = true;
              edge.selected = true;
            }
          }
        };

        //Deselecting the edge
        onmousedown: function(input)
        {
          if(input.actions["PLACE_EDGE"] && edge.selected === true)
          {
            edge.obj.material.color.setHex(DESELECT_COLOR);
            edge.selected = false;

            edges.push(edge.obj);
          }
        };
      });

      KeyBindings.addKeyBinding("KeyE", "PLACE_EDGE");
    }
  }
)
