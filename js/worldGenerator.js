
function _perlin(_frequency) {
	this.f = 1 / _frequency;
	this.get = function(x, y) {
		return (1 + perlin.get((2 * x - 1) / this.f, (2 * y - 1) / this.f)) / 2;
	}
}
let Perlin1 = new _perlin(2);
let Perlin2 = new _perlin(5);
let Perlin3 = new _perlin(10);


let blockSize = 0;
function _WorldGenerator({tileCount, worldSize}) {
	const chunkSize = 64;
	blockSize = worldSize / tileCount;

	this.createWorldShape = function({tileCount, worldSize}) {
		let world = [];
		
		const waterHeight = blockSize * 30;
		for (let x = 0; x < tileCount; x++)
		{
			world[x] = [];
			for (let z = 0; z < tileCount; z++)
			{
				let height = (Perlin1.get(x / tileCount, z / tileCount) * 10 + Perlin2.get(x / tileCount, z / tileCount) * 2 + Perlin3.get(x / tileCount, z / tileCount)) * 5; 
				height = Math.ceil(height / blockSize) * blockSize;
				if (height < waterHeight) height = waterHeight;
				let type = 0;
				if (height <= waterHeight) 
				{
					type = 2;
				} else if (height * (1.05 - .1 * Math.random()) > 40)
				{
					type = 1;
				}  

				world[x][z] = {
					y: height,
					type: type
				}
			}
		}
		return world;
	}


	function imageScalarFunction(texture) {
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    	texture.repeat.set(blockSize, blockSize);
	}
	let materials = [];
	let customMaterials = {
		door: loadImageMaterial('images/customMaterials/door.png'),
		karate: new THREE.MeshLambertMaterial({
			color: 0xffffff, 
			side: THREE.DoubleSide,
			alphaMap: new THREE.TextureLoader().load('images/customMaterials/karatePoppetjeAlpha.png'),
			transparent: true,
			map: new THREE.TextureLoader().load('images/customMaterials/karatePoppetje.png'),
		}),
		recipe: new THREE.MeshLambertMaterial({
			color: 0xffffff, 
			side: THREE.DoubleSide,
			alphaMap: new THREE.TextureLoader().load('images/customMaterials/recipeAlpha.png'),
			transparent: true,
			map: new THREE.TextureLoader().load('images/customMaterials/recipe.png'),
		})
	}

	for (let i = 0; i <= 7; i++)
	{
		materials[i] = {
			top: loadImageMaterial('images/blocks/' + i + '/top.png', imageScalarFunction),
			side: loadImageMaterial('images/blocks/' + i + '/side.png', imageScalarFunction),
		};
	}

	function loadImageMaterial(_url, _scaleFunc) {
		 return new THREE.MeshLambertMaterial({
			color: 0xffffff, 
			side: THREE.DoubleSide,
			map: new THREE.TextureLoader().load(_url, _scaleFunc),
		});
	}
		



	this.createChunkMeshes = function({chunkX, chunkZ, tileCount, worldSize, worldShape}) {
		let blockGeometries = [];
		for (let material of materials)
		{
			blockGeometries.push({
				topGeometry: new THREE.Geometry(),
				sideGeometry: new THREE.Geometry(),
				altered: false
			})
		}

		for (let dx = 0; dx < chunkSize; dx++)
		{
			let x = dx + chunkX * chunkSize;
			for (let dz = 0; dz < chunkSize; dz++)
			{
				let z = dz + chunkZ * chunkSize;
				let type = worldShape[x][z].type;
				if (type < 0 || type > materials.length) continue;

				let Meshes = createBlockMesh({
					x: x,
					z: z,
					worldShape: worldShape,
					blockSize: blockSize,
				});

				blockGeometries[type].topGeometry.mergeMesh(Meshes.top);
				blockGeometries[type].sideGeometry.mergeMesh(Meshes.side);
				blockGeometries[type].altered = true;
			}
		}

		for (let i = 0; i < blockGeometries.length; i++)
		{
			let curBlockType = blockGeometries[i];
			if (!curBlockType.altered) continue;

			curBlockType.topGeometry.mergeVertices();
			curBlockType.sideGeometry.mergeVertices();

			let topMesh = new THREE.Mesh(curBlockType.topGeometry, materials[i].top);
			let sideMesh = new THREE.Mesh(curBlockType.sideGeometry, materials[i].side);

			topMesh.geometry.groupsNeedUpdate = true
			sideMesh.geometry.groupsNeedUpdate = true

			topMesh.position.x = -worldSize / 2;
			topMesh.position.z = -worldSize / 2;
			World.scene.add(topMesh);

			sideMesh.position.x = -worldSize / 2;
			sideMesh.position.z = -worldSize / 2;
			World.scene.add(sideMesh);

			
			World.meshes.push(topMesh);
			World.meshes.push(sideMesh);
		}	
	}


	function createBlockMesh({x, z, worldShape, blockSize}) {
		let self = worldShape[x][z];				
		let sideGeometry = new THREE.Geometry();
		
		// Top
		let geometryTop = new THREE.PlaneGeometry(blockSize, blockSize);
		let topMesh = new THREE.Mesh(geometryTop);
		topMesh.rotation.x = .5 * Math.PI;


		if (z + 1 != worldShape[0].length)
		{
			let neighbour = worldShape[x][z + 1];
			let dy = self.y - neighbour.y;
			if (dy > 0) 
			{
				let geometryFront = new THREE.PlaneGeometry(blockSize, dy);
				let subMeshFront = new THREE.Mesh(geometryFront);
				subMeshFront.position.z = .5 * blockSize;
				subMeshFront.position.y = -.5 * dy;
				sideGeometry.mergeMesh(subMeshFront);
			}
		}


		if (z - 1 >= 0)
		{
			let neighbour = worldShape[x][z - 1];
			let dy = self.y - neighbour.y;
			if (dy > 0) 
			{
				let geometryBack = new THREE.PlaneGeometry(blockSize, dy);
				let subMeshBack = new THREE.Mesh(geometryBack);
				subMeshBack.position.z = -.5 * blockSize;
				subMeshBack.position.y = -.5 * dy;
				sideGeometry.mergeMesh(subMeshBack);	
			}
		}


		if (x + 1 != worldShape[0].length)
		{
			let neighbour = worldShape[x + 1][z];
			let dy = self.y - neighbour.y;
			if (dy > 0) 
			{	
				let geometryRight = new THREE.PlaneGeometry(blockSize, dy);
				let subMeshRight = new THREE.Mesh(geometryRight);
				subMeshRight.rotation.y = .5 * Math.PI;
				subMeshRight.position.x = .5 * blockSize;
				subMeshRight.position.y = -.5 * dy;
				sideGeometry.mergeMesh(subMeshRight);
			}
		}


		if (x - 1 >= 0)
		{
			let neighbour = worldShape[x - 1][z];
			let dy = self.y - neighbour.y;
			if (dy > 0) 
			{					
				let geometryLeft = new THREE.PlaneGeometry(blockSize, dy);
				let subMeshLeft = new THREE.Mesh(geometryLeft);
				subMeshLeft.rotation.y = .5 * Math.PI;
				subMeshLeft.position.x = -.5 * blockSize;
				subMeshLeft.position.y = -.5 * dy;
				sideGeometry.mergeMesh(subMeshLeft);
			}
		}

		sideGeometry.mergeVertices();

		let sideMesh = new THREE.Mesh(sideGeometry);
		sideMesh.position.x = x * blockSize;
		sideMesh.position.z = z * blockSize;
		sideMesh.position.y = self.y;

		topMesh.position.x = x * blockSize;
		topMesh.position.z = z * blockSize;
		topMesh.position.y = self.y;

		return {
			top: topMesh,
			side: sideMesh,
		}
	}


	this.createWaterFloor = function() {
		let geometry = new THREE.PlaneGeometry(1000, 1000);
		let mesh = new THREE.Mesh(geometry, materials[2].top);
		mesh.rotation.x = .5 * Math.PI;
		mesh.position.y = -0.1;

		World.scene.add(mesh);
		World.meshes.push(mesh);
	}

	this.createHouseRoof = function() {
		
	}

	this.createDoor = function() {
		World.components.push(new RotateComponent({
			width: blockSize * 2, 
			height: blockSize * 4.3, 
			thickness: blockSize * .2, 
			material: customMaterials.door,
			position: {x: 57.51, y: 8, z: 41}
		}));
	}

	this.createDrawers = function() {
		const y = 6.45;
		const x = houseX + 9.7;
		let drawer1 = new Compartiment({
			width: blockSize * 1.5, 
			height: blockSize * 1.3, 
			depth: blockSize * 2,
			material: materials[5].side,
			position: {x: x, y: y, z: 35.4}
		});
		drawer1.rotateY(Math.PI);
		let drawer2 = new Compartiment({
			width: blockSize * 1.5, 
			height: blockSize * 1.3, 
			depth: blockSize * 2,
			material: materials[5].side,
			position: {x: x, y: y, z: 37.401}
		});
		drawer2.rotateY(Math.PI);
		let fridge = new Compartiment({
			width: blockSize * 1.5, 
			height: blockSize * 3.5, 
			depth: blockSize * 1.5,
			material: materials[5].side,
			position: {x: x, y: y, z: 39.4}
		});
		fridge.rotateY(Math.PI);
	}

	this.createKarateGravity = function(_pos) {
		let geo = new THREE.PlaneGeometry(blockSize * 3, blockSize * 3);
		let mesh = new THREE.Mesh(geo, customMaterials.karate);
		applyPositionToMesh(mesh, _pos);
		World.scene.add(mesh);
	}
	this.createRecipeMessage = function(_pos) {
		let geo = new THREE.PlaneGeometry(blockSize * 1.8, blockSize * 2.5);
		let mesh = new THREE.Mesh(geo, customMaterials.recipe);
		applyPositionToMesh(mesh, _pos);
		World.scene.add(mesh);
	}


	this.createWorld = function({tileCount, worldSize, worldShape}) {
		this.createWaterFloor();
		this.createDoor();
		this.createDrawers();
		this.createKarateGravity({x: 61, y: 8, z: 41.51});
		this.createKarateGravity({x: 55, y: 8, z: 33.51});
		this.createRecipeMessage({x: 59, y: 8.5, z: 33.51});

		for (let x = 0; x < tileCount / chunkSize; x++)
		{
			for (let z = 0; z < tileCount / chunkSize; z++)
			{
				this.createChunkMeshes({
					chunkX: x,
					chunkZ: z,
					tileCount: tileCount,
					worldSize: worldSize,
					worldShape: worldShape
				});
			}	
		}
	}

}


