const vsSource = `
attribute vec4 aPosition;

uniform mat4 uMatrix;
uniform mat4 uPerspective;

varying float vFogDepth;

void main() {
    gl_Position = uPerspective * uMatrix * aPosition;
    gl_PointSize = 4.0;

    vFogDepth = -(uMatrix * aPosition).z;
}
`;

const fsSource = `
    precision mediump float;

    varying float vFogDepth;

    void main() {
      float fogAmount = smoothstep(1000.0, 5000.0, vFogDepth);

      gl_FragColor = vec4(1, 0.5, 0, 1);
      gl_FragColor = mix(gl_FragColor, vec4(1, 1, 1, 1), fogAmount);
    }
`;