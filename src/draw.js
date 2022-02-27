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
			return;
		case DRAW_TYPE.SQUARE:
			//not enough vertex
			if (drawVertices.length < 2) {
				isDrawing = true;
				drawVertices.push(coordinate);
				return;
			}

			const squareVert = convertToSquareVert(drawVertices[0], drawVertices[1]);
			gl.objects.push({
				method: DRAW_TYPE.SQUARE,
				name: "Square",
				vertices: squareVert,
				color,
			});
			addElementMenuItem(gl.objects.length - 1, "Square");
			resetAndRender();
			return;
		case DRAW_TYPE.RECTANGLE:
			if (drawVertices.length < 2) {
				isDrawing = true;
				drawVertices.push(coordinate);
				return;
			}

			const rectangleVert = convertToRectangleVert(drawVertices[0], drawVertices[1]);
			gl.objects.push({
				method: DRAW_TYPE.RECTANGLE,
				name: "Rectangle",
				vertices: rectangleVert,
				color,
			});
			addElementMenuItem(gl.objects.length - 1, "Rectangle");
			resetAndRender();
			return;
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

			return;
		case DRAW_TYPE.POLYGON:
			drawVertices.push(coordinate);
			for (let i = 0; i <= n; i++) {
				gl.drawLine([drawVertices[i % n], drawVertices[(i + 1) % n]], hexToRgb(color));
			}
			return;
	}

	if (isDragging) {
		isDragging = false;
		modeText.innerHTML = "none";
		return;
	}

	if (drawType !== "") return;

	//dragging
	const precision = 0.02;
	const { method, objectIdx, vertexIdx, distance } = gl.getNearestVertex(coordinate);

	if (distance < precision) {
		isDragging = true;
		dragObject.objectIdx = objectIdx;
		dragObject.vertexIdx = vertexIdx;
		dragObject.method = method;
		modeText.innerHTML = `Dragging ${method}`;
	}
	return;
};

const mousemove = (e) => {
	const coordinate = getWebGLPosition(e, gl);
	// Kalau lagi ngedrag vertex
	if (isDragging) {
		const { objectIdx, vertexIdx, method } = dragObject;
		if (method !== DRAW_TYPE.SQUARE && method !== DRAW_TYPE.RECTANGLE) {
			gl.objects[objectIdx].vertices[vertexIdx] = coordinate;
			return gl.renderAll();
		}

		let vertices = gl.objects[objectIdx].vertices;
		const acrossVertex = vertices[(vertexIdx + 2) % 4];

		vertices =
			method === DRAW_TYPE.SQUARE
				? convertToSquareVert(acrossVertex, coordinate)
				: convertToRectangleVert(acrossVertex, coordinate);

		gl.objects[objectIdx].vertices = vertices;

		const precision = 0.02;
		const updatedObject = gl.getNearestVertex(coordinate);

		if (updatedObject.distance < precision) {
			isDragging = true;
			dragObject.objectIdx = updatedObject.objectIdx;
			dragObject.vertexIdx = updatedObject.vertexIdx;
			dragObject.method = updatedObject.method;
			modeText.innerHTML = `Dragging ${method}`;
		}

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
			gl.renderAll();
			gl.drawLine(drawVertices, hexToRgb(color));
			return;

		case DRAW_TYPE.SQUARE:
			if (drawVertices.length === 2) {
				drawVertices.pop();
			}
			drawVertices.push(coordinate);
			gl.renderAll();
			if (drawVertices.length > 1) {
				const squareVert = convertToSquareVert(drawVertices[0], drawVertices[1]);
				const n = squareVert.length;
				for (let i = 0; i <= n; i++) {
					gl.drawLine([squareVert[i % n], squareVert[(i + 1) % n]], hexToRgb(color));
				}
			}
			return;
		case DRAW_TYPE.RECTANGLE:
			if (drawVertices.length === 2) drawVertices.pop();
			drawVertices.push(coordinate);

			gl.renderAll();
			if (drawVertices.length > 1) {
				const rectangleVert = convertToRectangleVert(drawVertices[0], drawVertices[1]);
				const n = rectangleVert.length;
				for (let i = 0; i <= n; i++) {
					gl.drawLine([rectangleVert[i % n], rectangleVert[(i + 1) % n]], hexToRgb(color));
				}
			}
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
