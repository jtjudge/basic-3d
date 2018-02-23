
Basic3D.loadModule("Geometry", function(Debug) {

  var vertices = [];
  var edges = [];
  var faces = [];

  var Colors = {
    VERTEX: 0xffffff,
    EDGE: 0xffffff,
    FACE: 0xffffff,
    VERTEX_SELECT: 0xff0000,
    EDGE_SELECT: 0xff0000,
    FACE_SELECT: 0xff0000,
    VERTEX_MARKER: 0x00ff00
  };

  var scene;

  var interface = {
    init: function(_scene, colors) {
      scene = _scene;
    },
    addVertex: function(position) {
      var geometry = new THREE.Geometry();
      geometry.vertices.push(new THREE.Vector3().copy(position));
      var material = new THREE.PointsMaterial({
        size: 2, sizeAttenuation: true, 
        color: Colors.VERTEX_SELECT
      });
      var vertex = {
        obj: new THREE.Points(geometry, material),
        selected: true
      };
      vertices.push(vertex);
      scene.add(vertex.obj);
    },
    addEdge: function(v1, v2) {
      //Creating the material and geometry for the edge
      var geometry = new THREE.Geometry();
      geometry.vertices.push(v1.obj.geometry.vertices[0]);
      geometry.vertices.push(v2.obj.geometry.vertices[0]);
      var material = new THREE.LineBasicMaterial({ 
        color: Colors.EDGE_SELECT
      });
      var edge = {
        obj: new THREE.Line(geometry, material),
        selected: true,
        v1: v1, v2: v2
      };
      edges.push(edge);
      scene.add(edge.obj);
    },
    addFace: function(v1, v2, v3) {
      var geometry = new THREE.Geometry();
      geometry.vertices.push(v1.obj.geometry.vertices[0]);
      geometry.vertices.push(v2.obj.geometry.vertices[0]);
      geometry.vertices.push(v3.obj.geometry.vertices[0]);
      geometry.faces.push(new THREE.Face3(0, 1, 2));
      geometry.faces.push(new THREE.Face3(2, 1, 0));
      geometry.computeFaceNormals();
      geometry.computeVertexNormals();
      var material = new THREE.MeshBasicMaterial({ 
        color: Colors.FACE_SELECT
      });
      var face = {
        obj: new THREE.Mesh(geometry, material),
        selected: true,
        v1: v1, v2: v2, v3: v3
      };
      faces.push(face);
      scene.add(face.obj);
    },
    getVertices: function() {
      return vertices;
    },
    getEdges: function() {
      return edges;
    },
    getFaces: function() {
      return faces;
    },
    getColors: function() {
      return Colors;
    }
  };

  return interface;

});