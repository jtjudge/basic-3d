
Basic3D.loadModule("AxisHelper", function (Debug){
    var initialized = false;

    let xAxis;
    let yAxis;
    let zAxis;

    function assertInit(val) {
        if(initialized && !val) {
            Debug.log("[AxisHelper] ERROR: Module already initialized");
            return false;
        } else if(!initialized && val) {
            Debug.log("[AxisHelper] ERROR: Module not initialized");
            return false;
        }
        return true;
    }

    var interface = {
        init: function (scene) {
            if(!assertInit(false)) return;
            const xMaterial = new THREE.LineBasicMaterial({
                color: 0xff0000
            });
        
            const yMaterial = new THREE.LineBasicMaterial({
                color: 0x00ff00
            });
        
            const zMaterial = new THREE.LineBasicMaterial({
                color: 0x000ff
            });

            var xGeometry = new THREE.Geometry();
            xGeometry.vertices.push(
                new THREE.Vector3( -1000, 10, 0 ),
                new THREE.Vector3( 1000, 10, 0 )
            );

            var yGeometry = new THREE.Geometry();
            yGeometry.vertices.push(
                new THREE.Vector3( 0, -1000, 0 ),
                new THREE.Vector3( 0, 1000, 0 )
            );

            var zGeometry = new THREE.Geometry();
            zGeometry.vertices.push(
                new THREE.Vector3( 0, 10, -1000 ),
                new THREE.Vector3( 0, 10, 1000 )
            );

            xAxis = new THREE.Line( xGeometry, xMaterial );

            yAxis = new THREE.Line( yGeometry, yMaterial );

            zAxis = new THREE.Line( zGeometry, zMaterial );
        },
        setNone: function(scene){
            scene.remove(xAxis, yAxis, zAxis);
        },
        setX: function (scene){
            this.setNone(scene);
            scene.add(xAxis);
        }, 
        setY: function(scene){
            this.setNone(scene);
            scene.add(yAxis);
        },
        setZ: function(scene){
            this.setNone(scene);
            scene.add(zAxis);
        }
    };
    return interface;
});