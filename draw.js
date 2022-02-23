const toggleDrawLine = () => {
    drawType = "line";
}

const mousedown = (e) => {
    if (drawType === "line") {
        const coordinate = getWebGLPosition(e, gl);

        if (drawVertices.length === 2) {
            gl.object.push({
                method: "line",
                vertices: [drawVertices[0], coordinate],
                color: COLOR.RED
            });

            drawVertices = [];
            isDrawing = false;
            drawType = "";
            gl.renderAll();
        } else {
            isDrawing = true;
            drawVertices.push(coordinate);
        }
    }
}

const mousemove = (e) => {
    // Kalau sudah mulai menggambar
    if (isDrawing && drawType === "line") {
        const coordinate = getWebGLPosition(e, gl);
        if (drawVertices.length == 2) {
            drawVertices.pop();
        }
        drawVertices.push(coordinate);
        gl.drawLine(drawVertices, COLOR.RED);
        gl.renderAll();
    }
}