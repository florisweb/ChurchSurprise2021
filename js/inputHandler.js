// document.onmousedown = function() { 
//   InputHandler.mouseDown = true;
// }
// document.onmouseup = function() {
//   InputHandler.mouseDown = false;
// }




function _InputHandler(_canvas) {
	const This = this;
	const HTML = {
		canvas: _canvas,
	};
	const speed = .5;

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
	// let mousePos = new THREE.Vector2();
	// mousePos.x = -2;
	// mousePos.y = -2;

	// this.mouseDown = false;
	// this.draging = false;

	// const blocker = document.getElementById( 'blocker' );
	// const instructions = document.getElementById( 'instructions' );

	this.usesDeviceMotionControls = false;
	if (window.DeviceMotionEvent)
	{
		this.usesDeviceMotionControls = true;
		this.controls = new THREE.DeviceOrientationControls(Camera.camera);
		document.body.onclick = () => {
			window.DeviceMotionEvent.requestPermission()
			  .then(response => {
			    console.log(response);
			  }
			);
		}
	} else {

		this.controls = new PointerLockControls(Camera.camera, document.body);
		// instructions.addEventListener( 'click', function () {
		document.body.addEventListener( 'click', function () {
			This.controls.lock();
		});

		this.controls.addEventListener( 'lock', function () {
			// instructions.style.display = 'none';
			// blocker.style.display = 'none';
		});

		this.controls.addEventListener( 'unlock', function () {
			// blocker.style.display = 'block';
			// instructions.style.display = '';
		});


		World.scene.add(this.controls.getObject());
	}


	



	// this.settings = new function() {
	// 	this.dragSpeed = 1;
	// 	this.scrollSpeed = .005
	// }
	// assignMouseDrager();
	// assignMouseMoveHandler();


	
	// window.addEventListener("deviceorientation", function(event) {
 //        // alpha: rotation around z-axis
 //        var rotateDegrees = event.alpha / 180 * Math.PI;
 //        // gamma: left to right
 //        var leftToRight = event.gamma / 180 * Math.PI;
 //        // beta: front back motion
 //        var frontToBack = event.beta / 180 * Math.PI;
 //        // Camera.rotation.value = [rotateDegrees / 180 * Math.PI, leftToRight / 180 * Math.PI, frontToBack / 180 * Math.PI];
 //        Camera.rotation.value = [frontToBack, rotateDegrees, 0];
 //        // 0: op en neer
 //        // 1: draaien
 //        // 2: hoofd scheef: 0

 //    }, true);

	// window.addEventListener('devicemotion', function(event) { 
	// 	console.log(event); 
	//   // let vx = event.acceleration.x;
	//   // let vy = event.acceleration.y;

	//   // if (vx < minimumChange && vx > -minimumChange) vx = 0;
	//   // if (vy < minimumChange && vy > -minimumChange) vy = 0;

	//   // mixPanCanvas.style.marginLeft = vx * 20 + "px";
	//   // mixPanCanvas.style.transform = "rotateZ(" + vy * 4 + "deg)";

	//   // if (Mixer.addedIngredients.length != Mixer.ingredients.length || progress == target) return;

	//   // progress += Math.abs(vx) + Math.abs(vy);

	//   // if (progress > target) progress = target;
	//   // Mixer.mixPercentage = progress / target;
	  
	//   // if (progress == target) finishedMixing();
	  
	//   // mixPercentageHolder.innerHTML = Math.round(Mixer.mixPercentage * 1000) / 10 + "%";
	//   // Drawer.drawPan(Mixer.mixPercentage);
	// });


	let moveForward = false;
	let moveLeft = false;
	let moveBackward = false;
	let moveRight = false;

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

	this.update = function() {

		// Gravity
		let curPos = Camera.getBlockPos();
		let curBlock = World.worldShape[curPos.x][curPos.z];
		if (!curBlock) return;
		let dy = Camera.camera.position.y - (curBlock.y + blockSize * 2);
		if (curBlock.type == -1 || curBlock.type == 2)
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

				this.controls.moveRight( - velocity.x * delta );
				this.controls.moveForward( - velocity.z * delta );


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


		// Camera.velocity.value[0] = 1;
		// raycaster.setFromCamera(mousePos, Camera.camera);
		// const intersects = raycaster.intersectObjects(World.meshes);
		
		// window.intersects = intersects;
		// if (intersects.length < 1) return;
		// World.buildMesh.position.x = Math.round(intersects[0].point.x / blockSize) * blockSize;
		// World.buildMesh.position.y = (Math.round(intersects[0].point.y / blockSize) + .5) * blockSize;
		// World.buildMesh.position.z = Math.round(intersects[0].point.z / blockSize) * blockSize;
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
