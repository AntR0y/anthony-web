

class DeforestSimulation {
	// Some number of grids
	constructor(mode, dimensions, tileSize) {
		this.idNumber = simCount++
		// Mode can control various factors about the simulation
		this.dimensions = dimensions
		this.mode = mode
		this.tileSize = tileSize
		
		this.selectedCell = [3, 4]

		
		// Your simulation can have multiple layers, 
		// for example, it might have a 
		//  - a layer of sheep emoji, and a noise field of grass layers and a layer of wind vectors
		//  - a single layer of true/false for Game of Life
		
		this.humidity = createGrid(...dimensions) // a float between 0 and 1; more or less amounts to fire aversion
		this.tree = createGrid(...dimensions) // bool
		this.fire = createGrid(...dimensions) // bool
		this.fireCount = createGrid(...dimensions) // int; how long fire has been burning, 0 if no fire
		this.fireChance = createGrid(...dimensions) // float; chance of fire in cell

		// Set up the grid with its initial values
		this.initialize()
	}


	initialize() {
		// A random place to sample noise from 
		let seedValue = Math.random()*1000
		console.log("init!")

		setGrid(this.humidity, (x, y) => {
			// Use the seedValue to make it different each time
			let scale = .2
			let h = noise(x*scale, y*scale, seedValue)

			if (this.mode == "healthy") {
				h += .5
			}
			else if (this.mode == "freeform") {
				let humidityChange = ((document.getElementById("humidity").value)/100) - .5
				h += humidityChange
				h = Math.max(0, Math.min(1, h))
			}

			return h			
		})
		
		// now let's plant the trees!
		// create list of all possible coordinates in sim
 		let treeCords = []
		for (var i = 0; i < this.dimensions[0]; i++) {
			for (var j = 0; j < this.dimensions[1]; j++) {
				treeCords = treeCords.concat([[i, j]])
			}
		}
		
		// sort list of coords in decreasing order of humidity
		treeCords.sort((a, b) => {
			let humA = this.humidity[a[0]][a[1]]
			let humB = this.humidity[b[0]][b[1]]
			return humB - humA
		})

		// what percent of forest is covered in trees? Place trees in most humid cells
		let treePercent = 0
		if (this.mode == "healthy") {
			treePercent = .9
		}
		else if (this.mode == "dryer") {
			treePercent = .9
		}
		else if (this.mode == "deforestation") {
			treePercent = .45
		}
		else { // we're in freeform mode
		 	treePercent = (document.getElementById("treeCover").value)/100
		}
		let thresholdHumLoc = treeCords[Math.floor((treeCords.length - 1) * treePercent)]
		let thresholdHum = this.humidity[thresholdHumLoc[0]][thresholdHumLoc[1]]
		setGrid(this.tree, (x, y) => {
			return (this.humidity[x][y] > thresholdHum)
		})

		setGrid(this.fire, (x, y) => {
			// Where's the fire?
			return false
		})

		setGrid(this.fireCount, (x, y) => {
			// How long has the fire been burning?
			return 0
		})

		setGrid(this.fireChance, (x, y) => {
			return 0
		})
	}



	// When we update the simulation, 
	// we want write our next moves into a temporary "next-step" grid
	// And then once all the updates are done, 
	// copy that back into the original grid 

