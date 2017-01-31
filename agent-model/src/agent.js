import runRules from './rules'
var Snap = require("snapsvg")

export default class Agent {
  constructor(species, world, element, x, y) {
    this.species = species
    this.world = world
    this.element = element
    this.x = x
    this.y = y
    this.state = this.species.initialState
  }

  step() {
    const tasks = runRules(this, this.world)

    // coming up... marking tasks as currently being done, for time-based tasks
    for (let task of tasks) {
      if (task.generate) {      // refactor into list of verbs
        this.generate(task.generate)
      } else if (task.transform) {
        this.transform(task.transform)
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
  }

  transform(opts) {
    // these shouldn't manipulate Snap directly, but should be
    // agent props that are read by the world's render method
    let element = opts.selection ? this.element.selectAll(opts.selection) : this.element
    if (opts.size) {
        let matrix = element.transform().globalMatrix
        matrix.scale(opts.size, opts.size)
        matrix.translate(-opts.size, -opts.size)
        element.animate({transform: matrix}, 500)     // we probably won't use Snap animations
    } else if (opts.fill) {
      element.animate({fill: opts.fill}, 500)
    }
  }
}
