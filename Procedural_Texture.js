let cols = 100;
let rows = 100;
let grid;
let nextGrid;
let img;

// valores que se deben variar con botones
let DA = 1.0;
let DB = 0.3;
let feed = 0.055;
let kill = 0.062;
let dt = 1;

function setup() {
  createCanvas(600, 600, WEBGL);
  
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
  let start = 5; //esta tambien puede ser un valor para parametrizar en botón
  for (let i = Math.floor(cols/2) - start; i < Math.floor(cols/2) + start; i++) {
    for (let j = Math.floor(rows/2) - start; j < Math.floor(rows/2) + start; j++) {
      grid[i][j].b = 1;
    }
  }
  
  img = createImage(cols, rows);
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
      img.set(x, y, color(c, c, c)); //Aqui los colores, se pueden tambier variar con botones para cambiar de blanco y negro
    }
  }
  img.updatePixels();
  
  // Renderizo el modelo con la textura aplicada
  background(255);
  rotateX(frameCount * 0.01);
  rotateY(frameCount * 0.01);
  
  texture(img);
  noStroke();
  torus(200, 50);
}