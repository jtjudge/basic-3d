
Basic3D.loadModule("GeometryTranslation", function (Debug, Geometry, InputHandling, AxisHelper){
    var initialized = false;

    var selectedverts = [];
    var connectededges = [];
    var connectedfaces = [];

    var returnmode = "";

    let scene;

    function assertInit(val) {
        if(initialized && !val) {
          Debug.log("[GeometryTranslation] ERROR: Module already initialized");
          return false;
        } else if(!initialized && val) {
          Debug.log("[GeometryTranslation] ERROR: Module not initialized");
          return false;
        }
        return true;
    }
    
    var interface = {
        init: function(camera, renderer, scene_){
            if(!assertInit(false)) return;
            initialized = true;
            scene = scene_;
            InputHandling.register({
                onmousedown: function(input){
                    returnmode = input.mode;
                    if(input.mode === "TRANSLATION_MODE" && input.actions["TRANSLATE_SELECTION"]){
                        InputHandling.mode("TRANSLATION_MODIFY_VERTS");
                        
                    }
                },
                onmouseup: function(input) {
                    if(!(input.mode === "EDIT")){
                       
                        InputHandling.mode(returnmode);
                    }
                },
                onmousemove: function(input) {

                },
                onkeydown: function(input) {
                    if(input.actions["TOGGLE_TRANSLATION_MODE"]){
                        AxisHelper.setNone(scene);
                        if(input.mode === "TRANSLATION_MODE" || input.mode === "TRANSLATION_MODIFY_VERTS" || input.mode === "TRANSLATE_X_AXIS_MODE" || input.mode === "TRANSLATE_Y_AXIS_MODE" || input.mode === "TRANSLATE_Z_AXIS_MODE"){
                            selectedverts = [];
                            connectededges = [];
                            connectedfaces = [];
                            InputHandling.mode("EDIT");
                            Debug.log("EDIT");
                        } else {
                            Geometry.getVertices().forEach(function (vertex) {
                                if(vertex.selected)
                                    selectedverts.push(vertex);
                            });
    
                            Geometry.getEdges().forEach(function (edge) {
                                if(edge.v1.selected || edge.v2.selected)
                                    connectededges.push(edge);
                            });
    
                            Geometry.getFaces().forEach(function (face) {
                                if(face.v1.selected || face.v2.selected || face.v3.selected)
                                    connectedfaces.push(face);
                            });
                            InputHandling.mode("TRANSLATION_MODE");
                            Debug.log("TRANSLATION_MODE");
                        }
                    }
                    if(input.actions["TOGGLE_TRANSLATE_X_AXIS_MODE"] && (input.mode === "TRANSLATION_MODE" || input.mode === "TRANSLATE_Y_AXIS_MODE" || input.mode === "TRANSLATE_Z_AXIS_MODE")){
                        InputHandling.mode("TRANSLATE_X_AXIS_MODE");
                        Debug.log("TRANSLATE_X_AXIS_MODE");
                        AxisHelper.setX(scene);
                    } else if(input.actions["TOGGLE_TRANSLATE_Y_AXIS_MODE"] && (input.mode === "TRANSLATION_MODE" || input.mode === "TRANSLATE_X_AXIS_MODE" || input.mode === "TRANSLATE_Z_AXIS_MODE")){
                        InputHandling.mode("TRANSLATE_Y_AXIS_MODE");
                        Debug.log("TRANSLATE_Y_AXIS_MODE");
                        AxisHelper.setY(scene);
                    } else if(input.actions["TOGGLE_TRANSLATE_Z_AXIS_MODE"] && (input.mode === "TRANSLATION_MODE" || input.mode === "TRANSLATE_X_AXIS_MODE" || input.mode === "TRANSLATE_Y_AXIS_MODE")){
                        InputHandling.mode("TRANSLATE_Z_AXIS_MODE");
                        Debug.log("TRANSLATE_Z_AXIS_MODE");
                        AxisHelper.setZ(scene);
                    }
                }
            });

            InputHandling.addKeyBinding("KeyT", "TOGGLE_TRANSLATION_MODE");
            InputHandling.addKeyBinding("KeyX", "TOGGLE_TRANSLATE_X_AXIS_MODE");
            InputHandling.addKeyBinding("KeyY", "TOGGLE_TRANSLATE_Y_AXIS_MODE");
            InputHandling.addKeyBinding("KeyZ", "TOGGLE_TRANSLATE_Z_AXIS_MODE");
            InputHandling.addKeyBinding("LMB", "TRANSLATE_SELECTION");
        }
    };

    return interface;
});