function Compartiment({width, height, depth, position, material}) {
	const paneThickness = width * .1;
	this.door = new RotateComponent({
		width: depth, 
		height: height, 
		thickness: paneThickness,
		position: {
			x: position.x + width / blockSize / 2,
			y: position.y + height / blockSize / 2,
			z: position.z + depth / blockSize / 2,
		},
		material: material,
		initalYRotation: Math.PI * .5
	});


	let geometry = new THREE.BoxGeometry(width, height, paneThickness);

	let geo = new THREE.Geometry();

	let topMesh = new THREE.Mesh(new THREE.PlaneGeometry(width, depth));
	topMesh.position.y = height;
	topMesh.rotation.x = Math.PI * .5;

	let bottomMesh = new THREE.Mesh(new THREE.PlaneGeometry(width, depth));
	bottomMesh.rotation.x = Math.PI * .5;


	let side1 = new THREE.Mesh(new THREE.PlaneGeometry(width, height));
	side1.position.z = -depth / 2;
	side1.position.y = height / 2;
	let side2 = new THREE.Mesh(new THREE.PlaneGeometry(width, height));
	side2.position.z = depth / 2;
	side2.position.y = height / 2;
	
	let side3 = new THREE.Mesh(new THREE.PlaneGeometry(depth, height));
	side3.position.x = -width / 2;
	side3.position.y = height / 2;
	side3.rotation.y = Math.PI * .5;


	geo.mergeMesh(topMesh);
	geo.mergeMesh(bottomMesh);
	geo.mergeMesh(side1);
	geo.mergeMesh(side2);
	geo.mergeMesh(side3);

	geo.mergeVertices();
	let mesh = new THREE.Mesh(geo, material);
	this.mesh = mesh;
	
	applyPositionToMesh(mesh, position);
	World.scene.add(mesh);


	this.rotateY = function(_angle) {
		mesh.rotation.y += _angle;
		this.door.setInitalYRotation(mesh.rotation.y + Math.PI * .5);
		
		let delta = mesh.position.clone().multiplyScalar(-1).add(this.door.mesh.position);
		delta.applyAxisAngle(new THREE.Vector3(0, 1, 0), _angle);
		let newPos = mesh.position.clone().add(delta);
		this.door.mesh.position.set(newPos.x, newPos.y, newPos.z);
	}
}

