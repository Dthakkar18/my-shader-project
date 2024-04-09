// fragment shader: how fill our "triangle"'s on our obj
// basically coloring the pixles of our obj

uniform float uTime;
uniform vec3 coloring;
uniform vec3 glowing;
uniform float waveNum;
uniform bool pushVertices;


// varying is used to get info from vertex shader
varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;
varying vec3 patternDisplay;


void main() {
	// (r, g, b, alpha)
	gl_FragColor = vec4( mod(patternDisplay.x, coloring.x), mod(patternDisplay.y, coloring.y), mod(patternDisplay.z, coloring.z), 1.0 );
}