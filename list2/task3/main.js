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

    let pong = new Pong(gl);
    Utils.resizeCanvas(pong.gl.canvas);

    function render() {
        if (pressedKeys["ArrowDown"]) {
            pong.rightPaddle.translation[1] += 5;
            needToRender = true;
        }
        if (pressedKeys["ArrowUp"]) {
            pong.rightPaddle.translation[1] -= 5;
            needToRender = true;
        }
        if (pressedKeys["s"]) {
            pong.leftPaddle.translation[1] += 5;
            needToRender = true;
        }
        if (pressedKeys["w"]) {
            pong.leftPaddle.translation[1] -= 5;
            needToRender = true;
        }

        pong.drawScene();
        requestAnimationFrame(render);
    }

    render();
}
