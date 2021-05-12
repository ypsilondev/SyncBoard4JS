const socket = io(baseURL);
let room = "";
let scale = 1;

let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

const board = new Board(canvas);

function connect() {
    room = prompt("enter room id");
    socket.emit("cmd", JSON.stringify({
        action: "join",
        payload: room,
    }));
    board.clear();
    board.history = {};
}

function create() {
    socket.emit("cmd", JSON.stringify({action: "create"}))
    board.endLine();
    board.history = {};
    board.clear();
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
    // canvas.style.transform = `scale(${1 / scale})`;
    canvas.style.width = 100 /* * scale */ + '%';
    canvas.style.height = 100 /* * scale */ + '%';
    // ...then set the internal size to match
    canvas.width  = canvas.offsetWidth /** scale*/;
    canvas.height = canvas.offsetHeight /** scale*/;
}

function urlReachable(url, callback) {
    let request = new XMLHttpRequest;
    request.open('GET', url + '?' + new Date().getTime(), true);
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.setRequestHeader('Cache-Control', 'no-cache');
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

function reloadWithParameter(key, value) {
    key = encodeURIComponent(key);
    value = encodeURIComponent(value);

    // kvp looks like ['key1=value1', 'key2=value2', ...]
    let kvp = document.location.search.substr(1).split('&');
    let i=0;

    for(; i<kvp.length; i++){
        if (kvp[i].startsWith(key + '=')) {
            let pair = kvp[i].split('=');
            pair[1] = value;
            kvp[i] = pair.join('=');
            break;
        }
    }

    if(i >= kvp.length){
        kvp[kvp.length] = [key,value].join('=');
    }

    document.location.search = kvp.join('&');
}

function forceUpdate() {
    urlReachable(location.toString(), reachable => {
        if (!reachable) {
            errorAlert(`URL '${location.toString()}' is unreachable`);
        } else if (confirm("Are you sure you want to update the page?")) {
            navigator.serviceWorker.ready.then(registration => {
                if (registration.active) {
                    registration.active.postMessage("clear-cache");
                    reloadWithParameter("lastAccessed", new Date().getTime());
                }
            });
        }
    })
}

window.addEventListener("resize", resizeCanvas);
window.addEventListener("load", () => {
    setTimeout(() => {
        document.getElementById('overlay').hidden = true;
        resizeCanvas();
    }, 500);
});
