import * as THREE from "three";
import { makeColor, makeBorder, returnSomething, createHTML } from "./utils.js";
import {
	startAnimationWithCSV,
	startAnimationWithMultipleCSV,
	joinData,
	processData,
} from "./datautils.js";

let isPaused = false;

window.onload = function () {
	//HTML things
	const divInfo = document.getElementById("info");
	const divDebug = document.getElementById("debug");
	const perfImg = document.getElementById("perfImg");
	const imagesContainer = document.getElementById("performanceImages");
	const largePerfImage = document.getElementById("perfLarge");
	const pausePerf = document.getElementById("perfpause");
	const availableSensors = TRIPTICO_SENSORS;

	pausePerf.addEventListener("click", function () {
		console.log("pausing");
		isPaused = true;
		console.log(isPaused);
	});

	let startPerfo = document.getElementById("perfstart");
	let titleperf = document.getElementById("titleperf");

	let accData = { a: [0, 0, 0], g: [0, 0, 0], m: [0, 0, 0], b: 0 };

	let rawData;
	let cleanData = [];
	let textContent = "";

	startPerfo.addEventListener("click", (event) => {
		console.log("start");
		cleanData = startAnimationWithMultipleCSV(TRIPTICO.acc_d, imgfiles);
		console.log(
			cleanData.then((data) => {
				console.log(data);
				main(data, imgfiles, isPaused);
			})
		);
	});

	//esto se localizar√° luego con el wordpress
	//const dataSample = "./data/" + dataFile;

	const main = (csvData, imgs, isPaused) => {
		const canvas = document.querySelector("#triptico");
		const renderer = new THREE.WebGLRenderer({ canvas });
		renderer.dispose();
		const clock = new THREE.Clock();
		const fov = 155;
		const aspect = 2; // the canvas default
		const near = 0.1;
		const far = 60;

		const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
		camera.position.x = 3;
		camera.position.z = 3;
		camera.rotation.y = 0;
		camera.rotation.x = 0;

		// const controls = new OrbitControls(camera, canvas);
		// controls.target.set(0, 0, 0);
		// controls.update();

		const scene = new THREE.Scene();
		const axesHelper = new THREE.AxesHelper(5);
		scene.add(axesHelper);

		//Light stuff
		{
			const color = 0xffffff;
			const intensity = 1;
			const light = new THREE.DirectionalLight(color, intensity);
			light.position.set(-1, 2, 4);
			scene.add(light);
		}

		const resourcesUrl = "img/";
		const cubeMaterialRed = new THREE.MeshPhongMaterial({
			color: 0x0099cc,
		});
		const cubeMaterialGreen = new THREE.MeshPhongMaterial({
			color: 0xffffe6,
		});
		const cubeMaterialBlue = new THREE.MeshPhongMaterial({
			color: 0x00b33c,
		});
		const cubeMaterialYellow = new THREE.MeshPhongMaterial({
			color: 0xcc0000,
		});

		const boxWidth = 0.3;
		const boxHeight = 0.3;
		const boxDepth = 0.3;

		const cubegeometry = new THREE.BoxGeometry(
			boxWidth,
			boxHeight,
			boxDepth
		);

		//const geometry = new THREE.TorusKnotGeometry(0.2, 0.1, 70, 10);
		const geometry = new THREE.PlaneGeometry(1, 0.2, 1);

		const makeInstance = (geometry, material, x, y, z) => {
			const cube = new THREE.Mesh(geometry, material);
			scene.add(cube);

			cube.position.x = x;
			cube.position.y = y;
			cube.position.z = z;
			cube.rotation.x = 0;
			cube.rotation.y = 0;
			cube.rotation.z = 0;

			return cube;
		};

		let cubes = [];

		let multiplier = 13;
		let zmultiplier = 0.8;

		const resizeRendererToDisplaySize = (renderer) => {
			const canvas = renderer.domElement;
			const width = canvas.clientWidth;
			const height = canvas.clientHeight;
			const needResize =
				canvas.width !== width || canvas.height !== height;
			if (needResize) {
				renderer.setSize(width, height, false);
			}
			return needResize;
		};

		//get CSV Data;

		//getCSV(dataSample);

		const setQuaternionFromDataRow = (key) => {
			let angle = [0, 0, 0];
			const tmpQuaternion = new THREE.Quaternion();

			if (csvData.length > 0) {
				angle = [
					csvData[key].a[0],
					csvData[key].a[1],
					csvData[key].a[2],
				];
			}
			//console.log(angle);
			let eulerAngle = new THREE.Euler();
			eulerAngle.fromArray(angle);
			tmpQuaternion.setFromEuler(eulerAngle);

			const vector = new THREE.Vector3(1, 0, 0);
			vector.applyQuaternion(tmpQuaternion);
			tmpQuaternion.normalize();
			//console.log(angle);
			return tmpQuaternion;
		};

		let keyIndicator = 0;
		let prevSecond = 0;
		let cameraDirection = -1;
		let upperLimit = 0;
		let lowerLimit = 0;
		let meshes = [];

		const animate = () => {
			if (isPaused === true) return;

			requestAnimationFrame(animate);
			//console.log(isPaused);
			let delta = clock.getDelta();
			let time = delta * 1;
			let second = parseInt(clock.elapsedTime);

			let tmpKey = keyIndicator % (csvData.length - 1);

			//divInfo.textContent = tmpKey;

			if (tmpKey === 0 || tmpKey % 4000 === 0) {
				//textContent = "";
				divInfo.innerHTML = "";
				divDebug.innerHTML = "";
				imagesContainer.innerHTML = "";
			} else {
				//textContent += " " + keyIndicator;
				let dataDot = document.createElement("i");
				//dataDot.textContent = tmpKey;
				let curColor = makeColor(csvData[tmpKey].g, 2);
				dataDot.style.backgroundColor = curColor;
				divInfo.append(dataDot);
				divDebug.innerHTML = `<p class="accel" style="background-color: ${curColor}"> g / aceleraci√≥n: ${csvData[
					tmpKey
				].g[0].toFixed(2)} | ${csvData[tmpKey].g[1].toFixed(
					2
				)} | ${csvData[tmpKey].g[2].toFixed(2)} </p> a / angulo: 
			<span class="x">${csvData[tmpKey].a[0].toFixed(2)}</span>
			<span class="y">${csvData[tmpKey].a[1].toFixed(2)}</span>
			<span class="z">${csvData[tmpKey].a[2].toFixed(2)}</span>
			<i>${tmpKey}</i>`;

				let tmpimg = document.createElement("img");
				let srcUrl =
					"tripticoEdge/RPiCAM/" + imgs[tmpKey % imgs.length];
				tmpimg.setAttribute("src", srcUrl);
				largePerfImage.setAttribute("src", srcUrl);

				performanceImages.appendChild(tmpimg);

				//cubeMaterial.color.set(makeColor(csvData[tmpKey].g, 1.2));

				meshes.push(
					makeInstance(
						geometry,
						cubeMaterialRed,
						tmpKey * 0.5,
						csvData[tmpKey].a[0] * 12,
						0.4
					)
				);

				meshes.push(
					makeInstance(
						geometry,
						cubeMaterialGreen,
						tmpKey * 0.5,
						csvData[tmpKey].a[1] * -12,
						0
						//csvData[tmpKey].g[2] * zmultiplier
					)
				);

				meshes.push(
					makeInstance(
						geometry,
						cubeMaterialBlue,
						tmpKey * 0.5,
						csvData[tmpKey].a[2] * 12,
						-2
						//csvData[tmpKey].g[2] * zmultiplier
					)
				);

				if (meshes.length > 600) {
					//console.log(meshes[0], meshes.length);
					for (let i = 0; i < 4; i++) {
						meshes[i].geometry.dispose();
						scene.remove(meshes[i]);
						meshes.splice(i, 1);
					}
				}
			}

			keyIndicator++;

			// camera.position.x =
			// 	tmpKey === 0 ? 0 : camera.position.x + csvData[tmpKey].g[0] * 0.1;
			camera.position.x = tmpKey === 0 ? 0 : camera.position.x + 0.5;
			//camera.position.y = tmpKey === 0 ? 0 : camera.position.x - 0.005;
			//camera.rotation.x = tmpKey === 0 ? 0 : camera.position.x + 0.0005;

			if (csvData[tmpKey].g[0] > 0) {
				if (upperLimit < 0.2) {
					camera.rotation.y = camera.rotation.y + 0.005;
					upperLimit = camera.rotation.y + 0.005;
				}
			} else {
				if (lowerLimit > -0.2) {
					camera.rotation.y = camera.rotation.y - 0.005;
					lowerLimit = camera.rotation.y - 0.005;
				}
			}

			if (csvData[tmpKey].a[0] > 3) {
				camera.fov = 180;
			} else {
				camera.fov = 155;
			}

			prevSecond = second;

			if (resizeRendererToDisplaySize(renderer)) {
				const canvas = renderer.domElement;
				camera.aspect = canvas.clientWidth / canvas.clientHeight;
				camera.updateProjectionMatrix();
			}

			renderer.render(scene, camera);
		};

		renderer.setClearColor(0x000000, 1);
		requestAnimationFrame(animate);

		//controls.addEventListener("change", renderer);
		window.addEventListener("resize", renderer);
	};

	//startAnimationWithCSV(dataSample);
	window.startAnimationWithCSV = startAnimationWithCSV;
	window.startAnimationWithMultipleCSV = startAnimationWithMultipleCSV;
};
