export default class Melanogenesis {
  constructor(snap, version) {
    this.snap = snap;
    this.version = version || Melanogenesis.BROKEN_TYR1;
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

      let nextStepInterval = 200 + (Math.random() * 1000);
      setTimeout(loop, nextStepInterval);

      let masterMelanosome = this.snap.select("#melanosome"),
          golgi = this.snap.select("#golgi");

      let melanosome = masterMelanosome.clone();
      masterMelanosome.after(melanosome);

      let melanosomeBBox = melanosome.getBBox(),
          golgiBBox = golgi.getBBox(),
          x = golgiBBox.x + (golgiBBox.width/4),
          y = golgiBBox.y + (golgiBBox.height/4),
          randX = Math.random() * golgiBBox.width/2,
          randY = Math.random() * golgiBBox.height/2,
          moveTo = "t"+((x + randX) - melanosomeBBox.cx)+","+((y + randY) - melanosomeBBox.cy)

      melanosome.attr({
        visibility: "",
        transform: moveTo+",s0.1,0.1"
      });


      let callback = () => { if (this.listener) this.listener.melanosomeCreated(melanosome) }

      melanosome.animate({ transform: "s0.5,0.5"+moveTo}, 1500, () => {
        if (this.version == Melanogenesis.WORKING_TYR1) {
          melanosome.select("path").attr({fill: "url(#SVGID_6_medium)"})
          setTimeout( () => melanosome.select("path").attr({fill: "url(#SVGID_6_dark)"}), 1000)
          melanosome.animate({transform: "s1,1,"+moveTo}, 2000, callback);
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
