class Point {
    constructor(x0, y0, x1, y1, p) {
        this.x0 = x0;
        this.y0 = y0;
        this.x1 = x1;
        this.y1 = y1;
        this.pressure = p;
    }

    static linesIntersect(a, b) {
        return Point.pointsIntersect(a.x0, a.y0, a.x1, a.y1, b.x0, b.y0, b.x1, b.y1);
    }

    static pointsIntersect(ax0, ay0, ax1, ay1, bx0, by0, bx1, by1) {
        let det, gamma, lambda;
        det = (ax1 - ax0) * (by1 - by0) - (bx1 - bx0) * (ay1 - ay0);
        if (det === 0) {
            return false;
        } else {
            lambda = ((by1 - by0) * (bx1 - ax0) + (bx0 - bx1) * (by1 - ay0)) / det;
            gamma = ((ay0 - ay1) * (bx1 - ax0) + (ax1 - ax0) * (by1 - ay0)) / det;
            return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
        }
    }

    static toTransportArray(points) {
        let transportArray = [];
        transportArray[0] = {x: points[0].x0, y: points[0].y0, p: points[0].pressure}
        for (let i = 0; i < points; i++)
            transportArray.push({x: points[i].x1, y: points[i].y1, p: points[i].pressure});
        return transportArray;
    }
}

class Color {
    constructor(R, G, B, A) {
        this.R = R;
        this.G = G;
        this.B = B;
        this.A = A;
    }

    json() {
        return { R: this.R, G: this.G, B: this.B, A: this.A }
    }
}

class Line {
    constructor() {
        this.points = [];
        this.guid = Line.generateGuid();
        this.color = new Color(0, 0, 0, 255);
    }

    addPoint(line) {
        this.points.push(line);
    }

    toTransportObject() {
        return {
            guid: this.guid,
            color: this.color.json(),
            points: Point.toTransportArray()
        }
    }

    static intersecting(path, otherPaths) {
        let guidsToRemove = [];

        for (const line of path.lines) {
            for (const otherPath of otherPaths) {
                for (const pathElement of otherPath.lines) {
                    if (Point.linesIntersect(line, pathElement)) {
                        guidsToRemove.push(otherPath.guid);
                    }
                }
            }
        }

        return guidsToRemove;
    }

    static generateGuid() {
        function _p8(s) {
            let p = (Math.random().toString(16) + "000000000").substr(2, 8);
            return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
        }
        return _p8() + _p8(true) + _p8(true) + _p8();
    }

    static fromTransportObject(transportObject) {
        let line = new Line();
        line.guid = transportObject.guid;
        line.color = new Color(transportObject.color.R, transportObject.color.G,
            transportObject.color.B, transportObject.color.A);
        let previous = {}
        for (const point of transportObject.points) {
            if (previous.hasOwnProperty("x")) {
                line.addPoint(new Point(previous.x, previous.y, point.x, point.y));
            }
            previous = {x: point.x, y: point.y};
        }
        return line;
    }
}
