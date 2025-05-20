const canvas = document.querySelector("canvas");
const sens = document.querySelector(".sens");
const isPaused = document.querySelector(".pause");
const count = document.querySelector(".count");
const grav = document.querySelector(".gravity");
let pauseOnHover = isPaused.checked;
isPaused.addEventListener("click", () => {
  pauseOnHover = isPaused.checked;
});
sens.addEventListener("change", (e) => {
  sensativity = e.target.value;
});
window.addEventListener("resize", () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
});
canvas.width = innerWidth;
canvas.height = innerHeight;
const c = canvas.getContext("2d");
let gravity = false;
grav.addEventListener("change", (e) => {
  gravity = grav.checked;
});
function miniRandomRange(min, max) {
  return Math.random() * (max - min) + min;
}
function Circle(x, y, raduis, dx, dy, color) {
  this.x = x;
  this.y = y;
  this.raduis = raduis;
  this.dx = dx;
  this.dy = dy;
  this.odx = dx;
  this.ody = dy;
  this.color = color;
  this.minRaduis = raduis;
  this.draw = function () {
    c.beginPath();
    c.arc(this.x, this.y, this.raduis, 0, 2 * Math.PI, false);
    c.fillStyle = this.color;
    c.fill();
  };
  this.update = function () {
    this.draw();
    this.x += this.dx;
    this.y += this.dy;
    if (this.x + this.raduis > innerWidth || this.x - this.raduis < 200) {
      this.dx = -this.dx;
      this.odx = -this.odx;
    } else if (this.y + this.raduis > innerHeight || this.y - this.raduis < 0) {
      this.dy = -(gravity ? Math.floor(this.dy * 0.91) : this.ody);
      this.ody = -this.ody;
    } else {
      if (gravity && !pauseOnHover) {
        this.dy += 1;
      } else {
        if (!pauseOnHover) {
          this.dy = this.ody;
          this.dx = this.odx;
        }
      }
    }
    if (sensativity < this.raduis) {
      sensativity = this.raduis;
    }
    if (
      mouse.x - this.x < sensativity &&
      mouse.x - this.x > -sensativity &&
      mouse.y - this.y < sensativity &&
      mouse.y - this.y > -sensativity
    ) {
      if (this.raduis < this.minRaduis + 50) {
        this.raduis += 1;
        this.dx = !pauseOnHover ? this.odx : 0;
        this.dy = !pauseOnHover ? this.ody : 0;
      }
    } else if (this.raduis > this.minRaduis) {
      this.raduis -= 1;
    }
  };
}
let circlesArr = [];
const colorsArr = ["#0F5FA6", "#0A8CBF", "#04B2D9", "#05DBF2", "#0D0D0D"];
let sensativity = sens.value;
const mouse = {
  x: undefined,
  y: undefined,
};
function init(count = 100) {
  circlesArr = [];
  for (let i = 0; i < count; i++) {
    let x = miniRandomRange(300, innerWidth - 60);
    let y = miniRandomRange(50, innerHeight - 60);
    let raduis = miniRandomRange(5, 25);
    let dx = miniRandomRange(-1.5, 1.5)||-1.5;
    let dy = miniRandomRange(-1.5, 1.5)||-1.5;
    let color = colorsArr[Math.floor( miniRandomRange(0, colorsArr.length))];
    circlesArr.push(new Circle(x, y, raduis, dx, dy, color));
  }
}
init();
count.addEventListener("keyup", (e) => {
  init(e.target.value || 100);
});
function animate() {
  c.clearRect(0, 0, innerWidth, innerHeight);
  requestAnimationFrame(animate);
  for (let i = 0; i < circlesArr.length; i++) {
    circlesArr[i].update();
  }
}
animate();
window.addEventListener("mousemove", (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
});
