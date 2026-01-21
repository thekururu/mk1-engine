const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const code = document.getElementById("code");

let loopId;
let update = () => {};
let draw = () => {};

// 📁 SISTEMA DE ARCHIVOS VIRTUAL REAL
const fs = {
  scripts: {
    "main.js": defaultMain()
  }
};

let currentFolder = "scripts";
let currentFile = "main.js";

// ===== FILE SYSTEM =====

function defaultMain() {
  return `
let sun = { x: 300, y: 120, r: 40 };
let moon = { x: 0, y: 120, r: 30, speed: 0.5 };

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
}

function renderFiles() {
  const tree = document.getElementById("files-tree");
  tree.innerHTML = "";

  for (const folder in fs) {
    tree.innerHTML += `
      <div class="folder" ondblclick="renameFolder('${folder}')">
        📁 ${folder}
      </div>
    `;

    for (const file in fs[folder]) {
      tree.innerHTML += `
        <div class="file"
             onclick="openFile('${folder}','${file}')"
             ondblclick="renameFile('${folder}','${file}')">
          📄 ${file}
        </div>
      `;
    }
  }
}

// ===== ACTIONS =====

window.createFolder = function () {
  let name = prompt("Nombre de la carpeta:");
  if (!name || fs[name]) return;
  fs[name] = {};
  renderFiles();
};

window.createFile = function () {
  let name = prompt("Nombre del archivo (.js):");
  if (!name) return;
  if (!name.endsWith(".js")) name += ".js";
  if (fs[currentFolder][name]) return;

  fs[currentFolder][name] = "// nuevo archivo\n";
  renderFiles();
};

window.openFile = function (folder, file) {
  currentFolder = folder;
  currentFile = file;
  code.value = fs[folder][file];
};

window.renameFolder = function (oldName) {
  let name = prompt("Nuevo nombre:", oldName);
  if (!name || fs[name]) return;

  fs[name] = fs[oldName];
  delete fs[oldName];
  if (currentFolder === oldName) currentFolder = name;
  renderFiles();
};

window.renameFile = function (folder, oldName) {
  let name = prompt("Nuevo nombre (.js):", oldName);
  if (!name) return;
  if (!name.endsWith(".js")) name += ".js";
  if (fs[folder][name]) return;

  fs[folder][name] = fs[folder][oldName];
  delete fs[folder][oldName];
  if (currentFile === oldName) currentFile = name;
  renderFiles();
};

window.run = function () { /* tu run */ };
window.stop = function () { cancelAnimationFrame(loopId); };
