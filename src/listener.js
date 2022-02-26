lineButton.addEventListener("click", toggleDrawLine);
squareButton.addEventListener("click", toggleDrawSquare);
quadrilateralButton.addEventListener("click", toggleDrawQuadrilateral);
polygonButton.addEventListener("click", toggleDrawPolygon);
recolorSelection.addEventListener("input", changeCurrObjColor);
clearButton.addEventListener("click", () => {
	gl.clear();
});
downloadButton.addEventListener("click", () => {
	gl.downloadJsonData();
});
fileInput.value = "";
fileInput.addEventListener(
	"change",
	(e) => {
		gl.readUploadedJson(e);
	},
	false
);
