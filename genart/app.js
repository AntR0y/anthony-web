const gifSize = 300

	// Run this function after the page is loaded
	window.addEventListener("load", function() {
	console.log("Hello, animation!")

	let swatchCount = 9



	// CREATE SOME HOLDERS FOR PROCESSING TO RUN IN
	let holderEl = document.getElementById("main")
	// Create a new swatch with a title and p5 canvas for each
	animations.forEach(animation => {
		if (!animation.skip) {
			let el = document.createElement("div")
			el.className = "swatch"
			let titleEl = document.createElement("h3")
			let canvasHolder = document.createElement("div")
			holderEl.append(el)
			el.append(titleEl)
			el.append(canvasHolder)
			//titleEl.innerHTML = animation.title

			mainP5 = new p5(

				// Run after processing is initialized
				function(p) {
					// Set the size of the canvas that P5 thinks its using
					// Use HSL mode (WAAAYYY better than RGB!)
					p.colorMode(p.HSL);
					p.ellipseMode(p.ELLIPSE_RADIUS);

					p.setup = () => {
						p.createCanvas(gifSize, gifSize);
						if (animation.setup)
							animation.setup(p)
					}
					p.draw = () => {
						animation.draw(p)
					}
				}, canvasHolder)
			}
		})
	})
