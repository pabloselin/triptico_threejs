import * as THREE from "three";

function makeScene(elem, camProps, lightProps) {
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
	camera.rotation.set(
		camProps.rotation[0],
		camProps.rotation[1],
		camProps.rotation[2]
	);
	//camera.lookAt(0, 0, 0);
	scene.add(camera);
	//const axesHelper = new THREE.AxesHelper(5);
	//scene.add(axesHelper);

	//Lights
	// {
	// 	const color = 0xffffff;
	// 	const intensity = 1;
	// 	const light = new THREE.DirectionalLight(color, intensity);
	// 	light.position.set(-1, 2, 4);
	// 	camera.add(light);
	// }

	{
		const color = lightProps.color;
		const intensity = lightProps.intensity;
		const light = new THREE.AmbientLight(color, intensity);
		// light.position.set(
		// 	lightProps.position[0],
		// 	lightProps.position[1],
		// 	lightProps.position[2]
		// );
		const hemisphereLight = new THREE.HemisphereLight(color, 0x93aaac, 1.1);
		camera.add(light);
		camera.add(hemisphereLight);
	}

	return { scene, camera, elem };
}

export default makeScene;
