export default class Transport {
  constructor(snap, melanogenesis, version) {
    this.snap = snap;
    this.version = version || Transport.TRANSPORT_WORKING;
    melanogenesis.setListener(this);
  }

  setVersion(version) {
    this.version = version;
  }

  setListener(listener) {
    this.listener = listener;
  }

  move(obj, loc, callback) {
    let x = loc.x,
        y = loc.y;
    if (loc.scatterX && this.version == Transport.TRANSPORT_WORKING) {
      x += (Math.random() * loc.scatterX * 2) - loc.scatterX;
      y += (Math.random() * loc.scatterY * 2) - loc.scatterY;
    }
    obj.animate({cx: x}, 2200, mina.easein);
    obj.animate({cy: y}, 2200, mina.easeout, callback);
  }

  moveAlongPath(obj, path, waypoint, callback) {
    if (path[waypoint]) {
      this.move(obj, path[waypoint], () => {
        this.moveAlongPath(obj, path, ++waypoint, callback);
      })
    } else {
      callback();
    }
  }

  melanosomeCreated(melanosome) {
    const top = melanosome.node.getBoundingClientRect().top - 3;
    const path = Transport.paths[Math.floor(top / 120)-1];

    let callback = () => {
      if (this.listener) {
        this.listener.melanosomeTransported(melanosome);
      }
    }

    if (this.version == Transport.TRANSPORT_WORKING || Math.random() < 0.3) {
      this.moveAlongPath(melanosome, path, 0, callback);
    } else {
      setTimeout(() => {
        melanosome.animate({r: 0}, 2000);
      }, 8000)
    }
  }
}

Transport.TRANSPORT_WORKING = "working";
Transport.TRANSPORT_BROKEN = "broken";

Transport.paths = [
  [{x: 50, y: 50}, {x: 30, y: 0, scatterX: 10, scatterY: 50 }],
  [{x: 260, y: 270}, {x: 320, y: 300}, {x: 360, y: 300, scatterX: 50, scatterY: 140}],
  [{x: 70, y: 450}, {x: 50, y: 600, scatterX: 10, scatterY: 50}]
]
