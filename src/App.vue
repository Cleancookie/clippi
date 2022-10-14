<template>
  <div class="container mx-auto text-gray-100 pt-12 flex flex-col gap-12">
    <section class="flex flex-col gap-4 items-center">
      <h1 class="text-xl">1. Select your video 🎬</h1>
      
      <input type="file" name="fileInput" id="fileInput" @change="fileChanged" class="file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-cyan-500 file:text-white">
    </section>

    <section v-if="video !== null" class="flex flex-col gap-4 items-center">
      <h1 class="text-xl">2. Trim your clip ⌚</h1>
      <video controls width="800" ref="video" :key="video">
        <source :src="videoUrl" :type="video.type"/>
      </video>

      <div class="flex gap-4">
        <button @click="setStart" class="px-4 py-2 font-semibold text-sm bg-cyan-500 text-white rounded-full">Start {{ start }}</button>
        <button @click="setEnd" class="px-4 py-2 font-semibold text-sm bg-cyan-500 text-white rounded-full">End {{ end }}</button>
      </div>
    </section>

    <section v-if="start && end" class="flex flex-col gap-2 items-center">
      <h1 class="text-xl">3. Trim & Save ✂️</h1>
      <button @click="cut" class="px-4 py-2 font-semibold text-sm bg-cyan-500 text-white rounded-full">{{ cutLabel }}</button>
    </section>
  </div>
</template>

<script>
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

export default {
  name: 'app',
  data() {
    return {
      video: null,
      start: null,
      end: null,
      cutLabel: 'Cut',
    }
  },
  computed: {
    videoUrl() {
      return URL.createObjectURL(this.video)
    }
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
      this.cutLabel = 'Cutting...';
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
      console.log(params);
      await ffmpeg.run(...params);
      const data = ffmpeg.FS('readFile', 'output.mp4');
      let blobUrl = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
      window.open(blobUrl);
      this.cutLabel = 'Done';
      setTimeout(() => { this.cutLabel = 'Cut'}, 2000)
    }
  }
};
</script>