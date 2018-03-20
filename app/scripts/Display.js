
Basic3D.loadModule("Display", function () {

  var container = document.getElementById("container");

  function addInterface(el) {

    var wrap = document.createElement("div");
    wrap.className = "container-sub";

    wrap.appendChild(el);
    container.appendChild(wrap);

    return {
      show: function () {
        wrap.style.visibility = "visible";
      },
      hide: function () {
        wrap.style.visibility = "hidden";
      },
      toggle: function () {
        if(wrap.style.visibility === "hidden") {
          wrap.style.visibility = "visible";
        } else {
          wrap.style.visibility = "hidden";
        }
      },
      align: function (args) {
        if (args === undefined) return;
        wrap.style.justifyContent = 
          (args.x === "left") ? "flex-start" :
          (args.x === "right") ? "flex-end" :
          args.x;
        wrap.style.alignItems = 
          (args.y === "top") ? "flex-start" : 
          (args.y === "bottom") ? "flex-end" : 
          args.y;
      },
      setCSS: function (data) {
        for(var prop in data) {
          if (el.style[prop] !== undefined) {
            el.style[prop] = data[prop];
          }
        }
      },
      setHTML: function (content) {
        el.innerHTML = content;
      },
      addItem: function (child) {
        el.appendChild(child);
      }
    }
  }

  return {
    Scene: function (el) {
      if (el === undefined) {
        throw ("ERROR: Missing renderer to add to DOM");
      }
      return addInterface(el);
    },
    Menu: function () {
      var el = document.createElement("div");
      el.className = "menu";
      return addInterface(el);
    },
    Label: function () {
      var el = document.createElement("div");
      el.className = "label";
      return addInterface(el);
    },
    Layer: function () {
      var el = document.createElement("div");
      el.className = "layer";
      return addInterface(el);
    }
  };


});
