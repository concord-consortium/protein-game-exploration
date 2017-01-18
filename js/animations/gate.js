export default class Gate {
  constructor(snap, transport, version) {
    this.snap = snap;
    transport.setListener(this);

    let s = snap;
    this.gateCells = s.group(
      s.circle(615, 166, 0),
      s.circle(625, 190, 0),
      s.circle(585, 440, 0),
      s.circle(575, 460, 0)
    );
    this.gateCells.attr({
      fill: "#f7f738",
      stroke: "#000",
      strokeWidth: 1
    });

    this.setVersion(version || Gate.GATE_WORKING);
  }

  setVersion(version) {
    this.version = version;
    if (version == Gate.GATE_WORKING) {
      this.gateCells.selectAll('circle').animate({
          r: 6
      }, 500);
    } else {
      this.gateCells.selectAll('circle').animate({
          r: 0
      }, 500);
    }
  }

  move(obj, loc, callback) {
    let x = loc.x,
        y = loc.y;
    if (loc.scatterX) {
      x += (Math.random() * loc.scatterX * 2) - loc.scatterX;
      y += (Math.random() * loc.scatterY * 2) - loc.scatterY;
    }
    obj.animate({cx: x}, 2200, mina.easeout);
    obj.animate({cy: y}, 2200, mina.easeout, callback);
  }

  moveAlongPath(obj, path, waypoint) {
    if (path[waypoint] && (waypoint == 0 || this.version == Gate.GATE_WORKING)) {
      this.move(obj, path[waypoint], () => {
        this.moveAlongPath(obj, path, ++waypoint);
      })
    }
  }

  melanosomeTransported(melanosome) {
    const top = melanosome.node.getBoundingClientRect().top - 3,
          left = melanosome.node.getBoundingClientRect().left;
    let fadeTime;
    if (top > 250 && top < 340 && left > 350 && left < 410) {
      const path = Gate.paths[Math.floor(Math.random() * 2)];
      this.moveAlongPath(melanosome, path, 0);
      fadeTime = 10000 + Math.random() * 3000;
    } else {
      fadeTime = 5000 + Math.random() * 3000;
    }

    setTimeout(() => {
      melanosome.animate({r: 0}, 2000);
    }, fadeTime)
  }
}

Gate.GATE_WORKING = "gate_working";
Gate.GATE_BROKEN = "gate_broken";

Gate.paths = [
  [{x: 610, y: 200}, {x: 680, y: 160, scatterX: 40, scatterY: 50 }],
  [{x: 570, y: 450}, {x: 630, y: 500, scatterX: 40, scatterY: 50 }]
]
