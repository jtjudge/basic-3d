
Basic3D.loadModule("GUI", function (Input, Scene) {

  var WIDTH = window.innerWidth;
  var HEIGHT = window.innerHeight;

  // Camera attributes
  var VIEW_ANGLE = 45;
  var ASPECT = WIDTH / HEIGHT;
  var NEAR = 0.1;
  var FAR = 10000;

  // Create HUD scene
  var hudRenderer = new THREE.WebGLRenderer({alpha: true});
  var hudCamera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
  var hudScene = new THREE.Scene();

  hudScene.add(hudCamera);
  hudRenderer.setSize(WIDTH, HEIGHT);

  Scene.addLayer(hudRenderer.domElement, { bottom: 0, left: 0 });

  // Set up HUD camera
  hudCamera.position.set(0, 0, 1);
  hudCamera.lookAt(new THREE.Vector3(0, 0, 0));


  Input.register({
    onresize: function (){
      WIDTH = window.innerWidth;
      HEIGHT = window.innerHeight;
      // hudCamera.aspect = WIDTH / HEIGHT;
      // hudCamera.updateProjectionMatrix();
      hudRenderer.setSize(WIDTH, HEIGHT);
    }
  });

  return {
    update: function () {
      hudRenderer.render(hudScene, hudCamera);
    },
    toggle: function() {
      if(hudRenderer.domElement.style.visibility === "hidden") {
        hudRenderer.domElement.style.visibility = "visible";
      } else {
        hudRenderer.domElement.style.visibility = "hidden";
      }
    }, 
    add: function(obj){
      hudScene.add(obj);
    },
    remove: function(obj){
      hudScene.remove(obj);
    },
    toScreenPosition: function(pos){
      var vector = new THREE.Vector3();

      var halfWidth = .5 * hudRenderer.context.canvas.width;
      var halfHeight = .5 * hudRenderer.context.canvas.height;

      vector.x = pos.x;
      vector.y = pos.y;
      vector.z = pos.z;

      vector.project(hudCamera);

      vector.x = Math.round((vector.x + 1) * halfWidth);
      vector.y = Math.round((-vector.y + 1) * halfHeight);

      return {
        x: vector.x,
        y: vector.y
      }
    }
  };

});