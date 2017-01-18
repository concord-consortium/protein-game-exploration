export default class Melanogenesis {
  constructor(snap, version) {
    this.snap = snap;
    this.version = version || Melanogenesis.WORKING_TYR1;
  }

  setVersion(version) {
    this.version = version;
  }

  setListener(listener) {
    this.listener = listener;
  }

  stop() {
    this.isRunning = false;
  }

  run() {
    this.isRunning = true;

    const loop = () => {
      if (!this.isRunning) return;

      let nextStepInterval = Math.random() * 1000;
      setTimeout(loop, nextStepInterval);

      let x = 100 + Math.random() * 100,
          y = 200 + Math.random() * 200,
          melanosome = this.snap.circle(x, y, 0);

      melanosome.attr({
          fill: "#f79708",
          stroke: "#000",
          strokeWidth: 1
      });

      let callback = () => { if (this.listener) this.listener.melanosomeCreated(melanosome) }

      melanosome.animate({r: 5}, 1500, () => {
        if (this.version == Melanogenesis.WORKING_TYR1) {
          melanosome.animate({r: 9, fill: "#505050"}, 2000, callback);
        } else {
          callback();
        }
      });
    }

    loop();
  }
}

Melanogenesis.WORKING_TYR1 = "working_tyr1";
Melanogenesis.BROKEN_TYR1 = "broken_tyr1";
