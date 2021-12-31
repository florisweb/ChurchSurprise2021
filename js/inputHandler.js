


function _InputHandler(_canvas) {
	const This = this;
	const HTML = {
		canvas: _canvas,
		clickToStartPanel: clickToStart,
	};
	// const speed = .5;
	const speed = 1;
	const shiftSpeedModifier = .5;

	let raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );



	let mouseDown = false;
	document.body.addEventListener("mousedown", function(_e) {
		mouseDown = true;
		_e.preventDefault();
		return false;
	});
	document.body.addEventListener("mouseup", function(_e) {
		mouseDown = false;
		_e.preventDefault();
		return false;
	});


	// const raycaster = new THREE.Raycaster();

	// mousePos.x = -2;
	// mousePos.y = -2;

	// this.mouseDown = false;
	// this.draging = false;

	// const blocker = document.getElementById( 'blocker' );
	// const instructions = document.getElementById( 'instructions' );

	this.usesDeviceMotionControls = false;
	window.addEventListener('click', () => {
		raycaster.setFromCamera(new THREE.Vector2(0, 0), Camera.camera);
		const intersects = raycaster.intersectObjects(World.clickables);
		
		if (intersects.length < 1) return;
		intersects.sort((a, b) => a.distance > b.distance);
		intersects[0].object.component.onclick();
	});


	if (window.DeviceMotionEvent && window.DeviceMotionEvent.requestPermission)
	{
		this.usesDeviceMotionControls = true;
		this.controls = new THREE.DeviceOrientationControls(Camera.camera);
		HTML.clickToStartPanel.onclick = () => {
			if (!window.DeviceMotionEvent || !window.DeviceMotionEvent.requestPermission) return initiateNonDeviceMotionControls();
			window.DeviceMotionEvent.requestPermission()
			  .then(response => {
			  	if (response != 'granted') return initiateNonDeviceMotionControls();
			    HTML.clickToStartPanel.classList.add('hide');
			  }
			);
		}
	} else initiateNonDeviceMotionControls();


	function initiateNonDeviceMotionControls() {
		This.usesDeviceMotionControls = false;
		This.controls = new PointerLockControls(Camera.camera, document.body);

		document.body.addEventListener( 'click', function () {
			This.controls.lock();
			setTimeout(CallManager.startCall, 1000 * 5);
		});

		This.controls.addEventListener( 'lock', function () {
			HTML.clickToStartPanel.classList.add('hide');
		});

		This.controls.addEventListener( 'unlock', function () {
			HTML.clickToStartPanel.classList.remove('hide');
		});


		World.scene.add(This.controls.getObject());

	}





	

	let moveForward = false;
	let moveLeft = false;
	let moveBackward = false;
	let moveRight = false;
	let shifting = false;

	const velocity = new THREE.Vector3();
	const direction = new THREE.Vector3();

	const onKeyDown = function ( event ) {
		switch ( event.code ) {

			case 'ArrowUp':
			case 'KeyW':
				moveForward = true;
				break;

			case 'ArrowLeft':
			case 'KeyA':
				moveLeft = true;
				break;

			case 'ArrowDown':
			case 'KeyS':
				moveBackward = true;
				break;

			case 'ArrowRight':
			case 'KeyD':
				moveRight = true;
				break;

			case 'Shift':
			case 'ShiftLeft':
			case 'ShiftRight':
				shifting = true;
				break;
		}

	};

	const onKeyUp = function ( event ) {
		switch ( event.code ) {
			case 'ArrowUp':
			case 'KeyW':
				moveForward = false;
				break;

			case 'ArrowLeft':
			case 'KeyA':
				moveLeft = false;
				break;

			case 'ArrowDown':
			case 'KeyS':
				moveBackward = false;
				break;

			case 'ArrowRight':
			case 'KeyD':
				moveRight = false;
				break;
			case 'Shift':
			case 'ShiftLeft':
			case 'ShiftRight':
				shifting = false;
				break;
		}

	};

	window.addEventListener('keydown', onKeyDown);
	window.addEventListener('keyup', onKeyUp);



	const blockSize = World.size / World.tileCount;
	let prevTime = performance.now();
	let prevSavePos = {x: Camera.camera.position.x, z: Camera.camera.position.z};
	const illegalBlockTypes = [-1, 2, 6, 7];
	this.update = function() {

		// Gravity
		let curPos = Camera.getBlockPos();
		let curBlock = World.worldShape[curPos.x][curPos.z];
		if (!curBlock) return;
		let dy = Camera.camera.position.y - (curBlock.y + blockSize * 2 - shifting * blockSize);

		if (illegalBlockTypes.includes(curBlock.type))
		{
			Camera.camera.position.x = prevSavePos.x;
			Camera.camera.position.z = prevSavePos.z;
		} else {
			prevSavePos = {x: Camera.camera.position.x, z: Camera.camera.position.z};
			velocity.y = -dy * 20;
		}

		if (this.usesDeviceMotionControls)
		{
			this.controls.update();
		} else {

			const time = performance.now();
			if ( this.controls.isLocked === true ) {
				const delta = ( time - prevTime ) / 1000;

				velocity.x -= velocity.x * 10.0 * delta;
				velocity.z -= velocity.z * 10.0 * delta;


				direction.z = Number(moveForward) - Number(moveBackward);
				direction.x = Number(moveRight) - Number(moveLeft);
				direction.normalize(); // this ensures consistent movements in all directions

				if ( moveForward || moveBackward ) velocity.z -= direction.z * 100.0 * delta * speed;
				if ( moveLeft || moveRight ) velocity.x -= direction.x * 100.0 * delta * speed;

				this.controls.moveRight( - velocity.x * delta * (1 - shifting * shiftSpeedModifier));
				this.controls.moveForward( - velocity.z * delta * (1 - shifting * shiftSpeedModifier));


				this.controls.getObject().position.y += ( velocity.y * delta ); // new behavior
			}

			prevTime = time;
		}




		// Forwards movement
		if (this.usesDeviceMotionControls && mouseDown)
		{
			Camera.velocity.value[0] = velocity * Math.sin(Camera.rotation.value[1] + Math.PI);
			Camera.velocity.value[2] = velocity * Math.cos(Camera.rotation.value[1] + Math.PI);
		}
	}
}
