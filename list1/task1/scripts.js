const canvas = document.getElementById("myCanvas");
const context = canvas.getContext("2d");
const btn = document.getElementById("runButton");
const input = document.getElementById("command-input");
const info = document.getElementById("info");
const error = document.getElementById("errorBox");

const maxX = 500;
const maxY = 400;
const minX = 0;
const minY = 0;

let currentX = 100;
let currentY = 100;
let currentAngle = 0;
let penDown = true;

function parseCommand(command) {
    const parsed = command.split(" ");

    switch (parsed[0]) {
        case "fd": {
            fd(parseInt(parsed[1]));
            break;
        }
        case "lt": {
            left(parseInt(parsed[1]));
            break;
        }
        case "rt": {
            left(parseInt(parsed[1]));
            break;
        }
        case "penDown": {
            penDown = true;
            break;
        }
        case "penUp": {
            penDown = false;
            break;
        }
        case "clear": {
            context.clearRect(minX, minY, maxX, maxY);
            break;
        }
        case "example": {
            example();
            break;
        }
        default: {
            console.log("Wrong commnad: ", parsed);
            break;
        }
    }
}

btn.addEventListener("click", function () {
    error.innerText = "";
    input.value.split("\n").forEach(parseCommand);
    info.innerText = "X: " + currentX + "\nY: " + currentY + "\nAngle: " + currentAngle + "\nPen is down: " + penDown;
});

function init() {
    context.translate(0, maxY);
    context.scale(1, -1);
    context.moveTo(currentX, currentY);
    info.innerText = "X: " + currentX + "\nY: " + currentY + "\nAngle: " + currentAngle + "\nPen is down: " + penDown;
}

function checkCoords(x, y) {
    return x <= maxX && x >= minX && y <= maxY && y >= minY;
}

function degree() {
    return -(currentAngle / 360) * 2 * Math.PI;
}

function fd(dist) {
    newX = currentX + dist * Math.cos(degree());
    newY = currentY + dist * Math.sin(degree());

    if (checkCoords(newX, newY)) {
        if (penDown) {
            context.lineTo(newX, newY);
            context.stroke();
        } else {
            context.moveTo(newX, newY);
        }
        currentX = newX;
        currentY = newY;
    } else {
        error.innerText = "Nie tak szybko gagatku!";
    }
}

function right(angle) {
    currentAngle = (currentAngle - angle) % 360;
}

function left(angle) {
    currentAngle = (currentAngle + angle) % 360;
}

function example() {
    context.clearRect(minX, minY, maxX, maxY);
    currentX = 100;
    currentY = 100;
    currentAngle = 0;
    penDown = true;
    context.moveTo(currentX, currentY);

    //hexagon
    for (let i = 0; i < 6; i++) {
        fd(50);
        right(60);
    }
}

init();
