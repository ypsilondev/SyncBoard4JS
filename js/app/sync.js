const clone = (obj) => Object.assign({}, obj);
/*

let pos = {x: 0, y: 0, p: 1};
let previousMousePos = {x: 0, y: 0};
let history = {};

let currentLine = {
    color: {
        R: 0,
        G: 0,
        B: 0,
        A: 255
    },
    guid: "",
    points: []
};

canvas.addEventListener('mousemove', onMouseOrPointerMove);
canvas.addEventListener('mousedown', setPosition);
canvas.addEventListener('mouseenter', setPosition);

canvas.addEventListener('mousedown', startLine);
canvas.addEventListener('mouseup', endLine);

canvas.addEventListener('pointermove', onMouseOrPointerMove);
canvas.addEventListener('pointerdown', setPosition);
canvas.addEventListener('pointerenter', setPosition);

canvas.addEventListener('pointerdown', startLine);
canvas.addEventListener('pointerup', endLine);

function setPosition(e) {
    paintLine(currentLine);
    let rect = canvas.getBoundingClientRect();
    pos.x = (e.clientX - rect.left) * scale;
    pos.y = (e.clientY - rect.top) * scale;
}

function guid() {
    function _p8(s) {
        let p = (Math.random().toString(16) + "000000000").substr(2, 8);
        return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
    }
    return _p8() + _p8(true) + _p8(true) + _p8();
}

function startLine() {
    currentLine.guid = guid();
    currentLine.points = [clone(pos)];
}

function endLine() {
    currentLine.points.push(clone(pos));
    socket.emit("sync", [currentLine]);
    history[currentLine.guid] = clone(currentLine);
}

function onMouseOrPointerMove(e) {
    if (e.buttons !== 1) {
        // nothing
    } else if (drawingMode || e.pointerType === "pen") {
        draw(e);
    } else {
        translateCanvas(e);
    }

    previousMousePos.x = e.x;
    previousMousePos.y = e.y;
}

function draw(e) {
    if (pos.x < 0 || pos.y < 0 || pos.x > canvas.offsetWidth || pos.y > canvas.offsetHeight) return;

    if (e.pressure !== undefined && e.pressure > 0) {
        pos.p = 0.5 + e.pressure * 1.5;
    } else {
        pos.p = 1;
    }

    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    currentLine.points.push(clone(pos));

    ctx.beginPath();

    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = `rgba(${currentLine.color.R}, ${currentLine.color.G}, ${currentLine.color.B}, ${currentLine.color.A})`;

    ctx.moveTo(pos.x, pos.y); // from
    setPosition(e);
    ctx.lineTo(pos.x, pos.y); // to

    ctx.stroke(); // draw it!
}

function translateCanvas(e) {

}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
}

function paintHistory() {
    for (let guid of Object.keys(history)) {
        paintLine(history[guid]);
    }
}

function paintLine(line) {
    if (line === undefined) return;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = `rgba(${line.color.R}, ${line.color.G}, ${line.color.B}, ${line.color.A})`;
    // ctx.moveTo(line.points[0].x, line.points[0].y);
    let lastPos = {}
    for (let point of line.points) {
        ctx.beginPath();
        ctx.lineWidth = 3 * point.p;
        if (lastPos !== {}) {
            ctx.lineTo(lastPos.x, lastPos.y);
        }
        ctx.lineTo(point.x, point.y);
        ctx.closePath();
        ctx.stroke();
        lastPos = point;
    }
}
*/
