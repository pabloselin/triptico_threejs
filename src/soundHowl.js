import { Howl, Howler } from "howler";

function initSound(sounds) {
	let pCount = 0;
	let howlerBank = [];
	let loop = true;

	let soundUrls = [];
	if (soundUrls.length > 0) {
		for (let i = 0; i < sounds.length; i++) {
			soundUrls.push(TRIPTICO_URLS.audio + sounds[i]);
		}

		// initialisation:

		// playing i+1 audio (= chaining audio files)
		var onEnd = function (e) {
			if (loop === true) {
				pCount = pCount + 1 !== howlerBank.length ? pCount + 1 : 0;
			} else {
				pCount = pCount + 1;
			}
			howlerBank[pCount].play();
		};

		console.log(soundsUrls, "sounds from above");

		// build up howlerBank:
		for (let i = 0; i < soundUrls.length; i++) {
			howlerBank.push(
				new Howl({ urls: [soundUrls[i]], onend: onEnd, buffer: true })
			);
		}

		// initiate the whole :
		howlerBank[0].play();
	}
}

export default initSound;
