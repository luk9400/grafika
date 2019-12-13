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
        }
        if (pressedKeys["ArrowUp"]) {
            pong.rightPaddle.translation[1] -= 5;
        }
        if (pressedKeys["s"]) {
            pong.leftPaddle.translation[1] += 5;
        }
        if (pressedKeys["w"]) {
            pong.leftPaddle.translation[1] -= 5;
        }

        pong.ball.translation[0] += pong.ball.vx;
        pong.ball.translation[1] += pong.ball.vy;

        pong.drawScene();
        requestAnimationFrame(render);
    }

    render();
}
