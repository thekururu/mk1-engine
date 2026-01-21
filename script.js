const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let loopId;
let update = () => {};
let draw = () => {};

const files = {
  scripts: {
    "main.js": `
let sun = { x: 300, y: 120, radius: 40 };
let moon = { x: 0, y: 120, radius: 30, speed: 0.5 };

function update() {
  moon.x += moon.speed;
  if (moon.x > 700) moon.x = -100;
}

function draw(ctx) {
  ctx.fillStyle = "#5bbcff";
  ctx.fillRect(0,0,600,240);

  ctx.fillStyle = "yellow";
  ctx.beginPath();
  ctx.arc(sun.x, sun.y, sun.radius, 0, Math.PI*2);
  ctx.fill();

  ctx.fillStyle = "#555";
  ctx.beginPath();
  ctx.arc(moon.x, moon.y, moon.radius, 0, Math.PI*2);
  ctx.fill();
}
`
  }
};

function renderFiles() {
  const container = document.getElementById("files");
  container.innerHTML = "📁 scripts<br>";
  container.innerHTML += `
    <div class="file" onclick="openFile('scripts','main.js')">
      📄 main.js
    </div>
  `;
}

function openFile(folder, file) {
  document.getElementById("code").value = files[folder][file];
}

function run() {
  cancelAnimationFrame(loopId);
  try {
    eval(code.value);
  } catch (e) {
    alert(e);
    return;
  }

  function loop() {
    ctx.clearRect(0,0,600,240);
    update();
    draw(ctx);
    loopId = requestAnimationFrame(loop);
  }
  loop();
}

function stop() {
  cancelAnimationFrame(loopId);
}

renderFiles();
openFile("scripts","main.js");
document.getElementById("newFolder").onclick = () => {
  const name = prompt("Nombre de la carpeta:");
  if (!name) return;

  if (!files[name]) {
    files[name] = {};
    renderFiles();
  }
};

