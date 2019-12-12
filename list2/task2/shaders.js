const vsSource = `
attribute vec2 aPosition;

uniform mat3 uMatrix;
uniform float uDepth;

void main() {
    gl_Position = vec4((uMatrix * vec3(aPosition, 1)).xy, 0.1 * uDepth, 1);
}
`;

const fsSource = `
    precision mediump float;
    uniform vec4 uColor;

    void main() {
      gl_FragColor = uColor;
    }
`;