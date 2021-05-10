import { main } from "./multiple.js";
import { getJoinedCSV } from "./datautils.js";
import canvasSquares2D from "./canvasSquares2D.js";

window.onload = function () {
	console.log("init triptico");
	const fetchData = getJoinedCSV(
		TRIPTICO,
		TRIPTICO_URLS,
		TRIPTICO_SENSORS,
		main
	);
};
