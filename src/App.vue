
<template>
	<main class="relative grid place-items-center h-full">
		<div class="space-y-8 px-1 py-12">
			<div class="relative flex flex-col">
				<span class="absolute right-0 -top-5 text-xs text-sky-50">{{ file?.name }}</span>
				<label
					for="file"
					class="group bg-black bg-opacity-20 hover:bg-opacity-30 hover:border-opacity-30 flex justify-center px-6 pt-5 pb-6 border-2 border-black border-opacity-20 border-dashed rounded-lg cursor-pointer focus-within:outline-none focus-within:border-opacity-30 focus-within:bg-opacity-30 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-sky-400 focus-within:ring-white focus-within:ring-opacity-50"
				>
					<input
						id="file"
						name="file"
						type="file"
						accept="video/*"
						class="opacity-0 top-0 absolute w-full h-full cursor-pointer"
						@input="getFile"
						tabindex="-1"
					/>
					<div class="space-y-1 text-center">
						<svg
							class="mx-auto h-12 w-12 text-white"
							stroke="currentColor"
							fill="none"
							viewBox="0 0 48 48"
							aria-hidden="true"
						>
							<path
								d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
						<div class="flex text-sm text-sky-50">
							<span class="font-medium text-white">Upload a video</span>
							<input
								id="file"
								name="file"
								type="file"
								accept="video/*"
								class="sr-only"
								@input="getFile"
								tabindex="0"
							/>
							<p class="pl-1">or drag and drop</p>
						</div>
						<p class="text-xs text-sky-100">AVI, MP4, WEBM, MKV, upto 2GB</p>
					</div>
				</label>
			</div>

			<div>
				<RadioGroup v-model="quality">
					<div class="flex justify-between items-end">
						<RadioGroupLabel
							class="text-sm uppercase text-sky-50 tracking-wide font-medium"
						>Choose quality</RadioGroupLabel>
						<Switch
							v-model="webmEncoder"
							:class="webmEncoder ? 'bg-opacity-40' : 'bg-opacity-30'"
							class="relative bg-black inline-flex flex-shrink-0 h-7 w-[5.5rem] border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
						>
							<span class="sr-only">Use H.265 Encoder</span>
							<span
								aria-hidden="true"
								:class="webmEncoder ? 'translate-x-9' : 'translate-x-0'"
								class="pointer-events-none inline-flex items-center justify-center h-6 w-12 rounded-full bg-sky-50 text-xs font-semibold text-sky-900 shadow transform ring-0 transition ease-in-out duration-200"
							>{{ webmEncoder ? 'WEBM' : 'H.264' }}</span>
						</Switch>
					</div>
					<RadioGroupOption
						v-for="opt in qualities"
						v-slot="{ active, checked }"
						:value="opt"
						class="focus:outline-none mb-3 mt-2 cursor-pointer"
					>
						<span
							class="flex items-center w-full rounded-lg shadow px-6 py-4"
							:class="[checked ? ' bg-black bg-opacity-25 text-white' : 'bg-white text-black', active ? 'ring-2 ring-offset-2 ring-offset-sky-500 ring-white ring-opacity-50' : '']"
						>
							{{ opt.name }}
							<svg v-if="checked" class="w-6 h-6 ml-auto" viewBox="0 0 24 24" fill="none">
								<circle cx="12" cy="12" r="12" fill="#fff" fill-opacity="0.2" />
								<path
									d="M7 13l3 3 7-7"
									stroke="#fff"
									stroke-width="1.5"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
						</span>
					</RadioGroupOption>
				</RadioGroup>
			</div>

			<button
				type="button"
				@click="transcode"
				class="px-4 py-3 w-full rounded-lg bg-gradient-to-br from-green-400 via-emerald-400 to-teal-500 shadow-2xl text-black text-opacity-80 font-medium hover:from-green-300 hover:to-teal-400 disabled:bg-white disabled:bg-none disabled:bg-opacity-40 disabled:text-gray-900 disabled:text-opacity-50 disabled:cursor-default disabled:shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-sky-500 focus:ring-white focus:ring-opacity-50"
				:style="[!disableTranscoding ? 'text-shadow: 0 1px 0 rgba(255, 255, 255, 0.3)' : '']"
				:disabled="disableTranscoding"
			>Transcode</button>

			<div>
				<div class="flex justify-between items-end mb-2">
					<label
						class="text-sm uppercase text-sky-50 tracking-wide font-medium"
					>Preview {{ previewTranscoded ? 'transcoded' : 'source' }}</label>
					<Switch
						v-model="previewTranscoded"
						:class="previewTranscoded ? 'bg-opacity-40' : 'bg-opacity-30'"
						class="relative bg-black inline-flex flex-shrink-0 h-7 w-[5.5rem] border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
					>
						<span class="sr-only">Preview transcoded video</span>
						<span
							aria-hidden="true"
							:class="previewTranscoded ? 'translate-x-9' : 'translate-x-0'"
							class="pointer-events-none inline-flex items-center justify-center h-6 w-12 rounded-full bg-sky-50 text-xs font-semibold text-sky-900 shadow transform ring-0 transition ease-in-out duration-200"
						>{{ previewTranscoded ? 'New' : 'Old' }}</span>
					</Switch>
				</div>
				<div class="overflow-hidden">
					<video
						v-show="previewTranscoded"
						id="transcoded-preview"
						class="w-[320px] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-sky-500 focus:ring-white focus:ring-opacity-50"
						controls
					></video>
					<video
						v-show="!previewTranscoded"
						id="source-preview"
						class="w-[320px] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-sky-500 focus:ring-white focus:ring-opacity-50"
						controls
					></video>
					<div id="progress-bar"></div>
				</div>
			</div>

			<button
				type="button"
				@click="download"
				class="px-4 py-3 w-full rounded-lg bg-gradient-to-br from-green-400 via-emerald-400 to-teal-500 shadow-2xl text-black text-opacity-80 font-medium hover:from-green-300 hover:to-teal-400 disabled:bg-white disabled:bg-none disabled:bg-opacity-40 disabled:text-gray-900 disabled:text-opacity-50 disabled:cursor-default disabled:shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-sky-500 focus:ring-white focus:ring-opacity-50"
				:style="[!disableDownload ? 'text-shadow: 0 1px 0 rgba(255, 255, 255, 0.3)' : '']"
				:disabled="disableDownload"
			>Download</button>
		</div>
	</main>
