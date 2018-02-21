
var EdgePlacement =  (function() {

  var initialized = false;

  //Setting the selct color of the edge to be yellow
  var SELECT_COLOR =  0xffd700;

  //Setting the deselect color of the edge to be white like the vertices
  var DESELECT_COLOR = 0xffffff;

  //I'm assuming we'll need to add more variables up here for keeping track of edges

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
    init: function(vertices, camera, scene, renderer){
      //Testing initialization
      if(!assertInit(false)) return;
      initialized = true;
    }
  }
)
