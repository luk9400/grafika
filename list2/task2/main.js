window.onload = main

function main() {
    const canvas = document.getElementById('canvas');
    const gl = canvas.getContext('webgl');
    if (!gl) {
        return;
    }
    Utils.resizeCanvas(gl.canvas);

    let degree = parseInt(document.getElementById('degree').value);
    let needToRender = true;
    document.getElementById('btn').addEventListener('click', event => {
        degree = parseInt(document.getElementById('degree').value);
        needToRender = true;
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

    function render() {
        if (needToRender) {
            needToRender = false;
            const positions = generatePoints(degree, gl.canvas.width, gl.canvas.height);
            const positionBuffer = initBuffers(gl, positions);
            drawScene(gl, programInfo, positionBuffer, Math.pow(2, degree));
        }

        requestAnimationFrame(render);
    }

    render();
}