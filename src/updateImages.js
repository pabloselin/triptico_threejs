let curkey = 0;

function updateImages(element, key, imgcount, total) {
	let fraction = parseInt(total / imgcount);
	let zone = parseInt(key / fraction);
	element.innerHTML = zone;
	let otherimgs = document.querySelector("#bottomimgs img");
	for (let i = 0; i < otherimgs.length; i++) {
		otherimgs[i].classList.remove("active");
	}
	let indeximg = document.querySelector(
		`#bottomimgs img[data-index="${zone}"]`
	);
	indeximg.classList.add("active");
}

export default updateImages;
