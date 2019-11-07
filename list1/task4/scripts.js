const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");
const dx = canvas.width / 2;
const dy = canvas.height / 2;
const perspective = 500;

const pressedKeys = {};
const speedUp = 0.3;
const slowDown = 0.2;
const maxSpeed = 50;
let previousTimestamp = 0;
let vx = 0;
let vy = 0;
let vz = 0;
let drag = false;

let Vertex = function (x, y, z) {
    this.x = parseFloat(x);
    this.y = parseFloat(y);
    this.z = parseFloat(z);
};

let Vertex2D = function (x, y) {
    this.x = parseFloat(x);
    this.y = parseFloat(y);
};

let Line = function (start, end) {
    this.start = start;
    this.end = end;
}

let Cube = function (center, size) {
    this.center = center;
    let d = size / 2;

    this.vertices = [
        new Vertex(center.x - d, center.y - d, center.z + d),
        new Vertex(center.x - d, center.y - d, center.z - d),
        new Vertex(center.x + d, center.y - d, center.z - d),
        new Vertex(center.x + d, center.y - d, center.z + d),
        new Vertex(center.x + d, center.y + d, center.z + d),
        new Vertex(center.x + d, center.y + d, center.z - d),
        new Vertex(center.x - d, center.y + d, center.z - d),
        new Vertex(center.x - d, center.y + d, center.z + d)
    ];

    this.lines = [
        new Line(this.vertices[0], this.vertices[1]),
        new Line(this.vertices[1], this.vertices[2]),
        new Line(this.vertices[2], this.vertices[3]),
        new Line(this.vertices[3], this.vertices[4]),
        new Line(this.vertices[4], this.vertices[5]),
        new Line(this.vertices[5], this.vertices[6]),
        new Line(this.vertices[6], this.vertices[7]),
        new Line(this.vertices[7], this.vertices[4]),
        new Line(this.vertices[1], this.vertices[6]),
        new Line(this.vertices[0], this.vertices[7]),
        new Line(this.vertices[2], this.vertices[5]),
        new Line(this.vertices[0], this.vertices[3])
    ];
};

function project(line) {
    let d = perspective;
    if (line.start.z <= -d && line.end.z <= -d) {
        return [];
    }

    return new Line(new Vertex2D(d * line.start.x / Math.max(d + line.start.z, 0.01), d * line.start.y / Math.max(d + line.start.z, 0.01)), new Vertex2D(d * line.end.x / Math.max(d + line.end.z, 0.01), d * line.end.y / Math.max(d + line.end.z, 0.01)));
}

function render(objects, dx, dy) {
    // clearing previous frame
    context.clearRect(0, 0, 2 * dx, 2 * dy);
    context.fillRect(0, 0, 2 * dx, 2 * dy);

    for (let i = 0; i < objects.length; i++) {
        for (let j = 0; j < objects[i].lines.length; j++) {
            let line = project(objects[i].lines[j]);
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

function rotateY(angle) {
    let sin = Math.sin(angle);
    let cos = Math.cos(angle);

    objects.forEach(obj => {
        obj.vertices.forEach(vertex => {
            let x = vertex.x;
            let y = vertex.y;
            let z = vertex.z;
            vertex.x = x * cos + z * sin;
            vertex.y = y;
            vertex.z = z * cos - x * sin;
        });
    });
}

function move(dx = 0, dy = 0, dz = 0) {
    objects.forEach(obj => {
        obj.vertices.forEach(vertex => {
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

let objects = [
    //new Cube(new Vertex(0, 1.1 * dy, 0), dy),
    new Cube(new Vertex(0, 0, 0), 100),
    new Cube(new Vertex(0, 0, 100), 200),
    new Cube(new Vertex(100, 0, 0), 100),
];
context.fillStyle = "#F0F0F0";
context.fillRect(0, 0, 2 * dx, 2 * dy);
render(objects, dx, dy);

canvas.addEventListener("mousedown", () => drag = true);
document.addEventListener("mouseup", () => drag = false);
window.addEventListener("keydown", event => pressedKeys[event.key] = true);
window.addEventListener("keyup", event => pressedKeys[event.key] = false);
canvas.addEventListener("mousemove", event => {
    if (drag) {
        let theta = event.movementX * Math.PI / 360;
        let phi = event.movementY * Math.PI / 180;
        
        rotateY(theta);
    }
});

window.requestAnimationFrame(draw);
