import * as THREE from "three";
import { BufferGeometryUtils } from "../node_modules/three/examples/jsm/utils/BufferGeometryUtils.js";
import { OrbitControls } from "../node_modules/three/examples/jsm/controls/OrbitControls.js";
import {
	makeMesh,
	addMesh,
	addMeshHorizontal,
	combinedDirectionalMesh,
} from "./geometries.js";
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
	let imgkeys = TRIPTICO_PICKED_IMAGES_RESIZED;
	let imgEls = [];
	console.log(imgkeys);
	for (let i = 0; i < imgkeys.length; i++) {
		console.log("run once");
		let img = document.createElement("img");
		img.setAttribute("src", imgkeys[i]);
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
			position: [3, 0, 30],
			rotation: [1, 0, 0],
		};

		const lightProps = {
			color: 0xef9c29,
			intensity: 0.1,
			position: [0, 1, -2],
		};

		const sceneInfo = makeScene(canvasEl, camProps, lightProps);
		// const axisHelper = new THREE.AxesHelper(5);
		// sceneInfo.scene.add(axisHelper);

		sceneInfo.scene.background = new THREE.Color(colors_night.black);

		sceneInfo.geometryAcc = new THREE.PlaneGeometry(0.6, 2, 1);
		sceneInfo.meshes = [];
		sceneInfo.geometries = {};
		sceneInfo.geometries.vertical = [];
		sceneInfo.geometries.horizontal = [];
		sceneInfo.meshes.horizontal = [];
		sceneInfo.meshes.vertical = [];

		// 1. Vertical section

		/* Data
				
				Vertical: 

				Acelerometro Izquierda
					Aceleración (3 numeros)
					Angulo (3 numeros)
				
				Le paso:
					Hue
					Positionsfactor
					Cylindersize
				


				Horizontal:

				Acelerometro Derecha
					Aceleracion (3 numeros)
					Angulo (3 numeros)

		*/

		let horizontalProps = {
			sceneInfo: sceneInfo,
			maxpoints: MAX_POINTS,
			data: data["acc2_d"],
			dataZone: "a",
			//hue: Primeros dos numeros rango y tercer numero multiplicador por data
			hue: [0.3, 0.33, 0.1],
			//positionsFactor: primer numero x multiplicador por data, z position z, y: dependiendo de si es vertical u horizontal se usan como multiplicadores o como posicionadores
			positionsFactor: { x: 0.2, y: 0.2, z: 1 },
			yIncrement: 10,
			//geoProps: propiedades geometria cilindro radius top, radius bottom, height, segments
			geoProps: [0.4, 0.3, 16, 12],
			direction: "horizontal",
		};

		let horizontalMesh = combinedDirectionalMesh(horizontalProps);

		let secondHorizontalProps = {
			sceneInfo: sceneInfo,
			maxpoints: MAX_POINTS,
			data: data["acc2_d"],
			dataZone: "g",
			//hue: Primeros dos numeros rango y tercer numero multiplicador por data
			hue: [0.3, 0.39, 0.1],
			//positionsFactor: primer numero x multiplicador por data, z position z, y: dependiendo de si es vertical u horizontal se usan como multiplicadores o como posicionadores
			positionsFactor: { x: 2.5, y: 6.4, z: -1 },
			yIncrement: 10,
			//geoProps: propiedades geometria cilindro radius top, radius bottom, height, segments
			geoProps: [0.3, 0.3, 12, 4],
			direction: "horizontal",
		};

		let secondHorizontalMesh = combinedDirectionalMesh(
			secondHorizontalProps
		);

		let verticalProps = {
			sceneInfo: sceneInfo,
			maxpoints: MAX_POINTS,
			data: data["acc2_i"],
			dataZone: "g",
			//hue: Primeros dos numeros rango y tercer numero multiplicador por data
			hue: [0.6, 0.65, 0.1],
			//positionsFactor: primer numero x multiplicador por data, z position z
			positionsFactor: { x: 6.3, y: 2, z: -1 },
			//geoProps: propiedades geometria cilindro radius top, radius bottom, height, segments
			yIncrement: 0,
			geoProps: [0.4, 0.3, 10, 4],
			direction: "vertical",
		};

		let verticalMesh = combinedDirectionalMesh(verticalProps);

		let secondVerticalProps = {
			sceneInfo: sceneInfo,
			maxpoints: MAX_POINTS,
			data: data["acc2_i"],
			dataZone: "g",
			//hue: Primeros dos numeros rango y tercer numero multiplicador por data
			hue: [0.7, 0.82, 0.4],
			//positionsFactor: primer numero x multiplicador por data, z position z
			positionsFactor: { x: 14.3, y: 1, z: 1 },
			//geoProps: propiedades geometria cilindro radius top, radius bottom, height, segments
			yIncrement: 0,
			geoProps: [0.6, 0.5, 15, 12],
			direction: "vertical",
		};

		let secondVerticalMesh = combinedDirectionalMesh(secondVerticalProps);

		//console.log(sceneInfo.geometries);

		//const material = new THREE.MeshBasicMaterial({ vertexColors: true });
		console.log(sceneInfo);
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

	const controls = new OrbitControls(
		scene3D.camera,
		document.querySelector("#threeDcanvases")
	);
	//controls.listenToKeyEvents(window); // optional
	controls.update();
	console.log(controls);
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

		updateImages(keyzone, drawCount, imgEls.length, MAX_POINTS);

		if (drawCount % MAX_POINTS === 0) {
			for (let m = 0; m < scene3D.meshes["horizontal"].length; m++) {
				scene3D.meshes["horizontal"][m].position.x = 0;
				scene3D.meshes["vertical"][m].position.y = 0;
			}
		}

		for (let m = 0; m < scene3D.meshes["horizontal"].length; m++) {
			scene3D.meshes["horizontal"][m].position.x -= 0.2;
			scene3D.meshes["vertical"][m].position.y -= 0.2;
			scene3D.meshes["horizontal"][m].rotation.x +=
				data["acc2_d"][drawCount].a[0] * 0.01;
			scene3D.meshes["vertical"][m].rotation.y +=
				data["acc2_i"][drawCount].a[0] * 0.01;
		}

		// if (drawCount % MAX_POINTS === 0) {
		// 	scene3D.meshes["vertical"].position.y = 0;
		// 	scene3D.meshes["horizontal"].position.x = 0;
		// }

		// scene3D.meshes["vertical"].position.y -= 0.2;
		// scene3D.meshes["horizontal"].rotation.y =
		// 	data["acc2_d"][drawCount].g[2] * 0.02;
		// scene3D.meshes["vertical"].rotation.x =
		// 	data["acc2_d"][drawCount].g[2] * 0.03;
		// scene3D.meshes["horizontal"].position.x -= 0.2;

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

		controls.update();

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
