export default class Feature {
  constructor (el) {
    this.el = el
  }

  getRandomLocation() {
    let pos = Math.random() * this.el.node.getTotalLength()
    return this.el.node.getPointAtLength(pos)
  }
}
