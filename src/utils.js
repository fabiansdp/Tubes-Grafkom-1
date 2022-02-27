// geometry

const EPS = 1e-11; // epsilon

const vecLen = (a) => {
	return Math.sqrt(a[0] * a[0] + a[1] * a[1]);
};

const vecSub = (a, b) => {
	// returns vector subtraction a - b
	return [a[0] - b[0], a[1] - b[1]];
};

const vecDot = (a, b) => {
	// returns dot product of vector a and b
	return a[0] * b[0] + a[1] * b[1];
};

const vecCross = (a, b) => {
	// returns cross product of vector a and b
	return a[0] * b[1] - a[1] * b[0];
};

const vecAngle = (a, b) => {
	// returns angle between two vectors a and b
	return Math.acos(vecDot(a, b) / (vecLen(a) * vecLen(b)));
};

const sgn = (a) => {
	if (Math.abs(a) < EPS) return 0;
	else if (a > 0) return 1;
	else return -1;
};

const inter1d = (a, b, c, d) => {
	// returns true if 1d line segment a-b & c-d intersects
	if (a > b) [a, b] = [b, a]; // swap
	if (c > d) [c, d] = [d, c]; // swap
	return Math.max(a, c) < Math.min(b, d); // notice strict ineq
};

const checkIntersect = (a, b, c, d) => {
	// returns true if 2d line segment a-b & c-d intersects
	let ca = vecSub(a, c),
		cd = vecSub(d, c),
		cb = vecSub(b, c);
	if (Math.abs(vecCross(ca, cd)) < EPS && Math.abs(vecCross(cb, cd)) < EPS) {
		return inter1d(a[0], b[0], c[0], d[0]) && inter1d(a[1], b[1], c[1], d[1]);
	}
	let ab = vecSub(b, a),
		ac = vecSub(c, a),
		ad = vecSub(d, a);
	return (
		sgn(vecCross(ab, ac)) != sgn(vecCross(ab, ad)) && sgn(vecCross(cd, ca)) != sgn(vecCross(cd, cb))
	);
};

const polygonDet = (vertices) => {
	// returns determinant of polygon matrix, useful for determining orientation
	const n = vertices.length;
	let ret = 0;
	for (let i = 0; i < n; i++)
		ret += vertices[i][0] * vertices[(i + 1) % n][1] - vertices[i][1] * vertices[(i + 1) % n][0];
	return ret;
};

const getMinimumAngleEar = (vertices) => {
	const orientation = sgn(polygonDet(vertices));
	const m = vertices.length;
	let idx,
		mn = 100;
	for (let j = 0; j < m; j++) {
		// check 1: is vertice j convex?
		let u = vecSub(vertices[j], vertices[(j - 1 + m) % m]),
			v = vecSub(vertices[(j + 1) % m], vertices[j]);
		if (orientation != sgn(vecCross(u, v))) continue;
		// check 2: does segment vertices[j-1] - vertices[j+1] intersect other segment?
		let ok = true;
		for (let k = 0; k < m; k++) {
			if (k == (j - 2 + m) % m || k == (j - 1 + m) % m || k == j || k == (j + 1) % m) continue;
			if (
				checkIntersect(
					vertices[k],
					vertices[(k + 1) % m],
					vertices[(j - 1 + m) % m],
					vertices[(j + 1) % m]
				)
			) {
				ok = false;
				break;
			}
		}
		if (ok) {
			let w = vecSub(vertices[(j - 1 + m) % m], vertices[j]);
			let theta = vecAngle(w, v);
			if (theta < mn) {
				idx = j;
				mn = theta;
			}
		}
	}
	return idx;
};

const euclideanDistance = (v1, v2) => {
	const [x1, y1] = v1;
	const [x2, y2] = v2;

	return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
};

const hexToRgb = (hexColor) => {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor);
	return result
		? {
				R: parseInt(result[1], 16),
				G: parseInt(result[2], 16),
				B: parseInt(result[3], 16),
				A: 1,
		  }
		: null;
};

