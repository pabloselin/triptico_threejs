import * as THREE from "three";
// Tres escenas
function main(data) {
	const canvas = document.querySelector("#triptico_canvas");
	const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
	const sceneElements = [];
	const clock = new THREE.Clock();
	const MAX_POINTS = 3000;
	let drawCount;
	let drawCount_right;
	console.log(data);
	function makeScene(elem) {
		const scene = new THREE.Scene();
		const fov = 45;
		const near = 0.1;
		const far = 5;
		const aspect = 2; // the canvas default

		// const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
		// camera.position.set(0, 1, 2);

		const camera = new THREE.PerspectiveCamera(
			45,
			window.innerWidth / window.innerHeight,
			1,
			10000
		);
		camera.position.set(0, 0, 1000);
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
		const sceneInfo = makeScene(
			document.querySelector("#triptico_canvas_left")
		);

		const geometry = new THREE.BufferGeometry();
		const positions = new Float32Array(MAX_POINTS * 3);
		geometry.setAttribute(
			"position",
			new THREE.BufferAttribute(positions, 3)
		);
		drawCount = 2;
		geometry.setDrawRange(0, drawCount);
		const material = new THREE.LineBasicMaterial({ color: 0xff0000 });

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
		const sceneInfo = makeScene(
			document.querySelector("#triptico_canvas_right")
		);
		const geometry = new THREE.BufferGeometry();
		const positions = new Float32Array(MAX_POINTS * 3);
		geometry.setAttribute(
			"position",
			new THREE.BufferAttribute(positions, 3)
		);
		drawCount_right = 2;
		geometry.setDrawRange(0, drawCount_right);
		const material = new THREE.LineBasicMaterial({ color: 0xff0000 });

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

	function setupRugScene() {}

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

		sceneLeft.line_1.geometry.setDrawRange(0, drawCount);
		sceneRight.line_1.geometry.setDrawRange(0, drawCount_right);

		if (drawCount === 0) {
			console.log("updating line");
			updatePositions(sceneLeft.line_1, data["acc2_d"]);
			sceneLeft.line_1.geometry.attributes.position.needsUpdate = true;
			sceneLeft.line_1.material.color.setHSL(Math.random(), 1, 0.5);
		}

		if (drawCount_right === 0) {
			console.log("updating line");
			updatePositions(sceneRight.line_1, data["acc2_i"]);
			sceneRight.line_1.geometry.attributes.position.needsUpdate = true;
			sceneRight.line_1.material.color.setHSL(Math.random(), 1, 0.5);
		}

		//console.log(drawCount);

		window.addEventListener("resize", renderer);
	}

	renderer.setClearColor(0x000000, 1);

	requestAnimationFrame(animate);
}

export { main };
