import { main } from "./multiple.js";
import { getJoinedCSV } from "./datautils.js";
import canvasSquares2D from "./canvasSquares2D.js";

window.onload = function () {
	console.log("init triptico");
	let fieldData = {
		acc2_d: TRIPTICO_PICKED_SENSORS_LEFT,
		acc2_i: TRIPTICO_PICKED_SENSORS_RIGHT,
		img: TRIPTICO_PICKED_IMAGES,
		audio: TRIPTICO_PICKED_AUDIOS,
	};

	//console.log(fieldData);

	const fetchData = getJoinedCSV(
		fieldData,
		TRIPTICO_URLS,
		["img", "acc2_i", "acc2_d"],
		main
	);
};
