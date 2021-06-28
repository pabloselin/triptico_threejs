import { colors } from "./colors.js";

function updateHTMLInfo(data, element, key, imagewrapper) {
	const keycount = document.getElementById("keycount");
	keycount.innerHTML = `[${key}/${data.length}]`;
	let prevsrc = imagewrapper.dataset.src;

	if (data[key]) {
		element.innerHTML = `<p class="accel" style="background-color: ${
			colors.line_1
		}">g: ${data[key].g[0].toFixed(2)} | ${data[key].g[1].toFixed(
			2
		)} | ${data[key].g[2].toFixed(2)} </p>
		<p>a: 
				<span class="x">${data[key].a[0].toFixed(2)}</span>
				<span class="y">${data[key].a[1].toFixed(2)}</span>
				<span class="z">${data[key].a[2].toFixed(2)}</span>
				<i>${key}</i></p>`;

		let fraction = parseInt(data.length / TRIPTICO_PICKED_IMAGES.length);
		let zone = parseInt(key / fraction);
		let currentsrc = TRIPTICO_URLS.img + TRIPTICO_PICKED_IMAGES[zone];
		imagewrapper.dataset.src = currentsrc;
		imagewrapper.style.backgroundImage = `url(${currentsrc})`;
	}

	if (key === 0) {
		let otherimgs = document.querySelectorAll("#bottomimgs img");
		console.log(otherimgs);
		for (let i = 0; i < otherimgs.length; i++) {
			otherimgs[i].classList.remove("active");
		}
	}
}

export default updateHTMLInfo;
