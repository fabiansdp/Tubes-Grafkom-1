const toggleDrawLine = () => {
    drawType = "line";
}

const mousedown = (e) => {
    if (drawType === "line") {
        const coordinate = getWebGLPosition(e, gl);
        // Kalau sudah mau selesai menggambar garis
        if (drawVertices.length === 2) {
            const color = document.getElementById("color-selection").value;

            gl.objects.push({
                method: "line",
                vertices: [drawVertices[0], coordinate],
                color: hexToRgb(color)
            });

            drawVertices = [];
            isDrawing = false;
            drawType = "";
            gl.renderAll();
        } else {
            isDrawing = true;
            drawVertices.push(coordinate);
        }

        return;
    }

    // Kalau sudah selesai ngedrag
    if (isDragging) {
        isDragging = false;
        return;
    }

    // Kalau mau ngedrag vertex
    if (drawType === "") {
        const coordinate = getWebGLPosition(e, gl);
        const {method, objectIdx, vertexIdx, distance} = gl.getNearestVertex(coordinate);

        if (distance < 0.02) {
            isDragging = true;
            dragObject.objectIdx = objectIdx;
            dragObject.vertexIdx = vertexIdx;
            dragObject.method = method;
        }
        return;
    }
}

const mousemove = (e) => {
    const coordinate = getWebGLPosition(e, gl);
    // Kalau lagi ngedrag vertex
    if (isDragging) {
        const {objectIdx, vertexIdx, method} = dragObject;
        if (method === "line") {
            gl.objects[objectIdx].vertices[vertexIdx] = coordinate;
            gl.renderAll();
        }
        return;
    }
    // Kalau sudah mulai menggambar
    if (isDrawing && drawType === "line") {
        const color = document.getElementById("color-selection").value;
        if (drawVertices.length == 2) {
            drawVertices.pop();
        }
        drawVertices.push(coordinate);
        gl.drawLine(drawVertices, hexToRgb(color));
        gl.renderAll();
        return
    }
}