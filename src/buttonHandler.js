const helpButtonHandler = () => {
	modal.style.display = "block"
}

const windowCloseModal = (e) => {
	if (e.target === modal) {
		modal.style.display = "none";
	}
}

const closeModalHandler = () => {
	modal.style.display = "none";
}

const buttonLineHandler = () => {
	drawType = DRAW_TYPE.LINE;
	drawVertices = [];
	toggleMenu();
};

const buttonSquareHandler = () => {
	drawType = DRAW_TYPE.SQUARE;
	drawVertices = [];
	toggleMenu();
};

const buttonRectangleHandler = () => {
	drawType = DRAW_TYPE.RECTANGLE;
	drawVertices = [];
	toggleMenu();
};

const buttonQuadrilateralHandler = () => {
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

const buttonPolygonHandler = () => {
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

const buttonClearHandler = () => {
	gl.clear();
	resetAndRender();
	elementsContainer.innerHTML = "";
};

const buttonDownloadHandler = () => {
	gl.downloadJsonData();
};

const buttonUploadHandler = (e) => {
	gl.readUploadedJson(e);
};
