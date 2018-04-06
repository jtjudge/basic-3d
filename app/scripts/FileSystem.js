
Basic3D.loadModule("FileSystem", function (Geometry) {

  var fs = require("fs");

  return {
    save: function (name) {
      console.log("Saving " + name);
      fs.writeFile(name, "Hello", function () { });
    },
    load: function (name) {
      console.log("Loading " + name);
      fs.readFile(name, "utf-8", function (err, data) {
        console.log(data);
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