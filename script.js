window.onload = () => {

  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const code = document.getElementById("code");
  const filesPanel = document.getElementById("files");

  let loopId;
  let update = () => {};
  let draw = () => {};

  // 📁 SISTEMA DE ARCHIVOS VIRTUAL
  const fs = {
    scripts: {
      "main.js": `
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
`
    }
  };

  let currentFolder = "scripts";
  let currentFile = "main.js";

  // 📁 RENDER PANEL
  function renderFiles() {
    filesPanel.innerHTML = `
      <button id="newFolder">+ Carpeta</button>
      <button id="newFile">+ Archivo</button>
      <hr>
    `;

    document.getElementById("newFolder").onclick = () => {
      const name = prompt("Nombre de la carpeta:");
      if (name && !fs[name]) {
        fs[name] = {};
        renderFiles();
      }
    };

    document.getElementById("newFile").onclick = () => {
      const name = prompt("Nombre del archivo (ej: game.js):");
      if (name && !fs[currentFolder][name]) {
        fs[currentFolder][name] = "// nuevo archivo\n";
        renderFiles();
      }
    };

    for (let folder in fs) {
      filesPanel.innerHTML += `<div class="folder">📁 ${folder}</div>`;
      for (let file in fs[folder]) {
        filesPanel.innerHTML += `
          <div class="file"
               onclick="openFile('${folder}','${file}')">
            📄 ${file}
          </div>
        `;
      }
    }
  }

  // 📄 ABRIR ARCHIVO
  window.openFile = (folder, file) => {
    currentFolder = folder;
    currentFile = file;
    code.value = fs[folder][file];
  };

  // ▶ RUN
  window.run = () => {
    cancelAnimationFrame(loopId);

    // guardar cambios
    fs[currentFolder][currentFile] = code.value;

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
  };

  // ■ STOP
  window.stop = () => cancelAnimationFrame(loopId);

  // INIT
  renderFiles();
  openFile("scripts", "main.js");
};


