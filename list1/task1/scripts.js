let maxX = 500;
let maxY = 400;
let currentX = 100;
let currentY = maxY - 100;
let currentAngle = 0;

let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
ctx.moveTo(currentX, currentY);

function degree() {
    return -(currentAngle / 360) * 2 * Math.PI;
}

function fd(dist) {
    currentX = currentX + dist * Math.cos(degree());
    currentY = currentY + dist * Math.sin(degree());
    ctx.lineTo(currentX, currentY);
    ctx.stroke();
}

function right(angle) {
    currentAngle = (currentAngle - angle) % 360;
}

function left(angle) {
    currentAngle = (currentAngle + angle) % 360;
}

for (let i = 0; i < 6; i++) {
    fd(50);
    right(60);
}
