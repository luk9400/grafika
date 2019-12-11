window.onload = main;

function initBuffers(gl) {
    const positionBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const positions = [
        100.0, 100.0,
        200.0, 100.0,
        300.0, 200.0,
        200.0, 300.0,
        100.0, 300.0,
        50.0, 200.0
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    return positionBuffer;
}

function drawScene(gl, programInfo, positionBuffer, primitiveType) {
    Utils.resizeCanvas(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(programInfo.program);
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    let size = 2;          // 2 components per iteration
    let type = gl.FLOAT;   // the data is 32bit floats
    let normalize = false; // don't normalize the data
    let stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    let offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, size, type, normalize, stride, offset);

    gl.uniform2f(programInfo.uniformLocations.resolutionUniform, gl.canvas.width, gl.canvas.height);

    gl.uniform4f(programInfo.uniformLocations.colorUniform, Math.random(), Math.random(), Math.random(), 1);


    gl.drawArrays(primitiveType, 0, 6);
}

function getInfo(gl, shaderProgram) {
    const numAttribs = gl.getProgramParameter(shaderProgram, gl.ACTIVE_ATTRIBUTES);
    for (let i = 0; i < numAttribs; ++i) {
        const info = gl.getActiveAttrib(shaderProgram, i);
        console.log('name:', info.name, 'type:', info.type, 'size:', info.size);
    }

    const numUniforms = gl.getProgramParameter(shaderProgram, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < numUniforms; ++i) {
        const info = gl.getActiveUniform(shaderProgram, i);
        console.log('name:', info.name, 'type:', info.type, 'size:', info.size);
    }
}

function main() {
    const current = document.getElementById('current')
    const canvas = document.getElementById('canvas');
    const gl = canvas.getContext('webgl');
    if (!gl) {
        return;
    }

    let type = gl.POINTS;
    let needToRender = true;
    document.querySelector('nav').addEventListener('click', event => {
        if (event.target.id) {
            const name = event.target.id.toUpperCase();
            type = gl[name];
            current.textContent = `CURRENT: ${name}`;
            needToRender = true;
        }
    });

    const shaderProgram = Utils.initShaderProgram(gl, vsSource, fsSource);

    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aPosition')
        },
        uniformLocations: {
            resolutionUniform: gl.getUniformLocation(shaderProgram, 'uResolution'),
            colorUniform: gl.getUniformLocation(shaderProgram, 'uColor'),
        },
    };

    const positionBuffer = initBuffers(gl);

    function render() {
        if (needToRender) {
            needToRender = false;
            drawScene(gl, programInfo, positionBuffer, type);
        }
        requestAnimationFrame(render);
    }
    render();

    getInfo(gl, programInfo.program);
}
