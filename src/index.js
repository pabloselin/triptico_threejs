import { main } from "./multiple.js";
import { getJoinedCSV } from "./datautils.js";

window.onload = function () {
	console.log("init triptico");
	const fetchData = getJoinedCSV(
		TRIPTICO,
		TRIPTICO_URLS,
		TRIPTICO_SENSORS,
		main
	);
};