	step() {
		let diffusionRate = .1 // rate at which humidity diffuses across tiles per step
		let dTreeHumidity = .01 // rate at which tree changes tile's humidity per step
		let dFireHumidity = .12 // rate at which fire changes tile's humidity per step

		let nextHumidityGrid = createGrid(...this.dimensions)
		setGrid(nextHumidityGrid, (x, y) => {
			// current humidity value
			let hum = this.humidity[x][y]

			// raise/lower tile's humidity depending on whether tile is on fire or not
			if (this.tree[x][y]) {
				hum += dTreeHumidity
			}
			else if (this.fire[x][y]) {
				hum -= dFireHumidity
			}

			// diffuse humidity over time (heavilly inspired by Prof. Compton's waterflow code)
			let neighbors = this.getEightNeighborPositions(x, y)
			// for each neighbor
			neighbors.forEach(n => {
				let dHum = hum - this.humidity[n[0]][n[1]] // diff between curr cell's and neigh cell's humidity

				// does humidity leak in or out?
				hum += -dHum * diffusionRate
			})

			hum = Math.min(1, Math.max(0, hum))
			
			return hum
		})
		copyGrid(this.humidity, nextHumidityGrid)

		// setGrid(this.humidity, (x, y) => {
		// 	// raise/lower tile's humidity depending on whether tile is on fire or not
		// 	let hum = this.humidity[x][y]
		// 	if (this.tree[x][y]) {
		// 		hum += dTreeHumidity
		// 	}
		// 	else if (this.fire[x][y]) {
		// 		hum -= dFireHumidity
		// 	}

		// 	// diffuse humidity over time (heavilly inspired by Prof. Compton's waterflow code)
		// 	let neighbors = this.getNearestNeighborPositions(x, y)
		// 	// for each neighbor
		// 	neighbors.forEach(n => {
		// 		let dHum = hum - this.humidity[n[0]][n[1]] // diff between curr cell's and neigh cell's humidity

		// 		// does humidity leak in or out?
		// 		hum += -dHum * diffusionRate
		// 	})

		// 	hum = Math.min(1, Math.max(0, hum))
			
		// 	return hum
		// })

		// grow trees
		setGrid(this.tree, (x, y) => {
			let neighbors = this.getEightNeighborPositions(x, y)
			
			// if there's no tree but adequate humidity to grow a new tree
			if (!this.tree[x][y] && this.humidity[x][y] > .6) {

				// count num of adjacent trees
				let adjTreeCount = 0
				neighbors.forEach(n => {
					if (this.tree[n[0]][n[1]]) {
						adjTreeCount++
					}
				})
				
				// if 3 or more adj trees, 1% chance of new tree per step
				if (adjTreeCount >= 3 && Math.random() > .99) {
					if (!this.fire[x][y]) {
						return true
					}
				}
				else {
					return false
				}
			}

			if (!this.fire[x][y] && this.tree[x][y]) {
				return true
			}
		})

		// calculate fireChance
		setGrid(this.fireChance, (x, y) => {
			let fc = 0
			let tooDry = .3
			this.humidity[x][y] < tooDry ? fc = .1 : fc = 0

			let adjFireCount = 0
			let neighbors = this.getEightNeighborPositions(x, y)
			neighbors.forEach(n => {
				if (this.fire[n[0]][n[1]]) {
					adjFireCount++
				}
			})
			// fc = Math.max(fc, ((1 - this.humidity[x][y])/20) * adjFireCount)
			fc += (1 - this.humidity[x][y])/20 * adjFireCount
			return fc
		})

		// set fires
		setGrid(this.fire, (x, y) => {
			// if no fire
			if (!this.fire[x][y]) {
				// and if no tree to catch on fire
				if (!this.tree[x][y]) {
					// then no fire
					return false
				}
				// but there's a tree that could catch fire
				else {
					// is there a fire?
					if (Math.random() < this.fireChance[x][y]) {
						this.tree[x][y] = false
						return true
					}
					else {
						false
					}
				}
			}
			// if there is a fire
			else {
				// count up the fire counter
				this.fireCount[x][y]++
				this.fireCount[x][y] %= 10

				// if the fire's timed out, the fire ends - otherwise, it continues
				if (this.fireCount[x][y] == 0) {
					return false
				}
				else {
					return true
				}
			}
		})
	}

