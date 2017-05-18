var Snap = require("snapsvg")
import Agent from "./agent";
import Feature from "./feature";

const snap = Snap("#model")
const fps = 60

Snap.plugin( function( Snap, Element, Paper, global ) {
    Element.prototype.nativeAttrs = function( attrs ) {
        for (var p in attrs)
            this.node.setAttributeNS(null, p, attrs[p]);
        return this;
    }
});

let agents = []

Snap.load("assets/melanocyte.svg", (img) => {
  snap.append(img)

  let golgi = new Feature(snap.select("#golgi_x5F_apparatus path"))

  let createNewMelanosome = () => {
    let spawnPoint = golgi.getRandomLocation()

    let melanosome = new Agent({
      world: img,
      x: spawnPoint.x,
      y: spawnPoint.y,
      speed: 0.8,
      direction: Math.random() * 2,
      r: 0,
      vr: 3
    },
    {
      image: "assets/melanosome.svg",
      selector: "#melanosome",
      snap
    })
    agents.push(melanosome)
  }

  let lastCreateTime = window.performance.now()
  let lastTime = window.performance.now()

  const redraw = () => {
    requestAnimationFrame( redraw )

    let now = window.performance.now()
    let frameSize = (now - lastTime) / (1000 / fps)
    lastTime = now

    if (now - lastCreateTime > 600) {
      createNewMelanosome()
      lastCreateTime = now
    }

    for (let i in agents) {
      agents[i].step(frameSize)
      agents[i].view.render()
    }

    let livingAgentList = []
    for (let i in agents) {
      if (!agents[i].dead) {
        livingAgentList.push(agents[i])
      } else {
        agents[i].destroy()
      }
    }
    agents = livingAgentList
  }
  redraw();

})


