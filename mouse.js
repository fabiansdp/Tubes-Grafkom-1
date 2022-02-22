// Get posisi mouse di dalam canvas
const getRelativeMousePosition = (event) => {
    const target = event.target;
    const rect = target.getBoundingClientRect();

    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    }
}

// Get posisi koordinat WebGL
const getWebGLPosition = (event, gl) => {
    const pos = getRelativeMousePosition(event);
    
    return [
        pos.x / gl.canvas.width * 2 - 1,
        pos.y / gl.canvas.height * -2 + 1
    ]
}