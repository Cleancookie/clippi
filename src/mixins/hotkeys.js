export default {
    mounted() {
        window.addEventListener('keydown', (e) => {
            console.log(e.key);

            // don't do anything if input type text is focused
            if (document.activeElement.type == 'text') {
                return;
            }

            // don't override the native video player hotkeys
            if (document.activeElement.tagName == 'VIDEO') {
                return;
            }

            // don't do anything if video is not loaded
            if (!this.$refs.video) {
                return;
            }

            if (e.key == 'ArrowRight') {
                this.$refs.video.currentTime += 1;
            }
            if (e.key == 'ArrowLeft') {
                this.$refs.video.currentTime -= 1;
            }
            if (e.key == ',') {
                this.$refs.video.currentTime -= 1 / 30;
            }
            if (e.key == '.') {
                this.$refs.video.currentTime += 1 / 30;
            }
            if (e.key == 'k' || e.key == ' ') {
                if (this.$refs.video.paused) {
                    this.$refs.video.play();
                } else {
                    this.$refs.video.pause();
                }
            }
        });
    }
}