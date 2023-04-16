
let positions = []
let windPos = 0

let tool = {
	color0: [230,50,50],
	color1: [120,70,25],
	size: 1,
	mode: "riverBrush",
	label: "River"
}

let lastMouse = [0,0]
let mouse = [0,0]

let tools = {
	// This tool clears the canvas in a hopefully fun way
	blowAway(p, size, color0, color1) {
		// coordinates for the "wind line"
		p0 = [windPos, 0]
		p1 = [windPos, p.height]

		// coordinates for the "erase line"
		p2 = [windPos-1, 0]
		p3 = [windPos-1, p.height]
		p4 = [windPos-2, 0]
		p5 = [windPos-2, p.height]

		// draw the "wind line"
		p.stroke(...color0)
		p.line(...p0, ...p1)

		// draw the "erase line"
		p.erase()
		p.line(...p2, ...p3)
		p.line(...p4, ...p5)
		p.noErase()
		console.log(windPos)
		windPos = (2+windPos) % Math.floor((p.width + 30))
	},

	riverBrush (p, size, color0, color1) {
		let mouse = [p.mouseX, p.mouseY]
		positions.push(mouse)
		let t = p.millis() *.001

		// some tool-specific parameters for building our brush marks
		let posStep = 5			// How many past mouse positions to step when building curve
		let length = 20 		// How many points used to build curve
		let count = 10 			// How many curves to build at each draw
		let curvePoints = []	// Points used to build curve
		
		// some Processing parameters
		p.noFill()
		p.strokeWeight(1)
		
		// if we don't have that many mouse positions accumulated yet, build a shorter curve
		if (positions.length < length*posStep && positions.length > posStep) {
			console.log(positions.length)
			// new, shorter length
			length = Math.ceil(positions.length/posStep) 

			// gather points to build curve
			for (i=0; i<length; i++) {
				curvePoints.push(positions[positions.length-1-i*posStep])
			}

			// draw our curves
			for (i=0; i<count; i++) {
				// pick color of curve
				if (i % 2 == 0) {
					p.stroke(...color0, Math.random()/(length))
				}
				else {
					p.stroke(...color1, Math.random()/(length))
				}
				
				// draw curve
				p.beginShape()
				for (j=0; j<length; j++) {
					let newX = curvePoints[j][0] + i*size*(p.noise(t+i/5+j/5)-.5)
					let newY = curvePoints[j][1] + i*size*(p.noise(t+i/5+j/5)-.5)
					p.curveVertex(newX, newY)
				}
				p.endShape()
			}
		}
		// if we have enough accumulated mouse positions, build a long curve
		else if (positions.length >= length*posStep) {
			
			// gather points to build curve
			for (i=0; i<length; i++) {
				curvePoints.push(positions[positions.length-1-i*posStep])
			}

			//pick color of curve
			for (i=0; i<count; i++) {
				if (i % 2 == 0) {
					p.stroke(...color0, Math.random()/(length))
				}
				else {
					p.stroke(...color1, Math.random()/(length))
				}
				
				// draw curve
				p.beginShape()
				for (j=0; j<length; j++) {
					let newX = curvePoints[j][0] + i*size*(p.noise(t+i/5+j/5)-.5)
					let newY = curvePoints[j][1] + i*size*(p.noise(t+i/5+j/5)-.5)
					p.curveVertex(newX, newY)
				}
				p.endShape()
			}
		}
	},

	grassBrush(p, size, color0, color1) {
		let t = p.millis()*.001

		// some tool-specific parameters for building our brush marks
		let grassCount = 10 // how many curves (stalks of grass) to build at each draw
		
		// some processing parameters
		p.noFill()
		p.strokeWeight(1)

		// draw a patch of grass
		for (i = 0; i < grassCount; i++) {
			let offset = 2*(Math.random()-.5)*i // how far to draw a stalk of grass from the mouse position

			// pick color of curve
			if (i % 2 == 0) {
				p.stroke(...color0, .5*Math.random())
			}
			else {
				p.stroke(...color1, .5*Math.random())
			}

			let length = size*5 + size*5*p.noise(t)*Math.random() // length of curve
			let step = length/3 // how far apart to place Bezier curve endpoints and control points
			let root = [p.mouseX + offset, p.mouseY] 		// one Bezier curve endpoint
			let tip = [p.mouseX + offset, p.mouseY-length] 	// the other Bezier curve endpoint
			let control1 = [p.mouseX + (Math.random()-.5) * 2 * size + offset, p.mouseY-step]	// one Bezier curve control point
			let control2 = [p.mouseX + (Math.random()-.5) * 2 * size + offset, p.mouseY-step*2] // the other Bezier curve control point
			p.bezier(...root, ...control1, ...control2, ...tip) // draw the Bezier curve
		}
		
	},

	petalBrush(p, size, color0, color1) {
		let t = p.millis() * .001
		let mouse = [p.mouseX, p.mouseY]

		// tool-specific parameters
		let count = 2 // how many petals to build at each draw

		// some Processing parameters
		p.noStroke()
		p.fill(...color0, .5 * Math.random())

		for (i=0; i<count; i++) {
			// pick petal color
			if (i%2 == 0) {
				p.fill(...color0, .5 * Math.random())
			}
			else {
				p.fill(...color1, .5 * Math.random())
			}

			// petal dimensions
			let petalLength = 6 * size*p.noise(t*.1)/1.5
			let petalWidth = 2 * size*p.noise(t*.1)/1.5
			
			// petal angle
			let theta = Math.PI*2*Math.random()

			// random petal offset
			mouse[0] += 3*size*(Math.random()-.5)
			mouse[1] += 3*size*(Math.random()-.5)


			// draw petal
			p.beginShape()
			p.curveVertex(mouse[0] + petalLength*Math.cos(theta), mouse[1] + petalLength*Math.sin(theta))
			p.curveVertex(mouse[0] + petalLength*Math.cos(theta), mouse[1] + petalLength*Math.sin(theta))
			p.curveVertex(mouse[0] + petalWidth*Math.cos(theta+Math.PI/2), mouse[1] + petalWidth*Math.sin(theta+Math.PI/2))
			p.curveVertex(mouse[0] + petalLength*Math.cos(theta+Math.PI), mouse[1] + petalLength*Math.sin(theta+Math.PI))
			p.curveVertex(mouse[0] + petalWidth*Math.cos(theta+3*Math.PI/2), mouse[1] + petalWidth*Math.sin(theta+3*Math.PI/2))
			p.curveVertex(mouse[0] + petalLength*Math.cos(theta), mouse[1] + petalLength*Math.sin(theta))
			p.curveVertex(mouse[0] + petalLength*Math.cos(theta), mouse[1] + petalLength*Math.sin(theta))
			p.endShape()
		}

	}
}