class Board {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.scale = 2;
        this.currentLine = null;
        this.drawingMode = true;
        this.pos = {x: 0, y: 0, p: 0};
        this.previousMousePos = {x: 0, y: 0}
        this.history = {};

        // register mouse events
        this.canvas.addEventListener('mousemove', e => this.onMouseOrPointerMove(e));
        this.canvas.addEventListener('mousedown', e => this.setPosition(e));
        this.canvas.addEventListener('mouseenter', e => this.setPosition(e));

        this.canvas.addEventListener('mousedown', e => this.startLine(e));
        this.canvas.addEventListener('mouseup', e => this.endLine(e));

        // register touch/pen events
        this.canvas.addEventListener('pointermove', e => this.onMouseOrPointerMove(e));
        this.canvas.addEventListener('pointerdown', e => this.setPosition(e));
        this.canvas.addEventListener('pointerenter', e => this.setPosition(e));

        this.canvas.addEventListener('pointerdown', e => this.startLine(e));
        this.canvas.addEventListener('pointerup', e => this.endLine(e));

        let test = new Line();
        test.addPoint(new Point(0, 0, 125, 125, 1));
        this.drawPath(test)
    }

    getHistory() {
        let result = [];
        for (let guid of Object.keys(history))
            if (guid && this.history[guid]) result.push(this.history[guid].toTransportObject());
        return result;
    }

    replaceHistory(newHistory) {
        this.history = {};
        for (let transportObject of newHistory) {
            let line = Line.fromTransportObject(transportObject);
            this.history[line.guid] = line;
        }
        this.clear();
        this.drawBoard();
    }

    setPosition(e) {
        //this.drawSegment(e);
        let rect = this.canvas.getBoundingClientRect();
        this.pos.x = (e.clientX - rect.left) //* this.scale;
        this.pos.y = (e.clientY - rect.top) //* this.scale;
    }

    onMouseOrPointerMove(e) {
        if (e.buttons !== 1) {
            // nothing
        } else if (this.drawingMode || e.pointerType === "pen") {
            this.drawSegment(e);
        } else {
            this.translateCanvas(e);
        }

        this.previousMousePos.x = e.x;
        this.previousMousePos.y = e.y;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.offsetWidth, this.canvas.offsetHeight);
    }

    drawBoard() {
        for (const guid of Object.keys(this.history)) {
            if (guid && this.history[guid]) this.drawPath(this.history[guid]);
        }
    }

    drawPath(line) {
        console.log(line);
        try {
            this.ctx.lineWidth = line.points[0].width;
        } catch (ignored) {console.debug(ignored)}
        this.ctx.lineCap = 'round';
        this.ctx.strokeStyle = `rgba(${line.color.R}, ${line.color.G}, ${line.color.B}, ${line.color.A})`;
        this.ctx.beginPath();
        this.ctx.lineWidth = 3 * line.points[0].p;
        this.ctx.lineTo(line.points[0].x0, line.points[0].y0);
        this.ctx.closePath();
        this.ctx.stroke();
        for (let point of line.points) {
            this.ctx.beginPath();
            this.ctx.lineWidth = 3 * point.p;
            this.ctx.lineTo(point.x1, point.y1);
            this.ctx.closePath();
            this.ctx.stroke();
        }
    }

    startLine() {
        this.currentLine = new Line();
        this.currentLine.addPoint(new Point(this.pos.x, this.pos.y, this.pos.y, this.pos.y, this.pos.p));
    }

    endLine() {
        this.currentLine.points.push(clone(this.pos));
        socket.emit("sync", [this.currentLine]);
        history[this.currentLine.guid] = clone(this.currentLine);
    }

    drawSegment(event) {
        if (this.pos.x < 0 || this.pos.y < 0 || this.pos.x > canvas.offsetWidth || this.pos.y > canvas.offsetHeight) return;

        if (event.pressure !== undefined && event.pressure > 0) {
            this.pos.p = 0.5 + event.pressure * 1.5;
        } else {
            this.pos.p = 1;
        }

        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

        this.currentLine.points.push(clone(this.pos));

        ctx.beginPath();

        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.strokeStyle = `rgba(${this.currentLine.color.R}, ${this.currentLine.color.G}, ${this.currentLine.color.B}, ${this.currentLine.color.A})`;

        ctx.moveTo(this.pos.x, this.pos.y); // from
        this.setPosition(event);
        ctx.lineTo(this.pos.x, this.pos.y); // to

        ctx.stroke(); // draw it!
    }

    translateCanvas(e) {

    }
}