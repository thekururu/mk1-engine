window.onload = () => {

  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const code = document.getElementById("code");

  let loopId;
  let update = () => {};
  let draw = () => {};

  // 📁 SISTEMA DE ARCHIVOS VIRTUAL
  const files = {
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

  // 📁 RENDER ARCHIVOS
  function renderFiles() {
    const panel = document.getElementById("files");
    panel.innerHTML = `<button id="newFolder">+ Carpeta</button>`;

    document.getElementById("newFolder").onclick = () => {
      const name = prompt("Nombre de la carpeta:");
      if (name && !files[name]) {
        files[name] = {};
        renderFiles();
      }
    };

    for (let folder in files) {
      panel.innerHTML += `<div class="folder">📁 ${folder}</div>`;
      for (let file in files[folder]) {
        panel.innerHTML += `
          <div class="file" onclick="openFile('${folder}','${file}')">
            📄 ${file}
          </div>
        `;
      }
    }
  }

  // 📄 ABRIR ARCHIVO
  window.openFile = (folder, file) => {
    code.value = files[folder][file];
  };

  // ▶ RUN
  window.run = () => {
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
  };

  // ■ STOP
  window.stop = () => {
    cancelAnimationFrame(loopId);
  };

  // INIT
  renderFiles();
  openFile("scripts", "main.js");
};
