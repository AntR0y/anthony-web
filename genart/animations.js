// Utility functions
// Given a processing object, a pct around the circle, a radius, and an offset (optional)
function getLoopingNoise({
	p,
	loopPct,
	radius,
	offset = 0
}) {
  
  // This number should go from 0 to 1 every loopLength seconds
  // And PI*2 radians every loopLength seconds
 
  let theta = 2 * Math.PI * loopPct

  // Place to sample the noise from
  let x = radius * Math.cos(theta)
  let y = radius * Math.sin(theta)

  let noiseVal = p.noise(x + 100, y + 30, offset)

  return noiseVal
}

// Each animation is represented an object
// with a title, setup, and draw function
let animations = [
	/* 
	   This one is a LOT of lines, each with endpoints
	   slightly offset from each other. Each line's 
	   endpoints travel along the borders of the canvas,
	   and for each line, one endpoint is slow,
	   and the other endpoint is fast.
	*/
	{
		title: "REACTOR",

		draw: function(p) {
			// black background
			p.background(0, 0, 0)

			// keep track of time in seconds
			let t = p.millis()*.001
			//t *= 10 // and then speed it up! (so I don't have to record a minute long GIF)

			// initialize coordinates for line endpoints
			let x1 = 0
			let y1 = 0
			let x2 = 0
			let y2 = 0

			// other settings
			slowSpeed = 20
			fastSpeed = 80
			slowOffset = 5
			fastOffset = 15

			for (i = 0; i < 240; i++) { //240
				// DRAWING COORD 1 - THE SLOW ONE
				// along top border
				if ((t*slowSpeed + i*slowOffset) % (2*(p.width+p.height)) > (p.width + 2*p.height)) {
					x1 = (t*slowSpeed + i*slowOffset) % p.width
					y1 = 0
				}
				// along left border
				else if ((t*slowSpeed + i*slowOffset) % (2*(p.width+p.height)) > (p.width + p.height)) {
					x1 = 0
					y1 = p.height - ((t*slowSpeed + i*slowOffset) % p.height)
				}
				//along bottom border
				else if ((t*slowSpeed + i*slowOffset) % (2*(p.width+p.height)) > (p.height)) {
					x1 = p.width - ((t*slowSpeed + i*slowOffset) % p.width)
					y1 = p.height
				}
				//along right border
				else {
					x1 = p.width
					y1 = (t*slowSpeed + i*slowOffset) % p.height
				}

				// DRAWING COORD 2 - THE FAST ONE
				// along top border
				if ((t*fastSpeed + i*fastOffset) % (2*(p.width+p.height)) > (p.width + 2*p.height)) {
					x2 = (t*fastSpeed + i*fastOffset) % p.width
					y2 = 0
				}
				// along left border
				else if ((t*fastSpeed + i*fastOffset) % (2*(p.width+p.height)) > (p.width + p.height)) {
					x2 = 0
					y2 = p.height - ((t*fastSpeed + i*fastOffset) % p.height)
				}
				//along bottom border
				else if ((t*fastSpeed + i*fastOffset) % (2*(p.width+p.height)) > (p.height)) {
					x2 = p.width - ((t*fastSpeed + i*fastOffset) % p.width)
					y2 = p.height
				}
				//along right border
				else {
					x2 = p.width
					y2 = (t*fastSpeed + i*fastOffset) % p.height
				}

				// set up brush
				//let hue = (t*6)%360
				let hue = (t*30)%360
				p.strokeWeight(1)
				p.stroke(hue, 100, 50)

				// draw line
				p.line(x1, y1, x2, y2)
			}
		}
	},

	/* 
	   This one uses perlin noise, polar coordinates 
	   and some non-oblique alpha values. Inspired by the 
	   generative art at the following link by Etienne Jacob.
	   https://necessary-disorder.tumblr.com/post/174861564638
	 */	
	{
		title: "CHANDALIER",

		setup: function(p) {
			p.background(0, 0, 0)
		},

		draw: function(p) {
			// black background
			//p.background(0, 0, 0)
			p.background(0, 0, 0, 0.1)

			// keep track of time in seconds
			let t = p.millis()*.001

			// set origin to center
			p.push()
			//p.translate(p.width/2, 5*p.height/8)
			p.translate(p.width/2, p.height/2)

			// set up brush
			p.color(0)
			p.stroke(0, 0, 100)
			p.strokeWeight(.5)
			
			let homeX = 0
			let homeY = 0
			p.circle(homeX, homeY, 3)

			// draw dots
			circleCount = 500
			polarRadius = 125
			let dTheta = (Math.PI*2/circleCount)
			for (i = 1; i <= circleCount; i++) {
				let theta = dTheta*i

				let noisyRadius = polarRadius*p.noise(t/5-i*10000)
				
				let x = noisyRadius*Math.cos(theta) + Math.sin(t)*20
				let y = noisyRadius*Math.sin(theta)
				p.circle(x, y, 2)

				
				p.stroke(0, 0, 100, .05)
				p.line(homeX, homeY, x, y)

			}
				
			p.pop()
		}
	},


	/* This one also uses perlin noise. I can't find the Pintrest
	   post that inspired it though. :( Needless to day, the 
	   original art was far cooler. Dots didn't travel in elipses,
	   and there was this neat particle effect going on.
		
	   The idea is that a grid of dots is generated, and each dot
	   travels in an eliptical path that depends on the value of
	   perlin noise associated with that dot's coordinates. This way,
	   each dot has a different path. Then, I draw lines between 
	   each pair of adjacent dots in the grid with a brightness
	   inversely proportional to the distance between those two dots.

	   The result is a neat, pseudo-random faze through polygons
	 */
	{
		title: "MURPHY",

		draw: function(p) {
			p.background(0, 0, 0)

			// keep track of time in seconds
			// fast forward by adding 100 seconds
			let t = p.millis()*.001 + 100
			
			// some settings
			let count = 10
			p.noiseDetail(4)
			let iMult = p.width/(count+1)
			let jMult = p.height/(count+1)

			// create dots array of (x,y) coords
			let dots = new Array(count)
			for (i=0; i < dots.length; i++) {
				dots[i] = new Array(count);
			}
			for (i=0; i<count; i++) {
				for (j=0; j<count; j++) {
					temp = [(i+1)*iMult, (j+1)*jMult]
					dots[i][j] = temp
				}
			}

			// create the dots!
			let circleSize = 2
			let polarRadius = 30
			for (i=0; i<dots.length; i++) {
				for (j=0; j<dots[i].length; j++) {
					let x = dots[i][j][0]
					let y = dots[i][j][1]
					
					let noisyXRadius = polarRadius*p.noise(x, y)
					let noisyYRadius = polarRadius*p.noise(i, j)					

					dots[i][j][0] += noisyXRadius*Math.cos(t*p.noise(i,j))
					dots[i][j][1] += noisyYRadius*Math.sin(t*p.noise(i,j))
					
					for (a=i-1; a<i+1; a++) {
						if (a==i-1) {
							for (b=j-1; b<=j+1; b++) {
								if (a < 0 || a >= dots.length || b < 0 || b >= dots.length) {
									continue
								}
								let x1 = dots[i][j][0]
								let y1 = dots[i][j][1]
								let x2 = dots[a][b][0]
								let y2 = dots[a][b][1]

								let dist = Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2))
								let sumNoise = p.noise(x1, y1) + p.noise(x2, y2)
								noiseBrightness = 1 - Math.abs(1-sumNoise)

								let brightness = 100-dist*3
								if (brightness > 0) {
									p.strokeWeight(1)
									p.stroke(360*((x+y)/(p.width+p.height)), 20, brightness)
									p.line(x1, y1, x2, y2)
								}
							}
						}
						else {
							for (b=j-1; b<j; b++) {
								if (a < 0 || a >= dots.length || b < 0 || b >= dots.length) {
									continue
								}
								let x1 = dots[i][j][0]
								let y1 = dots[i][j][1]
								let x2 = dots[a][b][0]
								let y2 = dots[a][b][1]
								
								let dist = Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2))
								let sumNoise = p.noise(x1, y1) + p.noise(x2, y2)
								noiseBrightness = 1 - Math.abs(1-sumNoise)

								let brightness = 100-dist*3
								if (brightness > 0) {
									p.strokeWeight(1)
									p.stroke(360*((x+y)/(p.width+p.height)), 20, brightness)
									p.line(x1, y1, x2, y2)
								}
							}
						}
					}
				}
			}
		}
	}
]