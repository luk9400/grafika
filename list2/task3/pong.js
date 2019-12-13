class Paddle {
    constructor(gl) {

        this.position = [
            0, 0,
            0, 200,
            20, 0,
            20, 0,
            20, 200,
            0, 200
        ];
        this.positionBuffer = initBuffers(gl, this.position)
        this.color = [1, 1, 1, 1];
        this.offset = 6;
    }
}

class LeftPaddle extends Paddle {
    constructor(props) {
        super(props);

        this.translation = [20, 200];
    }
}

class RightPaddle extends Paddle {
    constructor(props) {
        super(props);

        this.translation = [960, 200];
    }
}

class Pong {
    constructor(gl) {
        this.gl = gl;
        this.program = Utils.initShaderProgram(this.gl, vsSource, fsSource);

        this.uniforms = {
            uMatrix: gl.getUniformLocation(this.program, 'uMatrix'),
            uColor: gl.getUniformLocation(this.program, 'uColor'),
        };
        this.attribs = {
            aPosition: gl.getAttribLocation(this.program, 'aPosition')
        };

        this.rightPaddle = new RightPaddle(gl);
        this.leftPaddle = new LeftPaddle(gl);
        this.objectsToDraw = [this.rightPaddle, this.leftPaddle];
    }

    drawScene() {
        Utils.resizeCanvas(this.gl.canvas);
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        this.gl.useProgram(this.program);

        this.objectsToDraw.forEach(object => {
            this.gl.enableVertexAttribArray(this.attribs.aPosition);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, object.positionBuffer);

            let size = 2;          // 2 components per iteration
            let type = this.gl.FLOAT;   // the data is 32bit floats
            let normalize = false; // don't normalize the data
            let stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
            let offset = 0;        // start at the beginning of the buffer
            this.gl.vertexAttribPointer(this.attribs.aPosition, size, type, normalize, stride, offset);

            let matrix = m3.projection(this.gl.canvas.clientWidth, this.gl.canvas.clientHeight);
            matrix = m3.translate(matrix, object.translation[0], object.translation[1]);

            this.gl.uniformMatrix3fv(this.uniforms.uMatrix, false, matrix);

            this.gl.uniform4fv(this.uniforms.uColor, object.color);

            this.gl.drawArrays(this.gl.TRIANGLES, 0, object.offset);
        });
    }
}

