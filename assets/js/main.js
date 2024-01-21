var layer1 = document.getElementById("layer1");
var layer2 = document.getElementById("layer2");
var options = document.getElementById("options");
var slider = document.getElementById("myRange");
var speedSlider = document.getElementById("rangeSpeed");
var canvas_container = document.getElementById("canvas-container");
var outputCoordinateX = document.getElementById("outputCoordinateX");
var outputCoordinateY = document.getElementById("outputCoordinateY");

var ctx1 = layer1.getContext("2d");
var ctx2 = layer2.getContext("2d");
var cycloid = []

var R = 200;
var r = R * 0.1 ; // Радиус большого и маленького диска
slider.min = R * 0.1;
slider.max = R / 2;
slider.value = r;
slider.oninput = changeSmallRadius;

var dt = 10 // Временной шаг
var w2 = Math.PI / ( 12 * 100 ) // Угловая скорость маленького диска

var dtheta3 = dt * w2 // Скорость вращения маленького диска
speedSlider.step = 0.001;
speedSlider.min = dtheta3;
speedSlider.max = dtheta3 * 3;
speedSlider.value = dtheta3;
speedSlider.oninput = changeSpeed;

var lastPathPos = [];

resizeElements()
window.addEventListener("resize", resizeElements);

function resizeElements() {
    options.style.height = window.innerHeight + "px";
    canvas_container.style.height = window.innerHeight + "px";
    layer1.width = layer1.offsetWidth;
    layer1.height = layer1.offsetHeight;
    layer2.width = layer2.offsetWidth;
    layer2.height = layer2.offsetHeight;
    width = layer1.width;
    height = layer1.height;

    c1x = width/2, c1y = height/2;
    c2x = c1x, c2y = c1y - R + r; // Центр маленького диска
    c3x = c1x, c3y = c1y - R; // Центр точки
    theta2 = 0; // Ориентация маленького диска относительно 12 часов
    theta3 = 0; // Ориентация точки относительно 12 часов
    dtheta2 = dt * w2 * r / R // Как быстро вращается маленький диск относительно большого
    T = 2 * Math.PI / ( w2 * r / R ) // Время, чтобы маленький диск пришел в исходное положение

    lastPathPos = []
}

// Считываем радиус с input
function changeSmallRadius() {
    r = slider.value;
    resizeElements();
}

// Считываем скорость с input
function changeSpeed() {
    dtheta3 = Number(speedSlider.value);
    resizeElements();
}

function drawCircle(ctx, R, cx, cy, color) {
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, 2 * Math.PI);
    ctx.fillStyle = color
    ctx.fill();
}

function drawCircles(ctx) {
    drawCircle(ctx, R, c1x, c1y, "#cddeff")
    drawCircle(ctx, r, c2x, c2y, "#b8ffba")
    drawCircle(ctx, 3, c3x, c3y, "#ff0000")
}

function drawPath(ctx, color) {
    ctx.beginPath();
    ctx.moveTo(cycloid[0][0], cycloid[0][1])
    for ( i = 0; i < cycloid.length; i ++){
        ctx.lineTo(cycloid[i][0], cycloid[i][1]);
    }
    ctx.strokeStyle = color
    ctx.stroke();
}

function drawLine(ctx, start, end, color) {
    if (start == [] || end == []) {
        return;
    }
    ctx.beginPath();
    ctx.moveTo(start[0], start[1])
    ctx.lineTo(end[0], end[1])
    ctx.strokeStyle = color
    ctx.stroke();
}

function update() {
    theta2 += dtheta2;
    theta3 += dtheta3;
    updateCenter2();
    updatePoint();
    drawLine(ctx1, lastPathPos, [c3x, c3y], "#ff0000");
    lastPathPos = [c3x, c3y];
    ctx2.clearRect(0, 0, width+1, height+1);
    drawCircles(ctx2);
}

function updateCenter2() {
    c2x = c1x + (R - r) * Math.sin(theta2)
    c2y = c1y + (R - r) * Math.cos(theta2)
}

function updatePoint() {
    c3x = c2x + r * Math.sin(theta3)
    c3y = c2y + r * Math.cos(theta3)

    outputCoordinateX.textContent = c3x.toFixed(2);
    outputCoordinateY.textContent = c3y.toFixed(2);
}

pathTimer = setInterval(update, dt);
