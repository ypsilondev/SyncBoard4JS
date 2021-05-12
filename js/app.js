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
    clearCanvas();
    history = {};
}

function create() {
    socket.emit("cmd", JSON.stringify({action: "create"}))
    clearCanvas();
    history = {};
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

function getHistory() {
    let result = [];
    for (let guid in Object.keys(history))
        result.push(history[guid]);
    return result;
}

function replaceHistory(newHistory) {
    history = {};
    for (let line of newHistory)
        history[line.guid] = line;
    clearCanvas();
    paintHistory();
}

function urlReachable(url, callback) {
    let request = new XMLHttpRequest;
    request.open('GET', url, true);
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.setRequestHeader('Accept', '*/*');
    request.onprogress = function(event) {
        let status = event.target.status;
        let statusFirstNumber = (status).toString()[0];
        switch (statusFirstNumber) {
            case '2':
                request.abort();
                return callback(true);
            default:
                request.abort();
                return callback(false);
        }
    }
    request.send('');
}

function forceUpdate() {
    urlReachable(location.toString(), reachable => {
        if (!reachable) {
            errorAlert(`URL '${location.toString()}' is unreachable`);
        } else if (confirm("Are you sure you want to update the page?")) {
            navigator.serviceWorker.ready.then(registration => {
                if (registration.active) {
                    registration.active.postMessage("clear-cache");
                }
            }).then(() => window.location.reload());
        }
    })
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener("load", resizeCanvas);
