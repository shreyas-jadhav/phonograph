import getContext from './getContext';

const noWindow = typeof window === 'undefined';
let inited: boolean;

if (!noWindow) {
	window.addEventListener('touchend', init, false);
}

// https://paulbakaus.com/tutorials/html5/web-audio-on-ios/
export default function init() {
	if (inited || noWindow) return;

	const context: AudioContext = getContext();

	// create a short empty buffer
	var buffer = context.createBuffer(1, 1, 22050);
	var source: any = context.createBufferSource(); // needs to be `any` to avoid type errors below
	source.buffer = buffer;
	source.connect(context.destination);

	source.start(context.currentTime);

	setTimeout(() => {
		if (!inited) {
			if (
				source.playbackState === source.PLAYING_STATE ||
				source.playbackState === source.FINISHED_STATE
			) {
				inited = true;
				window.removeEventListener('touchend', init, false);
			}
		}
	});
}
