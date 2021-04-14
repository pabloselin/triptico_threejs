import * as THREE from "three";
// Tres escenas
function main(data) {
	const canvas = document.querySelector("#triptico_canvas");
	const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
	const sceneElements = [];
	const clock = new THREE.Clock();
	const MAX_POINTS = 3000;

	function makeScene(elem) {
		const scene = new THREE.Scene();
		const fov = 45;
		const near = 0.1;
		const far = 5;
		const aspect = 2; // the canvas default

		const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
		camera.position.set(0, 1, 2);
		camera.lookAt(0, 0, 0);
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
		const sceneInfo = makeScene(
			document.querySelector("#triptico_canvas_left")
		);

		const geometry = new THREE.BufferGeometry();
		const positions = new Float32Array(MAX_POINTS * 3);
		geometry.setAttribute(
			"position",
			new THREE.BufferAttribute(positions, 3)
		);

		const drawCount = 2;
		geometry.setDrawRange(0, drawCount);
		const material = new THREE.LineBasicMaterial({ color: 0xff0000 });

		const line = new THREE.Line(geometry, material);
		sceneInfo.scene.add(line);
		sceneInfo.line = line;

		// const geometry = new THREE.BoxGeometry(1, 1, 1);
		// const material = new THREE.MeshPhongMaterial({ color: "red" });
		// const mesh = new THREE.Mesh(geometry, material);
		// sceneInfo.scene.add(mesh);
		// sceneInfo.mesh = mesh;

		console.log(sceneInfo);
		return sceneInfo;
	}

	function setupRightScene() {
		const sceneInfo = makeScene(
			document.querySelector("#triptico_canvas_right")
		);
		const geometry = new THREE.BoxGeometry(1, 1, 1);
		const material = new THREE.MeshPhongMaterial({ color: "green" });
		const mesh = new THREE.Mesh(geometry, material);
		sceneInfo.scene.add(mesh);
		sceneInfo.mesh = mesh;
		return sceneInfo;
	}

	function setupRugScene() {}

	function updatePositions(line, sensor) {
		const positions = line.geometry.attributes.position.array;
		let x, y, z, index;

		for (let i = 0, l = MAX_POINTS; i < l; i++) {
			positions[index++] = x;
			positions[index++] = y;
			positions[index++] = z;

			x += data[sensor][i]["a"][0];
			y += data[sensor][i]["a"][1];
			z += data[sensor][i]["a"][2];
		}

		console.log(positions);
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

	function render(time) {
		time *= 0.001;
		//get data status
		//console.log(data.csv2_d !== undefined);

		let delta = clock.getDelta();
		let second = parseInt(clock.elapsedTime);

		resizeRendererToDisplaySize(renderer);

		renderer.setScissorTest(false);
		renderer.clear(true, true);
		renderer.setScissorTest(true);

		renderSceneInfo(sceneLeft);
		renderSceneInfo(sceneRight);

		console.log("update line", sceneLeft.line);

		drawCount = (drawCount + 1) % MAX_POINTS;
		sceneLeft.line.geometry.setDrawRange(0, drawCount);

		if (drawCount === 0) {
			updatePositions(sceneLeft.line, "csv2_d");
			sceneLeft.line.geometry.attributes.position.needsUpdate = true;
			sceneLeft.line.material.color.setHSL(Math.random(), 1, 0.5);
		}

		window.addEventListener("resize", renderer);
		requestAnimationFrame(render);
	}

	renderer.setClearColor(0x000000, 1);

	requestAnimationFrame(render);
}

export { main };
