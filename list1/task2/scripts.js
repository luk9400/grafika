const canvas = document.getElementById("hilbertCanvas");
const context = canvas.getContext("2d");

const minX = 0;
const minY = 0;
const maxX = 500;
const maxY = 500;

let currentX = 0;
let currentY = maxY;
let currentAngle = 0;
let penDown = true;

function degree() {
    return -(currentAngle / 360) * 2 * Math.PI;
}

function fd(dist) {
    newX = currentX + dist * Math.cos(degree());
    newY = currentY + dist * Math.sin(degree());

    if (penDown) {
        context.beginPath();
        context.moveTo(currentX, currentY);
        context.lineTo(newX, newY);
        context.stroke();
    } else {
        context.moveTo(newX, newY);
    }
    currentX = newX;
    currentY = newY;
}

function right(angle) {
    currentAngle = (currentAngle - angle) % 360;
}

function left(angle) {
    currentAngle = (currentAngle + angle) % 360;
}

function translateCoordinates(degree, x, y) {
    return [
        (x / degree) * (maxX - minX) + minX,
        (y / degree) * (maxY - minY) + minY
    ];
}

function last2bits(x) {
    return (x & 3);
}

function hindex2xy(hindex, N) {
    let positions = [[0, 0], [0, 1], [1, 1], [1, 0]];

    let tmp = positions[last2bits(hindex)];
    hindex = (hindex >>> 2);

    let x = tmp[0];
    let y = tmp[1];

    for (let n = 4; n <= N; n *= 2) {
        let n2 = n / 2;

        switch (last2bits(hindex)) {
            // bottom-left
            case 0: {
                tmp = x;
                x = y;
                y = tmp;
                break;
            }
            // upper-left
            case 1: {
                y = y + n2;
                break;
            }
            // upper-right
            case 2: {
                x = x + n2;
                y = y + n2;
                break;
            }
            // bottom-right
            case 3: {
                tmp = y;
                y = (n2 - 1) - x;
                x = (n2 - 1) - tmp;
                x = x + n2;
                break;
            }
        }
        hindex = (hindex >>> 2);
    }
    return [x, y];
}

function chooseAngle(dx, dy) {
    if (dx === 0) {
        if (dy > 0) {
            return 90;
        } else {
            return 270;
        }
    }

    if (dy === 0) {
        if (dx > 0) {
            return 0;
        } else {
            return 180;
        }
    }
}

function drawHilbert(inputDegree) {
    const degree = Math.pow(2, inputDegree);
    const dist = maxX / degree;
    let prev = [0, 0];
    let curr;
    
    context.moveTo(0, maxY);
    
    for (let i = 1; i < degree * degree; i++) {
        curr = hindex2xy(i, degree);
        const prevT = translateCoordinates(degree, prev[0], prev[1]);
        const currT = translateCoordinates(degree, curr[0], curr[1]);

        let dx = currT[0] - prevT[0];
        let dy = currT[1] - prevT[1];

        let angle = chooseAngle(dx, dy);

        right(currentAngle - angle);
        fd(dist);

        prev = curr;
    }
}
