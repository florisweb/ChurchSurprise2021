

function _Camera() {
	this.camera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	);
	this.camera.position.z = 60;
	this.camera.position.x = 100;
	this.camera.position.y = 60;
	// this.camera.lookAt(0, 0, 0);

	this.position = new Vector(0, 50, 0);
	this.velocity = new Vector(0, 0, 0);

	this.rotation = new Vector(0, 0, 0);
	this.angularVelocity = new Vector(0, 0, 0);

	this.zoom = 60;

	this.update = function(_dt) {
		this.position.add(this.velocity.copy().scale(_dt));
		// this.rotation.add(this.angularVelocity.copy().scale(_dt));

		this.camera.position.x = this.position.value[0];
		this.camera.position.y = this.position.value[1];
		this.camera.position.z = this.position.value[2];
		
		// this.camera.rotation.x = this.rotation.value[0];
		// this.camera.rotation.y = this.rotation.value[1];
		// this.camera.rotation.z = this.rotation.value[2];
	}
	this.update(0);





	this.resize = function() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
	}
}