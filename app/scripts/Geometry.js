
Basic3D.loadModule("Geometry", function (Debug) {

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

  function Vertex(position) {
    var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(0, 0, 0));
    var material = new THREE.PointsMaterial({
      size: 2, sizeAttenuation: true,
      color: Colors.VERTEX_SELECT
    });
    var vertex = {
      obj: new THREE.Points(geometry, material),
      edges: [],
      faces: [],
      selected: true
    };
    vertex.obj.position.copy(position);
    return vertex;
  }

  function Edge(v1, v2) {
    var geometry = new THREE.Geometry();
    geometry.vertices.push(v1.obj.position);
    geometry.vertices.push(v2.obj.position);
    var material = new THREE.LineBasicMaterial({
      color: Colors.EDGE_SELECT
    });
    var edge = {
      obj: new THREE.Line(geometry, material),
      selected: true,
      v1: v1, v2: v2
    };
    return edge;
  }

  function Face(v1, v2, v3) {
    var geometry = new THREE.Geometry();
    geometry.vertices.push(v1.obj.position);
    geometry.vertices.push(v2.obj.position);
    geometry.vertices.push(v3.obj.position);
    geometry.faces.push(new THREE.Face3(0, 1, 2));
    geometry.faces.push(new THREE.Face3(2, 1, 0));
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
    var material = new THREE.MeshLambertMaterial({
      color: Colors.FACE_SELECT
    });
    var face = {
      obj: new THREE.Mesh(geometry, material),
      selected: true,
      v1: v1, v2: v2, v3: v3
    };
    return face;
  }


  function addVertex(vertex) {
    var exists = vertices.some(function(v) {
      return v.obj.id === vertex.obj.id;
    });
    if(exists) return;
    vertices.push(vertex);
    scene.add(vertex.obj);
    console.log("Added vertex " + vertex.obj.id);
  }

  function addEdge(edge) {
    var exists = edges.some(function(e) {
      return e.obj.id === edge.obj.id;
    });
    if(exists) return;
    edge.v1.edges.push(edge);
    edge.v2.edges.push(edge);
    edges.push(edge);
    scene.add(edge.obj);
    console.log("Added edge " + edge.obj.id);
  }

  function addFace(face) {
    var exists = faces.some(function(f) {
      return f.obj.id === face.obj.id;
    });
    if(exists) return;
    face.v1.faces.push(face);
    face.v2.faces.push(face);
    face.v3.faces.push(face);
    faces.push(face);
    scene.add(face.obj);
    console.log("Added face " + face.obj.id);
  }

  function removeVertex(vertex) {
    var index = vertices.findIndex(function(v) {
      return v.obj.id === vertex.obj.id;
    });
    if(index > -1) {
      // Remove vertex from model and scene
      var target = vertices.splice(index, 1)[0];
      scene.remove(target.obj);
      // Remove associated edges and faces
      target.edges.forEach(removeEdge);
      target.faces.forEach(removeFace);
      console.log("Removed vertex " + vertex.obj.id);
    }
  }

  function removeEdge(edge) {
    var index = edges.findIndex(function(e) {
      return e.obj.id === edge.obj.id;
    });
    if(index > -1) {
      // Remove edge from model and scene
      var target = edges.splice(index, 1)[0];
      scene.remove(target.obj);
      // Remove edge from the vertex edge lists
      var getInd = function(e) { return e.obj.id === target.obj.id; };
      target.v1.edges.splice(target.v1.edges.findIndex(getInd), 1);
      target.v2.edges.splice(target.v2.edges.findIndex(getInd), 1);
      console.log("Removed edge " + edge.obj.id);
    }
  }

  function removeFace(face) {
    var index = faces.findIndex(function(f) {
      return f.obj.id === face.obj.id;
    });
    if(index > -1) {
      // Remove face from model and scene
      var target = faces.splice(index, 1)[0];
      scene.remove(target.obj);
      // Remove face from vertex face lists
      var getInd = function(f) { return f.obj.id === target.obj.id; };
      target.v1.faces.splice(target.v1.faces.findIndex(getInd), 1);
      target.v2.faces.splice(target.v2.faces.findIndex(getInd), 1);
      target.v3.faces.splice(target.v3.faces.findIndex(getInd), 1);
      console.log("Removed face " + face.obj.id);
    }
  }

  var interface = {
    init: function (_scene) {
      scene = _scene;
    },
    Vertex: Vertex,
    Edge: Edge,
    Face: Face,
    addVertex: addVertex,
    addEdge: addEdge,
    addFace: addFace,
    removeVertex: removeVertex,
    removeEdge: removeEdge,
    removeFace: removeFace,
    getVertices: function () {
      return vertices;
    },
    getEdges: function () {
      return edges;
    },
    getFaces: function () {
      return faces;
    },
    getColors: function () {
      return Colors;
    },
    getSelected: function () {
      return vertices.filter(function(v) {
        return v.selected;
      });
    },
    getCenter: function () {
      var minX = Infinity, maxX = -Infinity,
        minY = Infinity, maxY = -Infinity,
        minZ = Infinity, maxZ = -Infinity;
      var selected = vertices.filter(function(v) {
        return v.selected;
      });
      if (selected.length === 0) {
        return new THREE.Vector3(0, 0, 0);
      }
      selected.forEach(function (v) {
        if (v.obj.position.x < minX) minX = v.obj.position.x;
        if (v.obj.position.x > maxX) maxX = v.obj.position.x;
        if (v.obj.position.y < minY) minY = v.obj.position.y;
        if (v.obj.position.y > maxY) maxY = v.obj.position.y;
        if (v.obj.position.z < minZ) minZ = v.obj.position.z;
        if (v.obj.position.z > maxZ) maxZ = v.obj.position.z;
      });
      return new THREE.Vector3(
        (minX + maxX) / 2,
        (minY + maxY) / 2,
        (minZ + maxZ) / 2
      );
    }
  };

  return interface;

});