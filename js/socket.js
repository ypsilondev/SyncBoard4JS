socket.on("connect", () => {
    if (socket.disconnected) {
        alert("Could not connect to the server, retrying...");
    } else {
        status(`Connected to syncboard instance at <code class="code">
                        ${baseURL.replace("https://", "")}</code>`);
    }
});

socket.on("cmd", (data) => {
    console.log(data);
    if (data.hasOwnProperty("success")) {
        if (data.success === true) {
            document.getElementById('room').innerText = room;
        } else {
            status(`Could not connect to room '${room}'`, true);
        }
    } else if (data.hasOwnProperty("action")) {
        if (data.action === "sendBoard") {
            socket.emit("init-sync", getHistory());
        }
    } else if (data.hasOwnProperty("token")) {
        room = data.token;
        document.getElementById('room').innerText = room;
        successAlert(`Successfully created room '${room}'`);
    }
});

socket.on("init-sync", (data) => {
    replaceHistory(data);
})

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
    clearCanvas();
    paintHistory();
});

socket.connect();