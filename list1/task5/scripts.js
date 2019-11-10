const canvas = document.getElementById("myCanvas");
const context = canvas.getContext("2d");
const btn = document.getElementById("runButton");
const input = document.getElementById("command-input");
const info = document.getElementById("info");
const error = document.getElementById("errorBox");

const dx = canvas.width / 2;
const dy = canvas.height / 2;
const perspective = 200;

const pressedKeys = {};
const speedUp = 0.3;
const slowDown = 0.2;
const maxSpeed = 50;
let previousTimestamp = 0;
let vx = 0;
let vy = 0;
let vz = 0;
let drag = false;

let currentAlpha = 180;
let currentBeta = 30;
let penDown = true;

let objects = [];

let Vertex2D = function (x, y) {
    this.x = parseFloat(x);
    this.y = parseFloat(y);
};

let Line = function (start, end, draw) {
    this.start = start;
    this.end = end;
    this.draw = draw
}

function project(line) {
    let d = perspective;
    if (line.start.z <= -d && line.end.z <= -d) {
        return [];
    }

    return new Line(new Vertex2D(d * line.start.x / Math.max(d + line.start.z, 0.01), d * line.start.y / Math.max(d + line.start.z, 0.01)), new Vertex2D(d * line.end.x / Math.max(d + line.end.z, 0.01), d * line.end.y / Math.max(d + line.end.z, 0.01)));
}

function rotateY(angle) {
    let sin = Math.sin(angle);
    let cos = Math.cos(angle);

    objects.forEach(obj => {
        [obj.start, obj.end].forEach(vertex => {
            let x = vertex.x;
            let y = vertex.y;
            let z = vertex.z + perspective;
            vertex.x = x * cos + z * sin;
            vertex.y = y;
            vertex.z = z * cos - x * sin - perspective;
        });
    });
}

function rotateX(angle) {
    let sin = Math.sin(angle);
    let cos = Math.cos(angle);

    objects.forEach(obj => {
        [obj.start, obj.end].forEach(vertex => {
            let x = vertex.x;
            let y = vertex.y;
            let z = vertex.z + perspective;
            vertex.x = x;
            vertex.y = y * cos - z * sin;
            vertex.z = z * cos + y * sin - perspective;
        });
    });
}

function render(objects, dx, dy) {
    // clearing previous frame
    context.clearRect(0, 0, 2 * dx, 2 * dy);


    for (let i = 0; i < objects.length; i++) {
        if (objects[i].draw) {
            let line = project(objects[i]);
            if (line.start === undefined) {
                continue;
            }

            context.beginPath();
            context.moveTo(line.start.x + dx, line.start.y + dy);
            context.lineTo(line.end.x + dx, line.end.y + dy);
            context.closePath();
            context.stroke();
        }
    }
}

function move(dx = 0, dy = 0, dz = 0) {
    objects.forEach(obj => {
        [obj.start, obj.end].forEach(vertex => {
            vertex.x += dx;
            vertex.y += dy;
            vertex.z += dz;
        });
    });
}

let draw = (timestamp) => {
    let timeFactor = timestamp - previousTimestamp;

    if (pressedKeys["w"]) {
        vz = Math.max(vz - speedUp * timeFactor, -maxSpeed);
    } else if (pressedKeys["s"]) {
        vz = Math.min(vz + speedUp * timeFactor, maxSpeed);
    }

    if (pressedKeys["d"]) {
        vx = Math.max(vx - speedUp * timeFactor, -maxSpeed);
    } else if (pressedKeys["a"]) {
        vx = Math.min(vx + speedUp * timeFactor, maxSpeed);
    }

    if (pressedKeys["q"]) {
        vy = Math.max(vy - speedUp * timeFactor, -maxSpeed);
    } else if (pressedKeys["e"]) {
        vy = Math.min(vy + speedUp * timeFactor, maxSpeed);
    }


    if (vy > 0) {
        vy -= Math.min(slowDown * timeFactor, vy);
    } else {
        vy -= Math.max(-slowDown * timeFactor, vy);
    }

    if (vx > 0) {
        vx -= Math.min(slowDown * timeFactor, vx);
    } else {
        vx -= Math.max(-slowDown * timeFactor, vx);
    }

    if (vz > 0) {
        vz -= Math.min(slowDown * timeFactor, vz);
    } else {
        vz -= Math.max(-slowDown * timeFactor, vz);
    }

    move(vx, vy, vz);
    render(objects, dx, dy);
    previousTimestamp = timestamp;
    window.requestAnimationFrame(draw);
};

function fd(dist) {
    let oldX = objects[objects.length - 1].end.x;
    let oldY = objects[objects.length - 1].end.y;
    let oldZ = objects[objects.length - 1].end.z;

    const start = { x: oldX, y: oldY, z: oldZ };

    oldX += dist * Math.sin(currentAlpha * Math.PI / 180) * Math.cos(currentBeta * Math.PI / 180)
    oldY += dist * Math.cos(currentAlpha * Math.PI / 180) * Math.sin(currentBeta * Math.PI / 180)
    oldZ += dist * Math.cos(currentAlpha * Math.PI / 180) * Math.cos(currentBeta * Math.PI / 180)
    objects.push(new Line(start, {x: oldX, y: oldY, z: oldZ}, penDown));
}

function alpha(angle) {
    currentAlpha = ((currentAlpha + angle) % 360 + 360) % 360;
}

function beta(angle) {
    currentBeta = (currentBeta + angle) % 360;
}

function parseCommand(command) {
    const parsed = command.split(" ");

    switch (parsed[0]) {
        case "fd": {
            fd(parseInt(parsed[1]));
            break;
        }
        case "alpha": {
            alpha(parseInt(parsed[1]));
            break;
        }
        case "beta": {
            beta(parseInt(parsed[1]));
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
            context.clearRect(0, 0, 2 * dx, 2 * dy);
            objects = [new Line({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, false)];
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
    info.innerText = "X: " + objects[objects.length - 1].end.x + "\nY: " + objects[objects.length - 1].end.y + "\nZ: " + objects[objects.length - 1].end.z + "\nAlpha: " + currentAlpha + "\nBeta: " + currentBeta + "\nPen is down: " + penDown;
    render(objects, dx, dy);
});

// dirty trick, line as starting point
objects.push(new Line({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, false));

function example() {
    for (let i = 0; i < 50; i++) {

        fd(100);
        alpha(120);
        fd(100);
        alpha(120);
        beta(30);
        fd(100);
        alpha(120);
        beta(-30);
    }
}

render(objects, dx, dy);

canvas.addEventListener("mousedown", () => drag = true);
document.addEventListener("mouseup", () => drag = false);
window.addEventListener("keydown", event => pressedKeys[event.key] = true);
window.addEventListener("keyup", event => pressedKeys[event.key] = false);
canvas.addEventListener("mousemove", event => {
    if (drag) {
        let alpha = -event.movementX * Math.PI / 360;
        let beta = event.movementY * Math.PI / 180;

        rotateY(alpha);
        rotateX(beta);
    }
});

window.requestAnimationFrame(draw);
