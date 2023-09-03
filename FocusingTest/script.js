const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

class Vector {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
    add(vec2) {
        this.x += vec2.x
        this.y += vec2.y
    }
    subtract(vec2) {
        this.x -= vec2.x
        this.y -= vec2.y
    }
    valueOf() {
        return [this.x, this.y]
    }
    copy() {
        return new Vector(this.x, this.y)
    }
}

const FocusIndex = 4
const O = new Vector(canvas.width / 2, canvas.height / 2)

class Ball {
    constructor(x, y, velX, velY) {
        this.pos = new Vector(x, y)
        this.vel = new Vector(velX, velY)
    }
    get x() {
        return this.pos.x
    }
    get y() {
        return this.pos.y
    }
    move() {
        this.pos.add(this.vel)
    }
    draw() {
        let drawPos = this.pos.copy()
        ctx.beginPath()
        if (FocusIndex != undefined) {
            drawPos.subtract(balls[FocusIndex].pos)
            drawPos.add(O)
            console.log(drawPos)
        }
        ctx.arc(drawPos.x, drawPos.y, 10, 0, 2 * Math.PI)
        ctx.fill()
        ctx.closePath()
    }
}

const balls = [
    new Ball(100, 100, 0.1, 0),
    new Ball(200, 100, 0, 0.1),
    new Ball(300, 100, 0.1, 0.05),
    new Ball(200, 200, 0, 0.1),
    new Ball(600, 0, -0.1, 0.2),
    new Ball(200, 700, 0, -0.2),
    new Ball(700, 700, -0.1, 0),
    new Ball(600, 500, 0, -0.1),
]

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (var i in balls) {
        balls[i].draw()
        balls[i].move()
    }
    requestAnimationFrame(render)
}

render()