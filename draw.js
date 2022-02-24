const toggleDrawLine = () => {
    drawType = "line";
}

const toggleDrawPolygon = () => {
    if (isDrawing && drawType === "polygon"){
        // turn off
        if (drawVertices.length > 2){
            gl.objects.push({
                method: "polygon",
                vertices: drawVertices,
                color: hexToRgb(document.getElementById("color-selection").value)
            });
        }
        isDrawing = false;
        drawVertices = [];
        drawType = "";
        gl.renderAll();
        // TBD: ganti text button
        document.getElementById('polygon').innerHTML = "Polygon";
    }
    else{
        // turn on
        isDrawing = true;
        drawType = "polygon";
        // TBD: ganti text button
        document.getElementById('polygon').innerHTML = "Render Polygon";
    }
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

const mouseclick = (e) => {
    if (isDrawing && drawType === "polygon"){
        const coordinate = getWebGLPosition(e, gl);
        const color = document.getElementById("color-selection").value;
        drawVertices.push(coordinate);
        gl.renderAll();
        for (let i=0; i+1<drawVertices.length; i++){
            gl.drawLine([drawVertices[i], drawVertices[i+1]], hexToRgb(color));
        }
        gl.drawLine([drawVertices[0], drawVertices[drawVertices.length - 1]], hexToRgb(color));
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
    if (isDrawing && drawType === "polygon") {
        const color = document.getElementById("color-selection").value;
        gl.renderAll();
        for (let i=0; i+1<drawVertices.length; i++){
            gl.drawLine([drawVertices[i], drawVertices[i+1]], hexToRgb(color));
        }
        if (drawVertices.length > 0){
            gl.drawLine([drawVertices.slice(-1)[0], coordinate], hexToRgb(color));
            if (drawVertices.length > 1) gl.drawLine([drawVertices[0], coordinate], hexToRgb(color));
        }
        return;
    }
}
