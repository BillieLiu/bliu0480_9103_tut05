let img1; // image of sky
let img2; // image of water
let img3; // image of house
let imgoriginal; // Original image for introductionpage
let particles1 = []; // Array for first set of particles
let particles2 = []; // Array for second set of particles
let particles3 = []; // Array for third set of particles
let partSize1 = 10; // Particle size for first set
let partSize2 = 25; // Particle size for second set
let partSize3 = 10; // Particle size for third set
let c1, c2, c3; // Colors for gradient background
let mode = -1; //  Mode for different particle behaviors
let start = false; // Start flag to control introductionpage screen
let colChange = 0; // Counter for color change in mode 2

// Preload images before the program starts
function preload() {
  img1 = loadImage('assets/sky1.png'); //Sky image
  img2 = loadImage('assets/water1.png'); //Water image
  img3 = loadImage('assets/house.png'); //House image
  imgoriginal = loadImage('assets/1.jpg'); //Original image
}

// Change mode and create particles when keys are pressed
function keyPressed() {
  if (start) {// If start is true (intro screen is hidden)
    if (key == 'a') { 
      mode = 0;// Mode 0: initiate particle motion
      createParticle();
      background();
    } else if (key == 'b') { 
      mode = -1;// Mode -1: reset position
      createParticle();
      background();
    } else if (key == 'c') { 
      mode = 1;// Mode 1: size control
      createParticle();
      background();
    } else if (key == 'd') { 
      mode = 2;// Mode 2: color change
      createParticle();
      background();
    }
  } else {
    start = true; // Start the animation if it hasn't started yet
    background();
  }
}

 // Canvas setup and initial particle creation
function setup() {
  createCanvas(windowWidth, windowHeight);
  createParticle();
}

// Generate particles from images
// Create particles for each layer based on pixel color and brightness
function createParticle() {
  // Clear existing particles
  particles1 = [];
  particles2 = [];
  particles3 = [];

  // Create particles for the sky layer
  let imgCopy1 = img1.get();
  imgCopy1.resize(width, height);
  for (let x = 0; x < imgCopy1.width; x += partSize1) {
    for (let y = 0; y < imgCopy1.height; y += partSize1) {
      let c = imgCopy1.get(x, y);
      if (brightness(color(c)) > 0) {
        particles1.push(new Particle(x, y, c, partSize1, partSize1));
      }
    }
  }

    // Create particles for the water layer
  let imgCopy2 = img2.get();
  imgCopy2.resize(width, height);
  for (let x = 0; x < imgCopy2.width; x += partSize2) {
    for (let y = 0; y < imgCopy2.height; y += partSize2) {
      let c = imgCopy2.get(x, y);
      if (brightness(color(c)) > 0) {
        particles2.push(new Particle(x, y, c, partSize2 * 2, partSize2 * 0.8));
      }
    }
  }
// Create particles for the House layer
  let imgCopy3 = img3.get();
  imgCopy3.resize(width, height);
  for (let x = 0; x < imgCopy3.width; x += partSize3) {
    for (let y = 0; y < imgCopy3.height; y += partSize3) {
      let c = imgCopy3.get(x, y);
      if (brightness(color(c)) > 0) {
        particles3.push(new Particle(x, y, c, partSize3 * 2, partSize3 * 2));
      }
    }
  }
}

// Adjust canvas size on window resize and redraw particles
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  createParticle();
  background();
}

// Create gradient background with three colors
function background() {
  c1 = color(126, 164, 255);
  c2 = color(255, 178, 68);
  c3 = color(144, 183, 255);

  for (let y = 0; y < height * 0.5; y++) {
    let c = lerpColor(c1, c2, map(y, 0, height * 0.5, 0, 1));
    stroke(c);
    line(0, y, width, y);
  }
  for (let y = height * 0.5; y < height; y++) {
    let c = lerpColor(c2, c3, map(y, height * 0.5, height, 0, 1));
    stroke(c);
    line(0, y, width, y);
  }
}

// Draw function for updating particles
function draw() {
  if (start) {// If the introductionpage is hidden
    if (mode == 2) {//If in mode 2
      colChange++;
      if (colChange > 10) { // Adjust interval for flashing effect
        colChange = 0;
      }
    }

    // Display particles from each array
    for (let i = 0; i < particles1.length; i++) {
      particles1[i].update();// change the sizes of particles with noise
      particles1[i].move();// moving particles based on noise
      particles1[i].changeCol2();//If in mode 2,change color
      particles1[i].display();// show particles of waters as ellipse
    }
    for (let i = 0; i < particles3.length; i++) {
      particles3[i].changeCol1();//If in mode 2,change color
      particles3[i].display();//show particles
    }
    for (let i = 0; i < particles2.length; i++) {
      particles2[i].move();//move particles
      particles2[i].changeCol2();//If in mode 2,change color
      particles2[i].displayLine();//Show particles as line
    }
  } else {
    introductionpage();
  }
}

// Display introductionpage screen with instructions
function introductionpage() {
  image(imgoriginal, 0, 0, width, height);
  fill(255);
  textSize(25);
  textAlign(CENTER, CENTER);
  text("press A to start the particle motion\npress B to return the original position\npress C to start sizing\npress D to change the color of house", width / 2, height / 2);
}

// Particle class defining behavior and appearance of particles
class Particle {
  constructor(x, y, col, w, h) {
    //initial coordinates
    this.x = x;
    this.y = y;
    this.col = col;//color of particles
    this.init();//Initialize particle properties
    this.w = w;//weight
    this.h = h;//hight
    this.size = 1;
  }

  // Display the particle as an ellipse
  display() {
    noStroke();
    fill(this.r, this.g, this.b);
    ellipse(this.pos.x, this.pos.y, this.w * this.size, this.h * this.size);
  }

  // Change color randomly if in mode 2
  changeCol1() {
    if (mode == 2 && colChange == 0) {
      this.r = random(255);
      this.g = random(255);
      this.b = random(255);
    }
  }

  // Adjust color based on noise value
  changeCol2() {
    if (mode == 2 && colChange == 0) {
      this.r = random(255);//random color
      this.g = this.r;//make the color black & white & gray
      this.b = this.g;
    }
  }

  // Update particle size using Perlin noise if in mode 1
  update() {
    if (mode == 1) {
      this.size = map(noise(this.pos.x * 0.01, this.pos.y * 0.01, frameCount * 0.05), 0, 1, 0.5, 3);
    } else {
      this.size = 1;
    }
  }

  // Initialize particle position and color
  init() {
    this.pos = createVector(this.x, this.y);
    this.vel = createVector();
    this.r = red(this.col);
    this.g = green(this.col);
    this.b = blue(this.col);
  }

  // Display particle as a line
  displayLine() {
    noStroke();
    fill(this.r, this.g, this.b);
    //The y-coordinate is shifted based on the sine function
    ellipse(this.pos.x, this.pos.y + sin(this.pos.x * 0.01) * partSize2 * 0.5, this.w, this.h);
  }

  // Move particle based on noise if mode is 0
  move() {
    if (mode == 0) {
      let angle = noise(this.pos.x * 0.01, this.pos.y * 0.01) * TWO_PI;
      this.vel.set(cos(angle), sin(angle));//directional
      this.vel.mult(0.4);
      this.pos.add(this.vel);
    }
  }
}
