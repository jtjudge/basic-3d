
Basic3D.loadModule("CopyPaste", function (Input, Scene, Geometry, Selection, TipsDisplay, History){

  var vertices = [];
  var edges = [];
  var faces = [];

  function copy(){
    Geometry.getVertices().forEach(function (vertex) {
      if(vertex.selected){
        vertices.push(Geometry.Vertex(vertex.obj.position));
      }
    });
    Geometry.getEdges().forEach(function (edge) {
      if(edge.selected){
        var v1 = edge.v1;
        var v2 = edge.v2;
        vertices.forEach(function (vertex){
          if(v1.obj.position.equals(vertex.obj.position)) v1 = vertex;
          if(v2.obj.position.equals(vertex.obj.position)) v2 = vertex;
        });
        edges.push(Geometry.Edge(v1, v2));
      }
    });
    Geometry.getFaces().forEach(function (face) {
      if(face.selected){
        var v1 = face.v1;
        var v2 = face.v2;
        var v3 = face.v3
        vertices.forEach(function (vertex){
          if(v1.obj.position.equals(vertex.obj.position)) v1 = vertex;
          if(v2.obj.position.equals(vertex.obj.position)) v2 = vertex;
          if(v3.obj.position.equals(vertex.obj.position)) v3 = vertex;
        });
        faces.push(Geometry.Face(v1, v2, v3));
      }
    });
  }

  function paste(){
    var move = {
      undo: function () {
        
        vertices.forEach(function(vertex){
          Geometry.removeVertex(vertex);
        });

        edges.forEach(function(edge){
          Geometry.removeEdge(edge);
        });

        faces.forEach(function(face){
          Geometry.removeFace(face);
        });
      },
      redo: function () {
        Geometry.getVertices().forEach(function (vertex) {
          Selection.toggleSelection(vertex, false);
        });
        vertices.forEach(function(vertex){
          Geometry.addVertex(vertex);
          Selection.toggleSelection(vertex, true);
        });

        Geometry.getEdges().forEach(function (edge) {
          Selection.toggleSelection(edge, false);
        });
        edges.forEach(function(edge){
          Geometry.addEdge(edge);
          Selection.toggleSelection(edge, true);
        });

        Geometry.getFaces().forEach(function (face) {
          Selection.toggleSelection(face, false);
        });
        faces.forEach(function(face){
          Geometry.addFace(face);
          Selection.toggleSelection(face, true);
        });
      }
    };
    move.redo();
    History.addMove(move);
  }

  Input.register({
    onkeydown: function (){
      if(Input.action("READY_MOD") && Input.mode("EDIT")){
        if(Input.action("COPY")){
          copy();
        }
        if(Input.action("PASTE")){
          paste();
        }
      }
    }
  });

  Basic3D.loadScript("Copy", function () {
    return copy;
  });

  Basic3D.loadScript("Paste", function () {
    return paste;
  });

  Input.addKeyBinding("KeyC", "COPY");
  Input.addKeyBinding("KeyV", "PASTE");
  Input.addKeyBinding("ControlLeft", "READY_MOD");
  Input.addKeyBinding("ControlRight", "READY_MOD");
  
  TipsDisplay.registerTip({
    mode: "EDIT",
    builder: function (get) {
      return `${get("READY_MOD")} + ${get("COPY")} to copy`;
    }   
  });

  TipsDisplay.registerTip({
    mode: "EDIT",
    builder: function (get) {
      return `${get("READY_MOD")} + ${get("PASTE")} to paste`;
    }   
  });

  return {};
});
