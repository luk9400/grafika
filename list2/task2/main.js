window.onload = main;
let needToRender = true;
let objectsToDraw = [];

function main() {
    const canvas = document.getElementById('canvas');
    const gl = canvas.getContext('webgl');
    if (!gl) {
        return;
    }
    let pressedKeys = {};
    let currentObject;

    window.addEventListener("keydown", event => pressedKeys[event.key] = true);
    window.addEventListener("keyup", event => pressedKeys[event.key] = false);

    Utils.resizeCanvas(gl.canvas);

    let degree = parseInt(document.getElementById('degree').value);

    document.getElementById('btn').addEventListener('click', event => {
        degree = parseInt(document.getElementById('degree').value);
        const positions = generatePoints(degree, gl.canvas.width, gl.canvas.height);
        let object = {
            positionBuffer: initBuffers(gl, positions),
            degree: Math.pow(2, degree),
            uniforms: {
                uColor: [Math.random(), Math.random(), Math.random(), 1],
            },
            translation: [0, 0]
        };
        objectsToDraw.push(object);
        let len = objectsToDraw.length - 1;
        addMenu(objectsToDraw[len], len);
        needToRender = true;
    });

    const shaderProgram = Utils.initShaderProgram(gl, vsSource, fsSource);

    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aPosition')
        },
        uniformLocations: {
            matrixUniform: gl.getUniformLocation(shaderProgram, 'uMatrix'),
            colorUniform: gl.getUniformLocation(shaderProgram, 'uColor'),
        },
    };

    const positions = generatePoints(degree, gl.canvas.width, gl.canvas.height);
    let object = {
        positionBuffer: initBuffers(gl, positions),
        degree: Math.pow(2, degree),
        uniforms: {
            uColor: [Math.random(), Math.random(), Math.random(), 1],
        },
        translation: [0, 0]
    };
    objectsToDraw.push(object);
    currentObject = objectsToDraw[0];
    addMenu(objectsToDraw[0], 0);

    function render() {
        if (pressedKeys["d"]) {
            currentObject.translation[0] += 1;
            needToRender = true;
        }
        if (pressedKeys["a"]) {
            currentObject.translation[0] -= 1;
            needToRender = true;
        }
        if (pressedKeys["s"]) {
            currentObject.translation[1] += 1;
            needToRender = true;
        }
        if (pressedKeys["w"]) {
            currentObject.translation[1] -= 1;
            needToRender = true;
        }

        if (needToRender) {
            needToRender = false;

            drawScene(gl, programInfo, objectsToDraw);
        }

        requestAnimationFrame(render);
    }

    render();
}

function addMenu(object, id) {
    const containter = document.querySelector('nav');

    const menu = document.createElement('div');
    menu.className = 'menu';

    const info = document.createElement('span');
    info.textContent = `ID: ${id}, stopień: ${Math.round(Math.sqrt(object.degree))}`;

    const rgbInput = document.createElement('input');
    rgbInput.value = object.uniforms.uColor.join(', ');

    rgbInput.addEventListener('input', () => {
        let rgb = rgbInput.value.split(',').map(n => Number(n));
        if (rgb.length === 4 && rgb.every(num => !isNaN(num) && isFinite(num) && num >= 0 && num <= 1)) {
            objectsToDraw[id].uniforms.uColor = rgb;
            needToRender = true;
        }
    });

    menu.append(info, rgbInput);
    containter.append(menu);
}