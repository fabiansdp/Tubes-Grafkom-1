import setup_shader from "./shader.js";
import {COLOR} from "./config.js"

class GLProgram {
	constructor(canvas, clear_color = COLOR.CLEAR_COLOR) {
		var gl = canvas.getContext("webgl");
		gl.clearColor(clear_color.R, clear_color.G, clear_color.B, clear_color.A);
		gl.clear(gl.COLOR_BUFFER_BIT);

		const {vertexShader, fragmentShader} = setup_shader(gl);

		const program = gl.createProgram();
		gl.attachShader(program, vertexShader);
		gl.attachShader(program, fragmentShader);
		gl.linkProgram(program);

		this.gl = gl;
		this.canvas = canvas;
		this.vertexShader = vertexShader;
		this.fragmentShader = fragmentShader;
		this.program = program;
    this.object = [];
	}

	parseColorObj(color, is255 = false) {
		for (const [key, value] of Object.entries(color)) {
			if (!is255 && value > 1) color[key] = color[key] / 255;
		}
		return [color.R, color.G, color.B, color.A];
	}

	drawTriangle([v1, v2, v3], color = COLOR.VERTEX_COLOR) {
		const vertices = new Float32Array([...v1, ...v2, ...v3]);
		var buffer = this.gl.createBuffer();
		color = this.parseColorObj(color);

		//creating buffer
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);
		this.gl.useProgram(this.program);

		//defining vertex color
		this.program.color = this.gl.getUniformLocation(this.program, "color");
		this.gl.uniform4fv(this.program.color, color);

		//defining vertex position
		this.program.position = this.gl.getAttribLocation(this.program, "position");
		this.gl.enableVertexAttribArray(this.program.position);
		this.gl.vertexAttribPointer(this.program.position, 2, this.gl.FLOAT, false, 0, 0);

		//rendering
		this.gl.drawArrays(this.gl.TRIANGLES, 0, vertices.length / 2);
	}

	drawSquare([v1, v2, v3, v4], color = COLOR.VERTEX_COLOR) {
		this.drawTriangle([v1, v2, v3], color);
		// this.drawTriangle([v2, v3, v4], color);
		this.drawTriangle([v3, v4, v1], color); //if not perpendicular
	}

	drawPolygon(vertices, color = COLOR.VERTEX_COLOR) {
		const n = vertices.length;
		const center = vertices[0];

		for (let i = 1; i < n; i++) {
			let v1 = vertices[i % n];
			let v2 = vertices[(i + 1) % n];
			let v3 = center;
			this.drawTriangle([v1, v2, v3], color);
		}
	}
}

export default GLProgram;
