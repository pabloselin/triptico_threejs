import { Howl, Howler } from "howler";

function initSound() {
	console.log("init sound function");
	let pCount = 0;
	let howlerBank = [];
	let loop = true;
	let soundfiles = TRIPTICO_PICKED_AUDIOS;
	console.log(soundfiles, TRIPTICO_PICKED_AUDIOS);
	let soundUrls = [];
	let muted = false;
	let firstPlay = true;
	let soundToggle = document.querySelector("#soundToggle");

	if (soundfiles.length > 0) {
		for (let i = 0; i < soundfiles.length; i++) {
			soundUrls.push(TRIPTICO_URLS.audio + soundfiles[i]);
		}

		// initialisation:

		// playing i+1 audio (= chaining audio files)
		var onEnd = function (e) {
			if (loop === true) {
				pCount = pCount + 1 !== howlerBank.length ? pCount + 1 : 0;
			} else {
				pCount = pCount + 1;
			}
			console.log(pCount);
			howlerBank[pCount].play();
		};

		//console.log(soundUrls, "sounds from above");

		// build up howlerBank:
		for (let i = 0; i < soundUrls.length; i++) {
			let sources = [soundUrls[i].toString()];
			console.log(sources);
			howlerBank.push(
				new Howl({
					src: sources,
					onend: onEnd,
					buffer: true,
				})
			);
		}

		soundToggle.addEventListener("click", function () {
			if (firstPlay === true) {
				// initiate the whole :
				howlerBank[pCount].play();
				firstPlay = false;
			} else {
				muted = !muted;
				Howler.mute(muted);
			}
			soundToggle.innerHTML =
				muted || firstPlay
					? '<i class="lni lni-volume-high"></i>'
					: '<i class="lni lni-volume-mute"></i>';
		});
	}
}

export default initSound;
