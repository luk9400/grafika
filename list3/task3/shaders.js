const vsSource = `
attribute vec4 aPosition;

uniform mat4 uMatrix;

varying vec4 vColor;

void main() {
    gl_Position = uMatrix * aPosition;
    gl_PointSize = 4.0;

    vColor = vec4(1, 0.5, 0, 1);
}
`;

const fsSource = `
    precision mediump float;
    varying vec4 vColor;

    void main() {
      gl_FragColor = vColor;
    }
`;