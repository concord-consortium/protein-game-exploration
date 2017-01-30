import runRules from './rules'

export default class Agent {
  constructor(species, world, element, x, y) {
    this.species = species
    this.world = world
    this.element = element
    this.x = x
    this.y = y
  }

  step() {
    const tasks = runRules(this, this.world)

    // coming up... marking tasks as currently being done
    for (let task of tasks) {
      if (task.generate) {      // refactor into list of verbs
        this.generate(task.generate)
      }
    }
  }

  generate(opts) {
    let x, y;
    if (opts.where == "in_area") {
      let box = this.element.node.getBoundingClientRect()
      x = box.left + (Math.random() * box.width)
      y = box.top + (Math.random() * box.height) - 10
    }

    let agent = this.world.createAgent(opts.agent, x, y)
    console.log("created ", agent)
  }
}
