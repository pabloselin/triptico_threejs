import * as THREE from "three";
import makeScene from "./makeScene.js";
import { colors, colors_morning, colors_night } from "./colors.js";
import updatePositions from "./updatePositions.js";

function setupLineScene(canvasEl, data, maxpoints, drawCount, color) {
	const canvasDimensions = canvasEl.getBoundingClientRect();
	const camProps = {
		fov: 45,
		aspect: canvasDimensions.height / canvasDimensions.width,
		near: 1,
		far: 10000,
		position: [0, 0, 1000],
		rotation: [0, 0, 0],
	};
	const lightProps = {
		color: 0xffffff,
		intensity: 1,
		position: [-1, 2, 4],
	};
	const sceneInfo = makeScene(canvasEl, camProps, lightProps);

	const geometry = new THREE.BufferGeometry();
	const positions = new Float32Array(maxpoints * 3);
	geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

	//first range
	geometry.setDrawRange(0, 1);

	const material = new THREE.LineBasicMaterial({ color: color });

	//const line_acc2_d = new THREE.Line(geometry, material);
	const line_acc2_i = new THREE.Line(geometry, material);
	//sceneInfo.scene.add(line_acc2_d);
	sceneInfo.scene.add(line_acc2_i);
	//sceneInfo.line_1 = line_acc2_d;
	sceneInfo.line_1 = line_acc2_i;

	//updatePositions(sceneInfo.line_1, data["acc2_d"]);
	updatePositions(sceneInfo.line_1, data);
	sceneInfo.geometry = geometry;
	sceneInfo.scene.background = new THREE.Color(colors_night.darkgreen);

	// const geometry = new THREE.BoxGeometry(1, 1, 1);
	// const material = new THREE.MeshPhongMaterial({ color: "red" });
	// const mesh = new THREE.Mesh(geometry, material);
	// sceneInfo.scene.add(mesh);
	// sceneInfo.mesh = mesh;
	return sceneInfo;
}

export default setupLineScene;
