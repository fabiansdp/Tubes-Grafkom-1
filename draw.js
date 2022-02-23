const toggleDrawLine = () => {
    isDrawing = !isDrawing;
    drawType = "line";
}

const mousedown = (e) => {
    if (isDrawing) {
        if (drawType === "line") {
            const coordinate = getWebGLPosition(e, gl);
            drawVertices.push(coordinate)
    
            if (drawVertices.length === 2) {
                gl.object.push({
                    method: "line",
                    vertices: drawVertices,
                    color: COLOR.RED
                });
    
                drawVertices = [];
                isDrawing = false;
                drawType = "";
                gl.renderAll();
            }
        }
    }
}

const mousemove = (e) => {
    if (drawVertices.length > 0 && drawType === "line") {
        const coordinate = getWebGLPosition(e, gl);
        gl.object.pop();
        gl.object.push({
            method: "line",
            vertices: [drawVertices[0], coordinate],
            color: COLOR.RED
        });
        gl.renderAll();
    }
}