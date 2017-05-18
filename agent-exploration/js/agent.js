import AgentView from "./agent-view";

export default class Agent {
  /**
   * image       image to load, if any
   * selector    selector in image
   */
  constructor({world, x, y, speed, direction, r, vr}, {image, selector, snap}) {
    Object.assign(this, {world, x, y, speed, direction, r, vr})
    this.view = new AgentView(this, image, selector, snap)
    this.speedSq = this.speed * this.speed
    this.tempSnap = snap
    this.size = 0
    this.state = "growing"
  }

  step(frameSize) {
    let speed = 0

    if (this.state == "growing") {
      this.size += 0.01
      if (this.size >= 1) {
        this.state = "seeking"
      }
    }
    if (this.state == "seeking") {
      let paths = this.tempSnap.selectAll("#microtubules_x5F_grouped path")
      if (paths && paths.length) {
        this.path = paths[Math.floor(Math.random() * paths.length)]
        this.destination = this.path.node.getPointAtLength(0)
        this.state = "finding start"
      }
    }
    if (this.state == "finding start") {
      let dx = this.destination.x - this.x,
          dy = this.destination.y - this.y,
          distSq = (dx * dx) + (dy * dy),
          speedSq = this.speedSq * (frameSize * frameSize)

      this.direction = Math.atan2(dy, dx)
      speed = (distSq > speedSq) ? (this.speed * frameSize) : Math.sqrt(distSq)

      if (speed == 0) {
        this.state = "following"
        this.distanceAlongLength = 0
      }
      let vx = Math.cos(this.direction) * speed,
          vy = Math.sin(this.direction) * speed
      this.x += vx
      this.y += vy
    }
    if (this.state == "following") {
      this.destination = this.path.node.getPointAtLength(this.distanceAlongLength + (this.speed * frameSize));
      this.x = this.destination.x
      this.y = this.destination.y
      this.distanceAlongLength += (this.speed * frameSize)

      if (this.distanceAlongLength > this.path.node.getTotalLength()) {
        let gates = this.tempSnap.selectAll("#gate_x5F_openA, #gate_x5F_openB")
        for (let i = 0; i < gates.length; i++) {
          let gateBB = gates[i].getBBox()
          if (Math.abs(gateBB.cx - this.x) < 100 && Math.abs(gateBB.cy - this.y) < 100) {
            this.gate = gates[i]
            this.state = "exiting"
          }
          if (this.state !== "exiting") {
            this.state = "dying"
          }
        }
      }
    }
    if (this.state == "exiting") {
      if (this.size > 0.6) {
        this.size -= 0.04
      }
      if (!this.exit) {
        this.exit = this.gate.select(".exit").getBBox()
        this.vx = (this.exit.cx - this.x) / 16
        this.vy = (this.exit.cy - this.y) / 16
      }
      if (this.y < this.exit.y + this.exit.h) {
        this.size += 0.05
      }
      this.x += this.vx
      this.y += this.vy
      if (this.y < 0) {
        this.dead = true;
      }
    }
    if (this.state == "dying") {
      this.size -= 0.01
      if (this.size <= 0.01) {
        this.dead = true;
      }
    }
  }

  destroy() {
    this.view.destroy()
  }
}
