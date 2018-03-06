
Basic3D.loadModule("Geometry", function (Scene, Colors) {

  var vertices = [];
  var edges = [];
  var faces = [];

  return {

    Vertex: function (position) {
      var geometry = new THREE.Geometry();
      geometry.vertices.push(new THREE.Vector3(0, 0, 0));
      var material = new THREE.PointsMaterial({
        size: 2, sizeAttenuation: true,
        color: Colors.VERTEX
      });
      var vertex = {
        obj: new THREE.Points(geometry, material),
        selected: false,
        edges: [],
        faces: []
      };
      vertex.obj.position.copy(position);
      return vertex;
    },

    Edge: function (v1, v2) {
      var geometry = new THREE.Geometry();
      geometry.vertices.push(v1.obj.position);
      geometry.vertices.push(v2.obj.position);
      var material = new THREE.LineBasicMaterial({
        color: Colors.EDGE
      });
      var edge = {
        obj: new THREE.Line(geometry, material),
        selected: false,
        v1: v1, v2: v2
      };
      return edge;
    },

    Face: function (v1, v2, v3, edge1, edge2, edge3) {
      var geometry = new THREE.Geometry();
      geometry.vertices.push(v1.obj.position);
      geometry.vertices.push(v2.obj.position);
      geometry.vertices.push(v3.obj.position);
      geometry.faces.push(new THREE.Face3(0, 1, 2));
      geometry.faces.push(new THREE.Face3(2, 1, 0));
      geometry.computeFaceNormals();
      geometry.computeVertexNormals();
      var material = new THREE.MeshLambertMaterial({
        color: Colors.FACE
      });
      var face = {
        obj: new THREE.Mesh(geometry, material),
        selected: false,
        v1: v1, v2: v2, v3: v3,
        edge1: edge1, edge2: edge2, edge3: edge3
      };
      return face;
    },

    addVertex: function (vertex) {
      var exists = vertices.some(function (v) {
        return v.obj.id === vertex.obj.id;
      });
      if (exists) return;
      vertex.selected = true;
      vertex.obj.material.color.setHex(Colors.VERTEX_SELECT);
      vertices.push(vertex);
      Scene.add(vertex.obj);
      console.log("Adding vertex " + 
        vertex.obj.id + " at (" + 
        vertex.obj.position.x + ", " +
        vertex.obj.position.y + ", " + 
        vertex.obj.position.z + ")");
    },

    addEdge: function (edge) {
      var exists = edges.some(function (e) {
        return e.v1 === edge.v1 && e.v2 === edge.v2;
      });
      if (exists) return;
      edge.v1.edges.push(edge);
      edge.v2.edges.push(edge);
      edge.selected = true;
      edge.obj.material.color.setHex(Colors.EDGE_SELECT);
      edges.push(edge);
      Scene.add(edge.obj);
      console.log("Adding edge " + edge.obj.id);
    },

    addFace: function (face) {
      var exists = faces.some(function (f) {
        return f.obj.id === face.obj.id;
      });
      if (exists) return;
      face.v1.faces.push(face);
      face.v2.faces.push(face);
      face.v3.faces.push(face);
      face.selected = true;
      face.obj.material.color.setHex(Colors.FACE_SELECT);
      faces.push(face);
      Scene.add(face.obj);
      console.log("Adding face " + face.obj.id);
    },

    removeVertex: function (vertex) {
      var index = vertices.findIndex(function (v) {
        return v.obj.id === vertex.obj.id;
      });
      if (index > -1) {
        // Remove vertex from model and scene
        var target = vertices.splice(index, 1)[0];
        Scene.remove(target.obj);
        target.selected = false;
        target.obj.material.color.setHex(Colors.VERTEX);
        console.log("Removing vertex " + vertex.obj.id);
      }
    },

    removeEdge: function (edge) {
      var index = edges.findIndex(function (e) {
        return e.obj.id === edge.obj.id;
      });
      if (index > -1) {
        // Remove edge from model and scene
        var target = edges.splice(index, 1)[0];
        Scene.remove(target.obj);
        target.selected = false;
        target.obj.material.color.setHex(Colors.EDGE);
        console.log("Removing edge " + edge.obj.id);
      }
    },

    removeFace: function (face) {
      var index = faces.findIndex(function (f) {
        return f.obj.id === face.obj.id;
      });
      if (index > -1) {
        // Remove face from model and scene
        var target = faces.splice(index, 1)[0];
        Scene.remove(target.obj);
        target.selected = false;
        target.obj.material.color.setHex(Colors.FACE);
        console.log("Removing face " + face.obj.id);
      }
    },

    getVertices: function () {
      return vertices;
    },

    getEdges: function () {
      return edges;
    },

    getFaces: function () {
      return faces;
    },

    getSelected: function () {
      return vertices.filter(function (v) {
        return v.selected;
      });
    },

    getCenter: function () {
      var minX = Infinity, maxX = -Infinity,
        minY = Infinity, maxY = -Infinity,
        minZ = Infinity, maxZ = -Infinity;
      var selected = vertices.filter(function (v) {
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

});
