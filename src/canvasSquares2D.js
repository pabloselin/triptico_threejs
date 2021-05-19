function canvasSquares2D(key, data, dataSize, canvas, width, height) {
	let sw = 7.5; //square width
	let sh = 5;
	let ctx = canvas.getContext("2d");
	let imgs = document.querySelectorAll("#bottomimgs img");
	let fraction = parseInt(dataSize / imgs.length);
	let zone = parseInt(key / fraction);
	let curimg = imgs[zone];

	function init(key, data) {
		if (key === 0) {
			ctx.clearRect(0, 0, width, height);
		}
		let colCount = width / sw + 130;
		let rowCount = height / sh;
		let posx = key * sw;
		let posy = key * sh;
		// outlined square X: 50, Y: 35, width/height 50
		// filled square X: 125, Y: 35, width/height 50
		ctx.beginPath();
		ctx.fillStyle = `rgba(${255 - (data % 255) * 5}, 0, 0, 1)`;
		ctx.fillRect(
			checkCol(posx, colCount),
			checkRow(posy, rowCount),
			sw,
			sh
		);
		ctx.imageSmoothingEnabled = false;
		ctx.drawImage(
			curimg,
			checkCol(posx, colCount),
			checkRow(posy, rowCount),
			sw,
			sh
		);
	}

	function checkRow(key, rowCount) {
		return key / rowCount;
	}

	function checkCol(key, colCount) {
		return key % colCount;
	}

	//document.addEventListener("DOMContentLoaded", init);
	init(key, data);
}

export default canvasSquares2D;
