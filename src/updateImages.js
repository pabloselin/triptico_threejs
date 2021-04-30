let curkey = 0;

function updateImages(imageElement, pictures, drawCount, baseUrl, length) {
	let imgkeys = parseInt(length / pictures.length);
	let prevkey = curkey;
	curkey = parseInt(drawCount / imgkeys);

	if (prevkey !== curkey) {
		let srcUrl = baseUrl + pictures[curkey];
		imageElement.setAttribute("src", srcUrl);
	}
}

export default updateImages;
