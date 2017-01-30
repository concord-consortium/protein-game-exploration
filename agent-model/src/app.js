var Snap = require("snapsvg")
import agentSpecies from './species'
import Agent from './agent'

// Model
const model = {
  img: "assets/melanocyte.svg",
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

    const snap = Snap("#game")

    Snap.load(model.img, (img) => {
      snap.append(img)
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
    console.log("Agents: ", this.agents)

    this.step()
  }

  createAgent(kind, x, y) {
    let species = agentSpecies[kind]
    return new Agent(species, this, null, x, y)
  }

  step() {
    for (let agent of this.agents) {
      agent.step(this);
    }
  }
}

const world = new World(model);
