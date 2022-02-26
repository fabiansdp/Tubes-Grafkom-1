const resetAndRender = () => {
	drawVertices = [];
	isDrawing = false;
	drawType = "";
	gl.renderAll();
};

const forceClose = () => {
	if (drawType === DRAW_TYPE.POLYGON && drawVertices.length < 2) return resetAndRender();
	console.log(drawType, drawVertices);
	if (drawVertices.length < 2) return resetAndRender();
};

const toggleDrawLine = () => {
	drawType = DRAW_TYPE.LINE;
	drawVertices = [];
	toggleMenu();
};

const toggleDrawSquare = () => {
	drawType = DRAW_TYPE.SQUARE;
	drawVertices = [];
	toggleMenu();
};

const toggleDrawQuadrilateral = () => {
	if (isDrawing && drawType === DRAW_TYPE.QUADRILATERAL) {
		// turn off
		if (drawVertices.length === 4) {
			gl.objects.push({
				method: DRAW_TYPE.QUADRILATERAL,
				name: "Quadrilateral",
				vertices: drawVertices,
				color: hexToRgb(getColorSelection()),
			});
		}
		isDrawing = false;
		drawVertices = [];
		drawType = "";
		gl.renderAll();
		resetMenu();
		addElementMenuItem(gl.objects.length - 1, "Quadrilateral");
	} else {
		resetMenu();
		// turn on
		isDrawing = true;
		drawType = DRAW_TYPE.QUADRILATERAL;
		toggleMenu();
	}
};

const toggleDrawPolygon = () => {
	if (isDrawing && drawType === DRAW_TYPE.POLYGON) {
		// turn off
		if (drawVertices.length > 2) {
			gl.objects.push({
				method: DRAW_TYPE.POLYGON,
				name: "Polygon",
				vertices: drawVertices,
				color: hexToRgb(getColorSelection()),
			});
		}
		isDrawing = false;
		drawVertices = [];
		drawType = "";
		gl.renderAll();
		resetMenu();
		addElementMenuItem(gl.objects.length - 1, "Polygon");
	} else {
		resetMenu();
		// turn on
		isDrawing = true;
		drawType = DRAW_TYPE.POLYGON;
		toggleMenu();
	}
};

const mousedown = (e) => {
	const coordinate = getWebGLPosition(e, gl);
	const color = hexToRgb(getColorSelection());
	const n = drawVertices.length;

	switch (drawType) {
		case DRAW_TYPE.LINE:
			//not enough vertex
			if (drawVertices.length < 2) {
				isDrawing = true;
				drawVertices.push(coordinate);
				return;
			}

			gl.objects.push({
				method: DRAW_TYPE.LINE,
				name: "Line",
				vertices: [drawVertices[0], coordinate],
				color,
			});
			addElementMenuItem(gl.objects.length - 1, "Line");
			resetAndRender();
			break;
		case DRAW_TYPE.SQUARE:
			//not enough vertex
			if (drawVertices.length < 2) {
				isDrawing = true;
				drawVertices.push(coordinate);
				return;
			}

			const vertices = convertToSquareVert(drawVertices[0], drawVertices[1]);
			gl.objects.push({
				method: DRAW_TYPE.SQUARE,
				name: "Square",
				vertices,
				color,
			});
			addElementMenuItem(gl.objects.length - 1, "Square");
			resetAndRender();
			break;
		case DRAW_TYPE.QUADRILATERAL:
			drawVertices.push(coordinate);
			//turn off
			if (drawVertices.length >= 4 && isDrawing) {
				gl.objects.push({
					method: DRAW_TYPE.QUADRILATERAL,
					name: "Quadrilateral",
					vertices: drawVertices,
					color,
				});
				addElementMenuItem(gl.objects.length - 1, "Quadrilateral");
				return resetAndRender();
			}

			for (let i = 0; i <= n; i++) {
				gl.drawLine([drawVertices[i % n], drawVertices[(i + 1) % n]], hexToRgb(color));
			}

			break;
		case DRAW_TYPE.POLYGON:
			drawVertices.push(coordinate);
			gl.renderAll();
			for (let i = 0; i <= n; i++) {
				gl.drawLine([drawVertices[i % n], drawVertices[(i + 1) % n]], hexToRgb(color));
			}
			break;
	}

	if (!isDrawing) resetMenu();
	modeText.innerHTML = isDrawing ? `Drawing ${drawType}` : "none";

	if (isDragging) return (isDragging = false);

	if (drawType !== "") return;

	//dragging
	const precision = 0.02;
	const { method, objectIdx, vertexIdx, distance } = gl.getNearestVertex(coordinate);

	if (distance < precision) {
		isDragging = true;
		dragObject.objectIdx = objectIdx;
		dragObject.vertexIdx = vertexIdx;
		dragObject.method = method;
	}
	return;
};

const mousemove = (e) => {
	const coordinate = getWebGLPosition(e, gl);
	// Kalau lagi ngedrag vertex
	if (isDragging) {
		const { objectIdx, vertexIdx, method } = dragObject;
		if (method !== DRAW_TYPE.SQUARE) {
			gl.objects[objectIdx].vertices[vertexIdx] = coordinate;
			return gl.renderAll();
		}

		let vertices = gl.objects[objectIdx].vertices;
		const pivot = vertices[vertexIdx];

		vertices = vertices.map((v, idx) => {
			if (idx === vertexIdx) return coordinate;
			//maintain x
			if (v[0] === pivot[0]) {
				v[0] = coordinate[0];
			} else if (v[1] === pivot[1]) {
				v[1] = coordinate[1];
			}
			return v;
		});

		gl.objects[objectIdx].vertices = vertices;
		return gl.renderAll();
	}

	if (!isDrawing) return;

	const color = getColorSelection();

	switch (drawType) {
		case DRAW_TYPE.LINE:
			if (drawVertices.length === 2) {
				drawVertices.pop();
			}
			drawVertices.push(coordinate);
			gl.drawLine(drawVertices, hexToRgb(color));
			gl.renderAll();
			return;

		case DRAW_TYPE.SQUARE:
			if (drawVertices.length === 2) {
				drawVertices.pop();
			}
			drawVertices.push(coordinate);
			if (drawVertices.length > 1) {
				const squareVert = convertToSquareVert(drawVertices[0], drawVertices[1]);
				const n = squareVert.length;
				for (let i = 0; i <= n; i++) {
					gl.drawLine([squareVert[i % n], squareVert[(i + 1) % n]], hexToRgb(color));
				}
			}
			gl.renderAll();
			return;

		case DRAW_TYPE.QUADRILATERAL:
		case DRAW_TYPE.POLYGON:
			gl.renderAll();

			for (let i = 0; i + 1 < drawVertices.length; i++) {
				gl.drawLine([drawVertices[i], drawVertices[i + 1]], hexToRgb(color));
			}
			if (drawVertices.length > 0) {
				gl.drawLine([drawVertices.slice(-1)[0], coordinate], hexToRgb(color));
				if (drawVertices.length > 1) gl.drawLine([drawVertices[0], coordinate], hexToRgb(color));
			}
			return;
	}
};
