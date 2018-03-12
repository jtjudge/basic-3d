
var Basic3D = (function () {

  var modules = {};
  var queue = [];

  var listeners = {
    active: [],
    queued: []
  };

  function getDependencies(loader) {
    var deps = loader.toString()
    .match(/function\s.*?\(([^)]*)\)/)[1].split(',')
    .map(function (arg) { return arg.replace(/\/\*.*\*\//, '').trim(); })
    .filter(function (arg) { return arg; });
    return {
      loaded: deps.filter(function(dep) { return modules[dep] !== undefined; }),
      missing: deps.filter(function(dep) { return modules[dep] === undefined; })
    };
  }

  function tryLoad(name, loader) {
    var deps = getDependencies(loader);
    if(deps.missing.length > 0) return false;
    var params = deps.loaded.map(function(dep) {
      return modules[dep];
    });
    modules[name] = loader.apply(null, params);
    if(modules[name].update !== undefined) {
      listeners.queued.push(modules[name].update);
    }
    return true;
  }

  function tryQueue() {
    var leftovers = [];
    while(queue.length > 0) {
      var module = queue.pop();
      if(!tryLoad(module.name, module.loader)) {
        leftovers.push(module);
      } else {
        console.log("Loaded module '" + module.name + "'");
      }
    }
    queue = leftovers;
  }

  function loadModule(name, loader) {
    queue.push({ name: name, loader: loader });
    tryQueue();
  }

  function runScript(name, data) {
    if (modules[name] === undefined) {
      throw ("ERROR: Script '" + name + "' not loaded.");
    }
    console.log("Running script '" + name + "'.");
    modules[name](data);
    console.log("Finished script '" + name + "'.");
  }

  function update() {
    while(listeners.queued.length > 0) {
      listeners.active.push(listeners.queued.pop());
    };
    listeners.active.forEach(function(func) { func(); });
    requestAnimationFrame(update);
  }
  
  requestAnimationFrame(update);

  return {
    loadModule: loadModule,
    loadScript: loadModule,
    runScript: runScript
  };

})();

// Set up communications
require("electron").ipcRenderer.on("run", function (event, arg) {
  Basic3D.runScript(arg.name, arg.data);
});