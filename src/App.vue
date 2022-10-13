<template>
  <div class="flexy">
    <input type="file" name="fileInput" id="fileInput" @change="fileChanged">
    <div v-if="video !== null">
      <video controls width="800" ref="video">
        <source :src="videoUrl" :type="video.type" />
      </video>

      <div class="flexy">
        <button @click="setStart">Start {{ start }}</button>
        <button @click="setEnd">End {{ end }}</button>
      </div>
    </div>
  </div>
  <div v-if="start && end">
    <button @click="cut">{{ cutLabel }}</button>
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
      cutLabel: 'Cut!'
    }
  },
  computed: {
    videoUrl() {
      return URL.createObjectURL(this.video)
    }
  },
  methods: {
    fileChanged(event) {
      console.log(event.target.file)
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
      console.log('done!');
      this.cutLabel('done!');
    }
  }
};
</script>

<style scoped>
.flexy {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
</style>