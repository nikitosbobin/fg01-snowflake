var ctx;
var canvas;
var startPointsArray = [];
var iterationsSerializationName = "iterations";
var currentIterations = 0;
var fractalColorSerializationName = "fractColor";
var fractalColor = "#000";
var isFractalFillSerializationName = "isFill";
var isFractalFill = false;
var backgroundColorSerializationName = "backColor";
var background = "#ffffff";
var strokeWidthSerializationName = "strokeWidth";
var strokeWidth = 1;
var createFigureMode = true;
var clockwise = true;

function saveAllSettings() {
    localStorage.setItem(iterationsSerializationName, currentIterations);
    localStorage.setItem(fractalColorSerializationName, fractalColor);
    localStorage.setItem(isFractalFillSerializationName, isFractalFill);
    localStorage.setItem(backgroundColorSerializationName, background);
    localStorage.setItem(strokeWidthSerializationName, strokeWidth);
}

function loadAllSettings() {
    if (localStorage[iterationsSerializationName])
        currentIterations = parseInt(localStorage[iterationsSerializationName]);
    if (localStorage[strokeWidthSerializationName])
        strokeWidth = parseInt(localStorage[strokeWidthSerializationName]);
    if (localStorage[fractalColorSerializationName])
        fractalColor = localStorage[fractalColorSerializationName];
    if (localStorage[backgroundColorSerializationName])
        background = localStorage[backgroundColorSerializationName];
    if (localStorage[isFractalFillSerializationName])
        isFractalFill = localStorage[isFractalFillSerializationName] == "true";
    putDataInFields();
}

function resetFields() {
    startPointsArray = [];
    currentIterations = 0;
    fractalColor = "#000";
    isFractalFill = false;
    background = "#ffffff";
    strokeWidth = 1;
    handleCurrentFractal();
    saveAllSettings();
    putDataInFields();
}

function putDataInFields() {
    document.getElementById('iterations').value = currentIterations;
    document.getElementById('strokeWidth').value = strokeWidth;
    document.getElementById('backColor').value = background;
    document.getElementById('fractColor').value = fractalColor;
    if (isFractalFill) {
        document.getElementById('radioStroke').checked = false;
        document.getElementById('radioFill').checked = true;
    } else {
        document.getElementById('radioStroke').checked = true;
        document.getElementById('radioFill').checked = false;
    }
}

function redactor() {
    var redactor = document.getElementById('createMode');
    redactor.value = redactor.value == "Off" ? "On" : "Off";
    createFigureMode = !createFigureMode;
    if (!createFigureMode) {
        handleCurrentFractal();
    }
}

var lastPos;
function onMove(e) {
    if (createFigureMode) {
        var mouseX = e.pageX - canvas.offsetLeft;
        var mouseY = e.pageY - canvas.offsetTop;
        if (startPointsArray.length > 0) {
            ctx.strokeStyle = background;
            ctx.lineWidth = strokeWidth;
            ctx.fillStyle = background;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            drawPointArray(startPointsArray, fractalColor, strokeWidth, false);
            ctx.beginPath();
            ctx.moveTo(startPointsArray[startPointsArray.length - 1].x, startPointsArray[startPointsArray.length - 1].y);
            ctx.lineTo(mouseX, mouseY);
            ctx.strokeStyle = fractalColor;
            ctx.stroke();
        } else {
            if (lastPos) {
                ctx.fillStyle = background;
                ctx.fillRect(lastPos.x - 2, lastPos.y - 2, 4, 4);
            }
            ctx.fillStyle = fractalColor;
            ctx.fillRect(mouseX - 1.5, mouseY - 1.5, 3, 3);
            lastPos = {x: mouseX, y: mouseY};
        }
    }
}

function onClick(e) {
    if (createFigureMode) {
        var mouseX = e.pageX - canvas.offsetLeft;
        var mouseY = e.pageY - canvas.offsetTop;
        startPointsArray.push(new Point(mouseX, mouseY));
        if (startPointsArray.length == 2) {
            clockwise = startPointsArray[0].x < startPointsArray[1].x;
            console.log(clockwise);
        }
        drawPointArray(startPointsArray, fractalColor, strokeWidth, false);
    }
}

function onLoad() {
    canvas = document.getElementById("mainCanvas");
    canvas.onclick = onClick;
    canvas.onmousemove = onMove;
    canvas.width = document.documentElement.clientWidth * 0.95;
    ctx = canvas.getContext("2d");
    /*startPointsArray.push(new Point(250, 80));
    startPointsArray.push(new Point(425, 383));
    startPointsArray.push(new Point(75, 383));*/
    loadAllSettings();
    handleCurrentFractal();
    console.log("Loaded");
}

function onStrokeChange() {
    var strokeWidthChanger = document.getElementById('strokeWidth');
    strokeWidth = strokeWidthChanger.value;
    handleCurrentFractal();
    saveAllSettings();
}

function onBackgroundChanger() {
    var colorChanger = document.getElementById('backColor');
    background = colorChanger.value;
    handleCurrentFractal();
    saveAllSettings();
}

function handleCurrentFractal() {
    console.log("Iterations: ", currentIterations);
    var dateStart = new Date();
    var rr = makeFractal(startPointsArray, currentIterations);
    console.log("Done");
    drawPointArray(rr, fractalColor, strokeWidth, true);
    var dateEnd = new Date();
    console.log("Diff: ", dateEnd.getTime() - dateStart.getTime(), " ms");
}

function onIterationsChange() {
    var iterations = document.getElementById('iterations');
    currentIterations = iterations.value;
    handleCurrentFractal();
    saveAllSettings();
}

function onColorChange() {
    var colorChanger = document.getElementById('fractColor');
    fractalColor = colorChanger.value;
    handleCurrentFractal();
    saveAllSettings();
}

function onRadioFillChange(input) {
    if (input.value == "fill")
        isFractalFill = true;
    else if (input.value == "stroke")
        isFractalFill = false;
    handleCurrentFractal();
    saveAllSettings();
}

function drawPointsNumbers(points) {
    ctx.fillStyle = "#000";
    ctx.font = "bold 12px sans-serif";
    for (var i = 0; i < points.length; ++i)
        ctx.fillText(i, points[i].x, points[i].y);
}

function drawPointArray(array, color, lineWidth, circle) {
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(array[0].x, array[0].y);
    for (var i = 1; i < array.length; ++i) {
        ctx.lineTo(array[i].x, array[i].y);
    }
    if (circle)
        ctx.lineTo(array[0].x, array[0].y);
    ctx.lineWidth = lineWidth;
    if (isFractalFill){
        ctx.fillStyle = color;
        ctx.fill();
    } else {
        ctx.strokeStyle = color;
        ctx.stroke();
    }
}

function Point(x, y) {
    this.x = x;
    this.y = y;
}