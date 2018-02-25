
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

  var interface = {
    init: function (_scene, colors) {
      scene = _scene;
    },
    addVertex: function (position) {
      var geometry = new THREE.Geometry();
      geometry.vertices.push(new THREE.Vector3().copy(position));
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
      vertices.push(vertex);
      scene.add(vertex.obj);
    },
    addEdge: function (v1, v2) {
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
      v1.edges.push(edge);
      v2.edges.push(edge);
      edges.push(edge);
      scene.add(edge.obj);
    },
    addFace: function (v1, v2, v3) {
      var geometry = new THREE.Geometry();
      geometry.vertices.push(v1.obj.geometry.vertices[0]);
      geometry.vertices.push(v2.obj.geometry.vertices[0]);
      geometry.vertices.push(v3.obj.geometry.vertices[0]);
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
      v1.faces.push(face);
      v2.faces.push(face);
      v3.faces.push(face);
      faces.push(face);
      scene.add(face.obj);
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
    getColors: function () {
      return Colors;
    },
    getSelected: function () {
      return vertices.filter(function(v) {
        return v.selected;
      });
    },
    getCenter: function () {

      var selected = vertices.filter(function(v) {
        return v.selected;
      });

      if (selected.length === 0) {
        return new THREE.Vector3(0, 0, 0);
      }
  
      var minX = Infinity, maxX = -Infinity,
        minY = Infinity, maxY = -Infinity,
        minZ = Infinity, maxZ = -Infinity;
  
      selected.forEach(function (v) {
        if (!minX || v.obj.geometry.vertices[0].x < minX) {
          minX = v.obj.geometry.vertices[0].x;
        }
        if (!maxX || v.obj.geometry.vertices[0].x > maxX) {
          maxX = v.obj.geometry.vertices[0].x;
        }
        if (!minY || v.obj.geometry.vertices[0].y < minY) {
          minY = v.obj.geometry.vertices[0].y;
        }
        if (!maxY || v.obj.geometry.vertices[0].y > maxY) {
          maxY = v.obj.geometry.vertices[0].y;
        }
        if (!minZ || v.obj.geometry.vertices[0].z < minZ) {
          minZ = v.obj.geometry.vertices[0].z;
        }
        if (!maxZ || v.obj.geometry.vertices[0].z > maxZ) {
          maxZ = v.obj.geometry.vertices[0].z;
        }
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