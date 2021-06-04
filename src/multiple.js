import * as THREE from "three";
import { BufferGeometryUtils } from "../node_modules/three/examples/jsm/utils/BufferGeometryUtils.js";
import { OrbitControls } from "../node_modules/three/examples/jsm/controls/OrbitControls.js";
import { makeMesh, addMesh, addMeshHorizontal } from "./geometries.js";
import {
	colors,
	colors_morning,
	colors_sunset,
	colors_night,
} from "./colors.js";
import makeScene from "./makeScene.js";
import setupLineScene from "./setupLineScene.js";
import updatePositions from "./updatePositions.js";
import updateHTMLInfo from "./updateHTMLInfo.js";
import updateImages from "./updateImages.js";
import canvasSquares2D from "./canvasSquares2D.js";

// Tres escenas
function main(data) {
	const MAX_POINTS = data.acc2_i.length;
	const CAMERA_INCREMENT = 0.7;

	const canvas = document.querySelector("#triptico_canvas");
	const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
	const sceneElements = [];
	const clock = new THREE.Clock();

	let drawCount = 0;
	let drawCount_right = 0;
	let mouseX = 0;
	let mouseY = 0;
	let directionX = 1;
	const infoZonesLeft = document.getElementById("infozones_left");
	const infoZonesRight = document.getElementById("infozones_right");
	const imageElement = document.getElementById("image_performance");
	const imagesBottom = document.getElementById("bottomimgs");

	const keyzone = document.getElementById("keyzone");

	//2d stuff
	let canvasrug = document.getElementById("triptico_squares");
	let canvascontainer = document.getElementById("triptico_canvas_rug");
	let imageContainer = document.querySelector("#centerimg .centerimgimg");
	let canvasWidth = canvascontainer.clientWidth;
	let canvasHeight = canvascontainer.clientHeight;

	document.onmousemove = handleMouseMove;

	//put images
	let imgkeys = TRIPTICO.img_resized.length;
	let imgEls = [];

	for (let i = 0; i < imgkeys; i++) {
		console.log("run once");
		let img = document.createElement("img");
		img.setAttribute("src", TRIPTICO.img_resized[i]);
		img.dataset.index = i;
		imgEls.push(img);
		imagesBottom.appendChild(img);
	}

	function handleMouseMove(event) {
		if (event.pageX < mouseX) {
			directionX = -1;
		} else if (event.pageX > mouseX) {
			directionX = 1;
		}
		mouseX = event.pageX;

		if (mouseY > event.clientY) {
			mouseY = event.clientY;
		} else {
			mouseY = -event.clientY;
		}
	}

	function setup3dScene(canvasID) {
		const canvasEl = document.querySelector(canvasID);

		const camProps = {
			fov: 55,
			aspect: 2,
			near: 0.1,
			far: 10000,
			position: [3, 0, 10],
			rotation: [1, 0, 0],
		};

		const lightProps = {
			color: 0xef9c29,
			intensity: 0.1,
			position: [0, 1, -2],
		};

		const sceneInfo = makeScene(canvasEl, camProps, lightProps);
		const axisHelper = new THREE.AxesHelper(5);
		sceneInfo.scene.add(axisHelper);

		sceneInfo.materialLeft_1 = new THREE.MeshPhongMaterial({
			color: 0x0099cc,
		});

		sceneInfo.materialLeft_2 = new THREE.MeshPhongMaterial({
			color: 0x00a2cc,
		});

		sceneInfo.materialLeft_3 = new THREE.MeshPhongMaterial({
			color: 0x0072cc,
		});

		sceneInfo.materialLeft_4 = new THREE.MeshPhongMaterial({
			color: 0x6800f9,
		});

		sceneInfo.materialLeft_5 = new THREE.MeshPhongMaterial({
			color: 0xa060f9,
		});

		sceneInfo.materialLeft_6 = new THREE.MeshPhongMaterial({
			color: 0xceaff9,
		});

		sceneInfo.materialRight_1 = new THREE.MeshPhongMaterial({
			color: 0x00b33c,
		});

		sceneInfo.materialRight_2 = new THREE.MeshPhongMaterial({
			color: 0x00a00c,
		});

		sceneInfo.materialRight_3 = new THREE.MeshPhongMaterial({
			color: 0x3fa346,
		});

		sceneInfo.materialRight_4 = new THREE.MeshPhongMaterial({
			color: 0xd2a128,
		});

		sceneInfo.materialRight_5 = new THREE.MeshPhongMaterial({
			color: 0xd28228,
		});

		sceneInfo.materialRight_6 = new THREE.MeshPhongMaterial({
			color: 0xa3d228,
		});

		sceneInfo.materialGreen = new THREE.MeshPhongMaterial({
			color: colors.line_3,
		});

		sceneInfo.materialRed = new THREE.MeshPhongMaterial({
			color: colors.line_4,
		});

		sceneInfo.materialBlue = new THREE.MeshPhongMaterial({
			color: colors.line_1,
		});

		sceneInfo.materialYellow = new THREE.MeshPhongMaterial({
			color: colors.line_2,
		});

		sceneInfo.scene.background = new THREE.Color(colors_night.darkgreen);

		sceneInfo.geometryAcc = new THREE.PlaneGeometry(0.6, 2, 1);
		sceneInfo.meshes = [];
		sceneInfo.geometries = [];
		sceneInfo.geometries_horizontal = [];

		// 1. Vertical section

		//Los helpers se van moviendo según se necesiten
		//Longitude helper
		const lonHelper = new THREE.Object3D();
		sceneInfo.scene.add(lonHelper);

		//Latitude helper
		const latHelper = new THREE.Object3D();
		lonHelper.add(latHelper);

		const positionHelper = new THREE.Object3D();
		positionHelper.position.z = 1;
		latHelper.add(positionHelper);

		const originHelper = new THREE.Object3D();
		originHelper.position.z = 0.5;
		positionHelper.add(originHelper);

		// 2. Horizontal section
		const lonHorzHelper = new THREE.Object3D();
		sceneInfo.scene.add(lonHorzHelper);

		const latHorzHelper = new THREE.Object3D();
		lonHorzHelper.add(latHorzHelper);

		const positionHorzHelper = new THREE.Object3D();
		positionHorzHelper.position.z = 1;
		latHorzHelper.add(positionHorzHelper);

		const originHorzHelper = new THREE.Object3D();
		positionHorzHelper.add(originHorzHelper);

		const colorVert = new THREE.Color();
		const colorHorz = new THREE.Color();

		for (let i = 0; i < MAX_POINTS; i++) {
			// Data
			// Cylinder small
			// Acc_i_0: Position X
			// Acc_i_1: Position Z
			// Acc_i_2: Position Y + Key Increment

			// Cylinder big
			// Angle_i_0: Position X
			// Angle_i_1: Position Z
			// Angle_i_2: Position Y + Key Increment

			// Cylinder small
			// Acc_d_0: Position Y
			// Acc_d_1: Position Z
			// Acc_d_2: Position X - Key Increment

			// Cylinder big
			// Angle_d_0: Position Y
			// Angle_d_1: Position Z
			// Angle_d_2: Position X - Key Increment

			//Angle 1 Izquierda
			let cylinderAngle0 = new THREE.CylinderGeometry(1, 1, 4, 12);

			positionHelper.position.x = data["acc2_i"][i].a[0] * 0.2;
			positionHelper.position.y = i;
			positionHelper.position.z = 1;
			originHelper.updateWorldMatrix(true, false);
			cylinderAngle0.applyMatrix4(originHelper.matrixWorld);

			//Colors Angle 1

			const hue = THREE.MathUtils.lerp(
				0.7,
				0.3,
				data["acc2_i"][i].a[0] * 0.05
			);
			const saturation = 1;
			const lightness = THREE.MathUtils.lerp(0.4, 1.0, 0.5);

			colorVert.setHSL(hue, saturation, lightness);
			const rgb = colorVert.toArray().map((v) => v * 255);

			const numVerts = cylinderAngle0.getAttribute("position").count;

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
			cylinderAngle0.setAttribute("color", colorAttrib);
			sceneInfo.geometries.push(cylinderAngle0);

			// //Angle 2 Izquierda
			// let cylinderAngle1 = new THREE.CylinderGeometry(0.3, 0.3, 4, 6);
			// positionHelper.position.x = data["acc2_i"][i].a[1] * 0.2;
			// positionHelper.position.y = i;
			// positionHelper.position.z = 1;

			// originHelper.updateWorldMatrix(true, false);
			// cylinderAngle1.applyMatrix4(originHelper.matrixWorld);
			// sceneInfo.geometries.push(cylinderAngle1);

			//Angle 1 Derecha
			let cylinderAngle2 = new THREE.CylinderGeometry(
				1,
				1,
				0.5 * data["acc2_d"][i].a[1],
				12
			);

			positionHorzHelper.position.x = i;
			positionHorzHelper.position.y = data["acc2_d"][i].a[0] * 0.2 + 10;
			positionHorzHelper.position.z = 1;

			originHorzHelper.updateWorldMatrix(true, false);
			cylinderAngle2.applyMatrix4(originHorzHelper.matrixWorld);

			const hue_2 = THREE.MathUtils.lerp(
				30,
				50,
				data["acc2_i"][i].a[0] * 10.65
			);
			const saturation_2 = 0.4;
			const lightness_2 = THREE.MathUtils.lerp(0.4, 1.0, 0.5);

			colorHorz.setHSL(hue_2, saturation_2, lightness_2);
			const rgb_2 = colorHorz.toArray().map((v) => v * 255);

			const numVerts_2 = cylinderAngle2.getAttribute("position").count;

			const itemSize_2 = 3; //r,g,b
			const colors_2 = new Uint8Array(itemSize_2 * numVerts_2);

			colors_2.forEach((v, ndx) => {
				colors_2[ndx] = rgb_2[ndx % 3];
			});

			const normalized_2 = true;
			const colorAttrib_2 = new THREE.BufferAttribute(
				colors_2,
				itemSize_2,
				normalized_2
			);
			cylinderAngle2.setAttribute("color", colorAttrib_2);

			sceneInfo.geometries_horizontal.push(cylinderAngle2);

			// //Angle 2 Derecha
			// let cylinderAngle3 = new THREE.CylinderGeometry(0.6, 0.9, 4, 12);

			// positionHorzHelper.position.x = i;
			// positionHorzHelper.position.y = data["acc2_d"][i].a[1] * 0.2 + 10;
			// positionHorzHelper.position.z = 1;

			// originHorzHelper.updateWorldMatrix(true, false);
			// cylinderAngle3.applyMatrix4(originHorzHelper.matrixWorld);

			// sceneInfo.geometries_horizontal.push(cylinderAngle3);
		}

		//console.log(sceneInfo.geometries);

		const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(
			sceneInfo.geometries,
			false
		);

		const material = new THREE.MeshBasicMaterial({ vertexColors: true });
		sceneInfo.mesh = new THREE.Mesh(mergedGeometry, material);
		//console.log(mergedGeometry, sceneInfo.mesh);
		sceneInfo.scene.add(sceneInfo.mesh);

		//geometry horizontal
		const mergedGeometryHorizontal = BufferGeometryUtils.mergeBufferGeometries(
			sceneInfo.geometries_horizontal,
			false
		);
		sceneInfo.mesh_horizontal = new THREE.Mesh(
			mergedGeometryHorizontal,
			material
		);
		sceneInfo.scene.add(sceneInfo.mesh_horizontal);
		console.log(sceneInfo.scene);
		return sceneInfo;
	}

	function resizeRendererToDisplaySize(renderer) {
		const canvas = renderer.domElement;
		const width = canvas.clientWidth;
		const height = canvas.clientHeight;
		const needResize = canvas.width !== width || canvas.height !== height;
		if (needResize) {
			renderer.setSize(width, height, false);
		}
		return needResize;
	}

	const lineleft = document.querySelector("#triptico_canvas_left");
	const lineright = document.querySelector("#triptico_canvas_right");
	const sceneLineLeft = setupLineScene(
		lineleft,
		data["acc2_i"],
		MAX_POINTS,
		drawCount,
		colors.line_1
	);
	const sceneLineRight = setupLineScene(
		lineright,
		data["acc2_d"],
		MAX_POINTS,
		drawCount,
		colors.line_3
	);
	const scene3D = setup3dScene("#triptico_canvas_3d");
	//const scene3D_2 = setup3dScene("#triptico_canvas_3d_overlay");
	//const rugScene = setupRugScene();

	//console.log(sceneLineLeft, scene3D);

	function renderSceneInfo(sceneInfo) {
		const { scene, camera, elem } = sceneInfo;
		const {
			left,
			right,
			top,
			bottom,
			width,
			height,
		} = elem.getBoundingClientRect();

		const isOffscreen =
			bottom < 0 ||
			top > renderer.domElement.clientHeight ||
			right < 0 ||
			left > renderer.domElement.clientWidth;

		if (isOffscreen) {
			console.log("offscreen");
			return;
		}

		camera.aspect = width / height;
		camera.updateProjectionMatrix();

		const positiveYUpBottom = renderer.domElement.clientHeight - bottom;
		renderer.setScissor(left, positiveYUpBottom, width, height);
		renderer.setViewport(left, positiveYUpBottom, width, height);

		renderer.render(sceneInfo.scene, camera);
	}

	function animate() {
		//get data status
		//console.log(data.csv2_d !== undefined);
		//scene3D.controls.update();
		requestAnimationFrame(animate);
		const time = Date.now() * 0.001;
		drawCount = (drawCount + 1) % MAX_POINTS;
		drawCount_right = (drawCount + 1) % MAX_POINTS;
		resizeRendererToDisplaySize(renderer);

		renderer.setScissorTest(false);
		renderer.clear(true, true);
		renderer.setScissorTest(true);

		// renderSceneInfo(sceneLineLeft);
		// renderSceneInfo(sceneLineRight);
		// renderSceneInfo(scene3D);
		// renderSceneInfo(rugScene);

		sceneLineLeft.line_1.geometry.setDrawRange(0, drawCount);
		sceneLineRight.line_1.geometry.setDrawRange(0, drawCount_right);

		sceneLineLeft.line_1.rotation.x = time * 0.14;
		sceneLineRight.line_1.rotation.x = time * 0.14;
		//sceneLineLeft.camera.position.x += 1;
		//sceneLineLeft.camera.position.y += 1;

		updatePositions(sceneLineLeft.line_1, data["acc2_d"], MAX_POINTS, "a");
		sceneLineLeft.line_1.geometry.setDrawRange(0, drawCount);
		sceneLineLeft.line_1.geometry.attributes.position.needsUpdate = true;
		//sceneLineLeft.line_1.material.color.setHSL(Math.random(), 1, 0.5);

		updatePositions(sceneLineRight.line_1, data["acc2_i"], MAX_POINTS, "a");
		sceneLineLeft.line_1.geometry.setDrawRange(0, drawCount);
		sceneLineRight.line_1.geometry.attributes.position.needsUpdate = true;
		//sceneLineRight.line_1.material.color.setHSL(Math.random(), 1, 0.5);

		updateHTMLInfo(
			data["acc2_i"],
			infoZonesLeft,
			drawCount,
			imageContainer
		);
		updateHTMLInfo(
			data["acc2_d"],
			infoZonesRight,
			drawCount,
			imageContainer
		);
		// updateImages(
		// 	imageElement,
		// 	TRIPTICO.img,
		// 	drawCount,
		// 	TRIPTICO_URLS.img,
		// 	MAX_POINTS
		// );

		updateImages(keyzone, drawCount, imgEls.length, MAX_POINTS);

		if (drawCount % MAX_POINTS === 0) {
			scene3D.mesh.position.y = 0;
			scene3D.mesh_horizontal.position.x = 0;
		}

		scene3D.mesh.position.y -= 0.2;
		scene3D.mesh.rotation.y = data["acc2_d"][drawCount].g[2] * 0.2;
		scene3D.mesh_horizontal.position.x -= 0.2;
		scene3D.mesh_horizontal.rotation.x =
			data["acc2_d"][drawCount].g[2] * 0.2;

		// //Rotaciones arbitrarias
		// let curRotation = data["acc2_d"][drawCount]
		// 	? data["acc2_d"][drawCount].g[2] * 1.2
		// 	: 0;

		// let curRotationb = data["acc2_i"][drawCount]
		// 	? data["acc2_i"][drawCount].a[1] * 1.2
		// 	: 0;

		// let curRotationc = data["acc2_d"][drawCount]
		// 	? data["acc2_i"][drawCount].a[1] * 1.2
		// 	: 0;

		// let curRotationd = data["acc2_d"][drawCount]
		// 	? data["acc2_d"][drawCount].a[1] * 1.2
		// 	: 0;

		// //3d Scene
		// //1. Acelerometro Izquierda
		// //Angulo
		// let curposition = data["acc2_i"][drawCount]
		// 	? data["acc2_i"][drawCount].a[0] * 1.2
		// 	: 0;

		// let curpositionb = data["acc2_i"][drawCount]
		// 	? data["acc2_i"][drawCount].a[1] * 1.2
		// 	: 0;

		// let curpositionc = data["acc2_i"][drawCount]
		// 	? data["acc2_i"][drawCount].a[2] * 1.2
		// 	: 0;

		// let zFactor = 0.1;
		// let zLeft = [
		// 	0.4 * curposition * zFactor,
		// 	0.8 * curposition * zFactor,
		// 	1.2 * curposition * zFactor,
		// ];
		// let zRight = [
		// 	1.6 * curposition * zFactor,
		// 	2 * curposition * zFactor,
		// 	2.4 * curposition * zFactor,
		// ];

		// let xLeftIncrement = [-30, -25, -20];
		// let xRightIncrement = [20, 25, 30];

		// scene3D.meshes.push(
		// 	addMesh(
		// 		scene3D.geometry,
		// 		scene3D.materialLeft_1,
		// 		curposition + xLeftIncrement[0],
		// 		drawCount * 0.9,
		// 		zLeft[0],
		// 		curRotation,
		// 		scene3D.scene
		// 	)
		// );

		// scene3D.meshes.push(
		// 	addMesh(
		// 		scene3D.geometry,
		// 		scene3D.materialLeft_2,
		// 		curpositionb + xLeftIncrement[1],
		// 		drawCount * 0.9,
		// 		zLeft[1],
		// 		curRotation,
		// 		scene3D.scene
		// 	)
		// );

		// scene3D.meshes.push(
		// 	addMesh(
		// 		scene3D.geometry,
		// 		scene3D.materialLeft_3,
		// 		curpositionc + xLeftIncrement[2],
		// 		drawCount * 0.9,
		// 		zLeft[2],
		// 		curRotation,
		// 		scene3D.scene
		// 	)
		// );

		// //Aceleracion
		// let curpositiond = data["acc2_i"][drawCount]
		// 	? data["acc2_i"][drawCount].g[0] * 4.2
		// 	: 0;

		// let curpositione = data["acc2_i"][drawCount]
		// 	? data["acc2_i"][drawCount].g[1] * 4.2
		// 	: 0;

		// let curpositionf = data["acc2_i"][drawCount]
		// 	? data["acc2_i"][drawCount].g[2] * 4.2
		// 	: 0;

		// //Sensor 1 / Izquierda
		// //Aceleracion

		// scene3D.meshes.push(
		// 	addMesh(
		// 		scene3D.geometryAcc,
		// 		scene3D.materialLeft_4,
		// 		curpositiond + xLeftIncrement[0],
		// 		drawCount * 0.9,
		// 		zLeft[0],
		// 		curRotationb,
		// 		scene3D.scene
		// 	)
		// );

		// scene3D.meshes.push(
		// 	addMesh(
		// 		scene3D.geometryAcc,
		// 		scene3D.materialLeft_5,
		// 		curpositione + xLeftIncrement[1],
		// 		drawCount * 0.9,
		// 		zLeft[1],
		// 		curRotationb,
		// 		scene3D.scene
		// 	)
		// );

		// scene3D.meshes.push(
		// 	addMesh(
		// 		scene3D.geometryAcc,
		// 		scene3D.materialLeft_6,
		// 		curpositionf + xLeftIncrement[2],
		// 		drawCount * 0.9,
		// 		zLeft[2],
		// 		curRotationb,
		// 		scene3D.scene
		// 	)
		// );

		// //2. Acelerometro derecha
		// //Angulo
		// let curpositiong = data["acc2_d"][drawCount]
		// 	? data["acc2_d"][drawCount].a[0] * 1.2
		// 	: 0;

		// let curpositionh = data["acc2_d"][drawCount]
		// 	? data["acc2_d"][drawCount].a[1] * 1.2
		// 	: 0;

		// let curpositioni = data["acc2_d"][drawCount]
		// 	? data["acc2_d"][drawCount].a[2] * 1.2
		// 	: 0;

		// //Sensor 2 / Derecha
		// //Aceleracion

		// //Angulo

		// scene3D_2.meshes.push(
		// 	addMesh(
		// 		scene3D_2.geometry,
		// 		scene3D_2.materialRight_1,
		// 		zRight[0],
		// 		drawCount * 0.9,
		// 		curpositiong + xRightIncrement[0],
		// 		curRotationc,
		// 		scene3D_2.scene
		// 	)
		// );

		// scene3D_2.meshes.push(
		// 	addMesh(
		// 		scene3D_2.geometry,
		// 		scene3D_2.materialRight_2,
		// 		curpositionh + xRightIncrement[1],
		// 		drawCount * 0.9,
		// 		zRight[1],
		// 		curRotationc,
		// 		scene3D_2.scene
		// 	)
		// );

		// scene3D_2.meshes.push(
		// 	addMesh(
		// 		scene3D_2.geometry,
		// 		scene3D_2.materialRight_3,
		// 		curpositioni + xRightIncrement[2],
		// 		drawCount * 0.9,
		// 		zRight[2],
		// 		curRotationc,
		// 		scene3D_2.scene
		// 	)
		// );

		// //Aceleracion
		// let curpositionj = data["acc2_d"][drawCount]
		// 	? data["acc2_d"][drawCount].g[0] * 4.2
		// 	: 0;

		// let curpositionk = data["acc2_d"][drawCount]
		// 	? data["acc2_d"][drawCount].g[1] * 4.2
		// 	: 0;

		// let curpositionl = data["acc2_d"][drawCount]
		// 	? data["acc2_d"][drawCount].g[2] * 4.2
		// 	: 0;

		// scene3D_2.meshes.push(
		// 	addMesh(
		// 		scene3D_2.geometryAcc,
		// 		scene3D_2.materialRight_4,
		// 		curpositionj + xRightIncrement[0],
		// 		drawCount * 0.9,
		// 		0.8,
		// 		curRotation,
		// 		scene3D_2.scene
		// 	)
		// );

		// scene3D_2.meshes.push(
		// 	addMesh(
		// 		scene3D_2.geometryAcc,
		// 		scene3D_2.materialRight_5,
		// 		curpositionk + xRightIncrement[1],
		// 		drawCount * 0.9,
		// 		1.2,
		// 		curRotation,
		// 		scene3D_2.scene
		// 	)
		// );

		// scene3D_2.meshes.push(
		// 	addMesh(
		// 		scene3D_2.geometryAcc,
		// 		scene3D_2.materialRight_6,
		// 		curpositionk + xRightIncrement[2],
		// 		drawCount * 0.9,
		// 		1.8,
		// 		curRotation,
		// 		scene3D_2.scene
		// 	)
		// );

		// //Angulo

		// // if (scene3D.meshes.length > 300) {
		// // 	//console.log(meshes[0], meshes.length);
		// // 	for (let i = 0; i < 4; i++) {
		// // 		scene3D.meshes[i].geometry.dispose();
		// // 		scene3D.scene.remove(scene3D.meshes[i]);
		// // 		scene3D.meshes.splice(i, 1);
		// // 	}
		// // }

		// rugScene.plane.rotation.x = curRotationc * 0.0125;
		// rugScene.plane.rotation.y = curRotationb * 0.0125;

		// rugScene.geometry.attributes.color.array[drawCount] = 1;
		// rugScene.geometry.colorNeedUpdate = true;

		// scene3D.camera.position.y =
		// 	drawCount === 0 ? 0 : scene3D.camera.position.y + CAMERA_INCREMENT;

		// scene3D.camera.rotation.y = curRotationd * 0.0005;
		// // 	scene3D.camera.rotation.y + directionX * 0.01;

		// scene3D_2.camera.position.y =
		// 	drawCount === 0 ? 0 : scene3D.camera.position.y + CAMERA_INCREMENT;

		// scene3D_2.camera.rotation.y = curRotationd * 0.0005;
		// 	scene3D.camera.rotation.y + directionX * 0.01;

		//console.log(drawCount);
		//console.log(scene3D);
		if (data["acc2_d"]) {
			let squares = canvasSquares2D(
				drawCount,
				data["acc2_d"][drawCount].a[1],
				MAX_POINTS,
				canvasrug,
				canvasWidth,
				canvasHeight
			);
		}
		renderSceneInfo(sceneLineLeft);
		renderSceneInfo(sceneLineRight);
		renderSceneInfo(scene3D);
		//renderSceneInfo(scene3D_2);
		//renderSceneInfo(rugScene);
		//scene3D.controls.update();

		window.addEventListener("resize", renderer);
	}

	renderer.setClearColor(0xffffff, 1);
	requestAnimationFrame(animate);
}

export { main };