	draw(p) {
		p.background(196, 100, 80)
		// Draw each cell
		let w = this.dimensions[0]
		let h = this.dimensions[1]

		for (var i = 0; i < w; i++) {
			for (var j = 0; j < h; j++) {
				this.drawCell(p, i, j)
			}
		}
		

		// Draw debug information about the currently selected cell
		// A useful place to put debug information!
		if (this.debugMode) {
			console.log("debugging!")
			let hum = this.humidity[this.selectedCell[0]][this.selectedCell[1]]
			p.stroke(0, 50, 0)
			p.fill(0, 50, 100)
			p.textSize(32)
		}
	}

	
	// Draw a cell.  Add emoji or color it
	drawCell(p, x, y) {
		// some handy vars for drawing cells that I'm lifting from Prof. Compton's code
		let w = this.tileSize
		let px = (x + .5)*w
		let py = (y + .5)*w

		// draw cell color based on humidity
		let humidColor = [102, 80, 40]
		let notHumidColor = [39, 80, 31]

		let hueDiff = humidColor[0] - notHumidColor[0]
		let lightDiff = humidColor[2] - notHumidColor[2]

		let h = this.humidity[x][y]
		let drawHue = notHumidColor[0] + h * hueDiff
		let drawLight = notHumidColor[2] + h * lightDiff
		let drawColor = [drawHue, 80, drawLight]

		p.noStroke()
		p.fill(...drawColor)
		this.drawSquare(p, x, y)

		// if cell's tree val is true, draw tree
		if (this.tree[x][y]) {
			p.textSize(this.tileSize*.7)
			p.text("🌳", px - w*.4, py + w*.3)
		}

		// if cell's fire val is true, draw fire
		if (this.fire[x][y]) {
			p.textSize(this.tileSize*.7)
			p.text("🔥", px - w*.4, py + w*.3)
		}		
	}

	//=====================================================
	// Mouse interactions

	select(x, y) {
		// console.log("Select", x, y)
		this.selectedCell = [x, y]
	}

	click(x, y) {
		console.log("Click", x, y)
		
	}

	drag(x, y) {
		console.log("Drag", x, y)
		if (this.tree[x][y] && !this.fire[x][y]) {
			this.tree[x][y] = false
			this.fire[x][y] = true
		}
	}



	//=====================================================
	// Utility functions

	toggleDebugInfo() {
		console.log("toggle!")
		this.debugMode = !this.debugMode
	}

	// Handy utility to draw a single grid 
	drawSquare(p, col, row) {
		let w = this.tileSize
		let x = (col + .5)*w
		let y = (row + .5)*w
		p.rect(x - w/2, y - w/2, w, w)
	}

	// Handy utility to draw text 
	drawText(p, col, row, text) {
		let w = this.tileSize
		let x = (col + .5)*w
		let y = (row + .5)*w
		p.text(text, x - w/2, y - w*.1)
	}

	// Is this cell selected?
	isSelected(x, y) {
		return (this.selectedCell && this.selectedCell[0] == x && this.selectedCell[1] === y)
	}

	//------------------------------------------------
	// Neighbor positions
	getEightNeighborPositions(x1, y1, wrap=true) {
		return [...this.getNearestNeighborPositions(x1, y1, wrap),
		...this.getCornerNeighborPositions(x1, y1, wrap)]
	}

	getNearestNeighborPositions(x1, y1, wrap=true) {
		let w = this.dimensions[0]
		let h = this.dimensions[1]
		let x0 = x1 - 1
		let x2 = x1 + 1
		let y0 = y1 - 1
		let y2 = y1 + 1
		if (wrap)  {
			x0 = (x0 + w)%w
			x2 = (x2 + w)%w
			y0 = (y0 + h)%h
			y2 = (y2 + h)%h
		}
		
		return [[x1,y0],[x2,y1],[x1,y2],[x0,y1]]
	}
	getCornerNeighborPositions(x1, y1, wrap=true) {
		let w = this.dimensions[0]
		let h = this.dimensions[1]
		let x0 = x1 - 1
		let x2 = x1 + 1
		let y0 = y1 - 1
		let y2 = y1 + 1
		if (wrap)  {
			x0 = (x0 + w)%w
			x2 = (x2 + w)%w
			y0 = (y0 + h)%h
			y2 = (y2 + h)%h
		}
		
		return [[x0,y0],[x0,y2],[x2,y2],[x2,y0]]
	}


}