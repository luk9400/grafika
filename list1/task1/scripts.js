const canvas = document.getElementById("myCanvas");
const context = canvas.getContext("2d");
const maxX = 500;
const maxY = 400;
let currentX = 100;
let currentY = 100;
let currentAngle = 0;

function translateCoordinates() {
    context.translate(0, maxY);
    context.scale(1, -1);
    context.moveTo(currentX, currentY);
}

function degree() {
    return -(currentAngle / 360) * 2 * Math.PI;
}

function fd(dist) {
    currentX = currentX + dist * Math.cos(degree());
    currentY = currentY + dist * Math.sin(degree());
    context.lineTo(currentX, currentY);
    context.stroke();
}

function right(angle) {
    currentAngle = (currentAngle - angle) % 360;
}

function left(angle) {
    currentAngle = (currentAngle + angle) % 360;
}

translateCoordinates();

for (let i = 0; i < 6; i++) {
    fd(50);
    right(60);
}
