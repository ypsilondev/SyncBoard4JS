const clone = (obj) => Object.assign({}, obj);

const socket = io(baseURL);

socket.on("connect", () => {
    console.log(socket.disconnected); // false
    let room = prompt("enter room id");
    console.log(room);
    document.getElementById('room').innerText = room;
    socket.emit("cmd", JSON.stringify({
        action: "join",
        payload: room,
    }));
});

socket.on("cmd", (data) => {
    console.log(data);
});

socket.on("sync", (data) => {
    for (let line of data) {
        console.log(line);
        history[line.guid] = line;
        paintLine(line);
    }
});

socket.on("erase", (data) => {
    console.log(data);
    for (let guid of data) {
        history[guid] = undefined;
    }
    clear();
    paintHistory();
})

socket.connect();

let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

let pos = { x: 0, y: 0, p: 1 };
let history = {};

let currentLine = {
    color: {
        R: 127,
        G: 0,
        B: 255,
        A: 255
    },
    guid: "hurensohn",
    points: []
};

document.addEventListener('mousemove', draw);
document.addEventListener('mousedown', setPosition);
document.addEventListener('mouseenter', setPosition);

document.addEventListener('mousedown', startLine);
document.addEventListener('mouseup', endLine);

document.addEventListener('pointermove', draw);
document.addEventListener('pointerdown', setPosition);
document.addEventListener('pointerenter', setPosition);

document.addEventListener('pointerdown', startLine);
document.addEventListener('pointerup', endLine);

function setPosition(e) {
    paintLine(currentLine);
    let rect = canvas.getBoundingClientRect();
    pos.x = e.clientX - rect.left;
    pos.y = e.clientY - rect.top;
}

function guid() {
    function _p8(s) {
        let p = (Math.random().toString(16)+"000000000").substr(2,8);
        return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;
    }
    return _p8() + _p8(true) + _p8(true) + _p8();
}

function startLine(e) {
    currentLine.guid = guid();
    currentLine.points = [clone(pos)];
    clear();
    paintHistory();
}

function endLine(e) {
    currentLine.points.push(clone(pos));
    socket.emit("sync", [currentLine]);
    history[currentLine.guid] = clone(currentLine);
    if (e.pointerType !== undefined && e.pointerType === "touch") {
        clear();
        paintHistory();
    }
}

function draw(e) {
    if (e.buttons !== 1) return;

    /*
    if (e.pressure !== undefined && e.pressure > 0) {
        pos.p = e.pressure * 2;
    } else {
        pos.p = 1;
    }
    */

    console.log(pos);
    currentLine.points.push(clone(pos));

    ctx.beginPath();

    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = `rgba(${currentLine.color.R}, ${currentLine.color.G}, ${currentLine.color.B}, ${currentLine.color.A})`;

    ctx.moveTo(pos.x, pos.y); // from
    setPosition(e);
    ctx.lineTo(pos.x, pos.y); // to

    ctx.stroke(); // draw it!
}

function clear() {
    ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
}

function paintHistory() {
    for (let guid of Object.keys(history)) {
        paintLine(history[guid]);
    }
}

function paintLine(line) {
    if (line == undefined) return;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = `rgba(${line.color.R}, ${line.color.G}, ${line.color.B}, ${line.color.A})`;
    // ctx.moveTo(line.points[0].x, line.points[0].y);
    let lastPos = {}
    for (let point of line.points) {
        ctx.beginPath();
        ctx.lineWidth = 5 * point.p;
        if (lastPos !== {}) {
            ctx.lineTo(lastPos.x, lastPos.y);
        }
        ctx.lineTo(point.x, point.y);
        ctx.closePath();
        ctx.stroke();
        lastPos = point;
    }
}

console.log("anus");