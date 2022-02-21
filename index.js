import GLProgram from "./GLProgram.js";
import {COLOR, SHAPE} from "./config.js";

//creating canvas
const canvas = document.createElement("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);

var gl = new GLProgram(canvas);

// gl.drawTriangle(SHAPE.TRIANGLE, COLOR.BLUE);
// gl.drawSquare(SHAPE.SQUARE, COLOR.RED);
// gl.drawPolygon(SHAPE.POLYGON(6), COLOR.GREEN);
