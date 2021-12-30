


let InputHandler;
function _World({tileCount, worldSize}) {
	this.size = worldSize;
	this.tileCount = tileCount;

	this.scene = new THREE.Scene();
	this.scene.fog = new THREE.Fog( 0xffffff, 0, 100 );
	this.renderer = new THREE.WebGLRenderer({antialias: true});

	this.generator = new _WorldGenerator({tileCount: tileCount, worldSize: worldSize});

	this.meshes = [];
	this.components = [];
	this.clickables = [];

	this.setup = async function() {
		this.renderer.setClearColor('#ffffff');
		this.renderer.setSize(window.innerWidth, window.innerHeight);

		document.body.appendChild(this.renderer.domElement);
		window.addEventListener('resize', function() {
			World.renderer.setSize(window.innerWidth, window.innerHeight);
			Camera.resize();
		});


		// this.worldShape = this.generator.createWorldShape({tileCount: this.tileCount, worldSize: this.size});
		this.worldShape = MapData;
		this.generator.createWorld({
			worldSize: this.size,
			tileCount: this.tileCount,
			worldShape: this.worldShape
		});



		InputHandler = new _InputHandler(World.renderer.domElement);
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



