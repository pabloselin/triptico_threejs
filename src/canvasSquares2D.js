function canvasSquares2D(key, data, dataSize, canvas, width) {
	let sw = 4; //square width
	let ctx = canvas.getContext("2d");
	function init(key, data) {
		console.log(width);
		// outlined square X: 50, Y: 35, width/height 50
		// filled square X: 125, Y: 35, width/height 50
		ctx.beginPath();
		ctx.fillStyle = `rgba(${255 - (data % 255) * 5}, 0, 0, 1)`;
		ctx.fillRect(checkCol(key), checkRow(key), sw, sw);
	}

	function checkRow(key) {
		if (key < 300) {
			return 0;
		} else if (key < 600) {
			return 10;
		} else if (key < 900) {
			return 20;
		} else if (key < 1200) {
			return 30;
		} else if (key < 1500) {
			return 40;
		} else if (key < 1800) {
			return 50;
		} else if (key < 2100) {
			return 60;
		} else if (key < 2300) {
			return 70;
		}
	}

	function checkCol(key) {
		if (key * sw > width) {
			return key % width;
		} else {
			return key;
		}
	}

	//document.addEventListener("DOMContentLoaded", init);
	init(key, data);
}

export default canvasSquares2D;
