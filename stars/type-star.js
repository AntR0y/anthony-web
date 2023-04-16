// Array of floats class for stars -- based on Prof. Compton's type-fish.js
class Star {
	// Constructor for star class
	constructor(aof) {
		this.aof = aof
		this.center = new Vector()
	}

	update(t, dt) {
		// No update needed here
		// Updates are good for if you want to maintain more complicated state 
	}

	draw(p) {
		let t = p.millis()*.001

		p.push()
		// Move the stars around a bit -- From Prof. Compton's code
		p.translate(0, -200*p.noise(.2*t + this.id))
		p.rotate(1*p.noise(.3*t + this.id) - .5)

        let coreSaturation = 50
		let starColor = [this.aof.get("star color") * 360, 100, 50, .3] // Gaseous part of star, transparent
        let coreColor = [this.aof.get("core color") * 360, coreSaturation, 50, 1] // Dense part of star, opaque
        let starSize = this.aof.get("star size") * 100 // Size of whole star
        let coreSize = this.aof.get("core size") * starSize // Size of core as percentage of size of whole star
        let starGlow = (this.aof.get("brightness") + 1) * starSize // Reach of star's glow, can be as big as twice star's size

        p.noStroke()

        // draw core
        p.fill(...coreColor)
        p.circle(0, 0, coreSize)

        // draw gaseous star
        p.fill(...starColor)
        p.circle(0, 0, starSize)

        // draw glow
        p.noFill()
        let glowCount = starGlow - starSize
        let dGlow = .2/glowCount
        for (var i = 0; i < glowCount; i++) {
            let glowRadius = starSize + .5 + i
            let glowColor = starColor
            
            glowColor[3] = .2
            glowColor[3] -= dGlow*i
            p.stroke(...glowColor)
            p.circle(0, 0, glowRadius)
        }

        // let's draw some cool darkspots too make the star look like it's rotating!
        p.push()

        // first, let's fetch our parameters
        let rotationSpeed = Math.pow(100, this.aof.get("rotation speed")) / 10 // star's spped of rotation
        let darkspotCount = Math.floor(this.aof.get("darkspot count") * 100) // How many darkspots on the star
        let tilt = this.aof.get("tilt") * p.TWO_PI // Star's tilt

        // recalculate t for rotationSpeed
        let newT = t*rotationSpeed
        
        // tilt based on float val
        p.rotate(tilt)

        //! draw our  darkspots
        p.fill(0)
        for (var i = 0; i < darkspotCount; i++) {
            newT += p.TWO_PI*p.noise(i)
            let offset = (p.noise(i+this.id) - .5) * coreSize * 2
            let darkspotChord = 2 * Math.sqrt(Math.pow(coreSize, 2) - Math.pow(offset, 2))
            let xPos = Math.sin(newT) * darkspotChord/2
            let yPos = offset
                     
            let ellipseWidth = Math.min(6*p.noise(i+this.id), darkspotChord/2) * Math.cos(newT)
            let ellipseHeight = Math.min(2*p.noise(i+this.id+1), darkspotChord/2)
            if (newT%p.TWO_PI < p.HALF_PI || newT%p.TWO_PI > 3*p.TWO_PI/4) {
                p.fill(0, p.noise(i)/2)
                p.ellipse(xPos, yPos, ellipseWidth, ellipseHeight)
            }           
        }
        p.pop()
		p.pop()
	}
}

// Optional background: drawn once per population
Star.drawBackground = function(p) {
    p.background(0, .5)
}

// Static properties for this class
Star.landmarks = {
	"Sun": [0.142, 0.142, 0.590, 0.885, .655, .404, .190, .0],
    "Ol' Red": [0, 0, 1, .07, .1, .04, .9, .125],
    "Baby Blue" : [.5, .6, .25, .65, 1, .65, .05, .95],
    "Pulsar": [0.38, 0.61, 0.80, 0.44, 0.74, 1.00, 0.89, 0.26],
    "Willy" : [0.80,0.74,0.85,0.84,0.20,0.29,0.50,0.92],
    "Dudley" : [0.00,0.53,1.00,1.00,0.00,0.10,1.00,0.41]
}
Star.labels = ["star color", "core color", "star size", "core size", "brightness", "rotation speed", "darkspot count", "tilt"]