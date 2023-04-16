// Create a particle system with an initialize, update, and draw function
// Pollen inspired by Professor Compton's snow particle system
class PollenParticleSystem {
    constructor() {
        console.log("Making pollen particle system", this)

        // Array of pollen particles
        this.pollen = []

        // Make some particles
        let pollenCount = COUNT[this.constructor.name]
        for (let i = 0; i < pollenCount; i++) {
            let pollenParticle = {
                idNumber: i,
                position: new Vector(Math.random()*500, Math.random()*300),
                velocity: new Vector(0, 0),
                wind: new Vector(0, 0),
                drag: new Vector(0, 0),
                separation: new Vector(0, 0)
            }
            this.pollen.push(pollenParticle)
        }
    }

    update(p) {
        // get time
        let t = p.millis() * .001
        let mass = 1

        while (this.pollen.length < COUNT[this.constructor.name] ) {
            let pollenParticle = {
                idNumber: this.pollen.length,
                position: new Vector(Math.random()*500, Math.random()*300),
                velocity: new Vector(0, 0),
                wind: new Vector(0, 0),
                drag: new Vector(0, 0),
                separation: new Vector(0, 0)
            }
            this.pollen.push(pollenParticle)
        }
        while (this.pollen.length > COUNT[this.constructor.name] ) {
            this.pollen.pop()
        }

        this.pollen.forEach(pt => {
            // calculate wind vector for pollen particle
            let pollenX = pt.position[0]/10
            let pollenY = pt.position[1]/10
            let windDirection = p.noise(pollenX*.01, pollenY*.01, t/10) * 2*Math.PI * 6
            let windForce = SLIDER.pollenWindForce / 50000
            pt.wind[0] = windForce * Math.cos(windDirection)
            pt.wind[1] = windForce * Math.sin(windDirection)

            // calculate drag vector
            let pseudoDragCoef = SLIDER.pollenDrag / 1000 // I'm not a physicist
            let dragForce = pseudoDragCoef * Math.sqrt(pt.velocity[0] * pt.velocity[0] + pt.velocity[1] * pt.velocity[1])
            let dragDir = Math.atan2(pt.velocity[1], pt.velocity[0]) + Math.PI
            pt.drag[0] = dragForce * Math.cos(dragDir)
            pt.drag[1] = dragForce * Math.sin(dragDir)

            // calculate separation vector
            // built from Prof. Compton's boids code
            let distVec = new Vector(0, 0)
            let sep = new Vector(0, 0)
            this.pollen.forEach(pol => {
                if (pol != pt) {
                    distVec.setToDifference(pt.position, pol.position)
                    let distance = distVec.magnitude
                    let range = 20
				    if (distance < range && distance !== 0) {
                        // Too close?
                        // Use how close we are to create an appropriate force pushing us away
                        let force = (distance - range)/range
                        sep.addMultiples(distVec, -1*force/distance)
				    }
                }
            })
            pt.separation = sep.mult(SLIDER.pollenSeparation/10000)

            // calculate accelleration
            let accelX = (pt.wind[0] + pt.drag[0] + pt.separation[0]) / mass
            let accelY = (pt.wind[1] + pt.drag[1] + pt.separation[1]) / mass

            pt.position[0] += pt.velocity[0]*p.deltaTime + .5*accelX*p.deltaTime*p.deltaTime
            pt.position[1] += pt.velocity[1]*p.deltaTime + .5*accelY*p.deltaTime*p.deltaTime
            if (pt.position[0] < 0) {
                pt.position[0] = p.width
            }
            if (pt.position[0] > p.width) {
                pt.position[0] = 0
            }
            if (pt.position[1] < 0) {
                pt.position[1] = p.height
            }
            if (pt.position[1] > p.height) {
                pt.position[1] = 0
            }
            
            pt.velocity[0] += accelX*p.deltaTime
            pt.velocity[1] += accelY*p.deltaTime
            
        })
        
    }

    draw(p) {
        p.background(185, 80, 65)
        let debugDraw = DEBUG_DRAW[this.constructor.name]
        let t = p.millis() * .001
        this.pollen.forEach(pt => {
            p.fill(59, 100, 50, p.noise(100*pt.idNumber + t/10))
            p.noStroke()
            p.circle(...pt.position, 20 * p.noise(pt.idNumber))
            if (debugDraw) {
                let x1 = pt.position[0]
                let y1 = pt.position[1]
                let windX = x1 + 1000000*pt.wind[0] // multiply by large num to make lines visible
                let windY = y1 + 1000000*pt.wind[1]
                let dragX = x1 + 1000000*pt.drag[0]
                let dragY = y1 + 1000000*pt.drag[1]
                let sepX = x1 + 1000000*pt.separation[0]
                let sepY = y1 + 1000000*pt.separation[1]
                
                p.stroke(100, 100, 0)
                p.line(x1, y1, windX, windY)
                p.stroke(20, 100, 50)
                p.line(x1, y1, dragX, dragY)
                p.stroke(100, 100, 100)
                p.line(x1, y1, sepX, sepY)
            }    
        })

        // testing if wind works
        let windPositions = []
        let scale = 10
        let rows = p.height/scale
        let cols = p.width/scale
        let drawWind = false // set this to true to see wind vectormap

        if (drawWind){
            let yoff = 0
            for (let y = 0; y <= rows; y++) {
                let xoff = 0
                for (let x = 0; x <= cols; x++) {
                    let index = x * y * cols
                    let windDirection = p.noise(xoff, yoff, t/10) * 2*Math.PI * 6
                    let windMagnitude = 10

                    let x1 = x * scale
                    let y1 = y * scale
                    let x2 = x1 + windMagnitude * Math.cos(windDirection)
                    let y2 = y1 + windMagnitude * Math.sin(windDirection)
                    p.stroke(100, 100, 0)
                    p.line(x1, y1, x2, y2)

                    xoff += .01
                }
                yoff += .01
            }
        }
    }

    // Draw INTO the heatmap
    // built from Prof. Compton's bugs code
	drawHeatmap(p, heatmapScale) {
        if (p.frameCount % 10 == 0) {
            p.background(0, 0, 0, 10)
        }
		p.fill(0, 0, 0, 1)

		p.rect(0, 0, p.width, p.height)
		p.push()
		p.scale(1/heatmapScale)
		p.fill(255, 0, 0)
		p.noStroke()
		this.pollen.forEach(pt => {
			p.fill(0, 255, 0)

			// Draw *behind* the pollen particle
			let pos = Vector.addMultiples(pt.position, 1, pt.velocity, -200)
			p.circle(...pos, 30)
		})

		p.pop()
	}
}