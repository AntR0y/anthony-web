
/* 
 * Vue component for a single simulation
 * You don't need to edit this unless you want to change the UI elements
 */

Vue.component("simulation", {
	template: `
	<div class="simulation">
		
		<div class="p5-holder" ref="p5holder"></div>

		<div class="controls">
			<div v-if="type==='DustSimulation' && sim">Pattern:{{sim.pattern}}</div>

			<div v-if="mode==='freeform'" id="freeform-sliders">
				<div id="humidity-sliders">
					<label for="humidity">Humidity</label> <br>
					<input type="range" min="0" max="100" value="50" step="1" class="slider" id="humidity">
				</div>

				<div id="tree-cover-sliders">
					<label for="treeCover">Tree Cover</label> <br>
					<input type="range" min="0" max="100" value="50" step="1" class="slider" id="treeCover">
				</div>
			</div>
			
			<div class="constant-controls">
				<button class="emoji-button" @click="sim.initialize()">🎲</button>
				<button class="emoji-button" @click="sim.step()">🥾</button>
				<button class="emoji-button" @click="isPaused=!isPaused">{{isPaused?"▶️":"⏸"}}</button>
			</div>
		</div>
		
	</div>
	`,
	mounted() {

		console.log(this.type)
		this.sim = eval(`new ${this.type}(this.mode, this.dimensions, this.tileSize)`);

		// this.sim = new window[this.type](this.mode, this.dimensions, this.tileSize)
		

		// Setup a p5 for this grid view
		let gridP5 = new p5(p => {
			let getCell = () => {
				let x = Math.floor(p.mouseX/this.tileSize)
				let y = Math.floor(p.mouseY/this.tileSize)
				x = Math.max(0,x)
				y = Math.max(0,y)
				return [x,y]
			}

			
			p.setup = () => {
				let w = this.tileSize*this.dimensions[0]
				let h =  this.tileSize*this.dimensions[1]
				p.createCanvas(w, h);
				p.colorMode(p.HSL)
			}
			p.draw = () => {
				this.sim.draw(p)
				if (this.sim.paused) {
					this.noFill()
					this.stroke(0)
					this.sim.circle(0, 0, 100)
				}
				
			}

			p.mouseMoved = () => {
				if (p.canvas.parentNode.querySelector(":hover") == p.canvas) {	
					this.sim.select(...getCell())
				}
			}

			p.mouseDragged = () => {
				if (p.canvas.parentNode.querySelector(":hover") == p.canvas) {
					this.sim.drag(...getCell())
				}
			}
			p.mouseClicked = () => {
				if (p.canvas.parentNode.querySelector(":hover") == p.canvas) {
					this.sim.drag(...getCell())
				}
			}
			
		}, this.$el)

		// Handle updating this simulation
		let count = 0
		setInterval(() => {
			if (count < 50000 && !this.isPaused ) {

				this.sim.step()
			}
			count++
		}, this.speed)
	},
	
	props:{
		"mode": {},
		"dimensions": {},
		"tileSize": {}, 
		"type":{}, 
		"speed":{default: 300},
	},

	data() {
		return {
			// Start off paused
			isPaused: true,
			// Create a new simulation with this mode and dimensions
			sim: undefined
			//hum: sim.humidity[5][5]
		}
	}


})