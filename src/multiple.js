import * as THREE from "three";
import { makeMesh, addMesh } from "./geometries.js";
import { colors, colors_morning } from "./colors.js";

// Tres escenas
function main(data) {
	const canvas = document.querySelector("#triptico_canvas");
	const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
	const sceneElements = [];
	const clock = new THREE.Clock();
	const MAX_POINTS = 2400;
	let drawCount;
	let drawCount_right;
	//console.log(data);

	function makeScene(elem, camProps) {
		const scene = new THREE.Scene();
		// const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
		// camera.position.set(0, 1, 2);

		const camera = new THREE.PerspectiveCamera(
			camProps.fov,
			camProps.aspect,
			camProps.near,
			camProps.far
		);
		camera.position.set(
			camProps.position[0],
			camProps.position[1],
			camProps.position[2]
		);
		//camera.lookAt(0, 0, 0);
		scene.add(camera);
		//const axesHelper = new THREE.AxesHelper(5);
		//scene.add(axesHelper);

		//Lights
		{
			const color = 0xffffff;
			const intensity = 1;
			const light = new THREE.DirectionalLight(color, intensity);
			light.position.set(-1, 2, 4);
			camera.add(light);
		}

		return { scene, camera, elem };
	}

	function setupLeftScene() {
		const canvasEl = document.querySelector("#triptico_canvas_left");
		const canvasDimensions = canvasEl.getBoundingClientRect();
		const camProps = {
			fov: 45,
			aspect: canvasDimensions.height / canvasDimensions.width,
			near: 1,
			far: 10000,
			position: [0, 0, 1000],
		};
		const sceneInfo = makeScene(canvasEl, camProps);

		const geometry = new THREE.BufferGeometry();
		const positions = new Float32Array(MAX_POINTS * 3);
		geometry.setAttribute(
			"position",
			new THREE.BufferAttribute(positions, 3)
		);
		drawCount = 2;
		geometry.setDrawRange(0, drawCount);
		const material = new THREE.LineBasicMaterial({ color: colors.line_1 });

		const line_acc2_d = new THREE.Line(geometry, material);
		const line_acc2_i = new THREE.Line(geometry, material);
		sceneInfo.scene.add(line_acc2_d);
		sceneInfo.scene.add(line_acc2_i);
		sceneInfo.line_1 = line_acc2_d;
		sceneInfo.line_2 = line_acc2_i;

		updatePositions(sceneInfo.line_1, data["acc2_d"]);
		updatePositions(sceneInfo.line_2, data["acc2_i"]);

		// const geometry = new THREE.BoxGeometry(1, 1, 1);
		// const material = new THREE.MeshPhongMaterial({ color: "red" });
		// const mesh = new THREE.Mesh(geometry, material);
		// sceneInfo.scene.add(mesh);
		// sceneInfo.mesh = mesh;
		return sceneInfo;
	}

	function setupRightScene() {
		const camProps = {
			fov: 45,
			aspect: window.innerWidth / window.innerHeight,
			near: 1,
			far: 10000,
			position: [0, 0, 1000],
		};
		const sceneInfo = makeScene(
			document.querySelector("#triptico_canvas_right"),
			camProps
		);
		const geometry = new THREE.BufferGeometry();
		const positions = new Float32Array(MAX_POINTS * 3);
		geometry.setAttribute(
			"position",
			new THREE.BufferAttribute(positions, 3)
		);
		drawCount_right = 2;
		geometry.setDrawRange(0, drawCount_right);
		const material = new THREE.LineBasicMaterial({ color: colors.line_3 });

		const line_acc2_d = new THREE.Line(geometry, material);
		const line_acc2_i = new THREE.Line(geometry, material);
		sceneInfo.scene.add(line_acc2_d);
		sceneInfo.scene.add(line_acc2_i);
		sceneInfo.line_1 = line_acc2_d;
		sceneInfo.line_2 = line_acc2_i;

		updatePositions(sceneInfo.line_1, data["acc2_d"]);
		updatePositions(sceneInfo.line_2, data["acc2_d"]);

		// const geometry = new THREE.BoxGeometry(1, 1, 1);
		// const material = new THREE.MeshPhongMaterial({ color: "red" });
		// const mesh = new THREE.Mesh(geometry, material);
		// sceneInfo.scene.add(mesh);
		// sceneInfo.mesh = mesh;
		return sceneInfo;
	}

	function setupRugScene() {
		const camProps = {
			fov: 155,
			aspect: window.innerWidth / window.innerHeight,
			near: 0.1,
			far: 60,
			position: [3, 3, 0],
		};
		const sceneInfo = makeScene(
			document.querySelector("#triptico_canvas_right"),
			camProps
		);
		const geometry = new THREE.BufferGeometry();
		const axesHelper = new THREE.AxesHelper(5);

		sceneInfo.scene.add(axesHelper);

		return sceneInfo;
	}

	function setup3dScene() {
		const canvasEl = document.querySelector("#triptico_canvas_3d");
		const camProps = {
			fov: 45,
			aspect: window.innerWidth / window.innerHeight,
			near: 1,
			far: 1000,
			position: [0, 0, 1000],
		};
		const sceneInfo = makeScene(canvasEl, camProps);

		const axesHelper = new THREE.AxesHelper(5);

		sceneInfo.scene.add(axesHelper);

		const cubeMaterialRed = new THREE.MeshPhongMaterial({
			color: colors.line_1,
			side: THREE.DoubleSide,
		});
		// const cubeMaterialGreen = new THREE.MeshPhongMaterial({
		// 	color: colors.line_2,
		// });
		// const cubeMaterialBlue = new THREE.MeshPhongMaterial({
		// 	color: colors.line_3,
		// });
		// const cubeMaterialYellow = new THREE.MeshPhongMaterial({
		// 	color: colors.line_4,
		// });
		// //const geometry = new THREE.BufferGeometry();
		const geometry = new THREE.PlaneGeometry(10, 10, 1);
		const plane = new THREE.Mesh(geometry, cubeMaterialRed);
		sceneInfo.scene.add(plane);
		sceneInfo.plane = plane;
		sceneInfo.material = cubeMaterialRed;
		sceneInfo.meshes = [];

		return sceneInfo;
	}

	function updatePositions(line, data) {
		const positions = line.geometry.attributes.position.array;
		let x, y, z, index;
		x = y = z = index = 0;
		//console.log(data);
		if (data !== undefined) {
			for (let i = 0, l = MAX_POINTS; i < l; i++) {
				if (data[i] !== undefined) {
					positions[index++] = x;
					positions[index++] = y;
					positions[index++] = z;

					// x += (Math.random() - 0.5) * 30;
					// y += (Math.random() - 0.5) * 30;
					// z += (Math.random() - 0.5) * 30;
					x += data[i]["a"][0];
					y += data[i]["a"][1];
					z += data[i]["a"][2];
				}
			}
		}
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

	const sceneLeft = setupLeftScene();
	const sceneRight = setupRightScene();
	const scene3D = setup3dScene();
	const rugScene = setupRugScene();

	//console.log(sceneLeft, scene3D);

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
		requestAnimationFrame(animate);
		drawCount = (drawCount + 1) % MAX_POINTS;
		drawCount_right = (drawCount + 1) % MAX_POINTS;

		resizeRendererToDisplaySize(renderer);

		renderer.setScissorTest(false);
		renderer.clear(true, true);
		renderer.setScissorTest(true);

		renderSceneInfo(sceneLeft);
		renderSceneInfo(sceneRight);
		renderSceneInfo(scene3D);
		//renderSceneInfo(rugScene);

		sceneLeft.line_1.geometry.setDrawRange(0, drawCount);
		sceneRight.line_1.geometry.setDrawRange(0, drawCount_right);

		//sceneLeft.camera.position.x += 1;
		//sceneLeft.camera.position.y += 1;

		if (drawCount === 0) {
			console.log("updating line left");
			updatePositions(sceneLeft.line_1, data["acc2_d"]);
			sceneLeft.line_1.geometry.attributes.position.needsUpdate = true;
			//sceneLeft.line_1.material.color.setHSL(Math.random(), 1, 0.5);
		}

		if (drawCount_right === 0) {
			console.log("updating line right");
			updatePositions(sceneRight.line_1, data["acc2_i"]);
			sceneRight.line_1.geometry.attributes.position.needsUpdate = true;
			//sceneRight.line_1.material.color.setHSL(Math.random(), 1, 0.5);
		}

		//3d Scene
		scene3D.meshes.push(
			addMesh(scene3D.plane, 0, 1, drawCount + 10, scene3D.scene)
		);
		//console.log(drawCount);
		//console.log(scene3D);

		window.addEventListener("resize", renderer);
	}

	renderer.setClearColor(colors_morning.line_1, 1);

	requestAnimationFrame(animate);
}

export { main };
