// Create a particle system with an initialize, update, and draw function
// Bees inspired by Professor Compton's bug particle system
class BeeParticleSystem {
    constructor() {
        console.log("Making bee particle system", this)

        // Array of pollen particles
        this.bees = []

        // Make some particles
        let beeCount = COUNT[this.constructor.name]
        for (let i = 0; i < beeCount; i++) {
            this.bees.push(new Bee())
        }
    }

    update(p) {
        while (this.bees.length < COUNT[this.constructor.name]) {
            this.bees.push(new Bee())
        }
        while (this.bees.length > COUNT[this.constructor.name]) {
            this.bees.pop()
        }
		this.bees.forEach(bee => bee.update(p))
	}

    draw(p) {
        let debugDraw = DEBUG_DRAW[this.constructor.name]
        p.push()
		p.noStroke()
		
		this.bees.forEach(bee => bee.draw(p))
		if (debugDraw) {
			this.bees.forEach(bee => bee.drawDebug(p))
		}
		p.pop()
    }
}

class Bee {
    constructor() {
        this.position = new Vector(Math.random()*500,Math.random()*300)
		this.velocity = Vector.polar(Math.random()*.1, Math.random()*200)

		this.angle = 0
		this.thrust = 0
        this.force = new Vector(0,0)

		this.antennae = [new Vector(0,0),new Vector(0,0)]
		this.antennae.forEach(antenna => antenna.value = 0)
    }

    update(p) {
        let dt = Math.min(.1, p.deltaTime*.001)
		let t = p.millis()*.001

        // Set the position of the antennae
        let antennaRadius = 10
        let antennaAngle = .9
        this.antennae[0].setToPolarOffset(this.position, antennaRadius, this.angle + antennaAngle)
        this.antennae[1].setToPolarOffset(this.position, antennaRadius, this.angle - antennaAngle)

        // Smell for pollen
        this.antennae.forEach(antenna => antenna.value = readHeatmapAt(antenna)[1]/255)
        // Bees LOVE pollen
        this.angle += 4*SLIDER.beeTurnSpeed*(this.antennae[0].value - this.antennae[1].value)
        this.thrust = Math.max(0, .8 - .5 * (this.antennae[0].value + this.antennae[1].value))

        this.force.setToPolar(.0002*SLIDER.beeThrust*this.thrust, this.angle)
        this.velocity.addMultiples(this.force, p.deltaTime)
        this.velocity.mult(1 - .1*SLIDER.beeDrag)
        this.position.addMultiples(this.velocity, p.deltaTime)

        // Wraparound
		this.position[0] = (this.position[0]+p.width)%p.width
		this.position[1] = (this.position[1]+p.height)%p.height

        // reset angle of bee
		this.angle = this.velocity.angle
    }

    draw(p) {
        let t = p.millis() * .001
		p.push()

		p.translate(...this.position)
		p.rotate(this.angle)

		p.stroke(0)

		let bodyWidth = 20
		let bodyLength = 30

        // bees based on these bees:
        // https://editor.p5js.org/skgmmt/sketches/r1wu_qDCm

        // wings
        let buzzWing = 20 + 10*Math.sin(t*10 % Math.PI)
        p.noStroke()
        p.fill(191, 100, 84)
        p.ellipse(-5, -5, 8, buzzWing)
        p.ellipse(-15, 5, 8, buzzWing)
        p.ellipse(-5, 5, 8, buzzWing)
        p.ellipse(-15, -5, 8, buzzWing)

        // body
        p.fill(57, 100, 62)
        p.ellipse (-bodyLength*.3, 0, bodyLength, bodyWidth);
        p.stroke(0);
        p.strokeWeight(5);
        p.line(-15, -5, -15, 5);
        p.line(0, 5, 0, -5);

        // antennae
        p.strokeWeight(2)
        let x1 = 5
        let y1 = 5
        let x2 = 10
        let y2 = 8
        p.line(x1, y1, x2, y2)
        y1 = -5
        y2 = -8
        p.line(x1, y1, x2, y2)

		p.pop()
	}

    drawDebug(p) {
        p.push()
        p.translate(...this.position)
        p.stroke(0, 0, 0)
        p.fill(0, 0, 100)
        let debugStr = "angle: " + this.angle + 
                       "\nforce: " + this.force.magnitude
        p.text(debugStr, 0, 0)
        p.pop()
    }
}