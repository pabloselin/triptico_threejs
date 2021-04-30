function updatePositions(line, data, maxpoints) {
	const positions = line.geometry.attributes.position.array;
	let x, y, z, index;
	x = y = z = index = 0;
	//console.log(data);
	if (data !== undefined) {
		for (let i = 0, l = maxpoints; i < l; i++) {
			if (data[i] !== undefined) {
				positions[index++] = x;
				positions[index++] = y;
				positions[index++] = z;

				// x += (Math.random() - 0.5) * 30;
				// y += (Math.random() - 0.5) * 30;
				// z += (Math.random() - 0.5) * 30;
				x += data[i]["a"][0] * 0.4;
				y += data[i]["a"][1] * 0.4;
				z += data[i]["a"][2] * 0.4;
			}
		}
	}
}

export default updatePositions;
