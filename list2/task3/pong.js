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
        this.positionBuffer = initBuffers(gl, this.position);
        this.color = [1, 1, 1, 1];
        this.offset = 6;
        this.width = 20;
        this.height = 200;
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

class Net {
    constructor(gl) {
        this.position = [
            0, 0,
            0, 600,
            10, 0,
            10, 0,
            10, 600,
            0, 600
        ];
        this.positionBuffer = initBuffers(gl, this.position);
        this.color = [0.663, 0.663, 0.663, 1];
        this.offset = 6;
        this.translation = [495, 0];
    }
}

class Ball {
    constructor(gl) {
        this.position = [
            0, 0,
            0, 10,
            10, 0,
            10, 0,
            10, 10,
            0, 10
        ];
        this.positionBuffer = initBuffers(gl, this.position);
        this.color = [0.9, 0.9, 0.9, 1];
        this.offset = 6;
        this.translation = [495, 295];
        this.dx = -3;
        this.dy = -1;
        this.width = 10;
        this.height = 10;
    }

    checkCollision(gl, pong) {
        let score = document.getElementById('score');

        let ballMaxY = this.translation[1] + this.height;
        let ballMinY = this.translation[1];
        let ballMaxX = this.translation[0] + this.width;
        let ballMinX = this.translation[0];

        let leftPaddleMaxY = pong.leftPaddle.translation[1] + pong.leftPaddle.height;
        let leftPaddleMinY = pong.leftPaddle.translation[1];
        let leftPaddleMaxX = pong.leftPaddle.translation[0] + pong.leftPaddle.width;

        let rightPaddleMaxY = pong.rightPaddle.translation[1] + pong.rightPaddle.height;
        let rightPaddleMinY = pong.rightPaddle.translation[1];
        let rightPaddleMinX = pong.rightPaddle.translation[0];

        // top border
        if (ballMinY <= 0) {
            this.dy = -this.dy;
        }

        // bottom border
        if (ballMaxY >= gl.canvas.clientHeight) {
            this.dy = -this.dy;
        }

        // left paddle
        if (ballMinX <= leftPaddleMaxX && ballMaxY >= leftPaddleMinY && ballMinY <= leftPaddleMaxY) {
            //this.dy = -this.dy;
            this.dx = -this.dx;
        }

        // right paddle
        if (ballMaxX >= rightPaddleMinX && ballMaxY >= rightPaddleMinY && ballMinY <= rightPaddleMaxY) {
            //this.dy = -this.dy;
            this.dx = -this.dx;
        }

        // left border
        if (ballMinX <= 0) {
            this.translation = [495, 295];
            pong.rightScore++;
            score.innerText = `Score ${pong.leftScore}:${pong.rightScore}`;
        }

        // right border
        if (ballMaxX >= gl.canvas.clientWidth) {
            this.translation = [495, 295];
            pong.leftScore++;
            score.innerText = `Score ${pong.leftScore}:${pong.rightScore}`;
        }
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

        this.leftScore = 0;
        this.rightScore = 0;

        this.rightPaddle = new RightPaddle(gl);
        this.leftPaddle = new LeftPaddle(gl);
        this.net = new Net(gl);
        this.ball = new Ball(gl);
        this.objectsToDraw = [this.rightPaddle, this.leftPaddle, this.net, this.ball];
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

function initBuffers(gl, positions) {
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    return positionBuffer;
}

