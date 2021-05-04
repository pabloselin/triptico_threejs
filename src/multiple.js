import * as THREE from "three";
import { makeMesh, addMesh } from "./geometries.js";
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

// Tres escenas
function main(data) {
	const canvas = document.querySelector("#triptico_canvas");
	const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
	const sceneElements = [];
	const clock = new THREE.Clock();
	const MAX_POINTS = data.acc2_i.length;
	let drawCount = 0;
	let drawCount_right = 0;
	let mouseX = 0;
	let mouseY = 0;
	let directionX = 1;
	const infoZonesLeft = document.getElementById("infozones_left");
	const infoZonesRight = document.getElementById("infozones_right");
	const imageElement = document.getElementById("image_performance");
	document.onmousemove = handleMouseMove;

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

	function setupRugScene() {
		const camProps = {
			fov: 100,
			aspect: window.innerWidth / window.innerHeight,
			near: 0.1,
			far: 60,
			position: [3, 3, 3],
			rotation: [0, 0, 0],
		};
		const lightProps = {
			color: 0xffffff,
			intensity: 1,
			position: [-1, 2, 4],
		};
		const sceneInfo = makeScene(
			document.querySelector("#triptico_canvas_rug_right"),
			camProps,
			lightProps
		);
		const geometry = new THREE.BufferGeometry();
		//const axesHelper = new THREE.AxesHelper(5);
		let planePoints = parseInt(Math.sqrt(MAX_POINTS));

		sceneInfo.scene.background = new THREE.Color(colors_morning.purple);

		const indices = [];
		const vertices = [];
		const normals = [];
		const colors = [];

		const size = 20;
		const segments = planePoints;
		const halfSize = size / 2;
		const segmentSize = size / segments;

		for (let i = 0; i <= segments; i++) {
			const y = i * segmentSize - halfSize;

			for (let j = 0; j <= segments; j++) {
				const x = j * segmentSize - halfSize;
				vertices.push(x, -y, 0);
				normals.push(0, 0, 1);

				const r = data["acc2_d"][i] ? data["acc2_d"][i].a[0] * 1.2 : 0;
				//const r = x / size + 0.5;
				const g = data["acc2_d"][i] ? data["acc2_d"][i].a[1] * 1.2 : 0;

				const b = data["acc2_d"][i] ? data["acc2_d"][i].a[2] * 1.2 : 0;
				//const g = y / size + 0.5;
				//const g = 0;

				colors.push(r, g, b);
			}
		}

		for (let i = 0; i < segments; i++) {
			for (let j = 0; j < segments; j++) {
				const a = i * (segments + 1) + (j + 1);
				const b = i * (segments + 1) + j;
				const c = (i + 1) * (segments + 1) + j;
				const d = (i + 1) * (segments + 1) + (j + 1);

				// generate two faces (triangles) per iteration

				indices.push(a, b, d); // face one
				indices.push(b, c, d); // face two
			}
		}

		geometry.setIndex(indices);
		geometry.setAttribute(
			"position",
			new THREE.Float32BufferAttribute(vertices, 3)
		);
		geometry.setAttribute(
			"normal",
			new THREE.Float32BufferAttribute(normals, 3)
		);
		geometry.setAttribute(
			"color",
			new THREE.Float32BufferAttribute(colors, 3)
		);

		const material = new THREE.MeshPhongMaterial({
			side: THREE.DoubleSide,
			vertexColors: true,
		});

		sceneInfo.plane = new THREE.Mesh(geometry, material);
		sceneInfo.scene.add(sceneInfo.plane);

		//sceneInfo.scene.add(plane);
		//sceneInfo.scene.add(axesHelper);

		return sceneInfo;
	}

	function setup3dScene() {
		const canvasEl = document.querySelector("#triptico_canvas_3d");
		const camProps = {
			fov: 155,
			aspect: 2,
			near: 0.1,
			far: 10000,
			position: [3, 0, 12],
			rotation: [0, 0, 0],
		};
		const lightProps = {
			color: 0xffffff,
			intensity: 1,
			position: [-1, 2, -2],
		};
		const sceneInfo = makeScene(canvasEl, camProps, lightProps);
		// sceneInfo.controls = new THREE.OrbitControls(
		// 	sceneInfo.camera,
		// 	renderer.domElement
		// );

		// sceneInfo.controls.enableDamping = true;
		// sceneInfo.controls.dampingFactor = 0.25;
		// sceneInfo.controls.enableZoom = true;
		// sceneInfo.controls.autoRotate = true;

		sceneInfo.materialGreen = new THREE.MeshPhongMaterial({
			color: colors.line_3,
			side: THREE.DoubleSide,
		});

		sceneInfo.materialRed = new THREE.MeshPhongMaterial({
			color: colors.line_4,
			side: THREE.DoubleSide,
		});

		sceneInfo.materialBlue = new THREE.MeshPhongMaterial({
			color: colors.line_1,
			side: THREE.DoubleSide,
		});

		sceneInfo.materialYellow = new THREE.MeshPhongMaterial({
			color: colors.line_2,
			side: THREE.DoubleSide,
		});

		sceneInfo.scene.background = new THREE.Color(colors_night.darkgreen);

		sceneInfo.geometry = new THREE.PlaneGeometry(10, 1.2, 1);
		//sceneInfo.scene.add(plane);
		//sceneInfo.plane = plane;
		sceneInfo.meshes = [];

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
	const scene3D = setup3dScene();
	const rugScene = setupRugScene();

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

		renderer.render(scene, camera);
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

		sceneLineLeft.line_1.rotation.x = time * 0.04;
		sceneLineRight.line_1.rotation.x = time * 0.04;
		//sceneLineLeft.camera.position.x += 1;
		//sceneLineLeft.camera.position.y += 1;

		updatePositions(sceneLineLeft.line_1, data["acc2_d"], MAX_POINTS);
		sceneLineLeft.line_1.geometry.setDrawRange(0, drawCount);
		sceneLineLeft.line_1.geometry.attributes.position.needsUpdate = true;
		//sceneLineLeft.line_1.material.color.setHSL(Math.random(), 1, 0.5);

		updatePositions(sceneLineRight.line_1, data["acc2_i"], MAX_POINTS);
		sceneLineLeft.line_1.geometry.setDrawRange(0, drawCount);
		sceneLineRight.line_1.geometry.attributes.position.needsUpdate = true;
		//sceneLineRight.line_1.material.color.setHSL(Math.random(), 1, 0.5);

		updateHTMLInfo(data["acc2_i"], infoZonesLeft, drawCount);
		updateHTMLInfo(data["acc2_d"], infoZonesRight, drawCount);
		updateImages(
			imageElement,
			TRIPTICO.img,
			drawCount,
			TRIPTICO_URLS.img,
			MAX_POINTS
		);

		//3d Scene
		let curposition = data["acc2_d"][drawCount]
			? data["acc2_d"][drawCount].a[0] * 1.2
			: 0;

		let curpositionb = data["acc2_i"][drawCount]
			? data["acc2_i"][drawCount].g[0] * 1.2
			: 0;

		let curpositionc = data["acc2_i"][drawCount]
			? data["acc2_i"][drawCount].g[1] * 1.2
			: 0;

		let curpositiond = data["acc2_d"][drawCount]
			? data["acc2_d"][drawCount].a[1] * 1.2
			: 0;

		let curRotation = data["acc2_d"][drawCount]
			? data["acc2_d"][drawCount].g[2] * 1.2
			: 0;

		let curRotationb = data["acc2_i"][drawCount]
			? data["acc2_i"][drawCount].a[1] * 1.2
			: 0;

		let curRotationc = data["acc2_i"][drawCount]
			? data["acc2_i"][drawCount].a[0] * 1.2
			: 0;

		let curRotationd = data["acc2_d"][drawCount]
			? data["acc2_d"][drawCount].a[1] * 1.2
			: 0;

		scene3D.meshes.push(
			addMesh(
				scene3D.geometry,
				scene3D.materialGreen,
				drawCount * 0.9,
				curposition,
				0.4,
				curRotation,
				scene3D.scene
			)
		);

		scene3D.meshes.push(
			addMesh(
				scene3D.geometry,
				scene3D.materialRed,
				drawCount * 0.9,
				curpositionb,
				curRotationb,
				0.8,
				scene3D.scene
			)
		);

		scene3D.meshes.push(
			addMesh(
				scene3D.geometry,
				scene3D.materialBlue,
				drawCount * 0.9,
				curpositionc,
				curRotationc,
				1.2,
				scene3D.scene
			)
		);

		scene3D.meshes.push(
			addMesh(
				scene3D.geometry,
				scene3D.materialYellow,
				drawCount * 0.9,
				curpositiond,
				curRotationd,
				1.6,
				scene3D.scene
			)
		);

		if (scene3D.meshes.length > 300) {
			//console.log(meshes[0], meshes.length);
			for (let i = 0; i < 4; i++) {
				scene3D.meshes[i].geometry.dispose();
				scene3D.scene.remove(scene3D.meshes[i]);
				scene3D.meshes.splice(i, 1);
			}
		}

		rugScene.plane.rotation.x = curRotationc * 0.0025;
		rugScene.plane.rotation.y = curRotationb * 0.0005;

		//scene3D.scene.add(curmesh);

		scene3D.camera.position.x =
			drawCount === 0 ? 0 : scene3D.camera.position.x + 0.9;

		scene3D.camera.rotation.y = curRotationd * 0.015;
		// 	scene3D.camera.rotation.y + directionX * 0.01;

		//console.log(drawCount);
		//console.log(scene3D);
		renderSceneInfo(sceneLineLeft);
		renderSceneInfo(sceneLineRight);
		renderSceneInfo(scene3D);
		renderSceneInfo(rugScene);

		window.addEventListener("resize", renderer);
	}

	renderer.setClearColor(colors_morning.yellow, 1);

	requestAnimationFrame(animate);
}

export { main };
