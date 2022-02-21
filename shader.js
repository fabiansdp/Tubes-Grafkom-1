//create vertex shader
const setup_shader = (gl) => {
  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(
		vertexShader,
		[
			"attribute vec2 position;",
			"void main() {",
			"gl_Position = vec4(position, 0.0, 1.0);",
			"}",
		].join("\n")
	);
	gl.compileShader(vertexShader);

	//create fragment shader
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(
		fragmentShader,
		[
			"precision highp float;",
			"uniform vec4 color;",
			"void main() {",
			"gl_FragColor = color;",
			"}",
		].join("\n")
	);
	gl.compileShader(fragmentShader);

  return {vertexShader, fragmentShader}
}

export default setup_shader;