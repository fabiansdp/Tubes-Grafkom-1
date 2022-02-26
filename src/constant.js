const DRAW_TYPE = {
	LINE: "line",
	SQUARE: "square",
	RECTANGLE: "rectangle",
	QUADRILATERAL: "quadrilateral",
	POLYGON: "polygon",
};

//get mode
const modeText = document.getElementById("mode");

// Get line button
const lineButton = document.getElementById("line-button");
const lineText = document.getElementById("line");

// Get square button
const squareButton = document.getElementById("square-button");
const squareText = document.getElementById("square");

// Get rectangle button
const rectangleButton = document.getElementById("rectangle-button");
const rectangleText = document.getElementById("rectangle");

// Get quadrilateral button
const quadrilateralButton = document.getElementById("quadrilateral-button");
const quadrilateralText = document.getElementById("quadrilateral");

// Get polygon button
const polygonButton = document.getElementById("polygon-button");
const polygonText = document.getElementById("polygon");

// Get clear button
const clearButton = document.getElementById("clear");

// Get download button
const downloadButton = document.getElementById("download");

const fileInput = document.getElementById("file-input");

// Get element item container
const elementsContainer = document.getElementById("elements-container");

// Get properties item container
const propertiesContainer = document.getElementById("properties-container");
const currentObjId = document.getElementById("current-obj-id");
const currentObjColor = document.getElementById("current-obj-color");
const recolorSelection = document.getElementById("recolor-selection");
