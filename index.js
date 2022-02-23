//Get canvas
const canvas = document.getElementById("canvas");
var gl = new GLProgram(canvas);

// Mouse listeners
canvas.addEventListener('mousedown', mousedown);
canvas.addEventListener('mousemove', mousemove);

// Get line button
const lineButton = document.getElementById('line');
lineButton.addEventListener('click', toggleDrawLine);

// Get clear button
const clearButton = document.getElementById('clear');
clearButton.addEventListener('click', () => {
    gl.clear();
});

// Get download button
const downloadButton = document.getElementById('download');
downloadButton.addEventListener('click', () => {
    gl.downloadJsonData();
});


const fileInput = document.getElementById("file-input");
fileInput.value = '';
fileInput.addEventListener('change', (e) => {
    gl.readUploadedJson(e)
}, false)
// gl.drawTriangle(SHAPE.TRIANGLE, COLOR.BLUE);
// gl.drawSquare(SHAPE.SQUARE, COLOR.RED);
// gl.drawPolygon(SHAPE.POLYGON(13), COLOR.GREEN);

// tes wibi
// gl.drawPolygon(SHAPE.LETTERG, COLOR.GREEN); // ok
// gl.drawPolygon(SHAPE.CONVEX, COLOR.BLUE); // ok
// gl.drawPolygon(SHAPE.WEIRDCONVEX, COLOR.RED); // ok
// gl.drawPolygon(SHAPE.NOTSIMPLE, COLOR.GREEN); // ok
// gl.drawPolygon(SHAPE.HOLE, COLOR.GREEN); // lubangnya ilang


// Tes fabian
// gl.drawLine([
//     [-0.5, -0.5],
//     [0.5, -0.5],
// ], COLOR.BLUE);

// gl.drawLine([
//     [-0.5, 0.5],
//     [0.5, -0.7],
// ], COLOR.BLUE);