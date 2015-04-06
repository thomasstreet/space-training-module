require('traceur/bin/traceur-runtime');

class VideoController {
  constructor(videoId) {
    this.video = document.getElementById(videoId);

    this.video.addEventListener('loadedmetadata', () => {
        //console.log(this.video.duration);
    });

    this.timeouts = [];
  }

  play() {
    this.video.play();
  }

  playFromStartToMiddle() {
    this.video.currentTime = 0;
    this.video.play();

    var middlePoint = (this.video.duration / 2);

    var timeout = setTimeout(() => {
      this.video.currentTime = middlePoint;
      this.video.pause();
    }, middlePoint * 1000);

    this.timeouts.push(timeout);
  }

  playFromMiddleToEnd() {
    this.timeouts.forEach((timeout) => {
      clearTimeout(timeout);
    });

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
