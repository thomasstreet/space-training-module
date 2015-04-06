require('traceur/bin/traceur-runtime');

class VideoController {
  constructor(videoId) {
    this.video = document.getElementById(videoId);

    this.video.addEventListener('loadedmetadata', () => {
        //console.log(this.video.duration);
    });
  }

  play() {
    this.video.play();
  }

  playFromStartToMiddle() {
    this.video.currentTime = 0;
    this.video.play();

    // Set the middlePoint to slightly before the true middle point
    var middlePoint = (this.video.duration / 2) - (this.video.duration / 10);

    setTimeout(() => {
      this.video.pause();
    }, middlePoint * 1000);
  }

  playFromMiddleToEnd() {
    this.video.currentTime = this.video.duration / 2;
    this.video.play();
  }

  pause() {
    this.video.pause();
  }

  currentTime() {
    return this.video.played.end();
  }

  goToStart() {
    this.video.currentTime = 0;
    this.video.pause();
  }

  goToEnd() {
    this.video.currentTime = this.video.duration;
    this.video.pause();
  }
}

module.exports = VideoController;
