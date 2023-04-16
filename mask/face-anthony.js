class GlitchMask {
    constructor() {
        console.log("CONSTRUCT")
        this.pts = []
        this.ptsModified = []
        this.first = true
    }

    draw(p) {
        p.background(0)
        p.noStroke()
        p.fill(100)

        // IF THIS IS THE FIRST FRAME WE'RE DRAWING, BUILD 2D ARRAY OF FACE POINT INDICES IN this.points
        if (this.first) {
            
            // make clean version of face.centerLine (i.e. remove really crowded points)
            // we'll use centerline further down to sort face points into rows
            let cleanCenterLine = face.centerLine
            let cleanDist = 10 // if centerline points are this close together, remove them
            for (var i = cleanCenterLine.length - 1; i > 0; i--) {
                if ((cleanCenterLine[i][1] - cleanCenterLine[i-1][1]) > cleanDist) {
                    cleanCenterLine.splice(i, 1)
                }
            }

            // sort face point indices into rows by point's y-coord, using centerline coords
            // all indices in a given row correspond to face points that are all closest to the came centerLine point
            face.points.forEach(pt => {
                let closest = 0
                let dst = 1000000 // eeeh this is big enough
                for (var i = 0; i < cleanCenterLine.length; i++) {
                    let c = cleanCenterLine[i]
                    if (Math.abs(pt[1] - c[1]) < dst) {
                        dst = Math.abs(pt[1] - c[1])
                        closest = i
                    }
                }
                if (this.pts[closest] == undefined) {
                    this.pts[closest] = [pt.index]
                } else {
                    this.pts[closest].push(pt.index)
                }
            })

            // remove all empty, undefined rows, just in case
            for (var i = this.pts.length-1; i >= 0; i--) {
                if (this.pts[i] == undefined) {
                    this.pts.splice(i, 1)
                }
            }

            // now sort all indices in each row by the x coords of the points they represent
            this.pts.forEach(row => {
                row.sort((i1, i2) => {
                    return (face.points[i1][0] - face.points[i2][1])
                })
            })

            // clone face.points into this.ptsModified 
            // I modify this.ptsModified when implimenting "glitch," 
            // although I honestly don't know if I need to do this
            face.points.forEach(pt => {
                this.ptsModified.push(pt.clone())
            })

            //set this.first to false so we know not to do these expensive computations each frame
            this.first = false
        }

        // IF THIS ISN'T THE FIRST FRAME WE'RE DRAWING, JUST DRAW
        else {
            // first, impliment glitch for face points
            // lets make the face points travel around in little noisy ellipses
            let t = p.millis() * .001
            let polarRadius = SLIDER.glitch * 5
            p.noiseDetail(4)
            face.points.forEach(pt => {
                let x = pt[0] // pt's x coordinate
                let y = pt[1] // pt's y coordinate

                if (polarRadius != 0) {
                    let noisyXRadius = polarRadius * p.noise(x, y) * Math.cos(t * p.noise(pt.index))
                    let noisyYRadius = polarRadius * p.noise(x, y) * Math.sin(t * p.noise(pt.index))
                    this.ptsModified[pt.index][0] = x + noisyXRadius
                    this.ptsModified[pt.index][1] = y + noisyYRadius
                }
                else {
                    this.ptsModified[pt.index][0] = x
                    this.ptsModified[pt.index][1] = y
                }
            })      
            
            // set a bunch of params for drawing
            let dist = 15 * SLIDER.lineCount * 2
            let fingerDist = 70 // how close finger points need to be in order to draw line b/w them
            let palmDist = 100 // how close palm points need to be in order to draw line b/w them
            let connectNum = Math.ceil(SLIDER.lineCount * 6) // how many lines to draw b/w face points in diff rows
            let offset = Math.floor(connectNum / 2) // handy var
            let maxBrightness = SLIDER.faceHandsBrightness*100 // brightness of face and hand lines
            let eyeBrightness = SLIDER.eyeBrightness*100 // bridghtness of eyes
            let h = SLIDER.hue * 360 // hue of face, hands, and eyes
            let s = SLIDER.saturation * 100 // saturation of face, hands, and eyes

            // DRAW FACE LINES
            // iterate through every "row"
            for (var row = 0; row < this.pts.length - 1; row++) {

                // iterate through every "col" and get our point
                for (var col = 0; col < this.pts[row].length; col ++) {
                    let ind1 = this.pts[row][col]
                    let pt1 = this.ptsModified[ind1]

                    // iterate through a few points in the row beneath us
                    let k = Math.max(Math.floor((col/this.pts[row].length) * this.pts[row+1].length) - offset, 0)
                    let limit = Math.min((k + connectNum), this.pts[row+1].length)
                    for (k = 0; k < limit; k++) { // before I just went to end of row+1
                        let ind2 = this.pts[row+1][k]
                        let pt2 = this.ptsModified[ind2]
                        // are pt1 and pt2 close enought to draw a line between?
                        let actualDist = Math.sqrt(Math.pow((pt1[0] - pt2[0]), 2) + Math.pow((pt1[1] - pt2[1]), 2))
                        if (actualDist <= dist) {
                            p.noFill()
                            let l = (dist - actualDist) * (maxBrightness / dist)
                            p.stroke(h, s, l)
                            p.strokeWeight(1)
                            p.line(...pt1, ...pt2)
                        }
                    }

                    // now draw lines between points next to each other in same row
                    if (col + 1 < this.pts[row].length) {
                        let ind2 = this.pts[row][col + 1]
                        let pt2 = this.ptsModified[ind2]
                        let actualDist = Math.sqrt(Math.pow((pt1[0] - pt2[0]), 2) + Math.pow((pt1[1] - pt2[1]), 2))
                        if (actualDist <= dist) {
                            p.noFill()
                            let l = (dist - actualDist) * (maxBrightness / dist)
                            p.stroke(h, s, l)
                            p.strokeWeight(1)
                            p.line(...pt1, ...pt2)
                        }
                    }
                }
            }

            // DRAW HAND LINES
            hand.forEach(aHand => {

                // draw fingees
                aHand.fingers.forEach(finger => {
                    for(var i = 0; i < finger.length - 1; i++) {
                        let pt1 = finger[i]
                        let pt2 = finger[i+1]
                        let actualDist = Math.sqrt(Math.pow((pt1[0] - pt2[0]), 2) + Math.pow((pt1[1] - pt2[1]), 2))
                        if (actualDist <= fingerDist) {
                            let l = (fingerDist - actualDist) * (maxBrightness / fingerDist)
                            l *= 1 + SLIDER.glitch*Math.sin(t) // implement "glitch" by modifying brightness of hand lines
                            p.noFill()
                            p.stroke(h, s, l)
                            p.strokeWeight(1)
                            p.line(...pt1, ...pt2)
                        }
                    }
                })

                // draw palmees
                // hard set indices for palm lines
                let palmLines = [[0, 1],
                                 [1, 5],
                                 [5, 9],
                                 [9, 13],
                                 [13, 17],
                                 [17, 0],
                                 [0, 21],
                                 [1, 21],
                                 [5, 21],
                                 [9, 21],
                                 [13, 21],
                                 [17, 21],]
                palmLines.forEach(palmLine => {
                    let pt1 = aHand.points[palmLine[0]]
                    let pt2 = aHand.points[palmLine[1]]
                    let actualDist = Math.sqrt(Math.pow((pt1[0] - pt2[0]), 2) + Math.pow((pt1[1] - pt2[1]), 2))
                    if (actualDist <= palmDist) {
                        let l = (palmDist - actualDist) * (maxBrightness / palmDist)
                        l *= 1 + SLIDER.glitch*Math.sin(t*2) // implement "glitch" by modifying brightness of hand lines
                        p.noFill()
                        p.stroke(h, s, l)
                        p.strokeWeight(1)
                        p.line(...pt1, ...pt2)
                    }
                })

                // DRAW EYES >:]
                let eye1 = face.sides[0].eye
                let eye2 = face.sides[1].eye
                let l1 = eyeBrightness/2
                let l2 = eyeBrightness
                p.noStroke()

                // EYE 1
                let width = Vector.getDistance(face.points[246], face.points[173]) - 15
                let height = Vector.getDistance(face.points[145], face.points[159]) - 7.5

                let eyeAngleVec = face.points[246].clone().addMultiples(face.points[173], -1)
                let eyeAngle = eyeAngleVec.angle
                
                p.push()
                p.translate(...eye1)
                p.rotate(eyeAngle)
                
                // outer eye ellipse
                p.fill(h, s, l1, .2)
                p.ellipse(0, 0, width, height)

                // middle eye ellipse
                width = width/1.5
                height = height/1.5
                p.fill(h, s, l2, .5)
                p.ellipse(0, 0, width, height)

                // inner eye ellipse
                width = width/2
                height = height/2
                p.fill(h, s, l2, .7)
                p.ellipse(0, 0, width, height)
                p.pop()
                
                // EYE 2
                width = Vector.getDistance(face.points[398], face.points[466]) - 15
                height = Vector.getDistance(face.points[374], face.points[386]) - 7.5

                eyeAngleVec = face.points[398].clone().addMultiples(face.points[446], -1)
                eyeAngle = eyeAngleVec.angle

                p.push()
                p.translate(...eye2)
                p.rotate(eyeAngle)

                // outer eye ellipse
                p.fill(h, s, l1, .2)
                p.ellipse(0, 0, width, height)

                // middle eye ellipse
                width = width/1.5
                height = height/1.5
                p.fill(h, s, l2, .5)
                p.ellipse(0, 0, width, height)

                // inner eye ellipse
                width = width/2
                height = height/2
                p.fill(h, s, l2, .7)
                p.ellipse(0, 0, width, height)
                p.pop()
            })
        }
    }

    update(t, dt, frameCount) {
        //console.log("nothing! >:[")
    }
}
masks.glitch = GlitchMask