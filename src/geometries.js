import * as THREE from "three";

function makeMesh(geometry, material, x, y, z, scene) {
	const mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);

	mesh.position.x = x;
	mesh.position.y = y;
	mesh.position.z = z;
	mesh.rotation.x = 0;
	mesh.rotation.y = 0;
	mesh.rotation.z = 0;

	return mesh;
}

function addMesh(mesh, x, y, z, scene) {
	//const mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);

	mesh.position.x = x;
	mesh.position.y = y;
	mesh.position.z = z;
	mesh.rotation.x = 0;
	mesh.rotation.y = 0;
	mesh.rotation.z = 0;

	return mesh;
}

export { addMesh, makeMesh };
