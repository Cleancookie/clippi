<template>
  <div class="container mx-auto text-gray-100 pt-12 flex flex-col gap-12">
    <section class="flex flex-col gap-4 items-center">
      <h1 class="text-xl">1. Select your video 🎬</h1>
      
      <input type="file" name="fileInput" id="fileInput" @change="fileChanged" class="file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-cyan-500 file:text-gray-100 
                ">
    </section>

    <section v-if="video !== null" class="flex flex-col gap-4 items-center">
      <h1 class="text-xl">2. Trim your clip ⌚</h1>
      <video controls :width="'800'" ref="video" :key="video">
        <source :src="videoUrl" :type="video.type"/>
      </video>

      <div class="flex gap-4">
        <button @click="setStart" class="px-4 py-2 font-semibold text-sm bg-cyan-500  rounded-full">Start {{ start }}</button>
        <button @click="setEnd" class="px-4 py-2 font-semibold text-sm bg-cyan-500  rounded-full">End {{ end }}</button>
      </div>
    </section>

    <section v-if="start && end" class="flex flex-col gap-4 items-center">
      <h1 class="text-xl">3. Name & Save ✂️</h1>
      <input type="text" name="filename" id="filename" v-model="filename" class="text-black px-2 py-2">
      <div>
        <input type="checkbox" name="normalize-audio" id="normalize-audio" v-model="options.normalizeAudio">
        <label for="normalize-audio">Normalize Audio</label>
      </div>

      <button @click="cut" class="px-4 py-2 font-semibold text-sm bg-cyan-500  rounded-full" :disabled="cutting"
        :class="{ 'bg-cyan-800': cutting , 'text-gray-300': cutting}">
        {{ cutButtonLabel }}
      </button>
    </section>

    <br class="py-8">
  </div>
</template>

<script>
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import hotkeys from './mixins/hotkeys.js';

export default {
  name: 'app',
  mixins: [hotkeys],
  data() {
    return {
      video: null,
      start: null,
      end: null,
      cutting: false,
      filename: 'clippi.mp4',
      progress: 0, // float between 0-1
      options: {
        normalizeAudio: false,
      },
    }
  },
  computed: {
    videoUrl() {
      return URL.createObjectURL(this.video)
    },
    cutButtonLabel() {
      if (!this.cutting) {
        return 'Cut';
      }

      return `Cutting... ${Math.round(this.progress * 100)}%`;
    },
  },
  methods: {
    fileChanged(event) {
      console.log(event.target.files)
      this.video = event.target.files[0];
    },
    setStart(event) {
      this.start = this.$refs.video.currentTime;
    },
    setEnd(event) {
      this.end = this.$refs.video.currentTime;
    },
    async cut(event) {
      this.cutting = true;
      const ffmpeg = createFFmpeg({ log: true })
      await ffmpeg.load()
      const { name } = this.video;
      ffmpeg.FS('writeFile', name, await fetchFile(this.video));
      let params = [
        '-ss', `${this.start}`,
        '-i', name,
        '-c', 'copy',
        '-t', `${this.end - this.start}`,
        'output.mp4'
      ];

      if (this.options.normalizeAudio) {
        // https://superuser.com/questions/323119/how-can-i-normalize-audio-using-ffmpeg
      }
      console.log(params);
      ffmpeg.setProgress(({ ratio }) => {
        this.progress = ratio;
      });
      await ffmpeg.run(...params);
      const data = ffmpeg.FS('readFile', 'output.mp4');
      let blobUrl = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
      let a = document.createElement('a');
      a.download = this.filename || 'clippi.mp4';
      a.href = blobUrl;
      a.click();
      this.cutting = false;
    }
  }
};
</script>