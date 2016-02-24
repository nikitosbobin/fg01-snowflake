function getLength(p1, p2) {
      var dx = p2.x - p1.x;
      var dy = p2.y - p1.y;
      return Math.sqrt(dx * dx + dy * dy);
}

function getAngle(p1, p2) {
      var a;
      if (clockwise) {
            a = Math.atan((p2.y - p1.y) / (p2.x - p1.x));
            if (p1.x > p2.x) a -= Math.PI;
      }
      else {
            a = Math.atan((p1.y - p2.y) / (p1.x - p2.x));
            if (p1.x > p2.x) a -= Math.PI;
      }
      return a;
}

function getNextPoint(p, length, angle) {
      return new Point(p.x + length * Math.cos(angle), p.y + length * Math.sin(angle));
}

function makeFractal(points, count) {
      if (count == 0) return points;
      var result = [];
      for (var i = 0; i < points.length; ++i) {
            result.push(points[i]);
            var a = getAngle(points[i], points[(i + 1) % points.length]);
            var targetLength = getLength(points[i], points[(i + 1) % points.length]) / 3;
            var p2 = getNextPoint(points[i], targetLength, a);
            result.push(p2);
            if (clockwise)
                  result.push(getNextPoint(p2, targetLength, a - Math.PI / 3));
            else
                  result.push(getNextPoint(p2, targetLength, a + Math.PI / 3));
            result.push(getNextPoint(p2, targetLength, a));
      }
      return makeFractal(result, count - 1);
}

function splitLine(p1, p2, count) {
      var result = [];
      var angle = getAngle(p1, p2);
      if (p1.x > p2.x)
            angle -= Math.PI;
      var tLen = getLength(p1, p2) / count;
      var np1 = getNextPoint(p1, tLen, angle);
      result.push(np1);
      for (var i = 0; i < count - 2; ++i)
            result.push(getNextPoint(result[result.length - 1], tLen, angle));
      return result;
}