</template>

<script setup>
import { onMounted, watchEffect } from 'vue';
import {
	RadioGroup,
	RadioGroupLabel,
	RadioGroupOption,
	Switch,
} from '@headlessui/vue'
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import NProgress from 'nprogress';

NProgress.configure({ trickle: false, parent: '#progress-bar' });

const ffmpeg = createFFmpeg({ log: true, progress: p => NProgress.set(p.ratio) });

let file = $ref(null);
let blobUrl = $ref(null);

const qualities = [{ name: 'High', mp4: 18, webm: 24, }, { name: 'Medium', mp4: 23, webm: 29 }, { name: 'Low', mp4: 28, webm: 32 },]
let quality = $ref(qualities[1]);
let transcodeInProgress = $ref(false)
let webmEncoder = $ref(false)
let previewTranscoded = $ref(false)
let ffmpegLoaded = $ref(false);

let transcodedQuality = $ref(null);
let transcodedCoded = $ref(null);
let transcodedVideo = $ref(null);

let disableTranscoding = $computed(() => {
	if (transcodeInProgress) {
		return true;
	}
	if (!file) {
		return true;
	}
	if (transcodedQuality == quality && transcodedCoded == webmEncoder && transcodedVideo == file) {
		return true;
	}
	return false;
});

let disableDownload = $computed(() => {
	if (transcodeInProgress) {
		return true;
	}
	if (!blobUrl) {
		return true;
	}
	return false;
});

const getFile = ({ target: { files } }) => {
	file = files[0];

	const sourceBlobUrl = URL.createObjectURL(file);
	const video = document.getElementById("source-preview")
	video.src = sourceBlobUrl;
}

const transcode = async () => {
	if (!ffmpegLoaded) {
		console.log("ffmpeg isn't loaded yet");
		return;
	}
	try {
		NProgress.start();
		transcodeInProgress = true;

		ffmpeg.FS('writeFile', file.name, await fetchFile(file));

		const outputFormat = webmEncoder ? 'webm' : 'mp4';
		if (webmEncoder) {
			await ffmpeg.run(
				'-i', file.name,
				'-c:v', 'libvpx-vp9',
				'-crf', quality.webm.toString(),
				'-b:v', '0',
				'-row-mt', '1',
				`output.${outputFormat}`
			);
		} else {
			await ffmpeg.run(
				'-i', file.name,
				'-c:v', 'libx264',
				'-crf', quality.mp4.toString(),
				`output.${outputFormat}`
			);
		}

		const data = ffmpeg.FS('readFile', `output.${outputFormat}`);
		blobUrl = URL.createObjectURL(new Blob([data.buffer], { type: `video/${outputFormat}` }));

		const video = document.getElementById('transcoded-preview');
		video.src = blobUrl;

		transcodedQuality = quality;
		transcodedCoded = webmEncoder;
		transcodedVideo = file;

		NProgress.done();
		previewTranscoded = true;
		transcodeInProgress = false;
	} catch (ex) {
		console.error(ex);
		transcodeInProgress = false;
	}
}

const download = () => {
	const outputFormat = webmEncoder ? 'webm' : 'mp4';
	const anchor = document.createElement('a');
	anchor.href = blobUrl;
	anchor.target = "_blank";
	anchor.download = `output.${outputFormat}`;

	// Auto click on a element, trigger the file download
	anchor.click();
}

watchEffect(() => {
	if (previewTranscoded) {
		const video = document.getElementById('source-preview');
		if (video) {
			video.pause();
		}
	} else {
		const video = document.getElementById('transcoded-preview');
		if (video) {
			video.pause();
		}
	}
})

onMounted(async () => {
	await ffmpeg.load();
	ffmpegLoaded = true;
})

</script>
