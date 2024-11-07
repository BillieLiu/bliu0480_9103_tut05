let img1; // Image for sky layer
let img2; // Image for water layer
let img3; // Image for house layer
let imgoriginal; // Original background image
let particles1 = []; // Array for particles in the sky layer
let particles2 = []; // Array for particles in the water layer
let particles3 = []; // Array for particles in the house layer
let partSize1 = 10; // Particle size for sky layer
let partSize2 = 25; // Particle size for water layer
let partSize3 = 10; // Particle size for house layer
let backgroundColor; // Background color
let c1, c2, c3; // Colors for gradient background
let mode = -1; // Mode to control particle behavior
let start = false; // Toggle to start the animation
let colChange = 0; // Variable to control color changes in particles

function preload() {
  // Preload image resources
  img1 = loadImage('Assests/sky1.png');
  img2 = loadImage('Assests/water1.png'); 
  img3 = loadImage('Assests/house.png'); 
  imgoriginal = loadImage('Assests/1.jpg'); 
}

function keyPressed() {
  // Key press to trigger animation start
  if (start) {
    if (key == 'a') {
      mode = 0;
      createParticle(); // Initialize particles
      background(); // Set up background
    }
  } else {
    start = true;
    background();
  }
}

function setup() {
  // Canvas setup and initial particle creation
  createCanvas(windowWidth, windowHeight);
  createParticle();
}

function createParticle() {
  // Create particles for each image layer based on pixel color and brightness
  particles1 = []; // Clear existing particles
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

  // Create particles for the house layer
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

function windowResized() {
  // Resize canvas and particles when window is resized
  resizeCanvas(windowWidth, windowHeight);
  createParticle();
  background();
}

function background() {
  // Create a gradient background with defined colors
  c1 = color(126, 164, 255); // Top color
  c2 = color(255, 178, 68); // Middle color
  c3 = color(144, 183, 255); // Bottom color
  for (let y = 0; y < height * 0.5; y += 1) {
    let c = lerpColor(c1, c2, map(y, 0, height * 0.5, 0, 1));
    stroke(c);
    strokeWeight(1);
    line(0, y, width, y);
  }
  for (let y = height * 0.5; y < height; y += 1) {
    let c = lerpColor(c2, c3, map(y, height * 0.5, height, 0, 1));
    stroke(c);
    strokeWeight(1);
    line(0, y, width, y);
  }
}

function draw() {
  // Main animation loop, draws particles or introductionpage screen based on start variable
  if (start) {
    for (let i = 0; i < particles1.length; i++) {
      particles1[i].update();
      particles1[i].move();
      particles1[i].changeCol2();
      particles1[i].display();
    }
    for (let i = 0; i < particles3.length; i++) {
      particles3[i].changeCol1();
      particles3[i].display();
    }
    for (let i = 0; i < particles2.length; i++) {
      particles2[i].move();
      particles2[i].changeCol2();
      particles2[i].displayLine();
    }
  } else {
    introductionpage();
  }
}

function introductionpage() {
  // Display the original image and instructions before starting particle animation
  image(imgoriginal, 0, 0, width, height);
  fill(255);
  textSize(25);
  textAlign(CENTER, CENTER);
  text("press A to start the particle motion", width / 2, height / 2);
}

class Particle {
  // Particle Class: Defines properties and behavior of each particle
  constructor(x, y, col, w, h) {
    this.x = x;
    this.y = y;
    this.col = col;
    this.init(); // Initialize color and position
    this.w = w;
    this.h = h;
    this.size = 1;
  }

  display() {
    // Display the particle as an ellipse
    noStroke();
    fill(this.r, this.g, this.b);
    ellipse(this.pos.x, this.pos.y, this.w * this.size, this.h * this.size);
  }

  changeCol1() { // Changes particle color randomly if conditions are met
    if (mode == 2 && colChange == 0) {
      this.r = random(255);
      this.g = random(255);
      this.b = random(255);
    }
  }

  changeCol2() { // Another color-changing method, setting grayscale values
    if (mode == 2 && colChange == 0) {
      this.r = random(255);
      this.g = this.r;
      this.b = this.g;
    }
  }

  update() {
    this.size = 1;
  }

  init() { // Set initial position and color
    this.pos = createVector(this.x, this.y);
    this.vel = createVector();
    this.r = red(this.col);
    this.g = green(this.col);
    this.b = blue(this.col);
  }

  displayLine() { // Display particles with a vertical oscillation effect
    noStroke();
    fill(this.r, this.g, this.b);
    ellipse(this.pos.x, this.pos.y + sin(this.pos.x * 0.01) * partSize2 * 0.5, this.w, this.h);
  }

  move() { // Move particles using Perlin noise for a smooth randomized effect
    if (mode == 0) {
      var angle = noise(this.pos.x * 0.01, this.pos.y * 0.01) * TWO_PI;
      this.vel.set(cos(angle), sin(angle));
      this.vel.mult(0.4);
      this.pos.add(this.vel);
    }
  }
}
