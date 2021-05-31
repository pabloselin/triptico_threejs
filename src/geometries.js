import * as THREE from "three";
import { colors, colors_morning } from "./colors.js";

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

function addMesh(geometry, material, x, y, z, rotX, scene) {
	//const mesh = new THREE.Mesh(geometry, material);

	const plane = new THREE.Mesh(geometry, material);

	plane.position.x = x;
	plane.position.y = y;
	plane.position.z = z;
	plane.rotation.x = rotX * 0.01; //rotX * 0.3;
	plane.rotation.y = 0; //rotX * 0.5;
	plane.rotation.z = 0;

	scene.add(plane);

	return plane;
}

function addMeshHorizontal(geometry, material, x, y, z, rotX, scene) {
	//const mesh = new THREE.Mesh(geometry, material);

	const plane = new THREE.Mesh(geometry, material);

	plane.position.x = x;
	plane.position.y = y;
	plane.position.z = z;
	plane.rotation.x = rotX * 0.01; //rotX * 0.3;
	plane.rotation.y = 0; //rotX * 0.5;
	plane.rotation.z = 77;

	scene.add(plane);

	return plane;
}

export { addMesh, makeMesh, addMeshHorizontal };
