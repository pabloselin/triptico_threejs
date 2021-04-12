import CSVToArray from "./csvtoarray.js";

const startAnimationWithCSV = (csv) => {
	fetch(csv)
		.then((response) => response.text())
		.then((dataTXT) => processData(CSVToArray(dataTXT)));
};

const startAnimationWithMultipleCSV = (files, imgs) => {
	let tmpdata = [];
	let finalData = [];
	console.log(TRIPTICO_URLS);
	for (let i = 0; i < files.length; i++) {
		finalData = fetch(TRIPTICO_URLS.csv + files[i])
			.then((response) => response.text())
			.then((dataTXT) => tmpdata.push(CSVToArray(dataTXT)))
			.then((key) => {
				finalData = joinData(tmpdata, files.length, imgs);
				return finalData;
			});
	}

	return finalData;
};

const joinData = (dataArray, totalLength, imgs) => {
	let joinData = [];
	if (dataArray.length === totalLength) {
		for (let i = 0; i < dataArray.length; i++) {
			joinData = joinData.concat(dataArray[i]);
		}
		return processData(joinData, imgs);
	}
};

const processData = (data, imgs) => {
	let mins = [10, 10, 10];
	let maxs = [0, 0, 0];
	let cleanData = [];

	if (data.length > 0) {
		for (let i = 0; i < data.length; i++) {
			if (!isNaN(parseFloat(data[i][0]))) {
				//console.log(parseFloat(data[i][0]));

				let acoords = [
					parseFloat(data[i][0]),
					parseFloat(data[i][1]),
					parseFloat(data[i][2]),
				];
				let gcoords = [
					parseFloat(data[i][3]),
					parseFloat(data[i][4]),
					parseFloat(data[i][5]),
				];

				mins = mins.map((coord, key) => {
					if (coord > acoords[key]) {
						return acoords[key];
					} else {
						return coord;
					}
				});

				maxs = maxs.map((coord, key) => {
					if (coord < acoords[key]) {
						return acoords[key];
					} else {
						return coord;
					}
				});

				cleanData.push({
					a: acoords,
					g: gcoords,
				});
			}
		}
		//console.log(mins, maxs, cleanData);
		//main(imgs, isPaused);
		return cleanData;
	}
};

export {
	startAnimationWithCSV,
	startAnimationWithMultipleCSV,
	joinData,
	processData,
};
