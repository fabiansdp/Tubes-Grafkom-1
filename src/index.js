//Get canvas
const canvas = document.getElementById("canvas");
var gl = new GLProgram(canvas);

// Mouse listeners
canvas.addEventListener("mousedown", mousedown);
canvas.addEventListener("mousemove", mousemove);