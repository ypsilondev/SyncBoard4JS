const socket = io(baseURL);
let room = "";

let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

function connect() {
    room = prompt("enter room id");
    socket.emit("cmd", JSON.stringify({
        action: "join",
        payload: room,
    }));
}

function create() {
    socket.emit("cmd", JSON.stringify({action: "create"}))
}

function status(msg, failed) {
    if (failed) {
        errorAlert(msg);
    } else {
        document.getElementById('status').innerHTML = msg;
    }
}

function errorAlert(msg) {
    halfmoon.initStickyAlert({
        content: msg,
        title: "An error occurred",
        alertType: "alert-danger",
        fillType: "filled"
    });
}

function successAlert(msg) {
    halfmoon.initStickyAlert({
        content: msg,
        title: "Success",
        alertType: "alert-success",
        fillType: "filled"
    });
}

function resizeCanvas() {
    // Make it visually fill the positioned parent
    canvas.style.width ='100%';
    canvas.style.height='100%';
    // ...then set the internal size to match
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener("load", resizeCanvas);
