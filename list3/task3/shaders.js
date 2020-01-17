const vsSource = `
attribute vec4 aPosition;

uniform mat4 uMatrix;

void main() {
    gl_Position = uMatrix * aPosition;
    gl_PointSize = 4.0;
}
`;

const fsSource = `
    precision mediump float;
    uniform vec4 uColor;

    void main() {
      gl_FragColor = uColor;
    }
`;