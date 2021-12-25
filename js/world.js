


let InputHandler;
function _World({tileCount, worldSize}) {
	this.size = worldSize;
	this.tileCount = tileCount;

	this.scene = new THREE.Scene();
	this.scene.fog = new THREE.Fog( 0xffffff, 0, 150 );
	this.renderer = new THREE.WebGLRenderer({antialias: true});

	this.buildMesh;

	this.generator = new _WorldGenerator();

	this.meshes = [];

	this.setup = async function() {
		this.renderer.setClearColor('#e5e5e5');
		this.renderer.setSize(window.innerWidth, window.innerHeight);

		document.body.appendChild(this.renderer.domElement);
		window.addEventListener('resize', function() {
			World.renderer.setSize(window.innerWidth, window.innerHeight);
			Camera.resize();
		});


		this.worldShape = this.generator.createWorldShape({tileCount: this.tileCount, worldSize: this.size});
		this.generator.createWorld({
			worldSize: this.size,
			tileCount: this.tileCount,
			worldShape: this.worldShape
		});


		const blockSize = this.size / this.tileCount;
		let cursorGeometry = new THREE.BoxGeometry(blockSize, blockSize, blockSize);

		let material = new THREE.MeshLambertMaterial({color: 0xff0000});
		let BuildMesh = new THREE.Mesh(cursorGeometry, material);

		BuildMesh.position.x = 0 * blockSize;
		BuildMesh.position.z = 0 * blockSize;
		BuildMesh.position.y = blockSize * 20;
		this.buildMesh = BuildMesh;

		this.scene.add(BuildMesh);


		InputHandler = new _InputHandler(World.renderer.domElement);
		if (InputHandler.usesDeviceMotionControls) InputHandler.controls.connect();
		if (InputHandler.usesDeviceMotionControls) InputHandler.controls.connect();
		this.update();
		this.render();
	}

	

	this.update = function() {
		InputHandler.update();

		// setTimeout(function () {World.update()}, 100);
	}

	let prevFrameTime = new Date();
	this.render = function() {
		this.update();
		
		let dt = (new Date() - prevFrameTime) / 1000;
		Camera.update(dt);

		this.renderer.render(this.scene, Camera.camera);

		requestAnimationFrame(function () {World.render()});
		prevFrameTime = new Date();
	}	
}



