function initBuffers(gl, positions) {
    const positionBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    return positionBuffer;
}

function drawScene(gl, programInfo, objectsToDraw) {
    Utils.resizeCanvas(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.useProgram(programInfo.program);

    objectsToDraw.forEach(object => {
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
        gl.bindBuffer(gl.ARRAY_BUFFER, object.positionBuffer);

        let size = 2;          // 2 components per iteration
        let type = gl.FLOAT;   // the data is 32bit floats
        let normalize = false; // don't normalize the data
        let stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        let offset = 0;        // start at the beginning of the buffer
        gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, size, type, normalize, stride, offset);

        let matrix = m3.projection(gl.canvas.clientWidth, gl.canvas.clientHeight);
        matrix = m3.translate(matrix, object.translation[0], object.translation[1]);

        gl.uniformMatrix3fv(programInfo.uniformLocations.matrixUniform, false, matrix);

        gl.uniform4fv(programInfo.uniformLocations.colorUniform, object.uniforms.uColor);

        gl.uniform1f(programInfo.uniformLocations.depthUniform, object.uniforms.uDepth);

        gl.drawArrays(gl.LINE_STRIP, 0, object.degree * object.degree);
    });
}