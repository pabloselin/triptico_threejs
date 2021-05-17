function canvasSquares2D(key, data, dataSize, canvas, width, height) {
	let sw = 4; //square width
	let sh = 20;
	let ctx = canvas.getContext("2d");
	function init(key, data) {
		if (key === 0) {
			ctx.clearRect(0, 0, width, height);
		}
		let colCount = width / sw;
		let rowCount = colCount + 10;
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
			sw
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
