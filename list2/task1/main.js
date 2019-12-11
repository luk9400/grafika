window.onload = main;

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
            const name = event.target.id;
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
