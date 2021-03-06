function updatePositions(line, data, maxpoints, unit) {
	const positions = line.geometry.attributes.position.array;
	let x, y, z, index;
	x = y = z = index = 0;
	if (data !== undefined) {
		for (let i = 0, l = maxpoints; i < l; i++) {
			if (data[i] !== undefined) {
				positions[index++] = x;
				positions[index++] = y;
				positions[index++] = z;

				// x += (Math.random() - 0.5) * 30;
				// y += (Math.random() - 0.5) * 30;
				// z += (Math.random() - 0.5) * 30;
				if (unit === "a") {
					x += data[i]["a"][0] * 0.4;
					y += data[i]["a"][1] * 0.4;
					z += data[i]["a"][2] * 0.4;
				} else {
					x += data[i]["g"][0] * 0.8;
					y += data[i]["g"][1] * 0.8;
					z += data[i]["g"][2] * 0.8;
				}
			}
		}
	}
}

export default updatePositions;
