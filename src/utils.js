const makeColor = (accs, mult) => {
	return (
		"rgb(" +
		returnSomething(accs[0] * mult) +
		"," +
		returnSomething(100) +
		"," +
		returnSomething(100) +
		")"
	);
};

const makeBorder = (accs) => {
	let top = 0;
	let right = 0;
	let bottom = 0;
	let left = 0;

	if (accs[0] > 0) {
		top = 1;
	}
	if (accs[1] > 0) {
		right = 1;
	}
	if (accs[2] > 0) {
		bottom = 1;
	}

	return `${top}px ${right}px ${bottom}px ${left}px`;
};

const returnSomething = (number) => {
	//console.log(parseInt(Math.abs(number * 120) % 255));
	return parseInt(Math.abs(number * 120) % 255) !== NaN
		? parseInt(Math.abs(number * 120) % 255)
		: 100;
};

function hexToHSL(hex) {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	let r = parseInt(result[1], 16);
	let g = parseInt(result[2], 16);
	let b = parseInt(result[3], 16);

	(r /= 255), (g /= 255), (b /= 255);

	let max = Math.max(r, g, b),
		min = Math.min(r, g, b);
	let h,
		s,
		l = (max + min) / 2;

	if (max == min) {
		h = s = 0; // achromatic
	} else {
		const d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0);
				break;
			case g:
				h = (b - r) / d + 2;
				break;
			case b:
				h = (r - g) / d + 4;
				break;
		}

		h /= 6;
	}

	h = Math.round(360 * h);
	s = Math.round(100 * s);
	l = Math.round(100 * l);
	return { h, s, l };
}

export { makeColor, makeBorder, returnSomething, hexToHSL };
