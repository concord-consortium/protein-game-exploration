export default class Melanogenesis {
  constructor(snap, version) {
    this.snap = snap;
    this.version = version || Melanogenesis.WORKING_TYR1;
  }

  setVersion(version) {
    this.version = version;
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
          y = 100 + Math.random() * 300,
          melanosome = this.snap.circle(x, y, 0);

      melanosome.attr({
          fill: "#f79708",
          stroke: "#000",
          strokeWidth: 1
      });

      melanosome.animate({r: 5}, 1500, () => {
        if (this.version == Melanogenesis.WORKING_TYR1) {
          melanosome.animate({r: 9, fill: "#505050"}, 2000);
        }
      });
    }

    loop();
  }
}

Melanogenesis.WORKING_TYR1 = "working_tyr";
Melanogenesis.BROKEN_TYR1 = "broken_tyr";
