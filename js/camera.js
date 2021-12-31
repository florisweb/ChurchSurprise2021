
		
function _Camera() {
	const blockSize = World.size / World.tileCount;
	this.camera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	);
	this.camera.position.x = -3 * blockSize;
	this.camera.position.y = 100 * blockSize;
	this.camera.position.z = 20 * blockSize;
	// this.camera.lookAt(0, 0, 0);

	this.position = new Vector(0, 50, 0);
	this.velocity = new Vector(0, 0, 0);

	this.rotation = new Vector(0, 0, 0);
	this.angularVelocity = new Vector(0, 0, 0);

	this.zoom = 60;

	this.update = function(_dt) {
		this.position.add(this.velocity.copy().scale(_dt));
		this.rotation.add(this.angularVelocity.copy().scale(_dt));

		this.rotation.value = [
			this.camera.rotation.x || this.camera.rotation._x,
			this.camera.rotation.y || this.camera.rotation._y,
			this.camera.rotation.z || this.camera.rotation._z,
		];
	}
	this.update(0);



	this.getBlockPos = function() {
		return this.convertWorldCoordsToBlockCoords(Camera.camera.position);
	}
	
	this.convertBlockCoordsToWorldCoords = function({x, y, z}) {
		return {
			x: (x - World.worldShape.length / 2) * blockSize,
			y: y * blockSize,
			z: (z - World.worldShape[0].length / 2) * blockSize,
		}
	}

	this.convertWorldCoordsToBlockCoords = function({x, y, z}) {
		return {
			x: Math.round(x / blockSize) + World.worldShape.length / 2,
			z: Math.round(z / blockSize) + World.worldShape[0].length / 2,
			y: Math.round(y / blockSize)
		}
	}

	this.resize = function() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
	}
}