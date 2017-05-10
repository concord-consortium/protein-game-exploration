const speed = 0.1;

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


    let t = obj.transform().total,
        translate = t ? t.match(/t([^,]*),([0-9.-]*)/) : [],
        scaleRegex = t ? t.match(/s([^,]*),([0-9.-]*)/) : [],
        scale = scaleRegex ? parseFloat(scaleRegex[1]) : 1,
        scaleStr = scaleRegex ? scaleRegex[0] : "s1,1";



    let orig_x = (parseFloat(translate[1]) || 0),
        orig_y = (parseFloat(translate[2]) || 0),
        objBBox = obj.getBBox(),
        dx = x - objBBox.cx,
        dy = y - objBBox.cy,
        invScale = 1/scale,
        xTrans = (orig_x + dx) * invScale,
        yTrans = (orig_y + dy) * invScale,
        dist = Math.sqrt((dx * dx) + (dy * dy)),
        time = dist / speed;

    var matrix = new Snap.Matrix();
    matrix.scale(scale,scale);
    matrix.translate(xTrans,yTrans);

    obj.animate({transform: matrix}, time, callback);
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
    const path = Transport.paths[Math.floor(Math.random()*4)];

    let callback = () => {
      if (this.listener) {
        // this.listener.melanosomeTransported(melanosome);
      }
    }

    if (this.version == Transport.TRANSPORT_WORKING || Math.random() < 0.3) {
      this.moveAlongPath(melanosome, path, 0, callback);
    } else {
      setTimeout(() => {
        let t = melanosome.transform().total,
            translate = t ? t.match(/t([^,]*),([0-9.-]*)/) : [];
        melanosome.animate({transform: "s0.1,0.1"+translate[0]}, 2000, () =>
          melanosome.animate({transform: "s0,0"}, 10, callback));
      }, 2000)
    }
  }
}

Transport.TRANSPORT_WORKING = "transport_working";
Transport.TRANSPORT_BROKEN = "transport_broken";

Transport.paths = [
  [{x:460, y:660}, {x:470, y:690}, {x:455, y:715}, {x:400, y:715}, {x:380, y:705},
    {x:310, y:640}, {x:150, y:635}, {x:60, y:625}],
  [{x:440, y:540}, {x:360, y:510}, {x:330, y:490}, {x:300, y:430}, {x:300, y:430},
    {x:270, y:410}],
  [{x:480, y:490}, {x:380, y:420}, {x:360, y:385}, {x:365, y:325}],
  [{x:560, y:490, scatterx:7, scatterY: 7},{x:520, y:435},{x:515, y:405},
    {x:525, y:325},{x:495, y:270}, {x:495, y:215},{x:455, y:170},
    {x:425, y:100, scatterx:7, scatterY: 7}]
]
