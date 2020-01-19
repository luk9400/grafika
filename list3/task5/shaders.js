const vsSource = `
attribute vec4 aPosition;
attribute vec3 aNormal;

uniform mat4 uMatrix;
uniform mat4 uPerspective;

varying float vFogDepth;
varying vec3 vNormal;

void main() {
    gl_Position = uPerspective * uMatrix * aPosition;
    gl_PointSize = 4.0;

    vFogDepth = -(uMatrix * aPosition).z;
    vNormal = aNormal;
}
`;

const fsSource = `
    precision mediump float;

    uniform vec3 uReverseLightDirection;
    uniform float uAmbient;

    varying float vFogDepth;
    varying vec3 vNormal;

    void main() {
      float fogAmount = smoothstep(1000.0, 5000.0, vFogDepth);
      vec3 normal = normalize(vNormal);

      float light = dot(normal, uReverseLightDirection);

      gl_FragColor = vec4(1, 0.5, 0, 1);
      gl_FragColor.rgb *= max(min(light + uAmbient, 1.5), uAmbient);
      gl_FragColor = mix(gl_FragColor, vec4(1, 1, 1, 1), fogAmount);
    }
`;