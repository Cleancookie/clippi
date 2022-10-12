<template>
  <div>
    <input type="file" name="fileInput" id="fileInput" @change="fileChanged">
    <video v-if="video !== null" controls width="800"> 
      <source :src="videoUrl" :type="video.type" />
    </video>
  </div>
</template>

<script>

export default {
  name: 'app',
  data() {
    return {
      video: null,
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
    }
  }
};
</script>