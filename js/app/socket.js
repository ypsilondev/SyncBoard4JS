const debug = true;

socket.on("connect", () => {
    if (socket.disconnected) {
        alert("Could not connect to the server, retrying...");
    } else {
        status(`Connected to syncboard instance at <code class="code">
                        ${baseURL.replace("https://", "")}</code>`);
    }
});

socket.on("cmd", (data) => {
    log("cmd", data);
    if (data.hasOwnProperty("success")) {
        if (data.success === true) {
            document.getElementById('room').innerText = room;
        } else {
            status(`Could not connect to room '${room}'`, true);
        }
    } else if (data.hasOwnProperty("action")) {
        if (data.action === "sendBoard") {
            socket.emit("init-sync", board.getHistory());
        }
    } else if (data.hasOwnProperty("token")) {
        room = data.token;
        document.getElementById('room').innerText = room;
        successAlert(`Successfully created room '${room}'`);
    }
});

socket.on("init-sync", (data) => {
    log("init-sync", data);
    board.replaceHistory(data);
})

socket.on("sync", (data) => {
    log("sync", data);
    for (let transportObject of data) {
        let line = Line.fromTransportObject(transportObject);
        board.history[line.guid] = line;
        board.drawPath(line);
    }
});

socket.on("erase", (data) => {
    log("erase", data);
    for (let guid of data) {
        board.history[guid] = undefined;
    }
    board.clear();
    board.drawBoard();
});

function log(channel, data) {
    if (debug) {
        console.debug({
            on: channel,
            data: data
        });
    }
}

socket.connect();