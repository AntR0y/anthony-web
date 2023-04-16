// Create a particle system with an initialize, update, and draw function
class ButterflyParticleSystem {
    constructor() {
        console.log("Making butterfly particle system", this)

        // Array of pollen particles
        this.butterflies = []

        // Make some particles
        let butterflyCount = COUNT[this.constructor.name]
        for (let i = 0; i < butterflyCount; i++) {
            this.butterflies.push(new Butterfly(this))
        }
    }

    update(p) {
        while (this.butterflies.length < COUNT[this.constructor.name]) {
            this.butterflies.push(new Butterfly(this))
        }
        while (this.butterflies.length > COUNT[this.constructor.name]) {
            this.butterflies.pop()
        }
		this.butterflies.forEach(butterfly => butterfly.update(p))
	}

    draw(p) {
        let debugDraw = DEBUG_DRAW[this.constructor.name]
        p.push()
		p.noStroke()
		
		this.butterflies.forEach(butterfly => butterfly.draw(p))
		if (debugDraw) {
			this.butterflies.forEach(butterfly => butterfly.drawDebug(p))
		}
		p.pop()
    }
}

let butterflyCount = 0
class Butterfly {
    constructor(roost) {
        this.id = butterflyCount++
        this.roost = roost

        this.position = new Vector(Math.random()*500, Math.random()*300)
        this.velocity = new Vector(0,0)//(Math.random()*.1, Math.random()*.1)

        this.angle = 0

        this.wander = new Vector(0, 0) // based on the wander force seen in Prof. Compton's boids code
        this.mouseAttraction = new Vector(0, 0)
        this.borderAversion = new Vector(0, 0)

        this.totalForce = new Vector(0, 0)
    }

    update(p) {
        let t = p.millis()*.001
        this.totalForce.mult(0)

        // border aversion
        let borderRange = 30
        // x
        if (this.position[0] < borderRange) {
            this.borderAversion[0] = borderRange - this.position[0]
        }
        else if (this.position[0] > p.width - borderRange) {
            this.borderAversion[0] = (p.width - borderRange) - this.position[0]
        }
        // y
        if (this.position[1] < borderRange) {
            this.borderAversion[1] = borderRange - this.position[1]
        }
        else if (this.position[1] > p.height - borderRange) {
            this.borderAversion[1] = (p.height - borderRange) - this.position[1]
        }
        this.borderAversion = this.borderAversion.mult(SLIDER.butterflyBorderForce/10000)

        // wander (pulled from Prof. Compton's boids code)
        this.wander.setToPolar(.001*p.noise(this.id, t*.2), 20*p.noise(this.id, t*.14))

        // mouse attraction
        this.mouseAttraction[0] = p.mouseX - this.position[0]
        this.mouseAttraction[1] = p.mouseY - this.position[1]
        this.mouseAttraction = this.mouseAttraction.mult(SLIDER.butterflyMouseAttraction/40000)

        // combine all forces
        this.totalForce.add(this.borderAversion)
        this.totalForce.add(this.wander)
        this.totalForce.add(this.mouseAttraction)

        this.velocity.addMultiples(this.totalForce, p.deltaTime)
        this.velocity.mult(1-.1*SLIDER.butterflyDrag)
        this.position.addMultiples(this.velocity, p.deltaTime)

		this.angle = this.velocity.angle
    }

    draw(p) {
        let t = p.millis() * .001

		p.push()
		p.translate(...this.position)
		p.rotate(this.angle)
        
		p.noStroke()

        let flapPct = (Math.sin((t * 4) % (2*Math.PI)) / 4) + .75
       
        // wings
        p.fill(55, 100, 50)
        p.ellipse(-5, 0, 15, 30*flapPct)
        p.fill(40, 100, 50)
        p.ellipse(5, 0, 15, 40*flapPct)

        // body
        p.fill(0, 0, 0)
        p.ellipse(0, 0, 30, 10)

        // antennae
        p.stroke(0, 0, 0)
        let x1 = 13
        let y1 = 2
        let x2 = 18
        let y2 = 4
        p.line(x1, y1, x2, y2)
        y1 = -y1
        y2 = -y2
        p.line(x1, y1, x2, y2)

		p.pop()
		
	}

    drawDebug(p) {
        this.wander.drawArrow({p,
            multiple: 100000,
            center: this.position,
            color: [0, 0, 0]
        })
        this.mouseAttraction.drawArrow({p,
            multiple: 100000,
            center: this.position,
            color: [65, 100, 50]
        })
        this.borderAversion.drawArrow({p,
            multiple: 100000,
            center: this.position,
            color: [90, 100, 50]
        })
    }
}