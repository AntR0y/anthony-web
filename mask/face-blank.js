
masks.blank = function( p) {
	// Make a white background
	p.background(100)

	// You can draw things in the background
	p.stroke(0)
	p.noFill()
	p.circle(0, 0, 300)

	// You can also draw things that are attached to the face
	p.circle(...face.center, 200)
	
	
	// Get the two side contours of the face
	let sideContours = face.sides.map(side => {
		return side.faceRings[0]
	})
	
	// Join them together into a single continous contour
	let faceContour = joinSides(...sideContours)
	let weight = SLIDER.b*10 + 1
	let lightness = SLIDER.a*60 + 20
	let hue = SLIDER.c*360
	p.stroke(hue, 100, lightness)

	p.strokeWeight(weight)
	p.fill(100)

	// Drawing contours is your most basic tool
	// A contour is an array of vectors (usually face points)
	// You can draw it smooth or normal, closed or open
	drawSmoothContour(p, faceContour, true)

	// Each face has a single center line
	drawContour(p, face.centerLine, false)

	face.sides.forEach(side => {
		// For each side
		
		// We can take slices of the contours to only draw part of them
		drawContour(p, side.nose[0].slice(-8), false)

		drawContour(p, side.eyeRings[1].slice(2,8), false)
		//drawContour(p, side.eyeRings[4], true)
	})
	

	
	drawContour(p, face.mouth[4], true)

	// Draw the test hand and 
	drawTestFacePoints(p)
	drawTestHandPoints(p)
	drawFaceDirection(p)
}
