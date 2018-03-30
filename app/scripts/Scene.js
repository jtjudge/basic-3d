
Basic3D.loadModule("Scene", function (Input, Display) {

  var renderer, width, height, camera, scene, axis, grid;

  function setup() {
    width = window.innerWidth;
    height = window.innerHeight;
    // Create workspace scene
    renderer = new THREE.WebGLRenderer();
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    scene = new THREE.Scene();
    scene.add(camera);
    renderer.setSize(width, height);

    // Set up workspace camera
    camera.position.set(150, 100, 150);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    // Create grid
    grid = new THREE.GridHelper(100, 10);
    scene.add(grid);

    // Add lighting
    scene.add(new THREE.AmbientLight(0x212223));

    // Add to DOM
    var sceneDisplay = new Display.Scene(renderer.domElement);
    sceneDisplay.show();
  }

  function setAxis(x, y, z, pos) {
    scene.remove(axis);
    var geometry, material;
    geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(-1000 * x, -1000 * y, -1000 * z));
    geometry.vertices.push(new THREE.Vector3(1000 * x, 1000 * y, 1000 * z));
    material = new THREE.LineBasicMaterial({ color: new THREE.Color(x, y, z) });
    axis = new THREE.Line(geometry, material);
    axis.position.copy(pos);
    scene.add(axis);
  }

  setup();

  Input.register({
    onmode: function () {
      if (Input.mode("EDIT")) {
        scene.remove(axis);
      }
    },
    onresize: function () {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }
  });

  return {
    changeColor: function(obj){
      scene.background = new THREE.Color( obj );
    },
    changeGridColor: function(obj){
      scene.remove(grid);
      grid = new THREE.GridHelper(100, 10, obj, obj);
      scene.add(grid);
    },
    update: function () {
      renderer.render(scene, camera);
    },
    camera: function () {
      return camera;
    },
    add: function (obj) {
      scene.add(obj);
    },
    remove: function (obj) {
      scene.remove(obj);
    },
    intersectObjects: function (objects) {
      var mouse = new THREE.Vector3(
        (Input.coords().x2 / width) * 2 - 1,
        -(Input.coords().y2 / height) * 2 + 1,
        0.5
      );
      var caster = new THREE.Raycaster();
      caster.setFromCamera(mouse, camera);
      return caster.intersectObjects(objects);
    },
    showX: function (pos) {
      setAxis(1, 0, 0, pos);
    },
    showY: function (pos) {
      setAxis(0, 1, 0, pos);
    },
    showZ: function (pos) {
      setAxis(0, 0, 1, pos);
    },
    getMovementOnXZ: function () {
      var plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 1);
      var mouse1 = new THREE.Vector2(
        (Input.coords().x1 / width) * 2 - 1,
        -(Input.coords().y1 / height) * 2 + 1
      );
      var mouse2 = new THREE.Vector2(
        (Input.coords().x2 / width) * 2 - 1,
        -(Input.coords().y2 / height) * 2 + 1
      );
      var caster = new THREE.Raycaster();
      caster.setFromCamera(mouse1, camera);
      var p1 = caster.ray.intersectPlane(plane);
      caster.setFromCamera(mouse2, camera);
      var p2 = caster.ray.intersectPlane(plane);
      return {
        current: p2,
        previous: p1,
        diff: new THREE.Vector3().copy(p2).sub(p1)
      };
    },
    getMovementOnY: function () {
      return 0.2 * (Input.coords().y1 - Input.coords().y2);
    },
    getScreenPosition: function (obj) {
      var vector = new THREE.Vector3();

      var halfWidth = .5 * renderer.context.canvas.width;
      var halfHeight = .5 * renderer.context.canvas.height;

      obj.matrixWorldNeedsUpdate = true;
      vector.setFromMatrixPosition(obj.matrixWorld);
      vector.project(camera);

      vector.x = (vector.x * halfWidth) + halfWidth;
      vector.y = - (vector.y * halfHeight) + halfHeight;

      return {
        x: vector.x,
        y: vector.y
      }
    }
  };

});

