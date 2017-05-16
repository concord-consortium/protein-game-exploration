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

  step() {
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
          distSq = (dx * dx) + (dy * dy);

      this.direction = Math.atan2(dy, dx)
      speed = (distSq > this.speedSq) ? this.speed : Math.sqrt(distSq)

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
      this.destination = this.path.node.getPointAtLength(this.distanceAlongLength + this.speed);
      this.x = this.destination.x
      this.y = this.destination.y
      this.distanceAlongLength += this.speed

      if (this.distanceAlongLength > this.path.node.getTotalLength()) {
        this.dead = true;
      }
    }
  }

  destroy() {
    this.view.destroy()
  }
}
