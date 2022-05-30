// set up canvas

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

const p = document.querySelector("p");
let count = 0;
// function to generate random number

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// function to generate random RGB color value

function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}
class Shape {
  constructor(x, y, velX, velY) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
  }
}
class Ball extends Shape {
  constructor(x, y, velX, velY, exits, color, size) {
    super(x, y, velX, velY);

    this.color = color;
    this.size = size;
    this.exists = true;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }

  update() {
    if (this.x + this.size >= width) {
      this.velX = -this.velX;
    }

    if (this.x - this.size <= 0) {
      this.velX = -this.velX;
    }

    if (this.y + this.size >= height) {
      this.velY = -this.velY;
    }

    if (this.y - this.size <= 0) {
      this.velY = -this.velY;
    }

    this.x += this.velX;
    this.y += this.velY;
  }

  collisionDetect() {
    for (const ball of balls) {
      if (!(this === ball)) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + ball.size) {
          ball.color = this.color = randomRGB();
        }
      }
    }
  }
}

class EvilCircle extends Shape {
  constructor(x, y) {
    super(x, y, 20, 20);

    this.color = "white";
    this.size = 10;
  }
  draw() {
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 3;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
  }
  checkBounds() {
    if (this.x + this.size >= width) {
      this.velX = -this.velX;
    }

    if (this.x - this.size <= 0) {
      this.velX = -this.velX;
    }

    if (this.y + this.size >= height) {
      this.velY = -this.velY;
    }

    if (this.y - this.size <= 0) {
      this.velY = -this.velY;
    }

    // this.x += this.velX;
    // this.y += this.velY;
  }
  setControls() {
    let _this = this;
    window.onkeydown = function (e) {
      if (e.key === "a") {
        console.log("a");
        _this.x -= _this.velX;
      } else if (e.key === "d") {
        console.log("d");
        _this.x += _this.velX;
      } else if (e.key === "w") {
        console.log("w");
        _this.y -= _this.velY;
      } else if (e.key === "s") {
        console.log("s");
        _this.y += _this.velY;
      }
    };
  }
  collisionDetect() {
    for (const ball of balls) {
      if (ball.exists === true) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + ball.size) {
          ball.exists = false;
          count--;
          p.textContent = `Ball count: ${count}`;
        }
      }
    }
  }
}

const balls = [];

while (balls.length < 25) {
  const size = random(10, 20);
  const ball = new Ball(
    // ball position always drawn at least one ball width
    // away from the edge of the canvas, to avoid drawing errors
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(-7, 7),
    random(-7, 7),
    true,
    randomRGB(),
    size
  );

  balls.push(ball);
  count++;
  p.textContent = `Ball count: ${count}`;
}
const evilBall = new EvilCircle(random(0, width), random(0, height));
evilBall.setControls();

function loop() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.fillRect(0, 0, width, height);
  for (const ball of balls) {
    if (ball.exists === true) {
      ball.draw();
      ball.update();
      ball.collisionDetect();
    } else {
    }
    evilBall.draw();
    evilBall.checkBounds();
    evilBall.collisionDetect();
  }

  requestAnimationFrame(loop);
}

loop();