function applyPositionToMesh(_mesh, _position) {
	let pos = Camera.convertBlockCoordsToWorldCoords({x: _position.x, y: _position.y, z: _position.z});
	_mesh.position.x = pos.x;
	_mesh.position.y = pos.y;
	_mesh.position.z = pos.z;
}



function ClickableComponent(mesh) {
	this.mesh = mesh;
	this.mesh.component = this;
	World.clickables.push(this.mesh);
}


function RotateComponent({width, height, thickness, material, position, initalYRotation = 0}) {
	let geometry = new THREE.BoxGeometry(width, height, thickness);
	geometry.applyMatrix(new THREE.Matrix4().makeTranslation(width / 2, 0, thickness / 2));
	let doorMesh = new THREE.Mesh(geometry, material);

	applyPositionToMesh(doorMesh, position);
	doorMesh.rotation.y = initalYRotation;
	ClickableComponent.call(this, doorMesh);

	World.scene.add(doorMesh);
	World.meshes.push(doorMesh);


	this.openState = false;
	this.setInitalYRotation = function(_angle) {
		initalYRotation = _angle;
		doorMesh.rotation.y = initalYRotation;
	}

	this.onclick = function() {
		if (this.openState) return this.close();
		return this.open();
	}

	
	this.open = function() {
		this.openState = true;
		animateToAngle(initalYRotation - .5 * Math.PI);
	}

	this.close = function() {
		this.openState = false;
		animateToAngle(initalYRotation - 0 * Math.PI);
	}

	const stepSize = .04;
	function animateToAngle(_toAngle) {
		let delta = doorMesh.rotation.y - _toAngle;
		if (Math.abs(delta) < stepSize) 
		{
			doorMesh.rotation.y = _toAngle;
			return;
		}
		doorMesh.rotation.y += stepSize * (delta < 0 ? 1 : -1);

		requestAnimationFrame(() => {animateToAngle(_toAngle)});
	}
}



