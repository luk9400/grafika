class Plot {
    constructor(gl) {
        this.size = 1000;  
        this.fidelity = 50;
        this.positions = this.generatePlot([-5, 5], [-5, 5], (x, y) => x * y);    
        this.positionBuffer = initBuffers(gl, this.positions);
        this.color = [1, 0, 0, 1];
        this.translation = [0, 0, 2000];
        this.rotation = [Math.PI, 0.02, 0];


        console.log(this.positions);
    }

    generatePlot(xRange, yRange, func) {
        let plot = [];
        for (let x = 0; x < this.fidelity; x++) {
            for (let y = 0; y < this.fidelity; y++) {
                const value = func(
                    xRange[0] + x * (xRange[1] - xRange[0]) / this.fidelity,
                    yRange[0] + y * (yRange[1] - yRange[0]) / this.fidelity
                );
                
                plot.push(
                    x * this.size / this.fidelity - this.size / 2, 
                    y * this.size / this.fidelity - this.size / 2, 
                    value);
            }
        }

        const scaleFactor = this.size / Math.abs(xRange[1] - xRange[0]);
        plot = plot.map((p, i) => i % 3 === 2 ? p * scaleFactor : p);

        return plot;
    }
}

class Engine {
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

        this.plot = new Plot(this.gl);
        this.objectsToDraw = [this.plot];
    }

    drawScene() {
        Utils.resizeCanvas(this.gl.canvas);
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.enable(this.gl.DEPTH_TEST);

        this.gl.clearColor(1.0, 1.0, 1.0, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        this.gl.useProgram(this.program);

        this.objectsToDraw.forEach(object => {
            this.gl.enableVertexAttribArray(this.attribs.aPosition);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, object.positionBuffer);

            let size = 3;          
            let type = this.gl.FLOAT;   
            let normalize = false; 
            let stride = 0;        
            let offset = 0;        
            this.gl.vertexAttribPointer(this.attribs.aPosition, size, type, normalize, stride, offset);

            let aspect = this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;
            let fov = Math.PI / 4;
            let scale = [1, 1, 1];

            let matrix = m4.perspective(fov, aspect, 1, 5000);
            matrix = m4.xRotate(matrix, object.rotation[0]);
            matrix = m4.yRotate(matrix, object.rotation[1]);
            //matrix = m4.zRotate(matrix, object.rotation[2]);
            matrix = m4.translate(matrix, object.translation[0], object.translation[1], object.translation[2]);
            //matrix = m4.scale(matrix, scale[0], scale[1], scale[2]);
            //let mat = m4.projection(this.gl.canvas.clientWidth, this.gl.canvas.clientHeight, 1);
            //matrix = m4.multiply(matrix, m4.inverse(matrix));

            this.gl.uniformMatrix4fv(this.uniforms.uMatrix, false, matrix);

            this.gl.uniform4fv(this.uniforms.uColor, object.color);

            this.gl.drawArrays(this.gl.POINTS, 0, object.fidelity * object.fidelity);
        });
    }
}

function initBuffers(gl, positions) {
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    return positionBuffer;
}