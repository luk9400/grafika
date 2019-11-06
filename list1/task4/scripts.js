const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");
const dx = canvas.width / 2;
const dy = canvas.height / 2;

let Vertex = function (x, y, z) {
    this.x = parseFloat(x);
    this.y = parseFloat(y);
    this.z = parseFloat(z);
};

let Vertex2D = function (x, y) {
    this.x = parseFloat(x);
    this.y = parseFloat(y);
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
        [this.vertices[3], this.vertices[4]]
    ];
};

function project(M) {
    let d = 200;
    let r = d / M.y;

    return new Vertex2D(r * M.x, r * M.z);
}

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

function rotate(M, center, theta, phi) {
    // Rotation matrix coefficients
    var ct = Math.cos(theta);
    var st = Math.sin(theta);
    var cp = Math.cos(phi);
    var sp = Math.sin(phi);

    // Rotation
    var x = M.x - center.x;
    var y = M.y - center.y;
    var z = M.z - center.z;

    M.x = ct * x - st * cp * y + st * sp * z + center.x;
    M.y = st * x + ct * cp * y - ct * sp * z + center.y;
    M.z = sp * y + cp * z + center.z;
}

function autorotate() {
    for (var i = 0; i < 8; ++i) {
        rotate(cube.vertices[i], cube.center, -Math.PI / 720, Math.PI / 720);
    }

    render(objects, dx, dy);

    autorotate_timeout = setTimeout(autorotate, 30);
}

let cube = new Cube(new Vertex(0, 11 * dy / 10, 0), dy);
let objects = [cube];
render(objects, dx, dy);

let drag = false
canvas.addEventListener("mousedown", () => drag = true);
document.addEventListener("mouseup", () => drag = false);
canvas.addEventListener("mousemove", event => {
    if (drag) {
        let theta = event.movementX * Math.PI / 360;
        let phi = event.movementY * Math.PI / 180;

        for (var i = 0; i < 8; ++i) {
            rotate(cube.vertices[i], cube.center, theta, phi);
        }

        render(objects, dx, dy);
    }
})

//autorotate_timeout = setTimeout(autorotate, 2000);