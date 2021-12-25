

function _Camera() {
	this.camera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	);
	this.camera.position.x = -3;
	this.camera.position.y = 100;
	this.camera.position.z = 20;
	// this.camera.lookAt(0, 0, 0);

	this.position = new Vector(0, 50, 0);
	this.velocity = new Vector(0, 0, 0);

	this.rotation = new Vector(0, 0, 0);
	this.angularVelocity = new Vector(0, 0, 0);

	this.zoom = 60;

	this.update = function(_dt) {
		this.position.add(this.velocity.copy().scale(_dt));
		this.rotation.add(this.angularVelocity.copy().scale(_dt));

		if (InputHandler && InputHandler.usesDeviceMotionControls)
		{
			this.camera.position.x = this.position.value[0];
			this.camera.position.y = this.position.value[1];
			this.camera.position.z = this.position.value[2];
		}

		this.rotation.value = [
			this.camera.rotation.x || this.camera.rotation._x,
			this.camera.rotation.y || this.camera.rotation._y,
			this.camera.rotation.z || this.camera.rotation._z,
		];
	}
	this.update(0);



	this.getBlockPos = function() {
		const blockSize = World.size / World.tileCount;
		return {
			x: Math.round(Camera.camera.position.x / blockSize) + World.worldShape.length / 2,
			y: Math.round(Camera.camera.position.z / blockSize) + World.worldShape[0].length / 2
		}
	}

	this.resize = function() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
	}
}