<template>
  <div class="main">
    <input type="file" name="fileInput" id="fileInput" @change="fileChanged">
    <div v-if="video !== null">
      <video controls width="800" ref="video">
        <source :src="videoUrl" :type="video.type" />
      </video>

      <div @click="setStart">Start</div>
      <div @click="setEnd">End</div>
    </div>
  </div>
  <div v-if="start && end">
    <div @click="cut">Cut!</div>
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
      const ffmpeg = createFFmpeg({ log: true })
      await ffmpeg.load()
      const { name } = this.video;
      ffmpeg.FS('writeFile', name, await fetchFile(this.video));
      await ffmpeg.run('-i', '-c', 'copy', '-ss', this.start, '-to', this.end, name, 'output.mp4');
      const data = ffmpeg.FS('readFile', 'output.mp4');
      let blobUrl = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
      window.open(blobUrl);
      console.log('done!');
    }
  }
};
</script>

<style scoped>

.main {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
</style>