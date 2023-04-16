	
let simCount = 0

let noise = (new p5()).noise

document.addEventListener("DOMContentLoaded", function(){
	new Vue({
		el : "#app",
		template: `<div id="app">
			<div class="essay">
				Below are simulations of how forests expand and 
				recede and how climate change, deforestation, and wildfires 
				contribute to desertification. 
				
				<br><br>

				These simulations make the following assumptions: <br>
				<p>1) Humidity diffuses through the air, so a dry area will dry out
				the surrounding areas, and a humid area will humidify the 
				surrounding areas. </p>
				<p>2) A fire makes an area more dry, and a tree makes an area more
				humid. </p>
				<p>3) The dryer an area, the more prone it is to fire. </p>
				<p>4) Trees need to be nearby for new trees to grow in any given area. </p>
				<p>5) A tree can only grow on suitably humid land </p>

				<br>

				Each cell (tile) has a humidity value associated with it between
				0% and 100%. At 0%, the cell is brown, and at 100%, it's green. If a
				a tree is in the cell, the cell's humidity value raises by 1% each step. If
				a fire is in the cell, the cell's humidity value drops by 12% each step. I
				encoded such a large difference between a tree's and fire's effects on the local 
				humidity to simulate how long it takes for an ecosystem to recover from a natural
				disaster.

				<br><br>

				Note that humidity diffuses in this 
				simulation. If a cell is surrounded by dryer cells, its humidity
				decreases as its humidity "leaks" into those dryer cells. The
				reverse occurs if a cell is surrounded by more humid cells.

				<br><br>

				The chance that a tree catches fire in any given cell
				depends on the number of adjacent fires and the cell's humidity
				value. Not only does each adjacent fire increase a cell's chance of fire, 
				but the lower that cell's humidity, the more each adjacent fire increases 
				the likelihood that cell will catch fire. If a cell's humidity value is low 
				enough and it has a tree, the tree might catch fire without any adjacent fires 
				sparking it.

			</div>
			
			<br>
			<h2>Simulating the Ideal Scenario</h2>

			<div class="essay">
				Let's start by looking at the ideal scenario below. The forest is
				covered in trees (90% tree cover), and the humidity's
				set nice and high. You can
				set fires to trees by clicking and dragging your mouse
				accross the sim. Set fire to some trees and run 
				the simulation by clicking on the play button. What happens? How does the fire spread? How does
				the forest recover?
			</div>

			<simulation type="DeforestSimulation" mode="healthy" :dimensions="[20,15]" :tileSize="26"/>

			<div class="essay">
				How successful were you? I would wager not
				that successful! Because the forest is so humid, and because 
				moisture translates to fire aversion - just try setting	fire to 
				a wet log - the fire isn't able to spread that quickly, and
				it therefore dies out before causing too much damage. 

				<br><br>

				Not only that, but because there are so many trees, the forest
				quickly recovers too. The many trees increase the humidity of 
				their own cells, which then diffuses out to the dryer cells that
				were just on fire, allowing new trees to grow there. 

				<br><br>
			</div>

			<h2>Simulating a Drying Climate</h2>

			<div class="essay">
				But, as you may have seen in news about wildfires all over the world, 
				forests have been drying out, largely because of our warming, drying 
				climate. How does this affect a forest's ability to resist wildfires 
				and then recover afterwards?

				<br><br>

				Below, you'll find a simulation that functions with the same 
				rules as the simulation above and with the same starting parameters.
				The only difference is that each cell's humidity is around 50 
				percentage points lower. How does this simulation react to the fires
				you set? How does it recover? What happens if you just let the
				simulation run without setting any fires?
			</div>

			<simulation type="DeforestSimulation" mode="dryer" :dimensions="[20,15]" :tileSize="26"/>

			<div class="essay">
				I'm sure you noticed that the fires you set spread faster than before, 
				which is thanks to this particular sim's lower starting humidity. 
				Because the fire burned down more
				trees, and because the sim started out with lower humidity values
				to begin with, the forest also takes much longer to recover. If
				you set a second fire before the forest finishes recovering from
				the first one, chances are that fire will do a decent amount of
				damage as well. 

				<br><br>

				In short, a dryer forest is more susceptible to wildfires, and a 
				forest more suceptible to wildfires takes longer to recover from
				wildfires, and a forest still recovering from wildfires is a dry
				forest, and a dry forest is more susceptible to wildfires, and
				so on. This means our sim's forest spends a lot more time
				being dry than it should be.

				<br><br>

				But this forest does eventually recover, right? And all's well
				that ends well! ...Maybe. Let's look at the next simulation. 

				<br><br>
			</div>

			<h2>Simulating Deforestation</h2>

			<div class="essay">
				Again, everything in the simulation is the same, except for one
				starting parameter - here, fewer cells have a tree growing in them to simulate the effects of 
				deforestation (or wildfires). The idea is that this simulation will
				remind you of what's going on in ecosystems like those in the 
				Amazon Rainforest, where deforestation is causing the climate to dry.

				<br><br>

				Do what you've already been doing. Set some fires, run the 
				simulation, and observe. How does the fire spread? How does the
				forest recover? What happens if you don't set any fires?
			</div>

			<simulation type="DeforestSimulation" mode="deforestation" :dimensions="[20,15]" :tileSize="26"/>

			<div class="essay">
				How did it go? If your experience was anything like mine, one of 
				two things happened when you set your fires. 
				
				<br><br> 

				1) A nightmare scenario in which the fire spread across all or 
				nearly all tree-populated cells, leading to a dry landscape
				void of life that will recover extremely slowly, if at all - if
				there isn't a cell with at least three adjacent tree-populated cells,
				then the forest will never recover without outside 
				intervention. <br>
				2) Some spread, but of a lower magnitude. I think 
				this is a function of the fact that fire cannot spread 
				across cells without trees, so the more cells there are without trees,
				the harder it is for fire to sometimes spread great 
				distances. This mimics some forest management practices - if you cut down trees in
				strategic places, maybe you can reduce the risk of severe 
				wildfires. That being said, the effectiveness of tree thinning is
				widely debated.

				<br><br>

				Regardless, one detail holds true: the forest takes
				much longer to recover when there are fewer trees and the land is more dry. 
				In some simulations, the fire damage is irrevocably severe. Keep in mind 
				that these recovering forests will sometimes become even more susceptible to 
				wildfires than they were before.

				<br><br>

				The goal of these simulations are to simulate how desertification
				and forest dieback work. These are processes, cyclic in nature, by 
				which forests grow unable to recover from changing climates, 
				instead becoming dryer and dryer. 
				
				<br><br>

				Of course, these simulations are an extreme oversimplification. They
				disregard how other factors such as biodiversity and global weather
				patterns influence changes in Earth's climate and ecosystems, and
				even the factors these simulations do attempt to emulate are 
				replicated with very low-fidelity systems.

				<br><br>
			</div>

			<h2>Simulating Modified</h2>

			<div class="essay">
				Below, you'll find a simulation with parameters you can alter 
				yourself. Change the starting conditions and click on the dice 
				to generate a new simulation. How does fire spread differently 
				when you change the starting humidity? When you change the amount 
				of tree-populated cells? Have fun - or don't.
			</div>

			<simulation type="DeforestSimulation" mode="freeform" :dimensions="[20,15]" :tileSize="26"/>


		</div>`,
		
	}) 
})

//==================================
// Grid utilities

// Create a grid of columns
function createGrid(w, h) {
	const grid = Array.from(new Array(w),()=>Array.from(new Array(h),()=>"-"));
	return grid
}

// Set a grid equal to a function
function setGrid(grid, fxn) {
	if (grid === undefined)
		console.warn("no grid!")
	if (fxn === undefined)
		console.warn("no function for setting the grid!")
	for (var i = 0; i < grid.length; i++) {
		for (var j = 0; j < grid[i].length; j++) {
			grid[i][j] = fxn(i,j)
		}
	}
}

// Copy a grid
function copyGrid(dest, src) {
	for (var i = 0; i < src.length; i++) {
		for (var j = 0; j < src[i].length; j++) {
			dest[i][j] = src[i][j]
		}
	}
}
