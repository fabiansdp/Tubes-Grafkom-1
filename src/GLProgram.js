class GLProgram {
	constructor(canvas) {
		var gl = canvas.getContext("webgl");

		const { vertexShader, fragmentShader } = setup_shader(gl);

		const program = gl.createProgram();
		gl.attachShader(program, vertexShader);
		gl.attachShader(program, fragmentShader);
		gl.linkProgram(program);

		this.gl = gl;
		this.canvas = canvas;
		this.vertexShader = vertexShader;
		this.fragmentShader = fragmentShader;
		this.program = program;
		this.objects = [];
		this.pointSize = 0.015;
	}

	parseColorObj(color, is255 = false) {
		if (!color) return;
		for (const [key, value] of Object.entries(color)) {
			if (!is255 && value > 1) color[key] = color[key] / 255;
		}
		return [color.R, color.G, color.B, color.A];
	}

	downloadJsonData() {
		const dataStr =
			"data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.objects));
		let downloadAnchor = document.getElementById("download");
		downloadAnchor.setAttribute("href", dataStr);
		downloadAnchor.setAttribute("download", "data.json");
	}

	readUploadedJson(event) {
		const file = event.target.files[0];

		if (file) {
			const fileReader = new FileReader();
			fileReader.onload = function (e) {
				const fileContent = JSON.parse(e.target.result);
				gl.objects = fileContent;
				gl.renderAll();
			};
			fileReader.readAsText(file);
		}
	}

	getNearestVertex(coordinate) {
		let minDistance = 9999;
		let objectIdx = -1;
		let vertexIdx = -1;
		let method = "";

		for (let i = 0; i < this.objects.length; i++) {
			const { vertices } = this.objects[i];
			for (let j = 0; j < vertices.length; j++) {
				const distance = euclideanDistance(coordinate, vertices[j]);

				if (distance < minDistance) {
					minDistance = distance;
					objectIdx = i;
					vertexIdx = j;
					method = this.objects[i].method;
				}
			}
		}

		return {
			method,
			objectIdx,
			vertexIdx,
			distance: minDistance,
		};
	}

	initBuffer(vertices, color) {
		// Create and bind buffer
		var buffer = this.gl.createBuffer();
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
	}

	render(method, vertices, color, n) {
		// Init buffer
		this.initBuffer(vertices, color);
		// Rendering
		this.gl.drawArrays(method, 0, n);
	}

	renderPoint() {
		this.objects.forEach((object) => {
			object.vertices.forEach((vertex) => {
				const [x, y] = vertex;
				const x1 = x - this.pointSize / 2;
				const y1 = y - this.pointSize / 2;
				const x2 = x1 + this.pointSize;
				const y2 = y1 + this.pointSize;
				const point = new Float32Array([x1, y1, x2, y1, x1, y2, x2, y2]);

				this.render(
					this.gl.TRIANGLE_STRIP,
					point,
					this.parseColorObj(COLOR.BLUE),
					point.length / 2
				);
			});
		});
	}

	renderAll() {
		this.objects.forEach((object) => {
			const { method, vertices, color } = object;
			if (method === DRAW_TYPE.LINE) return this.drawLine(vertices, color);
			if (method === DRAW_TYPE.SQUARE) return this.drawSquare(vertices, color);
			if (method === DRAW_TYPE.RECTANGLE) return this.drawSquare(vertices, color);
			if (method === DRAW_TYPE.QUADRILATERAL) return this.drawPolygon(vertices, color);
			if (method === DRAW_TYPE.POLYGON) return this.drawPolygon(vertices, color);
		});

		this.renderPoint();
	}

	clear() {
		this.objects = [];
		this.gl.clear(gl.COLOR_BUFFER_BIT);
	}

	drawLine([v1, v2], color = COLOR.VERTEX_COLOR) {
		const vertices = new Float32Array([...v1, ...v2]);

		this.render(this.gl.LINES, vertices, this.parseColorObj(color), vertices.length / 2);
	}

	drawTriangle([v1, v2, v3], color = COLOR.VERTEX_COLOR) {
		if (!v1.length || !v2.length || !v3.length) return;
		const vertices = new Float32Array([...v1, ...v2, ...v3]);

		color = this.parseColorObj(color);

		this.render(this.gl.TRIANGLES, vertices, color, vertices.length / 2);
	}

	drawSquare([v1, v2, v3, v4], color = COLOR.VERTEX_COLOR) {
		this.drawTriangle([v1, v2, v3], color);
		// this.drawTriangle([v2, v3, v4], color);
		this.drawTriangle([v3, v4, v1], color); //if not perpendicular
	}

	drawPolygon(vertices, color = COLOR.VERTEX_COLOR) {
		const n = vertices.length;
		let p = JSON.parse(JSON.stringify(vertices)); // deep cloning wkwk

		// check simplicity, O(n^2)
		let is_simple = true;
		for (let i = 0; i < n; i++) {
			for (let j = i + 1; j < n; j++) {
				if ((j - i + n) % n < 2 || (i - j + n) % n < 2) continue;
				let a = p[i],
					b = p[(i + 1) % n];
				let c = p[j],
					d = p[(j + 1) % n];
				if (checkIntersect(a, b, c, d)) {
					// console.log(a, b, c, d);
					is_simple = false;
				}
			}
		}

		if (is_simple) {
			// ear clipping method, O(n^3)
			for (let i = 0; i < n - 3; i++) {
				// n-3 first triangles
				const idx = getMinimumAngleEar(p);
				// console.log(idx, p[idx]);
				const m = p.length;
				this.drawTriangle([p[(idx - 1 + m) % m], p[idx], p[(idx + 1) % m]], color);
				p.splice(idx, 1); // remove ear tip
			}
			// draw last triangle
			this.drawTriangle([p[0], p[1], p[2]], color);
		} else {
			// fan method lol
			for (let i = 1; i < n; i++) {
				let v1 = vertices[i % n];
				let v2 = vertices[(i + 1) % n];
				this.drawTriangle([v1, v2, vertices[0]], color);
			}
		}
	}
}
