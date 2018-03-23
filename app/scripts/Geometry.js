
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

    Face: function (v1, v2, v3) {
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
        v1: v1, v2: v2, v3: v3
      };
      return face;
    },

    addVertex: function (vertex) {
      var exists = vertices.some(function (v) {
        return v.obj.id === vertex.obj.id;
      });
      if (exists) return;
      vertices.push(vertex);
      Scene.add(vertex.obj);
      console.log("Adding vertex " +
        vertex.obj.id + " at (" +
        vertex.obj.position.x.toFixed(1) + ", " +
        vertex.obj.position.y.toFixed(1) + ", " +
        vertex.obj.position.z.toFixed(1) + ")");
    },

    addEdge: function (edge) {
      var exists = edges.some(function (e) {
        return e.v1 === edge.v1 && e.v2 === edge.v2;
      });
      if (exists) return;
      edge.v1.edges.push(edge);
      edge.v2.edges.push(edge);
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

    getSelectedFaces: function() {
      return faces.filter(function(f) {
        return f.selected;
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
    },

    refresh: function () {
      vertices.forEach(function (vertex) {
        vertex.obj.material.color.set(
          (vertex.selected) ? Colors.VERTEX_SELECT : Colors.VERTEX);
      });
      edges.forEach(function (edge) {
        edge.obj.material.color.set(
          (edge.selected) ? Colors.EDGE_SELECT : Colors.EDGE);
      });
      faces.forEach(function (face) {
        face.obj.material.color.set(
          (face.selected) ? Colors.FACE_SELECT : Colors.FACE);
      });
    }

  };

});
