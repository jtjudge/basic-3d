
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
      vertices.push(vertex);
      scene.add(vertex.obj);
    },
    addEdge: function (v1, v2) {
      //Creating the material and geometry for the edge
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
      v1.edges.push(edge);
      v2.edges.push(edge);
      edges.push(edge);
      scene.add(edge.obj);
    },
    addFace: function (v1, v2, v3) {
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
        if (!minX || v.obj.position.x < minX) {
          minX = v.obj.position.x;
        }
        if (!maxX || v.obj.position.x > maxX) {
          maxX = v.obj.position.x;
        }
        if (!minY || v.obj.position.y < minY) {
          minY = v.obj.position.y;
        }
        if (!maxY || v.obj.position.y > maxY) {
          maxY = v.obj.position.y;
        }
        if (!minZ || v.obj.position.z < minZ) {
          minZ = v.obj.position.z;
        }
        if (!maxZ || v.obj.position.z > maxZ) {
          maxZ = v.obj.position.z;
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