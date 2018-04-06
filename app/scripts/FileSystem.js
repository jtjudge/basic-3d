
Basic3D.loadModule("FileSystem", function (Geometry, History) {

  var fs = require("fs");

  return {
    save: function (name) {
      if (name.length === 0) return;
      console.log("Saving " + name);

      var content = "START_BASIC3D\n";

      content += "VERTICES\n";
      Geometry.getVertices().forEach(function (v) {
        content += v.obj.id + " " + 
          v.obj.position.x + " " + 
          v.obj.position.y + " " + 
          v.obj.position.z + "\n";
      });

      content += "EDGES\n";
      Geometry.getEdges().forEach(function (e) {
        content += e.obj.id + " " + 
          e.v1.obj.id + " " + 
          e.v2.obj.id + "\n";
      });

      content += "FACES\n";
      Geometry.getFaces().forEach(function (f) {
        content += f.obj.id + " " + 
          f.v1.obj.id + " " + 
          f.v2.obj.id + " " + 
          f.v3.obj.id + "\n";
      });
      content += "END_BASIC3D";

      fs.writeFile(name, content, function () { });
    },
    load: function (name) {
      if (name.length === 0) return;
      console.log("Loading " + name);
      fs.readFile(name, "utf-8", function (err, data) {
        if (err) return;
        if (data.indexOf("START_BASIC3D") !== 0) {
          alert("Could not read Basic 3D file " + name);
        }
        var vertStart = data.indexOf("VERTICES");
        var edgeStart = data.indexOf("EDGES");
        var faceStart = data.indexOf("FACES");
        var fileEnd = data.indexOf("END_BASIC3D");

        var verts, edges, faces;

        verts = data.slice(vertStart + 9, edgeStart - 1)
        .split("\n").filter(function (v) {
          return v.split(" ").length === 4;
        }).map(function (v) {
          var parts = v.split(" ");
          return {
            id: parts[0] * 1,
            x: parts[1] * 1,
            y: parts[2] * 1,
            z: parts[3] * 1
          };
        });
        edges = data.slice(edgeStart + 6, faceStart - 1)
        .split("\n").filter(function (e) {
          return e.split(" ").length === 3;
        }).map(function (e) {
          var parts = e.split(" ");
          console.log(parts);
          return {
            id: parts[0] * 1,
            v1: parts[1] * 1,
            v2: parts[2] * 1
          };
        });
        faces = data.slice(faceStart + 6, fileEnd - 1)
        .split("\n").filter(function (f) {
          return f.split(" ").length === 4;
        }).map(function (f) {
          var parts = f.split(" ");
          return {
            id: parts[0] * 1,
            v1: parts[1] * 1,
            v2: parts[2] * 1,
            v3: parts[3] * 1
          };
        });

        Geometry.clear();
        History.clear();

        verts.forEach(function (v) {
          v.vert = Geometry.Vertex(new THREE.Vector3(v.x, v.y, v.z));
          Geometry.addVertex(v.vert);
        });

        edges.forEach(function (e) {
          var v1 = verts.find(function (v) {
            return v.id === e.v1;
          }).vert;
          var v2 = verts.find(function (v) {
            return v.id === e.v2;
          }).vert; 
          Geometry.addEdge(Geometry.Edge(v1, v2));
        });

        faces.forEach(function (f) {
          var v1 = verts.find(function (v) {
            return v.id === f.v1;
          }).vert;
          var v2 = verts.find(function (v) {
            return v.id === f.v2;
          }).vert;
          var v3 = verts.find(function (v) {
            return v.id === f.v3;
          }).vert;
          Geometry.addFace(Geometry.Face(v1, v2, v3));
        });

      });
    }
  };

});

Basic3D.loadScript("SaveFile", function (FileSystem) {
  return function (data) {
    FileSystem.save(data.name);
  };
});

Basic3D.loadScript("LoadFile", function (FileSystem) {
  return function (data) {
    FileSystem.load(data.name);
  };
});