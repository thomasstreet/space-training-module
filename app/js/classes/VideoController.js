require('traceur/bin/traceur-runtime');

class VideoController {
  constructor(videoId) {
    this.video = document.getElementById(videoId);

    //this.endTime = this.video.seekable.end();
    //
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
