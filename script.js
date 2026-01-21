// ====== VIRTUAL FILE SYSTEM ======
let files = {};
let currentFile = null;

// ====== UI ======
function renderFiles() {
  const tree = document.getElementById("filesTree");
  tree.innerHTML = "";

  Object.keys(files).forEach(name => {
    const el = document.createElement("div");
    el.textContent = name;
    el.onclick = () => openFile(name);
    tree.appendChild(el);
  });
}

function createFile() {
  const name = prompt("Nombre del archivo (.js)");
  if (!name || !name.endsWith(".js")) return alert("Solo .js");
  files[name] = "";
  renderFiles();
}

function createFolder() {
  alert("Carpetas reales no existen en web 😅 (solo virtual)");
}

function uploadFile(input) {
  const file = input.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    files[file.name] = reader.result;
    renderFiles();
  };
  reader.readAsText(file);
}

function openFile(name) {
  currentFile = name;
  document.getElementById("code").value = files[name];
}

// ====== ENGINE ======
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let loop = null;

function run() {
  stop();
  if (!currentFile) return alert("No hay archivo abierto");

  files[currentFile] = document.getElementById("code").value;

  try {
    eval(files[currentFile]);
    loop = setInterval(() => {
      if (typeof update === "function") update();
      if (typeof draw === "function") draw(ctx);
    }, 16);
  } catch (e) {
    alert(e);
  }
}

function stop() {
  if (loop) clearInterval(loop);
}

// ====== DEFAULT FILE ======
files["main.js"] = `
let sun = { x: 300, y: 120, r: 40 };
let moon = { x: 0, y: 120, r: 30, speed: 1 };

function update() {
  moon.x += moon.speed;
  if (moon.x > 700) moon.x = -100;
}

function draw(ctx) {
  ctx.fillStyle = "#5bbcff";
  ctx.fillRect(0,0,600,240);

  ctx.fillStyle = "yellow";
  ctx.beginPath();
  ctx.arc(sun.x, sun.y, sun.r, 0, Math.PI*2);
  ctx.fill();

  ctx.fillStyle = "#555";
  ctx.beginPath();
  ctx.arc(moon.x, moon.y, moon.r, 0, Math.PI*2);
  ctx.fill();
}
`;

renderFiles();

