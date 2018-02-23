
var Geometry = (function() {

  var VERTEX_SELECT_COLOR = 0xff0000;
  var EDGE_SELECT_COLOR =  0xff0000;
  var FACE_SELECT_COLOR = 0xff0000;

  var VERTEX_DESELECT_COLOR = 0xffffff;
  var EDGE_DESELECT_COLOR = 0xffffff;
  var FACE_DESELECT_COLOR = 0xffffff;

  var vertices = [];
  var edges = [];
  var faces = [];

  var scene;

  var interface = {
    init: function(_scene) {
      scene = _scene;
    },
    getSelected: function() {
      var selected = [];
      vertices.forEach(function(v) {
        if(v.selected) selected.push(v);
      });
      return selected;
    },
    toggleSelect: function(target) {
      var vertex = vertices.find(function(v) {
        return v.obj.id === target.id;
      });
      if(!vertex) return;
      vertex.selected = !vertex.selected;
      if (vertex.selected) {
        vertex.obj.material.color.setHex(VERTEX_SELECT_COLOR);
      } else {
        vertex.obj.material.color.setHex(VERTEX_DESELECT_COLOR);
      }
      edges.forEach(function(edge) {
        if(edge.v1.selected && edge.v2.selected) {
          edge.selected = true;
          edge.obj.material.color.setHex(EDGE_SELECT_COLOR);
        } else {
          edge.selected = false;
          edge.obj.material.color.setHex(EDGE_DESELECT_COLOR);
        }
      });
      faces.forEach(function(face) {
        if(face.v1.selected && face.v2.selected && face.v3.selected) {
          face.selected = true;
          face.obj.material.color.setHex(FACE_SELECT_COLOR);
        } else {
          face.selected = false;
          face.obj.material.color.setHex(FACE_DESELECT_COLOR);
        }
      });
    },
    deselectAll: function() {
      vertices.forEach(function(vertex) {
        vertex.selected = false;
        vertex.obj.material.color.setHex(VERTEX_DESELECT_COLOR);
      });
      edges.forEach(function(edge){
        edge.selected = false;
        edge.obj.material.color.setHex(EDGE_DESELECT_COLOR);
      });
      faces.forEach(function(face){
        face.selected = false;
        face.obj.material.color.setHex(FACE_DESELECT_COLOR);
      });
    },
    addVertex: function(position) {
      var geometry = new THREE.Geometry();
      geometry.vertices.push(new THREE.Vector3().copy(position));
      var material = new THREE.PointsMaterial({
        size: 2, sizeAttenuation: true, color: VERTEX_SELECT_COLOR
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
        color: EDGE_SELECT_COLOR
      });
      var edge = {
        obj: new THREE.Line(geometry, material),
        selected: true,
        v1: v1,
        v2: v2
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
        color: FACE_SELECT_COLOR 
      });
      var face = {
        obj: new THREE.Mesh(geometry, material),
        selected: true,
        v1: v1,
        v2: v2,
        v3: v3
      };
      faces.push(face);
      scene.add(face.obj);
    },
    getVertices: function() {
      return vertices.map(function(vert) {
        return vert.obj;
      });
    }
  };

  return interface;


})();