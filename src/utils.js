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

export { makeColor, makeBorder, returnSomething };
