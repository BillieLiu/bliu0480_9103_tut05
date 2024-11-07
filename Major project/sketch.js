let img1;
let imgoriginal;
let particles1 = [];
let partSize1 = 10; // 天空圆的大小
let mode = -1;
let start = false;

function preload() {
  img1 = loadImage('Assests/sky1.png'); // 引用新的图片路径
  imgoriginal = loadImage('Assests/1.jpg'); // 引用新的图片路径
}

function keyPressed() {
  if (start) {
    if (key == 'a') {
      mode = 0;
      createParticle();
      background();
    }
  } else {
    start = true;
    background();
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  createParticle();
}

function createParticle() {
  particles1 = [];
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
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  createParticle();
  background();
}

function background() {
  // 绘制渐变背景
  let c1 = color(126, 164, 255);
  let c2 = color(255, 178, 68);
  for (let y = 0; y < height * 0.5; y += 1) {
    let c = lerpColor(c1, c2, map(y, 0, height * 0.5, 0, 1));
    stroke(c);
    line(0, y, width, y);
  }
}

function draw() {
  if (start && mode == 0) {
    for (let i = 0; i < particles1.length; i++) {
      particles1[i].move();
      particles1[i].display();
    }
  } else {
    intro();
  }
}

function intro() {
  image(imgoriginal, 0, 0, width, height);
  fill(255);
  textSize(25);
  textAlign(CENTER, CENTER);
  text("press A to start the particle motion", width / 2, height / 2);
}

class Particle {
  constructor(x, y, col, w, h) {
    this.x = x;
    this.y = y;
    this.col = col;
    this.w = w;
    this.h = h;
    this.init();
  }

  display() {
    noStroke();
    fill(this.col);
    ellipse(this.pos.x, this.pos.y, this.w, this.h);
  }

  init() {
    this.pos = createVector(this.x, this.y);
  }

  move() {
    var angle = noise(this.pos.x * 0.01, this.pos.y * 0.01) * TWO_PI;
    this.pos.add(createVector(cos(angle), sin(angle)).mult(0.4));
  }
}
