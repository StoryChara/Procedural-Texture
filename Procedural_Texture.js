let cols = 100;
let rows = 100;
let grid;
let nextGrid;
let img;
let lightPos;
let modelo; // Variable para el modelo Perro.obj

// valores que se deben variar con botones
let DA = 1.0;
let DB = 0.3;
let feed = 0.055;
let kill = 0.062;
let dt = 1;
let start = 5;
let colorR = 255;
let colorG = 255;
let colorB = 255;

function preload() {
  modelo = loadModel('Perro.obj', true); // Cargar el modelo 3D
}

function setup() {
  let canvas = createCanvas(600, 600, WEBGL);
  canvas.parent('canvas-container');
  
  // Inicializo arreglos
  grid = new Array(cols);
  nextGrid = new Array(cols);
  for (let i = 0; i < cols; i++) {
    grid[i] = new Array(rows);
    nextGrid[i] = new Array(rows);
    for (let j = 0; j < rows; j++) {
      grid[i][j] = { a: 1, b: 0 };
      nextGrid[i][j] = { a: 1, b: 0 };
    }
  }
  
  // Semilla de inicialización el patrón
  initializePattern();

  img = createImage(cols, rows);

  // Configuración de deslizadores y botón de reinicio
  setupControls();

  // Configuración de la posición de la luz
  lightPos = createVector(0, -200, 200);
}

function draw() {
  // Calculo la reacción-difusión
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      // Calculo la laplaciana con los valores iniciales
      let laplaceA = 0;
      let laplaceB = 0;
      for(let i = -1; i <= 1; i++) {
        for(let j = -1; j <= 1; j++) {
          let col = (x + i + cols) % cols;
          let row = (y + j + rows) % rows;
          let weight = [[0.05, 0.2, 0.05],
                        [0.2, -1, 0.2],
                        [0.05, 0.2, 0.05]][i+1][j+1];
          laplaceA += grid[col][row].a * weight;
          laplaceB += grid[col][row].b * weight;
        }
      }
      
      // Ecuaciones para la difusión-reacción
      let a = grid[x][y].a;
      let b = grid[x][y].b;
      let newA = a + (DA * laplaceA - a * b * b + feed * (1 - a)) * dt;
      let newB = b + (DB * laplaceB + a * b * b - (feed + kill) * b) * dt;
      
      nextGrid[x][y].a = constrain(newA, 0, 1);
      nextGrid[x][y].b = constrain(newB, 0, 1);
    }
  }
  
  // Cambio las matrices
  let temp = grid;
  grid = nextGrid;
  nextGrid = temp;
  
  // Creación de la textura de los valores de B
  img.loadPixels();
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      let c = grid[x][y].b * 255;
      img.set(x, y, color(c * colorR / 255, c * colorG / 255, c * colorB / 255));
    }
  }
  img.updatePixels();
  
  // Renderizo el modelo con la textura aplicada
  background(255);
  rotateY(frameCount * 0.01); // Rotación solo en el eje Y
  
  // Configuración de la iluminación Phong
  ambientLight(100, 100, 100); // Luz ambiental más intensa
  directionalLight(255, 255, 255, -1, -1, -1); // Luz direccional más intensa
  pointLight(255, 255, 255, lightPos.x, lightPos.y, lightPos.z); // Luz puntual más intensa

  // Simular la luz moviéndose con el mouse
  lightPos.x = map(mouseX, 0, width, -400, 400); // Aumentar el rango de movimiento
  lightPos.y = map(mouseY, 0, height, -400, 400); // Aumentar el rango de movimiento

  // Material para Phong Reflection
  ambientMaterial(80, 80, 80); // Color base
  specularMaterial(255, 255, 255); // Reflejo especular fuerte
  shininess(300); // Mayor intensidad de brillo

  // Aplicar textura si está disponible
  if (img) {
    texture(img);
  }
  noStroke();
  rotateX(PI); // Corregir la orientación del modelo
  scale(2); // Ajustar tamaño del modelo
  model(modelo); // Dibujar el modelo Perro.obj
}

function setupControls() {
  select('#DA').input(() => DA = parseFloat(select('#DA').value()));
  select('#DB').input(() => DB = parseFloat(select('#DB').value()));
  select('#feed').input(() => feed = parseFloat(select('#feed').value()));
  select('#start').input(() => {
    start = parseInt(select('#start').value());
    initializePattern();
  });
  select('#colorR').input(() => colorR = parseInt(select('#colorR').value()));
  select('#colorG').input(() => colorG = parseInt(select('#colorG').value()));
  select('#colorB').input(() => colorB = parseInt(select('#colorB').value()));
  select('#reset').mousePressed(resetValues);
}

function initializePattern() {
  for (let i = Math.floor(cols/2) - start; i < Math.floor(cols/2) + start; i++) {
    for (let j = Math.floor(rows/2) - start; j < Math.floor(rows/2) + start; j++) {
      grid[i][j].b = 1;
    }
  }
}

function resetValues() {
  DA = 1.0;
  DB = 0.3;
  feed = 0.055;
  start = 5;
  colorR = 255;
  colorG = 255;
  colorB = 255;
  select('#DA').value(DA);
  select('#DB').value(DB);
  select('#feed').value(feed);
  select('#start').value(start);
  select('#colorR').value(colorR);
  select('#colorG').value(colorG);
  select('#colorB').value(colorB);
  initializePattern();
}