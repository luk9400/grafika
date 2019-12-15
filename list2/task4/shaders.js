const vsSource = `
attribute vec2 aPosition;
attribute vec2 aTexcoord;

uniform mat3 uMatrix;

varying vec2 vTexcoord;

void main() {
    gl_Position = vec4((uMatrix * vec3(aPosition, 1)).xy, 0, 1);
    vTexcoord = aTexcoord;
}
`;

const fsSource = `
    precision mediump float;
    varying vec2 vTexcoord;
    
    uniform sampler2D uTexture;

    void main() {
      gl_FragColor = texture2D(uTexture, vTexcoord);
    }
`;