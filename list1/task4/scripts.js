const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");
const dx = canvas.width / 2;
const dy = canvas.height / 2;
const perspective = 200;

const pressedKeys = {};
const speedUp = 0.3;
const slowDown = 0.2;
const maxSpeed = 50;
let previousTimestamp = 0;
let vx = 0;
let vz = 0;



let Vertex = function (x, y, z) {
    this.x = parseFloat(x);
    this.y = parseFloat(y);
    this.z = parseFloat(z);
};

let Vertex2D = function (x, y) {
    this.x = parseFloat(x);
    this.y = parseFloat(y);
};

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
        [this.vertices[0], this.vertices[1]],
        [this.vertices[1], this.vertices[2]],
        [this.vertices[2], this.vertices[3]],
        [this.vertices[3], this.vertices[4]],
        [this.vertices[4], this.vertices[5]],
        [this.vertices[5], this.vertices[6]],
        [this.vertices[6], this.vertices[7]],
        [this.vertices[7], this.vertices[4]],
        [this.vertices[1], this.vertices[6]],
        [this.vertices[0], this.vertices[7]],
        [this.vertices[2], this.vertices[5]],
        [this.vertices[0], this.vertices[3]]
    ];
};

function project(M) {
    let d = 200;
    let r = d / M.y;

    return new Vertex2D(r * M.x, r * M.z);
}

// function project(M) {
//     return new Vertex2D(perspective * M.x / Math.max(perspective + M.z, 0.01), perspective * M.y / Math.max(perspective + M.z, 0.01));
// }

function render(objects, dx, dy) {
    // clearing previous frame
    context.clearRect(0, 0, 2 * dx, 2 * dy);

    for (let i = 0; i < objects.length; i++) {
        for (let j = 0; j < objects[i].lines.length; j++) {
            let line = objects[i].lines[j];

            let P = project(line[0]);
            context.beginPath();
            context.moveTo(P.x + dx, -P.y + dy);

            P = project(line[1]);
            context.lineTo(P.x + dx, -P.y + dy);

            context.closePath();
            context.stroke();
        }
    }
}

function rotate(objects, theta, phi) {
    for (let i = 0; i < objects.length; i++) {
        for (let j = 0; j < objects[i].vertices.length; j++) {
            rotatePoint(objects[i].vertices[j], objects[i].center, theta, phi);
        }
    }
}

function rotatePoint(M, center, theta, phi) {
    // Rotation matrix coefficients
    let ct = Math.cos(theta);
    let st = Math.sin(theta);
    let cp = Math.cos(phi);
    let sp = Math.sin(phi);

    // Rotation
    let x = M.x - center.x;
    let y = M.y - center.y;
    let z = M.z - center.z;

    M.x = ct * x - st * cp * y + st * sp * z + center.x;
    M.y = st * x + ct * cp * y - ct * sp * z + center.y;
    M.z = sp * y + cp * z + center.z;
}

// function rotate(pitch = 0, roll = 0, yaw = 0) {
//     let cosa = Math.cos(yaw);
//     let sina = Math.sin(yaw);

//     let cosb = Math.cos(pitch);
//     let sinb = Math.sin(pitch);

//     let cosc = Math.cos(roll);
//     let sinc = Math.sin(roll);

//     let Axx = cosa * cosb;
//     let Axy = cosa * sinb * sinc - sina * cosc;
//     let Axz = cosa * sinb * cosc + sina * sinc;

//     let Ayx = sina * cosb;
//     let Ayy = sina * sinb * sinc + cosa * cosc;
//     let Ayz = sina * sinb * cosc - cosa * sinc;

//     let Azx = -sinb;
//     let Azy = cosb * sinc;
//     let Azz = cosb * cosc;

//     objects.forEach(obj => {
//         obj.vertices.forEach(vertex => {
//             vertex.x = Axx * vertex.x + Axy * vertex.y + Axz * (vertex.z + perspective);
//             vertex.y = Ayx * vertex.x + Ayy * vertex.y + Ayz * (vertex.z + perspective);
//             vertex.z = Azx * vertex.x + Azy * vertex.y + Azz * vertex.z - perspective;
//         });
//     });
// }

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

    if (vz > 0) {
        vz -= Math.min(slowDown * timeFactor, vz);
    } else {
        vz -= Math.max(-slowDown * timeFactor, vz);
    }

    if (vx > 0) {
        vx -= Math.min(slowDown * timeFactor, vx);
    } else {
        vx -= Math.max(-slowDown * timeFactor, vx);
    }

    move(vx, vz, 0);
    render(objects, dx, dy);
    previousTimestamp = timestamp;
    window.requestAnimationFrame(draw);
};

let objects = [
    //new Cube(new Vertex(0, 1.1 * dy, 0), dy),
    new Cube(new Vertex(0, 100, 0), 100),
    new Cube(new Vertex(0, 200, 0), 100),
    new Cube(new Vertex(100, 200, 0), 100),
];
render(objects, dx, dy);

let drag = false;
canvas.addEventListener("mousedown", () => drag = true);
document.addEventListener("mouseup", () => drag = false);
window.addEventListener("keydown", event => pressedKeys[event.key] = true);
window.addEventListener("keyup", event => pressedKeys[event.key] = false);
canvas.addEventListener("mousemove", event => {
    if (drag) {
        let theta = event.movementX * Math.PI / 360;
        let phi = event.movementY * Math.PI / 180;

        rotate(objects, theta, phi);
        //rotate(event.movementX / 500, event.movementY / 500);
        //render(objects, dx, dy);
    }
});

window.requestAnimationFrame(draw);
