var Snap = require("snapsvg")
import agentSpecies from './species'
import Agent from './agent'

const imgPath = "assets/"

// Model
const model = {
  img: imgPath + "melanocyte.svg",
  props: {
    produce_melanosomes: true,
    tyr1: "working"
  }
}

class World {
  constructor(model) {
    this.model = model
    this.props = model.props
    this.agents = []

    this.snap = Snap("#game")

    Snap.load(model.img, (img) => {
      this.snap.append(img)
      this.initializeWorld(img)
    })
  }

  loadExistingAgents(img) {
    for (let kind in agentSpecies) {
      let species = agentSpecies[kind]
      if (species.selector) {
        let els = img.selectAll(species.selector)
        for (let element of els.items) {
          let agent = new Agent(species, this, element)
          this.agents.push(agent)
        }
      }
    }
  }

  initializeWorld(img) {
    this.loadExistingAgents(img)
    console.log("Initial agents: ", this.agents)

    // quick demo showing two steps
    setTimeout(() => this.step(), 1000);
    setTimeout(() => this.step(), 2000);
  }

  createAgent(kind, x, y) {
    let species = agentSpecies[kind]
    if (species.image) {
      Snap.load(imgPath + species.image, (f) => {
        let element = f.select("g")
        this.snap.append(element)

        let matrix = new Snap.Matrix()
        matrix.translate(x, y)
        matrix.scale(0.1, 0.1)

        element.transform(matrix)
        this.agents.push(new Agent(species, this, element))
      })
    }
  }

  step() {
    for (let agent of this.agents) {
      agent.step(this);
    }
  }
}

const world = new World(model);
