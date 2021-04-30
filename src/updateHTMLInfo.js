import { colors } from "./colors.js";

function updateHTMLInfo(data, element, key) {
	const keycount = document.getElementById("keycount");
	keycount.innerHTML = `[${key}/${data.length}]`;

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
	}
}

export default updateHTMLInfo;
