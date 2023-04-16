// Components for exploring an array of floats

//====================================================================================
// Breeding multiple arrays of floats

Vue.component("aof-population", {
	template: `<details class="aof-population section" open>
		<summary>Population</summary>
		<div class="population-item">
			<div id="pop-item-1">
				Mutation: 
			</div>
			<div id="pop-item-2">
				<input type="range" min="0" max="1" :step=".001" class="slider" v-model="controls.mutation" />
			</div>
		</div>
		<div class="population-item">
			<div id="pop-item-1">
				Wander: 
			</div>
			<div id="pop-item-2">
				<button class="emoji-button" @click="controls.isAnimating = !controls.isAnimating">▶️</button>
			</div>
		</div>
		<div class="population-item">
			<div id="pop-item-1">
				Population: 
			</div>
			<div id="pop-item-2">
				<select v-model="controls.count" @change="reroll">
					<option>1</option>
					<option>3</option>
					<option>7</option>
					<option>15</option>
				</select>
				<button class="emoji-button" @click="reroll">🎲</button>
			</div>
		</div>
		


	</details>`,

	mounted() {
		population.nextGeneration()
	},
	methods: {
		reroll() {
			population.nextGeneration({count:controls.count})
		}
	},

	data() {
		return {
			controls:controls,
			animationModes: ["music", "wander", "evolve"]
		
		}
	},
})

//====================================================================================
// Looking at landmarks

Vue.component("aof-landmarks", {
	template: `<div class="aof-population section">
	

		<div v-if="false">
			<select v-model="app.xaxis">
				<option v-for="label in controls.selectedClass.labels">{{label}}</option>
			</select>
			<select v-model="app.yaxis">
				<option v-for="label in controls.selectedClass.labels">{{label}}</option>
			</select>
			<button class="emoji-button" @click="randomAxes">🎲</button>
		</div>

		<div>
			<div>Landmarks</div>
			<div id="landmark-grid">
				<button v-for="(landmarkAOF,landmarkName) in controls.selectedClass.landmarks" @click="controls.selectedAOF.setValues(landmarkAOF, landmarkName)">{{landmarkName}}</button>
			</div>
			</div>
	</div>`,
	data() {
		return {
			controls:controls,
			
		
		}
	},
	// props: ["app"]
})

//====================================================================================
// A set of sliders for a single AOF

Vue.component("aof-sliders", {
	template: `<div class="aof-view section" v-if="aof">
		<div id="star-randomizer-container">
			<div class="contrast title">Star #{{aof.idNumber}}</div>
			<div id="star-randomizer">
				<button class="emoji-button" @click="aof.randomize()">🎲</button>
			</div>
		</div>

		<div id="star-slider-container">
			<div id="star-slider" v-for="(value,valIndex in aof.values">
				<label>{{aof.labels[valIndex]}}</label>
				<div class="star-slider-inp">
					<div class="slider-val">{{value.toFixed(3)}}</div>
					<input type="range" min="0" max="1" :step=".001" class="slider" :value="value" @input="ev => change(ev, valIndex)" />
				</div>
			</div>
		</div>
		<input id="star-parameters" v-model="aofinput" @keyup.enter='setFromInput'>
	</div>
	<div v-else>
	((no aof))
	</div>
	`,

	
	mounted() {
		this.updateValues()
	},
	watch: {
		"aof.values"() {
			this.updateValues()
		}
	},
	methods: {
		updateValues() {
			if (this.aof)
				this.aofinput = this.aof.valuesToString()
		},
		setFromInput() {
			let val = JSON.parse(this.aofinput)
			this.aof.setValues(val)
		},
		change(ev,  valIndex) {
			let val = parseFloat(ev.target.value)
			this.aof.set(valIndex, val)


		}
	},
	data() {
		return {
			animationMode: undefined,
			aofinput: ""
		}
	},
	props: ["aof"]
})
