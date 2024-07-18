const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
const HTML = {
    mass: document.getElementById('mass'),
    gravity: document.getElementById('gravity'),
    charge: document.getElementById('charge'),
    electric: document.getElementById('electric'),
    time: document.getElementById('time'),
    pin: document.getElementById('pin'),
}

//-------------<Constant>-------------
const limitX = canvas.width
const limitY = canvas.height

const PI2 = Math.PI * 2
const sin = (seta) => { return Math.sin(seta) }
const cos = (seta) => { return Math.cos(seta) }
const print = (t) => { console.log(t) }

const setting = {
    G_SCALE: 100,
    K_SCALE: 1000000,
    VEL_LIMIT: 10,
}

//-------------<Function>-------------
function selectColor(color) {
    ctx.fillStyle = color
    ctx.strokeStyle = color
}

function drawLine(x1, y1, x2, y2) {
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
    ctx.closePath()
}

function distanceBetween(A, B) {
    return Math.sqrt((A.x - B.x) ** 2 + (A.y - B.y) ** 2)
}

function distanceBetweenSquare(A, B) {
    return ((A.x - B.x) ** 2 + (A.y - B.y) ** 2)
}

function applyGravityForce(A, B) {
    if (gravityConstant <= 0) {
        return
    }
    const r = distanceBetweenSquare(A.pos, B.pos)
    const Fg = gravityConstant * A.mass * B.mass / r ** 2
    const Fx = Fg * (B.x - A.x) / r
    const Fy = Fg * (B.y - A.y) / r
    A.applyForce(Fx, Fy)
    B.applyForce(-Fx, -Fy)
}

function applyElectricForce(A, B) {
    if (electricConstant <= 0) {
        return
    }
    const r = distanceBetweenSquare(A.pos, B.pos)
    const F = -electricConstant * A.charge * B.charge / r ** 2
    const Fx = F * (B.x - A.x) / r
    const Fy = F * (B.y - A.y) / r

    A.applyForce(Fx, Fy)
    B.applyForce(-Fx, -Fy)
}

function getLimitedVel(vel) {
    if (vel > setting.VEL_LIMIT) {
        return setting.VEL_LIMIT
    } else if (vel < -setting.VEL_LIMIT) {
        return -setting.VEL_LIMIT
    }
    return vel
}

//-------------<Class>-------------
class Vector {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
    add(vector2) {
        this.x += vector2.x
        this.y += vector2.y
    }
    mul(m) {
        this.x *= m
        this.y *= m
    }
    div(m) {
        this.x /= m
        this.y /= m
    }
    toStr() {
        return `(${this.x}, ${this.y})`
    }
    norm() {
        return Math.sqrt(this.x ** 2 + this.y ** 2)
    }
}

class DrawObject {
    constructor(x, y) {
        this.pos = new Vector(x, y)
    }
    get x() {
        return this.pos.x
    }
    get y() {
        return this.pos.y
    }
    draw() {}
    move() {}
}

class Ball extends DrawObject {
    constructor(x, y, velX, velY) {
        super(x, y)
        this.r = 5 + initMass / 10
        if (this.r > 30) {
            this.r = 30
        }
        this.mass = initMass
        this.charge = initCharge
        this.vel = new Vector(velX, velY)
        this.isPinned = isPin
    }
    draw() {
        selectColor('white')
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.r, 0, PI2)
        ctx.fill()
        ctx.closePath()
        selectColor('red')
        const norm = this.vel.norm()
        drawLine(this.x, this.y, this.x + this.vel.x * 15 / norm, this.y + this.vel.y * 15 / norm)
    }
    move() {
        if (this.isPinned) {
            return
        }
        this.pos.add(this.vel)
    }
    applyForce(Fx, Fy) {
        if (this.isPinned) {
            return
        }
        this.vel.x += Fx / this.mass
        this.vel.y += Fy / this.mass
        this.vel.x = getLimitedVel(this.vel.x)
        this.vel.y = getLimitedVel(this.vel.y)
    }
}

//-------------<Main>-------------
const renderList = []

ctx.lineWidth = 2

function render() {
    if (!isStarting) return
    ctx.clearRect(0, 0, limitX, limitY)
    for (var i in renderList) {
        renderList[i].draw()
        renderList[i].move()
    }
    for (var i = 0; i < renderList.length - 1; i++) {
        for (var j = i + 1; j < renderList.length; j++) {
            applyGravityForce(renderList[i], renderList[j])
            applyElectricForce(renderList[i], renderList[j])
        }
    }
}
setInterval(render, 0.01)

//-------------<Event>-------------
var initMass = 10
var initCharge = 1
var gravityConstant = 1
var electricConstant = 1
var isStarting = true
var isPin = false

HTML.mass.addEventListener('change', (event) => {
    initMass = event.target.value
})
HTML.charge.addEventListener('change', (event) => {
    initCharge = event.target.value
})
HTML.gravity.addEventListener('change', (event) => {
    gravityConstant = event.target.value * setting.G_SCALE
})
HTML.electric.addEventListener('change', (event) => {
    electricConstant = event.target.value * setting.K_SCALE
})
HTML.time.addEventListener('click', (event) => {
    isStarting = !isStarting
    HTML.time.innerHTML = isStarting
})
HTML.pin.addEventListener('click', (event) => {
    isPin = !isPin
    HTML.pin.innerHTML = isPin
})

canvas.addEventListener('click', (event) => {
    const clickPos = [event.offsetX, event.offsetY]
    renderList.push(new Ball(
        clickPos[0], clickPos[1],
        0, 0,
    ))
})