Basic3D.loadScript("BackgroundColor", function (Display, Controls, Colors, Geometry, Scene) { 
  return () =>{
    var wheel, img, ctx;
    
        var dropdown, expanded, current;
    
        var menu, closeButton, resetButton, buttonBar;
    
        function dropdownItem(color) {
          var style = `"width: 20px; height: 20px; background-color: ${color.value.getStyle()}"`;
          var content = 
          `<div class="picker-dropdown-item" data-name="${color.name}">
            <div>${color.name}</div>
            <div style=${style}></div>
          </div>`;
          return content;
        }
    
        function refresh() {
          dropdown.innerHTML = dropdownItem(current);
          if (expanded) {
            Colors.getColors().forEach(function (c) {
              if (c.name === current.name) return;
              dropdown.innerHTML += dropdownItem(c);
            });
          }
        }
    
        function pickColor(event) {
          var pix = ctx.getImageData(event.layerX, event.layerY, 1, 1).data;
          var rgba = `rgba(${pix[0]}, ${pix[1]}, ${pix[2]}, ${pix[3] / 255})`;
          current.value = new THREE.Color(rgba);
          Scene.changeColor(current.value);
        }
    
        function pickName(event) {
          var name = event.path.find(function(e) {
            return e.dataset.name !== undefined;
          }).dataset.name;
          var value = Colors[name];
          current = { name: name, value: value };
          expanded = !expanded;
          refresh();
        }
    
        function hideMenu() {
          menu.hide();
          Controls.enable(["shift", "orbit", "snap"]);
        }
    
        function resetMenu() {
          Colors.reset();
          current.value = Colors[current.name];
          refresh();
          Geometry.refresh();
        }
    
        // Color wheel
    
        wheel = document.createElement("canvas");
        wheel.className = "picker-wheel";
    
        wheel.height = 200;
        wheel.width = 200;
    
        img = new Image();
        img.src = "assets/color_wheel.png";
        ctx = wheel.getContext("2d");
    
        img.onload = function () {
          ctx.drawImage(img, 0, 0, 200, 200);
          img.style.display = "none";
        };
    
        wheel.onclick = pickColor;
    
        // Dropdown menu
    
        dropdown = document.createElement("div");
        dropdown.className = "picker-dropdown";
    
        expanded = false;
        current = Colors.getColors()[0];
    
        dropdown.onclick = pickName;
    
        refresh();
    
        // Reset button
    
        resetButton = document.createElement("div");
        resetButton.className = "btn btn-alt";
        resetButton.innerHTML = "Reset";
    
        resetButton.onclick = resetMenu;
    
        // Close button
    
        closeButton = document.createElement("div");
        closeButton.className = "btn btn-confirm";
        closeButton.innerHTML = "Done";
    
        closeButton.onclick = hideMenu;
    
        // Button bar
    
        buttonBar = document.createElement("div");
        buttonBar.appendChild(resetButton);
        buttonBar.appendChild(closeButton);
    
        // Menu
    
        menu = new Display.Menu();
    
        menu.addItem(dropdown);
        menu.addItem(wheel);
        menu.addItem(buttonBar);
    
        menu.align({x: "center", y: "center"});
        menu.show();
        Controls.disable(["shift", "orbit", "snap"]);
  };
});

Basic3D.loadScript("GridColor", function (Display, Controls, Colors, Geometry, Scene) { 
  return () =>{
    var wheel, img, ctx;
    
        var dropdown, expanded, current;
    
        var menu, closeButton, resetButton, buttonBar;
    
        function dropdownItem(color) {
          var style = `"width: 20px; height: 20px; background-color: ${color.value.getStyle()}"`;
          var content = 
          `<div class="picker-dropdown-item" data-name="${color.name}">
            <div>${color.name}</div>
            <div style=${style}></div>
          </div>`;
          return content;
        }
    
        function refresh() {
          dropdown.innerHTML = dropdownItem(current);
          if (expanded) {
            Colors.getColors().forEach(function (c) {
              if (c.name === current.name) return;
              dropdown.innerHTML += dropdownItem(c);
            });
          }
        }
    
        function pickColor(event) {
          var pix = ctx.getImageData(event.layerX, event.layerY, 1, 1).data;
          var rgba = `rgba(${pix[0]}, ${pix[1]}, ${pix[2]}, ${pix[3] / 255})`;
          current.value = new THREE.Color(rgba);
          Scene.changeGridColor(current.value);
        }
    
        function pickName(event) {
          var name = event.path.find(function(e) {
            return e.dataset.name !== undefined;
          }).dataset.name;
          var value = Colors[name];
          current = { name: name, value: value };
          expanded = !expanded;
          refresh();
        }
    
        function hideMenu() {
          menu.hide();
          Controls.enable(["shift", "orbit", "snap"]);
        }
    
        function resetMenu() {
          Colors.reset();
          current.value = Colors[current.name];
          refresh();
          Geometry.refresh();
        }
    
        // Color wheel
    
        wheel = document.createElement("canvas");
        wheel.className = "picker-wheel";
    
        wheel.height = 200;
        wheel.width = 200;
    
        img = new Image();
        img.src = "assets/color_wheel.png";
        ctx = wheel.getContext("2d");
    
        img.onload = function () {
          ctx.drawImage(img, 0, 0, 200, 200);
          img.style.display = "none";
        };
    
        wheel.onclick = pickColor;
    
        // Dropdown menu
    
        dropdown = document.createElement("div");
        dropdown.className = "picker-dropdown";
    
        expanded = false;
        current = Colors.getColors()[0];
    
        dropdown.onclick = pickName;
    
        refresh();
    
        // Reset button
    
        resetButton = document.createElement("div");
        resetButton.className = "btn btn-alt";
        resetButton.innerHTML = "Reset";
    
        resetButton.onclick = resetMenu;
    
        // Close button
    
        closeButton = document.createElement("div");
        closeButton.className = "btn btn-confirm";
        closeButton.innerHTML = "Done";
    
        closeButton.onclick = hideMenu;
    
        // Button bar
    
        buttonBar = document.createElement("div");
        buttonBar.appendChild(resetButton);
        buttonBar.appendChild(closeButton);
    
        // Menu
    
        menu = new Display.Menu();
    
        menu.addItem(dropdown);
        menu.addItem(wheel);
        menu.addItem(buttonBar);
    
        menu.align({x: "center", y: "center"});
        menu.show();
        Controls.disable(["shift", "orbit", "snap"]);
  };
});