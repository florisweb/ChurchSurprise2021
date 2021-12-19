
function _perlin(_frequency) {
	this.f = 1 / _frequency;
	this.get = function(x, y) {
		return (1 + perlin.get((2 * x - 1) / this.f, (2 * y - 1) / this.f)) / 2;
	}
}
let Perlin1 = new _perlin(2);
let Perlin2 = new _perlin(5);
let Perlin3 = new _perlin(10);


function _WorldGenerator() {
	const chunkSize = 64;


	this.createWorldShape = function({tileCount, worldSize}) {
		let world = [];
		const blockSize = worldSize / tileCount;
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


	
	let materials = [
		{
			top: new THREE.MeshLambertMaterial({
				color: 0xffffff, 
				side: THREE.DoubleSide,
				map: new THREE.TextureLoader().load('images/blocks/0/top.png'),
			}),
			side: new THREE.MeshLambertMaterial({
				color: 0xffffff, 
				side: THREE.DoubleSide,
				map: new THREE.TextureLoader().load('images/blocks/0/side.png'),
			})
		},
		{
			top: new THREE.MeshLambertMaterial({
				color: 0xffffff, 
				side: THREE.DoubleSide,
				map: new THREE.TextureLoader().load('images/blocks/1/top.png'),
			}),
			side: new THREE.MeshLambertMaterial({
				color: 0xffffff, 
				side: THREE.DoubleSide,
				map: new THREE.TextureLoader().load('images/blocks/1/side.png'),
			})
		},
		{
			top: new THREE.MeshLambertMaterial({
				color: 0xffffff, 
				side: THREE.DoubleSide,
				map: new THREE.TextureLoader().load('images/blocks/2/top.png'),
			}),
			side: new THREE.MeshLambertMaterial({
				color: 0xffffff, 
				side: THREE.DoubleSide,
				map: new THREE.TextureLoader().load('images/blocks/2/side.png'),
			})
		}
	];
		



	this.createChunkMeshes = function({chunkX, chunkZ, tileCount, worldSize, worldShape}) {
		const blockSize = worldSize / tileCount;

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





	this.createWorld = function({tileCount, worldSize, worldShape}) {
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



