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
// gl.drawPolygon(SHAPE.POLYGON(13), COLOR.GREEN);

// tes wibi
gl.drawPolygon(SHAPE.LETTERG, COLOR.GREEN); // ok
gl.drawPolygon(SHAPE.CONVEX, COLOR.BLUE); // ok
gl.drawPolygon(SHAPE.WEIRDCONVEX, COLOR.RED); // ok
// gl.drawPolygon(SHAPE.NOTSIMPLE, COLOR.GREEN); // ok