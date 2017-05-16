export default class AgentView {
  constructor(agent, image, selector, snap) {
    this.agent = agent

    Snap.load(image, (img) => {
      this.el = img.select(selector)
      snap.append(this.el)
      this.render()
    })
  }

  render() {
    if (this.el) {
      let a = this.agent,
          bb = this.el.getBBox(),
          matrix = new Snap.Matrix()

      matrix.translate((a.x-bb.w/2), (a.y-bb.h/2))
      matrix.scale(a.size)

      this.el.nativeAttrs({transform: matrix})
    }
  }

  destroy() {
    if (this.el) this.el.remove()
  }
}
