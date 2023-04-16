# This is Me: Anthony
## What is this project?
This is the git repository for my website, which contains an about page and a portfolio. Items in my portfolio were developed as assignments for Professor Kate Compoton's Generative Methods class at Northwestern Univeristy that I later touched up and improved after I graduated. As such, some of the code (i.e. helper functions, webpage structure) was written or inspired by her. You can find her in many parts of the web as GalaxyKate. 
Every item in my portfolio uses p5.js Processing.
The entire website uses the Headache color pallette by joy_of_summer on Colour Lovers (https://www.colourlovers.com/palette/953498/Headache).
I will go into futher detail on each page of my website in later sections

## How does it work? How do you use it?
To browse through my website, you can either download this repository and browse through it on your local, or you can take a look here "link."

## Why are you here?
If you're reading this or browsing through my website, it's probably because I've sent you the link so you can see the projects I've built and the work I'm capable of doing. Howdy! 

## Whis is this repo here?
I've posted the source code here for two reasons:
1. so anybody curious can browse through the work I've created
2. to prove that I'm capable of some of what I report on my resume

## Pages in my website
### Home page
This is my website's central location, from which you can navigate to my about page and my portfolio. It features a silly picture of me that I'm quite fond of, even though it is over two years old now (I no longer have such long hair).

### About page
This is a page that features another silly picture of me (this one is much more recent -- December 2022). It also includes a little bio -- where I work, where I went to school, and what I like to do.

### Portfolio page
The central location from which you can reference all items that are currently in my portfolio. I go into further detail on each of them below.

#### Computational Art
Here are 3 animations I put together using p5.js Processing.
The first animation loops every 60 seconds, and is inspired by these neat connect-the-dots-type activities my 2nd grade teacher used to give my class -- we would draw a bunch of lines, and because of the quantity of lines and the way they intersected, these lines together would create cool curves.
There are a lot of lines here, each slightly offset from each other. Each line's endpoints travel along the borders of the canvas, and one endpoint on each line travels faster along the canvas border than the other

The second animation does not loop. It uses perlin noise, polar coordinates, and transparency. Inspired by a generative art piece by Etienne Jacob: https://necessary-disorder.tumblr.com/post/174861564638

The third animation also uses perlin noise and does not loop. Inspired by the art piece at this link: https://www.pinterest.com/pin/442126888424796739/. A grid of dots is generated, and each dot travels in its own eliptical path. The radii for each elipse's major and minor axes and the dot's speed depends on the value of perlin noise associated with that dot's coordinate. This way, each dot has a different path. Then, I draw lines between each pair of adjacent dots in the grid with a brightness inversely proportional to the distance between those two dots. The result is a neat, pseudo-random faze through polygons.

#### Drawing Tool
A drawing tool I created in the same vein as KidPix.

Hex to HSLA conversion adapted from [here](https://css-tricks.com/converting-color-spaces-in-javascript/)

The blowAway tool's purpose is to clear the canvas. When you click and drag, a line "blows" across the screen, erasing everything behind it.

The riverBrush tool draws a bunch of curves repeatedly on top of each other based on the user's mouse strokes. Specifically, each curve relies on the mouse's current position as well as the mouse's previous 99 positions. If the user has only just started drawing and there are less than 99 previous mouse positions, then the riverBrush tool just uses the greatest multiple of 5 mouse positions (so if there are 72 mouse positions, then the tool uses 70). Because these curves are so long, the brush strokes hopefully look like they accumulate on top of one another, much like water in a river. Each curve is a spline, the color pickers control the colors of the curves, and the slider controls how far apart the accumulated curves you're drawing are. Just note that this tool may not start drawing as soon as you start clicking and dragging; you may need to click and drag for a fraction of a second for something to appear on the screen.

The grassBrush tool draws a patch of grass at the user's mouse position when drag the mouse. Each "stalk" of grass is a cubic Bezier curve (the function used to draw each Bezier curve is Professor Compton's). The color pickers control the colors of the grass, and the slider controls the length of the grass.

The petalBrush draws petals of varying sizes, orientations, and transparencies. The color pickers control the colors of the petals, and the slider controls the size of the petals.

#### Particle Systems
I have 3 particle systems here, each controlled by 3 sliders and a text box where you input how many particles you want in your system. 

Hex to HSLA conversion adapted from [here](https://css-tricks.com/converting-color-spaces-in-javascript/)

In my experience, when I return to this webpage after having tabbed out of it, I normally find the particles zooming every which way across the screen before they are calmed down by the drag forces slowing them down. I frankly don't know why this happens. Maybe it's because of some weird way in which Processing updates its canvas when you're tabbed out of it? 

Also, the lines/arrows in the debug views for the pollen and butterfly particle systems are scaled up. Otherwise, they would be invisible and pretty much meaningless.

##### Pollen Particle System
The pollen particle system is largely inspired by a snow particle system in Prof. Compton showed us as an example. I didn't realize that Prof. Compton had a vector field behaving as the wind on her snow particles until after I finished developing my pollen particle system, so I kind of just happened to adopt the same strategy of simulating a wind-like force on my pollen particles. I based a lot of my pollen code on the code found in this really cool open source p5.js Processing project: https://rawgit.com/Bleuje/p5js-myprojects/master/vector-field-drawing/index.html. You can actualy draw the wind vector field by setting the drawWind variable on line 138 of particles-pollen.js to true. I pulled the code for calculating the separation force for each pollen particle from Prof. Compton's boids code. My code for computing drag is more or less original - I based it off physics equations for drag. Note that in my other 2 particle systems, I use Prof Compton's method of accounting for drag, velocity = velocity * (1 - .1*drag), since I find that method a lot simpler. Also, pollen particles leave behind a non-persistent trail in the heatmap (which you can see in the bottom ofyou window). Because bees LOVE pollen, bee particles read the  heatmap so they can follow pollen particles.

Summary of 3 sliders controling pollen particle system:
1. pollenWindForce: alters strength of wind force
2. pollenDrag: alters strength of drag force
3. pollenSeparation: alters strength of separation force

Summary of debug view:
1. Black line: vector of wind force on each pollen particle
2. Red line: vector of drag force on each pollen particle
3. White line: vector of seperation force on each pollen particle


##### BeeParticleSystem
The bee particle system is based a large amount of Prof. Compton's bugs particle system and boasts a lot of her code. Each bee is a Braitenburg vehicle that LOVES pollen, as opposed to Prof. Compton's bugs, which seem to fear each other. To do so, each bee particle moves forward unless it reads a pollen trail from the heatmap, in which case it slows down on the side it detects the pollen trail. I modeled my bee drawings very heavily on the bees in this p5.js Processing project: https://editor.p5js.org/skgmmt/sketches/r1wu_qDCm. My big alteration here was to make the wings "flap" based on the sin function.

Summary of 3 sliders controling bee particle system:
1. beeDrag: alters strength of drag on bee particles
2. beeThrust: alters strength of thrust (forward acceleration) pushing bee particles around space
3. beeTurnSpeed: alters speed at which bee particles change angle

Summary of debug view:
- Shows the angle (radians) of each bee particle and the magnitude of force propelling each bee around the space

##### ButterflyParticleSystem
The butterfly particle system pulls ideas from Prof. Compton's boids particle system, especially the implementation of the wander force, which I implement in the same way as Prof. Compton's boids code. These particles are pushed away from the canvas borders and are pulled towards your mouse.

Summary of 3 sliders controlling butterfly particle system:
1. butterflyDrag: alters strength of drag on butterfly particles
2. butterflyBorderForce: alters how strongly butterfly particles are pushed from border
3. butterflyMouseAttraction: alters how strongly butterfly particles are pulled towards your mouse

Summary of debug view:
1. black arrow: vector of wander force
2. green arrow: vector of border aversion force
3. yellow arrow: vector of mouse attraction force.

#### Wildfires: An Interactive Eassay with Cellular Automata

This is an interactive essay that simulates desertification/forest dieback, processes by which our forests slowly turn into more arid ecosystems like deserts and savannas (like the forests in the western United States and the Amazon River Basin). It also demonstrates use of Vue.js templates. 

Credit where credit is due; while the idea for and the implementation of this simulation is mine, the base code is Professor Compton's. She helped me figure out how to use Vue.js templates.

My simulation doesn't work perfectly. Desertification and forest dieback are very macro processes, so simulating them with imprescise rules and simulations challenged me a fair deal. In addition, these processes I'm trying to simulate are cyclic in nature. They rise out of feedback loops, but in my sims, there really isn't much of a feedback loop. You kind of just set your fires, watch it spread/die out, and that's it. My simulations don't visualize the lasting effects of wildfires very well. This might be because my code simulates forests recovering from fires too quickly, which is likely an artifact of me trying to balance my simulations in the favor of forest regeneration. I didn't want forest regeneration to be invisible; otherwise, users might just dismiss my simulations as faulty or inaccurate.

Also, each iteration of the same simulation may end up drastically different. Sometimes, the fires you set hardly spread at all, and other times, the fires you start set every single tree ablaze. I'm still not sure if this is a flaw or not.

#### Array of Floats: Customizable Stars
This project builds stars out of arrays of floating point numbers. Each float in an array maps to a property of a star. Think of this is as a simplified Spore creature creator, except instead of designing aliens, you design stars.

Summary of each slider:

1. Star color: Controls the hue of the star (the gaseous/transparent part)
2. Core color: Controls the hue of the core (the non-gaseous/opaque part in the star's center)
3. Star size: Controls the size of the star
4. Core size: Controls the size of the star's core as a percentage of star size
5. Brightness: Controls the reach of the star's glow
6. Rotation speed: Controls how fast the star appears to rotate
7. Darkspot count: Controls how many darkspots are on the star's core
8. Tilt: Control's the star's tilt

I credit Prof. Compton for the base code; a fair amount of this code is borrowed from her array of floats example code (her code's expressive space was a bunch of fishes, whereas mine is a bunch of stars). She also wrote the Wander functionailty, which causes the on-screen creations to wander back and forth across the expressive space when you click the play button next to "Wander." She wrote the Mutate functionality too, which lets you generate "children" of a creation by double clicking on it - double clicking on a star generates new stars in a similar area of the generative space. Moving the "Mutation" slider controls how similar the new stars are to the original star.

I credit kevinsa5 on this stackoverflow post (https://stackoverflow.com/questions/20959489/how-to-draw-a-glowing-halo-around-elements-using-processing-2-0-java) which helped me figure out how to make the stars glow.

#### Virtual Mask
This project builds a virtual mask based on face capture date. When you first open the project, it uses prerecorded data, but if you click the "Face Recognition" button, the project will start using face capture data from your webcam video feed. The page will pause when you do this, and you may need to click on the page or move a slider for the mask to resume updating. You should probably be looking towards your camera when you start using face detection (the code builds its 2D array from the face points' orientation during the very first frame - I go into further detail on this below).

I credit Professor Compton for the starter code and some utility functions. She selected the face recognition tool and provided the prerecorded face capture data. The "glitch" mask is mine, however the "blank" mask (when you click on the dropdown next to the "Face Recognition" button) is Professor Compton's. I found the "blank" mask useful for development of my "glitch" mask.

A summary of the sliders:
1. Hue: Conrols the hue of the face, hands, and eyes
2. Saturation: Controls the saturation of the face, hands, and eyes
3. Face Brightness: Controls the lightness of the face and hands (NOT EYES)
4. Eye Brightness: Controls the lightness of the eyes
5. Lines: Controls how many lines are drawn in the face
6. Glitch: Controls the "glitchiness" of the hands and face; this makes the face points move around in circles and the hand lines change lightness according to a sin function. If you pause the recorded face capture by pressing the spacebar, you can see this happen more clearly
7. Zoom: Controls zoom

##### Process
I started by wanting to make something along the lines of my third animation from my computational art project, which is to say that I wanted to draw a bunch of lines between the face points provided by the face capture tool with a variable brightness that depended on the distance between each line's endpoints (i.e. if the endpoints are close together, the line is bright, and if the endpoints are far apart, the line is dim or not drawn at all)

##### Obstacle 1
I only wanted to draw lines between points that were close together, but the face points' indices provided by the tool correlated very little to the points' positions. I could have, at each face point, iterated through all the other face points to examine their positions and determine the points of closest proximity. Unfortunately, that's an expensive O(n^2) task.  

My solution was to sort all the face points into a 2D array ONCE, where all points in the same row would be roughly at similar y coordinates, and all points in the same column would be roughly at the same x coordinates. To do this, I used the face.centerLine as reference for what row to put each point into (I put points into the same row as the centerline point that it's closest to). Then, I sort all rows by each point's x coordinate. I do this once during the very first frame. That way, I have a general idea of where each face point is and what face points are close together.

##### Obstacle 2
I then implemented the same strategy I used in my computational art project to make the face points move around. Here, I ran into my second obstacle: it didn't look good. I think it's because the face tracking isn't *perfect*, so the face points are very jittery. The result is a face that vibrates, which is not what I wanted.

My solution was to attach that part of my code to a "glitch" slider, kinda playing off the matrix-y look of what I had going so far. A deformed face looks a lot better when you call it "glitchy," I think.

##### Obstacle 3
My third obstacle was how to attach the eyes in such a way that their shape, size, and angle depended on the faces orientation. For example, I wanted to tilt the eyes when the face tilted, shrink the eyes when the head moved away from the camera, and squish the eyes as the head turned side-to-side.

My solution was to draw each eye as an ellipse, with the lengths of the minor and major axes dependent on the distance between the face points at the top & bottom and right & left ends of the eye. This let the eyes shrink and grow as necessary, given the face orientation. I also used the angle of the vector from the eye's left point to its right point to determine how much to rotate each eye.