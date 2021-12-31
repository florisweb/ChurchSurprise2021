


function _InputHandler(_canvas) {
	const This = this;
	const HTML = {
		canvas: _canvas,
		clickToStartPanel: clickToStart,
	};
	const speed = .5;
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
		// instructions.addEventListener( 'click', function () {
		document.body.addEventListener( 'click', function () {
			This.controls.lock();
		});

		This.controls.addEventListener( 'lock', function () {
			HTML.clickToStartPanel.classList.add('hide');
		});

		This.controls.addEventListener( 'unlock', function () {
			HTML.clickToStartPanel.classList.remove('hide');
		});


		World.scene.add(This.controls.getObject());

	}


	



	// this.settings = new function() {
	// 	this.dragSpeed = 1;
	// 	this.scrollSpeed = .005
	// }
	// assignMouseDrager();
	// assignMouseMoveHandler();


	

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

	window.addEventListener( 'keydown', onKeyDown );
	window.addEventListener( 'keyup', onKeyUp );



	// HTML.canvas.addEventListener('mousemove', function(_e) {
	// 	// InputHanlder.raycaster
	// 	// mousePos.x = (_e.clientX / window.innerWidth) * 2 - 1;
	// 	// mousePos.y = -(_e.clientY / window.innerHeight) * 2 + 1;

	// });

	// let resetColorValue = false;

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


				direction.z = Number( moveForward ) - Number( moveBackward );
				direction.x = Number( moveRight ) - Number( moveLeft );
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









	// HTML.canvas.addEventListener('wheel', function(event) {
		// let mousePosition = new Vector([
		// 	event.offsetX / HTML.canvas.offsetWidth * HTML.canvas.width, 
		// 	event.offsetY / HTML.canvas.offsetHeight * HTML.canvas.height
		// ]);

		// let startWorldPosition = RenderEngine.camera.canvasPosToWorldPos(mousePosition);

	//     Camera.zoom += event.deltaY * InputHandler.settings.scrollSpeed;
	//     if (Camera.zoom < .1) Camera.zoom = .1;
	    

	//     // let endWorldPosition = RenderEngine.camera.canvasPosToWorldPos(mousePosition);
	//     // RenderEngine.camera.position.add(endWorldPosition.difference(startWorldPosition));
	    
	//     return false; 
	// }, false);

	// HTML.canvas.addEventListener('click', function() {
	// 	InputHandler.update();
	// });




	// function assignMouseMoveHandler() {
	// 	HTML.canvas.addEventListener("mousemove", 
	// 	    function (_event) {
	// 	    	let mousePosition = new Vector([
	// 				_event.offsetX / HTML.canvas.offsetWidth * HTML.canvas.width, 
	// 				_event.offsetY / HTML.canvas.offsetHeight * HTML.canvas.height
	// 			]);
	//     		let worldPosition = RenderEngine.camera.canvasPosToWorldPos(mousePosition);

	//     		Builder.handleMouseMove(worldPosition);
	// 	    	Server.sendPacket(0, worldPosition.value);
	// 	    }
	// 	);
	// }








	// function assignMouseDrager() {
	// 	HTML.canvas.addEventListener("mousedown", 
	//     	function (_event) {
	//       		InputHandler.draging = true;
	//     	}
	//   	);

	//   	HTML.canvas.addEventListener("mouseup", stopDraging);

	//   	let prevDragVector = false;
	// 	HTML.canvas.addEventListener("mousemove", 
	// 	    function (_event) {
	// 	    	if (!InputHandler.draging) return;
	// 	    	if (!InputHandler.mouseDown) return stopDraging();
	// 	    	RenderEngine.camera.follow(false);

	// 	    	if (prevDragVector)
	// 	    	{
	// 	    		let deltaPos = new Vector([_event.screenX, _event.screenY]).difference(prevDragVector);
	// 	    		let moveVector = deltaPos.scale(InputHandler.settings.dragSpeed * RenderEngine.camera.zoom);
	// 	    		RenderEngine.camera.position.add(moveVector);
	// 	    	}

	// 	    	prevDragVector = new Vector([_event.screenX, _event.screenY]);
	// 	    }
	// 	);
		
	// 	function stopDraging() {
	// 		InputHandler.draging = false;
	//       	prevDragVector = false;
	// 	}
	// }

}




// document.body.addEventListener("keydown", function(_e) {
// 	KeyHandler.keys[_e.key] = true;
// 	KeyHandler.handleKeys(_e);
// });

// document.body.addEventListener("keyup", function(_e) {
// 	KeyHandler.keys[_e.key] = false;
// });
