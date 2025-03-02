let modelo;
let lightPos;
let angle = 0;

function preload() {
  modelo = loadModel("Perro.obj", true); // Cargar el modelo 3D
}

function setup() {
  createCanvas(800, 800, WEBGL); // Usar WebGL para renderizado 3D
  lightPos = createVector(0, -200, 200); // Posición inicial de la luz

  noStroke(); // Quitar bordes para mejor visualización
}

function draw() {
  background(0);

  // 💡 Iluminación Avanzada
  ambientLight(50, 50, 50); // Luz ambiental tenue
  directionalLight(220, 220, 220, -1, -1, -1); // Luz direccional extra
  pointLight(255, 255, 255, lightPos.x, lightPos.y, lightPos.z); // Luz puntual

  // 💡 Simular la luz moviéndose con el mouse
  lightPos.x = map(mouseX, 0, width, -300, 200);
  lightPos.y = map(mouseY, 0, height, -300, 200);

  // 🎨 Material para Phong Reflection
  ambientMaterial(80, 80, 80); // Color base
  specularMaterial(255, 255, 255); // Reflejo especular fuerte
  shininess(300); // Mayor intensidad de brillo

  push();
  translate(0, 100, 0); // Posicionar el modelo un poco más abajo
  scale(50); // Ajustar tamaño del modelo
  rotateX(PI); // Corregir orientación
  rotateY(angle); // Rotación automática
  model(modelo); // Dibujar el modelo
  pop();

  // 🔥 Dibujar sombra en el suelo
  dibujarSombra();

  // 🔥 Dibujar reflejo en el suelo
  dibujarReflejo();

  angle += 0.01; // Animación de rotación
}

// 📌 Función para dibujar la sombra simulada
function dibujarSombra() {
  push();
  translate(0, 150, 0); // Posicionar la sombra debajo del modelo
  rotateX(HALF_PI); // Girar para que se vea como un suelo
  fill(0, 90); // Color de la sombra
  ellipse(0, 0, 200, 50); // Dibujar la sombra
  pop();
}

// 📌 Función para simular reflejo en el suelo
function dibujarReflejo() {
  push();
  translate(0, 200, 0); // Mover el reflejo un poco más abajo
  scale(1, -1, 1); // Invertir en el eje Y para reflejo
  tint(255, 100); // Hacerlo semitransparente
  rotateX(PI); // Mantener la orientación del reflejo
  rotateY(angle); // Mantener la misma rotación que el modelo
  model(modelo);
  pop();
}
