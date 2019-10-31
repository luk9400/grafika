const minX = 0;
const minY = 0;
const maxX = 500;
const maxY = 500;

function translateLevelCoordinates(degree, x, y) {
    return [
        (x / degree) * (maxX - minX) + minX,
        maxY - (y / degree) * (maxY - minY) + minY
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

function generatePoints(inputDegree) {
    const svg = document.getElementById("hilbertSVG");
    const degree = Math.pow(2, inputDegree);
    let points = "";

    for (let i = 0; i < degree * degree; i++) {
        const point = hindex2xy(i, degree);
        const coords = translateLevelCoordinates(degree, point[0], point[1]);

        points = points.concat(coords[0] + "," + coords[1] + " ");
    }

    svg.innerHTML = '<polyline points="' + points + '" style="fill:none;stroke:black;stroke-width:1" />';
}