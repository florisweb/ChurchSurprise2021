


// optimized = 39112;
// unoptimized = 77350


const World = new _World({worldSize: 100, tileCount: 128});
const Camera = new _Camera();



let light = new THREE.PointLight(0xffffff, 1, 700);
light.position.set(20, 80, 0);
World.scene.add(light);

let ambientLight = new THREE.AmbientLight(0xffffff, .6);
World.scene.add(ambientLight);



World.setup();











