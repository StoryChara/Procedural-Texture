PShape modelo;
PVector lightPos; // Posición de la luz puntual

void setup() {
  size(800, 800, P3D); // Activar renderizado 3D
  modelo = loadShape("Perro.obj"); // Cargar el modelo 3D desde la carpeta "data"
  lightPos = new PVector(width / 2, height / 4, 200); // Posición inicial de la luz

  noStroke(); // Quitar bordes para mejor renderizado
}

void draw() {
  background(0); // Fondo negro
  
  // Simulación de sombras con una luz direccional tenue desde arriba
  directionalLight(100, 100, 100, 0, -1, 0);

  // Luz ambiental general (suaviza sombras)
  ambientLight(50, 50, 50);

  // Luz puntual que se mueve con el mouse
  lightPos.x = mouseX;
  lightPos.y = mouseY;
  pointLight(255, 255, 255, lightPos.x, lightPos.y, 200); // Luz blanca puntual

  // Luz direccional extra (simula luz del sol desde un ángulo)
  directionalLight(220, 220, 220, -1, -1, -1);

  // 🚀 **Mejorado: Phong Reflection más fuerte**
  ambient(80, 80, 80);   // Color base del material
  specular(255, 255, 255); // **Reflejo especular más brillante**
  shininess(300);         // **Más brillo en el reflejo**

  // Posicionar el modelo un poco más abajo
  pushMatrix();
  translate(width / 2, height / 2 + 50, 0); // Bajamos el modelo 50 píxeles en Y
  scale(50); // Ajustar tamaño del modelo
  rotateX(PI); // Corregir orientación si está al revés
  rotateY(frameCount * 0.01); // Rotación automática para visualización
  shape(modelo);
  popMatrix();

  // Dibujar sombra simulada en el suelo
  dibujarSombra();

  // Dibujar reflejo en el suelo
  dibujarReflejo();
}

// Función para simular una sombra debajo del modelo
void dibujarSombra() {
  pushMatrix();
  translate(width / 2, height / 2 + 120, 0); // Bajamos la sombra junto con el modelo
  rotateX(HALF_PI); // Girar la sombra para que quede en el "suelo"
  
  fill(0, 90); // **Sombra más oscura para más realismo**
  ellipse(0, 0, 220, 60); // **Sombra más grande**
  popMatrix();
}

// Función para simular reflejo en el suelo
void dibujarReflejo() {
  pushMatrix();
  translate(width / 2, height / 2 + 150, 0); // Bajamos el reflejo junto con el modelo
  scale(1, -1, 1); // Reflejar en el eje Y
  tint(255, 120); // **Más visible el reflejo**
  rotateX(PI); // Corregir la orientación del reflejo
  rotateY(frameCount * 0.01); // Mantener la misma rotación que el modelo
  shape(modelo);
  popMatrix();
}
