window.onload = main;

function main() {
    const canvas = document.getElementById('canvas');
    const gl = canvas.getContext('webgl');
    if (!gl) {
        return;
    }

    let pressedKeys = {};
    window.addEventListener("keydown", event => pressedKeys[event.key] = true);
    window.addEventListener("keyup", event => pressedKeys[event.key] = false);

    let engine = new Engine(gl);
    Utils.resizeCanvas(engine.gl.canvas);

    let needToRender = true;
    function render() {

        if (pressedKeys["ArrowUp"]) {
            engine.plot.rotation[0] -= 0.01;
            needToRender = true;
        }
        if (pressedKeys["ArrowDown"]) {
            engine.plot.rotation[0] += 0.01;
            needToRender = true;
        }
        if (pressedKeys["ArrowRight"]) {
            engine.plot.rotation[1] += 0.01;
            needToRender = true;
        }
        if (pressedKeys["ArrowLeft"]) {
            engine.plot.rotation[1] -= 0.01;
            needToRender = true;
        }
        if (pressedKeys["w"]) {
            engine.plot.translation[2] += 10;
            needToRender = true;
        }
        if (pressedKeys["s"]) {
            engine.plot.translation[2] -= 10;
            needToRender = true;
        }
        if (pressedKeys["d"]) {
            engine.plot.translation[0] -= 10;
            needToRender = true;
        }
        if (pressedKeys["a"]) {
            engine.plot.translation[0] += 10;
            needToRender = true;
        }
        if (pressedKeys["e"]) {
            engine.plot.translation[1] += 10;
            needToRender = true;
        }
        if (pressedKeys["q"]) {
            engine.plot.translation[1] -= 10;
            needToRender = true;
        }
        


        if (needToRender) {
            engine.drawScene(true);
            needToRender = false;
        }
        requestAnimationFrame(render);
    }

    render();
}