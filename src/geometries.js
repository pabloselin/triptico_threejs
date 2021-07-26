import * as THREE from "three";
import { BufferGeometryUtils } from "../node_modules/three/examples/jsm/utils/BufferGeometryUtils.js";
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

function combinedDirectionalMesh(props) {
	//Los helpers se van moviendo según se necesiten
	//Longitude helper
	const lonHelper = new THREE.Object3D();
	const colorVert = new THREE.Color();
	props.sceneInfo.scene.add(lonHelper);

	//Latitude helper
	const latHelper = new THREE.Object3D();
	lonHelper.add(latHelper);

	const positionHelper = new THREE.Object3D();
	positionHelper.position.z = 1;
	latHelper.add(positionHelper);

	const originHelper = new THREE.Object3D();
	originHelper.position.z = 0.5;
	positionHelper.add(originHelper);

	for (let i = 0; i < props.maxpoints; i++) {
		//Angle 1 Izquierda
		let cylinder = new THREE.CylinderGeometry(...props.geoProps);

		if (props.direction === "vertical") {
			positionHelper.position.x =
				props.data[i][props.dataZone][0] * props.positionsFactor.x;
			positionHelper.position.y = i + 12;
			positionHelper.position.z = props.positionsFactor.z;
			positionHelper.rotation.z =
				props.data[i][props.dataZone][1] * 0.4 + 30;
		} else {
			positionHelper.position.x = i;
			positionHelper.position.y =
				props.data[i][props.dataZone][0] * props.positionsFactor.y +
				props.yIncrement;
			positionHelper.position.z = props.positionsFactor.z;
			positionHelper.rotation.z = props.data[i][props.dataZone][1] * 0.1;
		}

		originHelper.updateWorldMatrix(true, false);
		cylinder.applyMatrix4(originHelper.matrixWorld);

		// const hue = THREE.MathUtils.lerp(
		// 	props.hue[0],
		// 	props.hue[1],
		// 	props.data[i][props.dataZone][0] * props.hue[2]
		// );
		const hue = props.hue[0];
		const saturation =
			props.hue[2] * Math.abs(props.data[i][props.dataZone][0]) * 1.2;
		const lightFactorAbs = Math.abs(props.data[i][props.dataZone][0]);
		const lightFactor = lightFactorAbs > 2 ? 2 : lightFactorAbs;
		const lightness = THREE.MathUtils.lerp(0.4, 0.6, lightFactor);

		colorVert.setHSL(hue, saturation, lightness);
		const rgb = colorVert.toArray().map((v) => v * 255);

		const numVerts = cylinder.getAttribute("position").count;

		const itemSize = 3; //r,g,b
		const colors = new Uint8Array(itemSize * numVerts);

		colors.forEach((v, ndx) => {
			colors[ndx] = rgb[ndx % 3];
		});

		const normalized = true;
		const colorAttrib = new THREE.BufferAttribute(
			colors,
			itemSize,
			normalized
		);
		cylinder.setAttribute("color", colorAttrib);
		props.sceneInfo.geometries[props.direction].push(cylinder);
	}

	const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(
		props.sceneInfo.geometries[props.direction],
		false
	);

	const material = new THREE.MeshBasicMaterial({ vertexColors: true });
	const newMesh = new THREE.Mesh(mergedGeometry, material);
	props.sceneInfo.meshes[props.direction].push(newMesh);
	//console.log(mergedGeometry, sceneInfo.mesh);
	props.sceneInfo.scene.add(newMesh);
}

export { addMesh, makeMesh, addMeshHorizontal, combinedDirectionalMesh };