const componentToHex = (c) => {
	c *= 255;
	var hex = c.toString(16);
	return hex.length == 1 ? "0" + hex : hex;
};

const rgbToHex = (rgb) => {
	return "#" + componentToHex(rgb.R) + componentToHex(rgb.G) + componentToHex(rgb.B);
};

const getColorSelection = () => {
	return document.getElementById("color-selection").value;
};

const convertToSquareVert = (v1, v2) => {
	if (!v1 || !v2) return [];
	const x1 = v1[0];
	const y1 = v1[1];
	let x2 = v2[0];
	let y2 = v2[1];

	const xdist = Math.abs(x1 - x2);
	const ydist = Math.abs(y1 - y2);

	const xMul = x2 < x1 ? -1 : 1;
	const yMul = y2 < y1 ? -1 : 1;

	const minDir = xdist < ydist ? xdist : ydist;

	const realVertex = [x1 + xMul * minDir, y1 + yMul * CANVAS_RATIO * minDir];
	x2 = realVertex[0];
	y2 = realVertex[1];

	return [v1, [x2, y1], realVertex, [x1, y2]];
};

const convertToRectangleVert = (v1, v2) => {
	if (!v1 || !v2) return [];

	const x1 = v1[0];
	const x2 = v2[0];
	const y1 = v1[1];
	const y2 = v2[1];

	return [v1, [x2, y1], v2, [x1, y2]];
};

const resetMenu = () => {
	modeText.innerHTML = "<none>";
	lineButton.classList.remove("active");
	squareButton.classList.remove("active");
	rectangleButton.classList.remove("active");
	quadrilateralButton.classList.remove("active");
	polygonButton.classList.remove("active");
};

const toggleMenu = () => {
	modeText.innerHTML = `Drawing ${drawType}`;
	if (drawType === DRAW_TYPE.LINE) return lineButton.classList.add("active");
	if (drawType === DRAW_TYPE.SQUARE) return squareButton.classList.add("active");
	if (drawType === DRAW_TYPE.RECTANGLE) return rectangleButton.classList.add("active");
	if (drawType === DRAW_TYPE.QUADRILATERAL) return quadrilateralButton.classList.add("active");
	if (drawType === DRAW_TYPE.POLYGON) return polygonButton.classList.add("active");
};

const changeCurrentPropertiesObj = (idx) => {
	if (idx >= 0 && idx < gl.objects.length) {
		// change properties values
		currentObjId.innerHTML = idx;
		currentObjColor.innerHTML = rgbToHex(gl.objects[idx].color);
		recolorSelection.value = rgbToHex(gl.objects[idx].color);

		const elements = document.getElementsByClassName("element-button");
		for (let el of elements) {
			el.classList.remove("element-active");
		}
		elements[idx].classList.add("element-active");
	}
};

const addElementMenuItem = (idx, name) => {
	var button = document.createElement("button");
	button.type = "button";
	button.innerHTML = `#${idx} - ${name}`;
	button.className = "element-button";
	button.id = `element-${idx}`;
	button.value = idx;
	button.onclick = function () {
		changeCurrentPropertiesObj(idx);
	};

	elementsContainer.appendChild(button);
};

const changeCurrObjColor = () => {
	if (!isNaN(currentObjId.innerHTML)) {
		const idx = parseInt(currentObjId.innerHTML);
		currentObjColor.innerHTML = recolorSelection.value;
		gl.objects[idx].color = hexToRgb(recolorSelection.value);
		gl.renderAll();
	}
};

const resetAndRender = () => {
	drawVertices = [];
	isDrawing = false;
	drawType = "";
	if (!isDrawing) resetMenu();
	modeText.innerHTML = isDrawing ? `Drawing ${drawType}` : "none";
	gl.renderAll();
};

const forceClose = () => {
	if (drawType === DRAW_TYPE.POLYGON && drawVertices.length < 2) return resetAndRender();
	if (drawVertices.length < 2) return resetAndRender();
};
